from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json
import google.generativeai as genai
from typing import List, Dict, Any, Optional
import jwt  # Để trích xuất userId từ JWT
import time
import re
import uvicorn
from datetime import datetime

app = FastAPI(title="Hotel Chatbot API", description="API cho chatbot gợi ý khách sạn", version="1.1.0")

# Thêm middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Định nghĩa model cho request body
class ChatRequest(BaseModel):
    user_input: str
    jwt_token: Optional[str] = None

# Định nghĩa model cho response body
class ChatResponse(BaseModel):
    response: str
    intent: Optional[str] = None
    confidence: Optional[float] = None
    hotel_info: Optional[Dict[str, Any]] = None
    booking_info: Optional[Dict[str, Any]] = None
    extracted_requirements: Optional[str] = None

# Lưu trữ session trong bộ nhớ
session_store: Dict[str, Dict[str, Any]] = {}
SESSION_TTL = 1800  # 30 phút (thời gian sống của session)

class HotelRecommendationSystem:
    def __init__(self, gemini_api_key: str, base_api_url: str = "http://localhost/bookingBackend/api"):
        """
        Khởi tạo hệ thống gợi ý khách sạn
        """
        self.base_api_url = base_api_url
        self.hotel_api_url = f"{base_api_url}/hotel/list"
        self.availability_api_url = f"{base_api_url}/booking/checkAvailability"
        self.booking_api_url = f"{base_api_url}/booking/create"
        self.booking_list_url = f"{base_api_url}/booking/list"
        self.gemini_api_key = gemini_api_key
        
        # Cấu hình Gemini API
        genai.configure(api_key=gemini_api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-lite')

    def get_user_id_from_jwt(self, jwt_token: str) -> Optional[int]:
        """
        Trích xuất userId từ JWT mà không xác minh chữ ký
        """
        try:
            decoded = jwt.decode(jwt_token, options={"verify_signature": False})
            return decoded.get('userId')
        except jwt.InvalidTokenError:
            return None

    def save_session_context(self, user_id: int, context: Dict[str, Any]):
        """
        Lưu bối cảnh vào session_store
        """
        session_store[str(user_id)] = {
            "context": context,
            "timestamp": time.time()
        }

    def get_session_context(self, user_id: int) -> Optional[Dict[str, Any]]:
        """
        Lấy bối cảnh từ session_store, kiểm tra TTL
        """
        session = session_store.get(str(user_id))
        if session and time.time() - session["timestamp"] < SESSION_TTL:
            return session["context"]
        return None

    def clear_session_context(self, user_id: int):
        """
        Xóa bối cảnh của user
        """
        session_store.pop(str(user_id), None)

    def fetch_booking_list(self, jwt_token: str) -> List[Dict[str, Any]]:
        """
        Lấy danh sách đặt phòng từ API với cookie JWT
        """
        try:
            headers = {
                'Cookie': f'jwt={jwt_token}'
            }
            response = requests.get(self.booking_list_url, headers=headers, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return [{"error": f"Lỗi khi lấy danh sách đặt phòng: {str(e)}"}]
        except json.JSONDecodeError:
            return [{"error": "Lỗi phân tích phản hồi từ API danh sách đặt phòng"}]

    def format_booking_list(self, bookings: List[Dict[str, Any]]) -> str:
        """
        Định dạng danh sách đặt phòng thành văn bản thân thiện
        """
        if not bookings or "error" in bookings[0]:
            return bookings[0]["error"] if bookings else "Không có đặt phòng nào trong lịch sử của bạn."
        
        formatted_text = "📋 **Danh sách đặt phòng của bạn:**\n\n"
        status_map = {
            "pending": "Đang chờ xác nhận",
            "confirmed": "Đã xác nhận",
            "cancelled": "Đã hủy",
            "completed": "Hoàn thành"
        }
        
        for booking in bookings:
            status = status_map.get(booking.get('statusId', 'pending'), "Không xác định")
            formatted_text += f"""
            🔑 **Mã đặt phòng**: {booking.get('id', 'N/A')}
            🏨 **Khách sạn**: {booking.get('hotelName', 'N/A')} (ID: {booking.get('hotelId', 'N/A')})
            🛏️ **Phòng**: {booking.get('roomName', 'N/A')} (ID: {booking.get('roomId', 'N/A')})
            📅 **Check-in**: {booking.get('checkInDate', 'N/A')}
            📅 **Check-out**: {booking.get('checkOutDate', 'N/A')}
            💰 **Tổng tiền**: {float(booking.get('totalPrice', 0)):,.0f} VNĐ
            📌 **Trạng thái**: {status}
            🕒 **Thời gian đặt**: {booking.get('createdAt', 'N/A')}
            ---
            """
        formatted_text += "Bạn có muốn xem chi tiết đặt phòng nào hoặc cần hỗ trợ thêm không?"
        return formatted_text.strip()

    def classify_user_intent(self, user_input: str) -> Dict[str, Any]:
        """
        Sử dụng Gemini để phân loại ý định người dùng và trích xuất thông tin
        """
        now_str = datetime.now().strftime("%Y-%m-%d (%A)")
        classification_prompt = f"""
Bạn là một AI chuyên phân tích ý định của khách hàng trong lĩnh vực khách sạn. 
Hãy phân tích câu sau và trả về JSON với format chính xác:

INPUT: "{user_input}"

Hãy xác định:
1. INTENT: "search_hotels" (tìm kiếm khách sạn), "check_rooms" (xem phòng trống), "book_room" (đặt phòng), hoặc "view_bookings" (xem danh sách đặt phòng)
2. Trích xuất thông tin liên quan, bao gồm roomId hoặc tên phòng (VD: P1003) nếu được chỉ định
3. Trích xuất số người (people) từ câu, ví dụ: "cho 2 người" → people: 2. Nếu không rõ số người, để people: 1

RULES:
- Nếu người dùng muốn xem lịch sử đặt phòng, danh sách booking → "view_bookings"
- Nếu người dùng chỉ muốn tìm hiểu, gợi ý khách sạn → "search_hotels"  
- Nếu người dùng muốn xem phòng trống với ngày cụ thể → "check_rooms"
- Nếu người dùng muốn đặt phòng với ngày và khách sạn cụ thể → "book_room"
- Nếu người dùng chỉ định roomId (VD: "với roomId 8") hoặc tên phòng (VD: "phòng P1003"), trích xuất vào hotel_info
- Nếu họ chỉ nói chung là "cuối tuần","ngày mai","cuối tháng","đầu tháng" thì bạn hãy tự xác định ngày phù hợp dựa vào thời gian hiện tại là {now_str}.
- Ngày có thể ở format: YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY
- Tên khách sạn có thể viết không dấu hoặc có dấu
- Nếu không rõ số người trong câu (VD: "Đặt phòng P1003"), để people: null để sử dụng bối cảnh từ session trước đó

Trả về JSON format:
{{
    "intent": "search_hotels" hoặc "check_rooms" hoặc "book_room" hoặc "view_bookings",
    "confidence": số từ 0.0 đến 1.0,
    "hotel_info": {{
        "name": "tên khách sạn nếu có",
        "id": số ID nếu có,
        "room_id": số ID phòng nếu có,
        "room_name": "tên phòng nếu có (VD: P1003)",
        "room_type": "loại phòng nếu có"
    }},
    "booking_info": {{
        "check_in_date": "YYYY-MM-DD format",
        "check_out_date": "YYYY-MM-DD format", 
        "people": số người hoặc null,
        "original_dates": ["ngày gốc từ input"]
    }},
    "extracted_requirements": "yêu cầu chi tiết của khách hàng"
}}
"""
        try:
            response = self.model.generate_content(classification_prompt)
            response_text = response.text.strip()
            
            if response_text.startswith('```json'):
                response_text = response_text.replace('```json', '').replace('```', '').strip()
            elif response_text.startswith('```'):
                response_text = response_text.replace('```', '').strip()
            
            classification_result = json.loads(response_text)
            return classification_result
            
        except json.JSONDecodeError as e:
            return self._fallback_classification(user_input)
        except Exception as e:
            return self._fallback_classification(user_input)

    def _fallback_classification(self, user_input: str) -> Dict[str, Any]:
        """
        Phương pháp phân loại dự phòng khi Gemini lỗi
        """
        user_input_lower = user_input.lower()
        
        book_keywords = ['đặt phòng', 'book room', 'booking', 'reserve room']
        room_keywords = ['xem phòng', 'kiểm tra phòng', 'phòng trống', 'check room', 'availability']
        view_booking_keywords = ['xem đặt phòng', 'danh sách đặt phòng', 'lịch sử đặt phòng', 'booking của tôi']
        
        has_book_keywords = any(keyword in user_input_lower for keyword in book_keywords)
        has_room_keywords = any(keyword in user_input_lower for keyword in room_keywords)
        has_view_booking_keywords = any(keyword in user_input_lower for keyword in view_booking_keywords)
        
        date_patterns = [
            r'(\d{4}-\d{2}-\d{2})',
            r'(\d{2}[-/]\d{2}[-/]\d{4})',
        ]
        dates = []
        for pattern in date_patterns:
            dates.extend(re.findall(pattern, user_input))
        
        room_id_match = re.search(r'roomId\s*(\d+)', user_input, re.IGNORECASE)
        room_name_match = re.search(r'phòng\s*([A-Za-z0-9]+)', user_input_lower)
        room_type_match = re.search(r'phòng\s*(deluxe|standard|suite)', user_input_lower)
        people_match = re.search(r'cho\s*(\d+)\s*người', user_input_lower)
        
        hotel_info = {"name": None, "id": None, "room_id": None, "room_name": None, "room_type": None}
        if room_id_match:
            hotel_info["room_id"] = int(room_id_match.group(1))
        if room_name_match:
            hotel_info["room_name"] = room_name_match.group(1).upper()
        if room_type_match:
            hotel_info["room_type"] = room_type_match.group(1).capitalize()
        
        people = int(people_match.group(1)) if people_match else None
        
        if has_view_booking_keywords:
            return {
                "intent": "view_bookings",
                "confidence": 0.95,
                "hotel_info": hotel_info,
                "booking_info": {},
                "extracted_requirements": user_input
            }
        elif has_book_keywords:
            return {
                "intent": "book_room",
                "confidence": 0.9,
                "hotel_info": hotel_info,
                "booking_info": {
                    "check_in_date": dates[0] if dates else None,
                    "check_out_date": dates[1] if len(dates) > 1 else None,
                    "people": people,
                    "original_dates": dates
                },
                "extracted_requirements": user_input
            }
        elif has_room_keywords and len(dates) >= 2:
            return {
                "intent": "check_rooms",
                "confidence": 0.8,
                "hotel_info": hotel_info,
                "booking_info": {
                    "check_in_date": dates[0],
                    "check_out_date": dates[1],
                    "people": people if people else 1,
                    "original_dates": dates
                },
                "extracted_requirements": user_input
            }
        else:
            return {
                "intent": "search_hotels",
                "confidence": 0.7,
                "hotel_info": hotel_info,
                "booking_info": {
                    "people": people
                },
                "extracted_requirements": user_input
            }

    def fetch_hotel_list(self) -> List[Dict[str, Any]]:
        """Lấy danh sách khách sạn từ REST API"""
        try:
            response = requests.get(self.hotel_api_url, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            return []
        except json.JSONDecodeError:
            return []

    def check_room_availability(self, hotel_id: int, check_in_date: str, 
                              check_out_date: str, people: int) -> Dict[str, Any]:
        """Kiểm tra phòng trống của khách sạn"""
        try:
            params = {
                'hotelId': hotel_id,
                'checkInDate': check_in_date,
                'checkOutDate': check_out_date,
                'people': people
            }
            response = requests.get(self.availability_api_url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            return {"rooms": [], "message": "Error checking availability"}
        except json.JSONDecodeError:
            return {"rooms": [], "message": "Error parsing response"}

    def book_room(self, hotel_id: int, room_id: int, check_in_date: str, check_out_date: str, jwt_token: str) -> Dict[str, Any]:
        """Gửi yêu cầu đặt phòng đến API"""
        try:
            headers = {
                'Content-Type': 'application/json',
                'Cookie': f'jwt={jwt_token}'
            }
            payload = {
                "hotelId": hotel_id,
                "roomId": room_id,
                "checkInDate": check_in_date,
                "checkOutDate": check_out_date
            }
            response = requests.post(self.booking_api_url, json=payload, headers=headers, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": f"Lỗi khi đặt phòng: {str(e)}"}
        except json.JSONDecodeError:
            return {"error": "Lỗi phân tích phản hồi từ API đặt phòng"}

    def find_hotel_by_name(self, hotel_name: str) -> Optional[Dict[str, Any]]:
        """Tìm khách sạn theo tên (fuzzy matching)"""
        try:
            hotels = self.fetch_hotel_list()
            hotel_name_lower = hotel_name.lower().strip()
            
            for hotel in hotels:
                if hotel.get('name', '').lower() == hotel_name_lower:
                    return hotel
            
            for hotel in hotels:
                if hotel_name_lower in hotel.get('name', '').lower():
                    return hotel
            
            name_words = hotel_name_lower.split()
            for hotel in hotels:
                hotel_name_check = hotel.get('name', '').lower()
                if all(word in hotel_name_check for word in name_words):
                    return hotel
            
            return None
        except Exception:
            return None

    def format_hotel_data_for_ai(self, hotels: List[Dict[str, Any]]) -> str:
        """Định dạng dữ liệu khách sạn để gửi cho AI"""
        if not hotels:
            return "Không có khách sạn nào khả dụng."
        
        formatted_data = "DANH SÁCH KHÁCH SẠN:\n\n"
        for hotel in hotels:
            formatted_data += f"""
🏨 **{hotel.get('name', 'N/A')}** (ID: {hotel.get('id', 'N/A')})
📍 Địa chỉ: {hotel.get('address', 'N/A')}
📝 Mô tả: {hotel.get('description', 'N/A')}
⭐ Đánh giá: {hotel.get('rating', 'N/A')}/5
📅 Ngày tạo: {hotel.get('created_at', 'N/A')}
---
"""
        return formatted_data.strip()

    def format_room_data_for_ai(self, rooms: List[Dict[str, Any]], hotel_name: str = "") -> str:
        """Định dạng dữ liệu phòng để gửi cho AI"""
        if not rooms:
            return f"Không có phòng trống tại {hotel_name}."
        
        formatted_data = f"DANH SÁCH PHÒNG TRỐNG TẠI {hotel_name.upper()}:\n\n"
        room_types = {}
        for room in rooms:
            room_type = room.get('room_type', 'Unknown')
            if room_type not in room_types:
                room_types[room_type] = []
            room_types[room_type].append(room)
        
        for room_type, type_rooms in room_types.items():
            formatted_data += f"\n🛏️ **LOẠI PHÒNG: {room_type.upper()}**\n"
            formatted_data += f"💰 Giá: {type_rooms[0].get('price', 'N/A')} VNĐ/đêm\n"
            formatted_data += f"📊 Số phòng có sẵn: {len(type_rooms)}\n"
            amenities = type_rooms[0].get('amenities', '')
            if amenities:
                amenities_list = [a.strip() for a in amenities.split(',') if a.strip()]
                formatted_data += f"🎯 Tiện nghi: {', '.join(amenities_list)}\n"
            room_names = [f"{room.get('name', 'N/A')} (ID: {room.get('id', 'N/A')})" for room in type_rooms]
            formatted_data += f"🚪 Phòng có sẵn: {', '.join(room_names[:5])}"
            if len(room_names) > 5:
                formatted_data += f" và {len(room_names) - 5} phòng khác"
            formatted_data += "\n---\n"
        
        return formatted_data.strip()

    def create_recommendation_prompt(self, user_query: str, hotel_data: str) -> str:
        """Tạo prompt cho gợi ý khách sạn"""
        prompt = f"""
Bạn là một chuyên gia tư vấn du lịch chuyên nghiệp. Dựa trên yêu cầu của khách hàng và danh sách khách sạn có sẵn, hãy đưa ra những gợi ý phù hợp nhất.

YÊU CẦU CỦA KHÁCH HÀNG: "{user_query}"
Còn Đây là danh sách khách sạn hiện có trong dữ liệu hệ thống:
{hotel_data}

HƯỚNG DẪN TRẢ LỜI:
- Phân tích yêu cầu của khách hàng
- Đề xuất 2-3 khách sạn phù hợp nhất
- Giải thích lý do tại sao chọn những khách sạn đó
- Đưa ra thông tin chi tiết về từng khách sạn được gợi ý
- Kết thúc bằng câu: "Bạn có muốn xem phòng trống ở khách sạn nào không?'"
- Trả lời bằng tiếng Việt một cách thân thiện và chuyên nghiệp.


"""
        return prompt

    def create_room_recommendation_prompt(self, user_query: str, room_data: str, 
                                       check_in: str, check_out: str, people: int) -> str:
        """Tạo prompt cho gợi ý phòng"""
        prompt = f"""
Bạn là một chuyên gia tư vấn khách sạn. Khách hàng đang tìm phòng với thông tin:
- Ngày check-in: {check_in}
- Ngày check-out: {check_out}  
- Số người: {people}

YÊU CẦU: "{user_query}"

{room_data}

HƯỚNG DẪN TRẢ LỜI:
- Phân tích thông tin phòng trống
- Gợi ý loại phòng phù hợp nhất
- Phân tích giá cả và tiện nghi
- Đưa ra lời khuyên về lựa chọn phòng
- Trả lời bằng tiếng Việt một cách thân thiện và chuyên nghiệp.


"""
        return prompt

    def get_hotel_recommendation(self, user_query: str) -> str:
        """Lấy gợi ý khách sạn từ Gemini API"""
        try:
            hotels = self.fetch_hotel_list()
            if not hotels:
                return "❌ Xin lỗi, hiện tại không thể lấy được danh sách khách sạn. Vui lòng thử lại sau."
            hotel_data = self.format_hotel_data_for_ai(hotels)
            prompt = self.create_recommendation_prompt(user_query, hotel_data)
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"❌ Xin lỗi, đã có lỗi xảy ra: {str(e)}"

    def get_room_recommendation(self, hotel_id: int, check_in_date: str, 
                              check_out_date: str, people: int, user_query: str = "") -> str:
        """Lấy gợi ý phòng từ Gemini API"""
        try:
            hotels = self.fetch_hotel_list()
            hotel_name = "Khách sạn"
            for hotel in hotels:
                if hotel.get('id') == hotel_id:
                    hotel_name = hotel.get('name', 'Khách sạn')
                    break
            availability_data = self.check_room_availability(hotel_id, check_in_date, check_out_date, people)
            rooms = availability_data.get('rooms', [])
            if not rooms:
                return f"❌ Xin lỗi, không còn phòng trống tại {hotel_name} từ {check_in_date} đến {check_out_date} cho {people} người. Bạn có thể thử tìm khách sạn khác hoặc thay đổi ngày đặt phòng."
            room_data = self.format_room_data_for_ai(rooms, hotel_name)
            prompt = self.create_room_recommendation_prompt(user_query or "Tư vấn phòng phù hợp", 
                                                         room_data, check_in_date, check_out_date, people)
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"❌ Xin lỗi, đã có lỗi xảy ra: {str(e)}"

    def normalize_date_format(self, date_str: str) -> str:
        """Chuẩn hóa format ngày về YYYY-MM-DD"""
        if not date_str:
            return date_str
        if re.match(r'^\d{4}-\d{2}-\d{2}$', date_str):
            return date_str
        if re.match(r'^\d{2}[-/]\d{2}[-/]\d{4}$', date_str):
            parts = re.split(r'[-/]', date_str)
            return f"{parts[2]}-{parts[1]}-{parts[0]}"
        return date_str

    def process_user_request(self, user_input: str, jwt_token: Optional[str] = None) -> Dict[str, Any]:
        """
        Xử lý yêu cầu người dùng với Gemini classification và bối cảnh session
        """
        classification = self.classify_user_intent(user_input)
        intent = classification.get('intent')
        confidence = classification.get('confidence', 0)
        
        if confidence < 0.5:
            return {
                "response": "❓ Xin lỗi, tôi không hiểu rõ yêu cầu của bạn. Bạn có thể nói rõ hơn được không?\n💡 Ví dụ: 'Tìm khách sạn gần trung tâm', 'Xem đặt phòng của tôi', hoặc 'Đặt phòng Hotel ABC từ 2025-06-01 đến 2025-06-05'",
                "intent": intent,
                "confidence": confidence,
                "hotel_info": classification.get('hotel_info'),
                "booking_info": classification.get('booking_info'),
                "extracted_requirements": classification.get('extracted_requirements')
            }
        
        if intent == "view_bookings":
            if not jwt_token:
                return {
                    "response": "❌ Vui lòng đăng nhập để xem danh sách đặt phòng.",
                    "intent": intent,
                    "confidence": confidence,
                    "hotel_info": classification.get('hotel_info'),
                    "booking_info": classification.get('booking_info'),
                    "extracted_requirements": classification.get('extracted_requirements')
                }
            
            bookings = self.fetch_booking_list(jwt_token)
            response = self.format_booking_list(bookings)
            return {
                "response": response,
                "intent": intent,
                "confidence": confidence,
                "hotel_info": classification.get('hotel_info'),
                "booking_info": classification.get('booking_info'),
                "extracted_requirements": classification.get('extracted_requirements')
            }
        
        elif intent == "search_hotels":
            response = self.get_hotel_recommendation(classification.get('extracted_requirements', user_input))
            return {
                "response": response,
                "intent": intent,
                "confidence": confidence,
                "hotel_info": classification.get('hotel_info'),
                "booking_info": classification.get('booking_info'),
                "extracted_requirements": classification.get('extracted_requirements')
            }
            
        elif intent == "check_rooms":
            hotel_info = classification.get('hotel_info', {})
            booking_info = classification.get('booking_info', {})
            
            check_in = self.normalize_date_format(booking_info.get('check_in_date', ''))
            check_out = self.normalize_date_format(booking_info.get('check_out_date', ''))
            people = booking_info.get('people', 1)
            
            if not check_in or not check_out:
                return {
                    "response": "❌ Vui lòng cung cấp ngày check-in và check-out.\n💡 Ví dụ: 'Xem phòng Hotel ABC từ 2025-06-01 đến 2025-06-05 cho 2 người'",
                    "intent": intent,
                    "confidence": confidence,
                    "hotel_info": hotel_info,
                    "booking_info": booking_info,
                    "extracted_requirements": classification.get('extracted_requirements')
                }
            
            hotel_id = hotel_info.get('id')
            hotel_name = hotel_info.get('name')
            
            if hotel_id:
                pass
            elif hotel_name:
                hotel = self.find_hotel_by_name(hotel_name)
                if not hotel:
                    return {
                        "response": f"❌ Không tìm thấy khách sạn: '{hotel_name}'\n💡 Hãy thử tìm khách sạn trước, sau đó xem phòng trống.",
                        "intent": intent,
                        "confidence": confidence,
                        "hotel_info": hotel_info,
                        "booking_info": booking_info,
                        "extracted_requirements": classification.get('extracted_requirements')
                    }
                hotel_id = hotel.get('id')
                hotel_name = hotel.get('name')
            else:
                return {
                    "response": "❌ Vui lòng chỉ định tên hoặc ID khách sạn.\n💡 Ví dụ: 'Xem phòng Royal Garden Hotel từ 2025-06-01 đến 2025-06-05'",
                    "intent": intent,
                    "confidence": confidence,
                    "hotel_info": hotel_info,
                    "booking_info": booking_info,
                    "extracted_requirements": classification.get('extracted_requirements')
                }
            
            # Lưu bối cảnh session
            if jwt_token:
                user_id = self.get_user_id_from_jwt(jwt_token)
                if user_id:
                    self.save_session_context(user_id, {
                        "hotel_id": hotel_id,
                        "hotel_name": hotel_name,
                        "check_in_date": check_in,
                        "check_out_date": check_out,
                        "people": people
                    })
            
            response = self.get_room_recommendation(hotel_id, check_in, check_out, people, user_input)
            return {
                "response": response,
                "intent": intent,
                "confidence": confidence,
                "hotel_info": {"name": hotel_name, "id": hotel_id},
                "booking_info": booking_info,
                "extracted_requirements": classification.get('extracted_requirements')
            }
        
        elif intent == "book_room":
            if not jwt_token:
                return {
                    "response": "❌ Vui lòng đăng nhập để đặt phòng.",
                    "intent": intent,
                    "confidence": confidence,
                    "hotel_info": classification.get('hotel_info'),
                    "booking_info": classification.get('booking_info'),
                    "extracted_requirements": classification.get('extracted_requirements')
                }
            
            user_id = self.get_user_id_from_jwt(jwt_token) if jwt_token else None
            session_context = self.get_session_context(user_id) if user_id else None
            
            hotel_info = classification.get('hotel_info', {})
            booking_info = classification.get('booking_info', {})
            
            check_in = self.normalize_date_format(booking_info.get('check_in_date', ''))
            check_out = self.normalize_date_format(booking_info.get('check_out_date', ''))
            people = booking_info.get('people')
            
            hotel_id = hotel_info.get('id')
            hotel_name = hotel_info.get('name')
            room_id = hotel_info.get('room_id')
            room_name = hotel_info.get('room_name')
            
            # Sử dụng bối cảnh session nếu thiếu thông tin
            if not (hotel_id or hotel_name) and session_context:
                hotel_id = session_context.get('hotel_id')
                hotel_name = session_context.get('hotel_name')
            if not check_in and session_context:
                check_in = session_context.get('check_in_date')
            if not check_out and session_context:
                check_out = session_context.get('check_out_date')
            if not people and session_context:  # Ưu tiên session nếu people không được cung cấp
                people = session_context.get('people', 1)
            
            if not hotel_id and hotel_name:
                hotel = self.find_hotel_by_name(hotel_name)
                if not hotel:
                    return {
                        "response": f"❌ Không tìm thấy khách sạn: '{hotel_name}'\n💡 Hãy thử tìm khách sạn trước, sau đó đặt phòng.",
                        "intent": intent,
                        "confidence": confidence,
                        "hotel_info": hotel_info,
                        "booking_info": booking_info,
                        "extracted_requirements": classification.get('extracted_requirements')
                    }
                hotel_id = hotel.get('id')
                hotel_name = hotel.get('name')
            
            if not hotel_id:
                return {
                    "response": "❌ Vui lòng chỉ định tên hoặc ID khách sạn.\n💡 Ví dụ: 'Đặt phòng Royal Garden Hotel từ 2025-06-01 đến 2025-06-05'",
                    "intent": intent,
                    "confidence": confidence,
                    "hotel_info": hotel_info,
                    "booking_info": booking_info,
                    "extracted_requirements": classification.get('extracted_requirements')
                }
            
            if not check_in or not check_out:
                return {
                    "response": "❌ Vui lòng cung cấp ngày check-in và check-out.\n💡 Ví dụ: 'Đặt phòng Hotel ABC từ 2025-06-01 đến 2025-06-05 cho 2 người'",
                    "intent": intent,
                    "confidence": confidence,
                    "hotel_info": {"name": hotel_name, "id": hotel_id},
                    "booking_info": booking_info,
                    "extracted_requirements": classification.get('extracted_requirements')
                }
            
            # Kiểm tra room_id hoặc room_name
            if not room_id and room_name:
                # Tìm room_id từ room_name bằng cách kiểm tra phòng trống
                availability_data = self.check_room_availability(hotel_id, check_in, check_out, people)
                rooms = availability_data.get('rooms', [])
                for room in rooms:
                    if room.get('name', '').upper() == room_name:
                        room_id = room.get('id')
                        break
            
            if not room_id:
                # Lấy danh sách phòng trống
                availability_data = self.check_room_availability(hotel_id, check_in, check_out, people)
                rooms = availability_data.get('rooms', [])
                if not rooms:
                    return {
                        "response": f"❌ Không có phòng trống tại {hotel_name} từ {check_in} đến {check_out} cho {people} người.",
                        "intent": intent,
                        "confidence": confidence,
                        "hotel_info": {"name": hotel_name, "id": hotel_id},
                        "booking_info": booking_info,
                        "extracted_requirements": classification.get('extracted_requirements')
                    }
                # Lưu bối cảnh session
                if user_id:
                    self.save_session_context(user_id, {
                        "hotel_id": hotel_id,
                        "hotel_name": hotel_name,
                        "check_in_date": check_in,
                        "check_out_date": check_out,
                        "people": people
                    })
                # Trả về danh sách phòng trống để người dùng chọn
                room_data = self.format_room_data_for_ai(rooms, hotel_name)
                return {
                    "response": f"Dựa trên yêu cầu của bạn, đây là các phòng trống tại {hotel_name}:\n{room_data}\nVui lòng chọn ID phòng hoặc tên phòng để đặt (VD: 'Đặt phòng với roomId 7' hoặc 'Đặt phòng P1003').",
                    "intent": intent,
                    "confidence": confidence,
                    "hotel_info": {"name": hotel_name, "id": hotel_id},
                    "booking_info": booking_info,
                    "extracted_requirements": classification.get('extracted_requirements')
                }
            
            # Lưu bối cảnh session
            if user_id:
                self.save_session_context(user_id, {
                    "hotel_id": hotel_id,
                    "hotel_name": hotel_name,
                    "check_in_date": check_in,
                    "check_out_date": check_out,
                    "people": people
                })
            
            # Nếu có room_id, tiến hành đặt phòng
            booking_response = self.book_room(hotel_id, room_id, check_in, check_out, jwt_token)
            if 'error' in booking_response:
                return {
                    "response": f"❌ Đặt phòng thất bại: {booking_response['error']}",
                    "intent": intent,
                    "confidence": confidence,
                    "hotel_info": {"name": hotel_name, "id": hotel_id},
                    "booking_info": booking_info,
                    "extracted_requirements": classification.get('extracted_requirements')
                }
            
            # Xóa session sau khi đặt phòng thành công
            if user_id:
                self.clear_session_context(user_id)
            
            return {
                "response": f"✅ Đặt phòng thành công tại {hotel_name}! Mã đặt phòng: {booking_response.get('id')}.",
                "intent": intent,
                "confidence": confidence,
                "hotel_info": {"name": hotel_name, "id": hotel_id},
                "booking_info": booking_info,
                "extracted_requirements": classification.get('extracted_requirements')
            }
        
        return {
            "response": "❓ Xin lỗi, tôi không thể xử lý yêu cầu này. Hãy thử lại với yêu cầu rõ ràng hơn.",
            "intent": intent,
            "confidence": confidence,
            "hotel_info": classification.get('hotel_info'),
            "booking_info": classification.get('booking_info'),
            "extracted_requirements": classification.get('extracted_requirements')
        }

# Khởi tạo hệ thống với API key từ biến môi trường
GEMINI_API_KEY = "AIzaSyAl5693-QgRfg8Bz8wsYTfJvwVhxdmVcOU"  # Thay bằng API key thực
BASE_API_URL = "http://localhost/bookingBackend/api"

if not GEMINI_API_KEY or GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE":
    raise ValueError("GEMINI_API_KEY không được cung cấp hoặc không hợp lệ")

recommendation_system = HotelRecommendationSystem(
    gemini_api_key=GEMINI_API_KEY,
    base_api_url=BASE_API_URL
)

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Endpoint để xử lý yêu cầu chat từ giao diện chatbot
    """
    try:
        result = recommendation_system.process_user_request(request.user_input, request.jwt_token)
        return ChatResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý yêu cầu: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)