import React, { useState, useRef, useContext } from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
import MessageBubble from "../component/MessageBubble";
import ChatInput from "../component/ChatInput";
import { AppContext } from "../context/ContextData";

function ChatBot() {
  const { isAuth } = useContext(AppContext);
  const [messages, setMessages] = useState([
    {
      id: 1,
      message:
        "Xin chào! 👋 Tôi là trợ lý ảo của hệ thống đặt phòng khách sạn. Tôi có thể giúp bạn:\n\n🏨 Tìm kiếm và gợi ý khách sạn phù hợp\n🛏️ Kiểm tra phòng còn trống\n🎯 Đặt phòng trực tiếp \n📋 Tra cứu lịch sử đặt phòng \n\nBạn cần tôi hỗ trợ gì hôm nay?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages, isTyping]);

  // Get JWT token from localStorage
  const getJWTToken = () => {
    return localStorage.getItem("token");
  };

  // API call function
  const sendMessageToAPI = async (userMessage) => {
    try {
      const jwtToken = getJWTToken();
      const requestBody = {
        user_input: userMessage,
      };

      // Thêm JWT token vào request nếu user đã đăng nhập
      if (isAuth && jwtToken) {
        requestBody.jwt_token = jwtToken;
      }

      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Để gửi cookies
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error calling API:", error);
      throw error;
    }
  };

  // Handle sending message
  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      message: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Call API
      const response = await sendMessageToAPI(messageText);

      // Simulate typing delay for better UX
      setTimeout(() => {
        setIsTyping(false);

        // Add bot response
        const botMessage = {
          id: Date.now() + 1,
          message:
            response.response || "Xin lỗi, tôi không thể xử lý yêu cầu này.",
          isUser: false,
          timestamp: new Date(),
          intent: response.intent,
          confidence: response.confidence,
          hotel_info: response.hotel_info,
          booking_info: response.booking_info,
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    } catch {
      setIsTyping(false);
      setIsLoading(false);

      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        message:
          "❌ Xin lỗi, đã có lỗi xảy ra khi kết nối với server. Vui lòng thử lại sau.\n\n💡 Lưu ý: Đảm bảo API server đang chạy tại http://localhost:8000",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // Clear chat function
  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        message:
          "Xin chào! 👋 Tôi là trợ lý ảo của hệ thống đặt phòng khách sạn. Tôi có thể giúp bạn:\n\n🏨 Tìm kiếm và gợi ý khách sạn phù hợp\n🛏️ Kiểm tra phòng trống\n💰 So sánh giá cả và tiện nghi\n📅 Tư vấn lựa chọn ngày phù hợp\n🎯 Đặt phòng trực tiếp (cần đăng nhập)\n📋 Xem danh sách đặt phòng (cần đăng nhập)\n\nBạn cần tôi hỗ trợ gì hôm nay?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col">
        <div className="container mx-auto px-4 py-6 flex-grow flex flex-col max-w-6xl">
          {/* Chat header */}
          <div className="bg-white rounded-t-2xl border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Trợ lý Khách sạn AI
                </h1>
                <p className="text-sm text-gray-500 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Đang trực tuyến
                  {isAuth && (
                    <span className="ml-2 text-blue-600 text-xs">
                      • Đã đăng nhập
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleClearChat}
                disabled={isLoading}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Xóa hội thoại
              </button>
            </div>
          </div>

          {/* Chat messages container */}
          <div
            ref={chatContainerRef}
            className="flex-grow bg-white px-6 py-6 overflow-y-auto"
            style={{
              minHeight: "400px",
              maxHeight: "calc(100vh - 300px)",
            }}
          >
            <div className="space-y-1">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg.message}
                  isUser={msg.isUser}
                  timestamp={msg.timestamp}
                />
              ))}

              {isTyping && (
                <MessageBubble message="" isUser={false} isTyping={true} />
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat input */}
          <div className="bg-white rounded-b-2xl">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Info section */}
        <div className="container mx-auto px-4 pb-6 max-w-6xl">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-blue-500 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Hướng dẫn sử dụng:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>
                    • <strong>Tìm khách sạn:</strong> "Tìm khách sạn gần trung
                    tâm" hoặc "Khách sạn giá rẻ"
                  </li>
                  <li>
                    • <strong>Xem phòng trống:</strong> "Xem phòng [tên khách
                    sạn] từ [ngày] đến [ngày] cho [số người] người"
                  </li>
                  <li>
                    • <strong>Đặt phòng:</strong> "Đặt phòng [tên khách sạn] từ
                    [ngày] đến [ngày]" (cần đăng nhập)
                  </li>
                  <li>
                    • <strong>Xem lịch sử đặt:</strong> "Xem đặt phòng của tôi"
                    hoặc "Danh sách booking" (cần đăng nhập)
                  </li>
                  <li>
                    • <strong>Ví dụ:</strong> "Xem phòng Royal Garden Hotel từ
                    2025-06-10 đến 2025-06-15 cho 2 người"
                  </li>
                </ul>
                {!isAuth && (
                  <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-xs">
                    💡 <strong>Lưu ý:</strong> Đăng nhập để sử dụng các tính
                    năng đặt phòng và xem lịch sử đặt phòng.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ChatBot;
