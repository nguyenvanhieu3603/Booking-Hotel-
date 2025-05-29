<?php
require_once PROJECT_ROOT_PATH . "/inc/EmailService.php";

class BookingController extends BaseController
{
    private function isValidDate($date)
    {
        return (bool)strtotime($date) && DateTime::createFromFormat('Y-m-d', $date) !== false;
    }

    /**
     * "/booking/create" Endpoint - Create new booking
     */
    public function createAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        if (strtoupper($requestMethod) == 'POST') {
            try {
                $bookingModel = new BookingModel();
                $requestData = $this->getRequestData();
                $user = $this->authenticate();
                
                if (!$user) {
                    throw new Exception("Không tìm thấy thông tin người dùng");
                }

                // Validate input
                $requiredFields = ['hotelId', 'roomId', 'checkInDate', 'checkOutDate'];
                foreach ($requiredFields as $field) {
                    if (!isset($requestData[$field])) {
                        throw new Exception("Missing required field: $field");
                    }
                }

                // Kiểm tra định dạng ngày
                if (!$this->isValidDate($requestData['checkInDate']) || !$this->isValidDate($requestData['checkOutDate'])) {
                    throw new Exception("Invalid date format");
                }
                $checkIn = new DateTime($requestData['checkInDate']);
                $checkOut = new DateTime($requestData['checkOutDate']);
                if ($checkIn >= $checkOut) {
                    throw new Exception("Check-out date must be after check-in date");
                }

                // Create booking
                $bookingId = $bookingModel->createBooking(
                    $user['id'], // Lấy userId từ token
                    $requestData['hotelId'],
                    $requestData['roomId'],
                    $requestData['checkInDate'],
                    $requestData['checkOutDate']
                );

                // Gửi email xác nhận
                $booking = $bookingModel->getBookingById($bookingId);
                $emailService = new EmailService();
                $emailService->sendBookingConfirmation(
                    $user['email'],
                    $user['fullName'],
                    $booking[0]['hotelName'],
                    $booking[0]['roomName'],
                    $requestData['checkInDate'],
                    $requestData['checkOutDate'],
                    $booking[0]['totalPrice']
                );
                
                $responseData = json_encode([
                    'id' => $bookingId,
                    'message' => 'Booking created successfully'
                ]);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage();
                $strErrorHeader = 'HTTP/1.1 400 Bad Request';
            }
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }

        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 201 Created')
            );
        } else {
            $this->sendOutput(
                json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    /**
     * "/booking/list" Endpoint - Get user bookings
     */
    public function listAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $bookingModel = new BookingModel();
                $user = $this->authenticate();
                
                if (!$user) {
                    throw new Exception("Không tìm thấy thông tin người dùng");
                }

                $intLimit = 10;
                if (isset($arrQueryStringParams['limit']) && $arrQueryStringParams['limit']) {
                    $intLimit = $arrQueryStringParams['limit'];
                }
                
                $showCancelled = isset($arrQueryStringParams['showCancelled']) 
                    && $arrQueryStringParams['showCancelled'] === 'true';
                
                if ($showCancelled) {
                    $arrBookings = $bookingModel->getUserBookings($user['id'], $intLimit);
                } else {
                    $arrBookings = $bookingModel->getUserActiveBookings($user['id'], $intLimit);
                }
                
                $responseData = json_encode($arrBookings);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage();
                $strErrorHeader = 'HTTP/1.1 400 Bad Request';
            }
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }

        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(
                json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    /**
     * "/booking/cancel" Endpoint - Cancel booking
     */
    public function cancelAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        if (strtoupper($requestMethod) == 'PUT') {
            try {
                $bookingModel = new BookingModel();
                $requestData = $this->getRequestData();
                $user = $this->authenticate();
                
                if (!$user) {
                    throw new Exception("Không tìm thấy thông tin người dùng");
                }

                if (!isset($requestData['bookingId'])) {
                    throw new Exception('Booking ID is required');
                }
                
                $booking = $bookingModel->getBookingById($requestData['bookingId']);
                if (empty($booking)) {
                    throw new Exception("Booking not found");
                }
                if ($booking[0]['userId'] != $user['id']) {
                    throw new Exception("Unauthorized to cancel this booking");
                }

                $affectedRows = $bookingModel->updateBookingStatus($requestData['bookingId'], 'cancelled');
                
                if ($affectedRows === 0) {
                    throw new Exception('Booking not found or already cancelled');
                }

                // Gửi email thông báo hủy
                $emailService = new EmailService();
                $emailService->sendBookingCancellation(
                    $user['email'],
                    $user['fullName'],
                    $booking[0]['hotelName'],
                    $booking[0]['roomName'],
                    $booking[0]['checkInDate']
                );
                
                $responseData = json_encode([
                    'message' => 'Booking cancelled successfully'
                ]);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage();
                $strErrorHeader = 'HTTP/1.1 400 Bad Request';
            }
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }

        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(
                json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    public function allAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $bookingModel = new BookingModel();

                $intLimit = 10;
                if (isset($arrQueryStringParams['limit']) && $arrQueryStringParams['limit']) {
                    $intLimit = $arrQueryStringParams['limit'];
                }

                $arrBookings = $bookingModel->getAllBookings($intLimit);
                $responseData = json_encode($arrBookings);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage();
                $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
            }
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }

        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(
                json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    /**
     * "/booking/stats" Endpoint - Get booking statistics (admin only)
     */
    public function statsAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $bookingModel = new BookingModel();

                $totalBookings = $bookingModel->countTotalBookings();
                $totalRevenue = $bookingModel->calculateTotalRevenue();
                $revenueByDate = $bookingModel->calculateRevenueByDate();

                $responseData = json_encode([
                    'totalBookings' => $totalBookings,
                    'totalRevenue' => $totalRevenue,
                    'revenueByDate' => $revenueByDate
                ]);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage();
                $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
            }
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }

        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(
                json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    /**
     * "/booking/complete" Endpoint - Mark booking as completed (admin only)
     */
    public function completeAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        if (strtoupper($requestMethod) == 'PUT') {
            try {
                $bookingModel = new BookingModel();
                $requestData = $this->getRequestData();

                if (!isset($requestData['bookingId'])) {
                    throw new Exception('Booking ID is required');
                }

                $affectedRows = $bookingModel->markAsCompleted($requestData['bookingId']);
                
                if ($affectedRows === 0) {
                    throw new Exception('Booking not found or already completed');
                }

                $responseData = json_encode([
                    'message' => 'Booking marked as completed successfully'
                ]);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage();
                $strErrorHeader = 'HTTP/1.1 400 Bad Request';
            }
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }

        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(
                json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }
    /**
     * "/booking/check-availability" Endpoint - Check room availability
     */
    public function checkAvailabilityAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $bookingModel = new BookingModel();

                // Validate required input
                $requiredFields = ['hotelId', 'checkInDate', 'checkOutDate', 'people'];
                foreach ($requiredFields as $field) {
                    if (!isset($arrQueryStringParams[$field])) {
                        throw new Exception("Missing required parameter: $field");
                    }
                }

                // Kiểm tra định dạng ngày
                if (!$this->isValidDate($arrQueryStringParams['checkInDate']) || 
                    !$this->isValidDate($arrQueryStringParams['checkOutDate'])) {
                    throw new Exception("Invalid date format. Use YYYY-MM-DD");
                }

                $checkIn = new DateTime($arrQueryStringParams['checkInDate']);
                $checkOut = new DateTime($arrQueryStringParams['checkOutDate']);
                if ($checkIn >= $checkOut) {
                    throw new Exception("Check-out date must be after check-in date");
                }

                // Kiểm tra số lượng người
                $people = (int)$arrQueryStringParams['people'];
                if ($people <= 0) {
                    throw new Exception("Number of people must be greater than 0");
                }

                // Lấy danh sách phòng khả dụng
                $availableRooms = $bookingModel->checkAvailability(
                    $arrQueryStringParams['hotelId'],
                    $arrQueryStringParams['checkInDate'],
                    $arrQueryStringParams['checkOutDate'],
                    $people
                );

                $responseData = json_encode([
                    'rooms' => $availableRooms,
                    'message' => empty($availableRooms) ? 'No rooms available' : 'Rooms available'
                ]);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage();
                $strErrorHeader = 'HTTP/1.1 400 Bad Request';
            }
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }

        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(
                json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    public function searchAvailableHotelsAction()
{
    $strErrorDesc = '';
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    $arrQueryStringParams = $this->getQueryStringParams();

    if (strtoupper($requestMethod) == 'GET') {
        try {
            $bookingModel = new BookingModel();

            // Validate required input
            $requiredFields = ['checkInDate', 'checkOutDate', 'people'];
            foreach ($requiredFields as $field) {
                if (!isset($arrQueryStringParams[$field])) {
                    throw new Exception("Missing required parameter: $field");
                }
            }

            // Kiểm tra định dạng ngày
            if (!$this->isValidDate($arrQueryStringParams['checkInDate']) || 
                !$this->isValidDate($arrQueryStringParams['checkOutDate'])) {
                throw new Exception("Invalid date format. Use YYYY-MM-DD");
            }

            $checkIn = new DateTime($arrQueryStringParams['checkInDate']);
            $checkOut = new DateTime($arrQueryStringParams['checkOutDate']);
            if ($checkIn >= $checkOut) {
                throw new Exception("Check-out date must be after check-in date");
            }

            // Kiểm tra số lượng người
            $people = (int)$arrQueryStringParams['people'];
            if ($people <= 0) {
                throw new Exception("Number of people must be greater than 0");
            }

            // Lấy danh sách khách sạn có sẵn
            $availableHotels = $bookingModel->searchAvailableHotels(
                $arrQueryStringParams['checkInDate'],
                $arrQueryStringParams['checkOutDate'],
                $people
            );

            // Thêm hình ảnh cho mỗi khách sạn
            $hotelModel = new HotelModel();
            foreach ($availableHotels as &$hotel) {
                $images = $hotelModel->getImagesByHotelId($hotel['id']);
                $hotel['images'] = empty($images) 
                    ? ['Uploads/hotel/default_hotel.jpg'] 
                    : array_column($images, 'image_url');
            }

            $responseData = json_encode([
                'hotels' => $availableHotels,
                'message' => empty($availableHotels) ? 'No hotels available' : 'Hotels available'
            ]);
        } catch (Exception $e) {
            $strErrorDesc = $e->getMessage();
            $strErrorHeader = 'HTTP/1.1 400 Bad Request';
        }
    } else {
        $strErrorDesc = 'Method not supported';
        $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
    }

    if (!$strErrorDesc) {
        $this->sendOutput(
            $responseData,
            array('Content-Type: application/json', 'HTTP/1.1 200 OK')
        );
    } else {
        $this->sendOutput(
            json_encode(array('error' => $strErrorDesc)),
            array('Content-Type: application/json', $strErrorHeader)
        );
    }
}

    /**
     * "/booking/room-details" Endpoint - Get room details by ID
     */
    public function roomDetailsAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                if (!isset($arrQueryStringParams['roomId'])) {
                    throw new Exception("Missing required parameter: roomId");
                }

                $bookingModel = new BookingModel();
                $roomDetails = $bookingModel->getRoomDetails($arrQueryStringParams['roomId']);

                if (empty($roomDetails)) {
                    throw new Exception("Room not found");
                }

                $responseData = json_encode($roomDetails);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage();
                $strErrorHeader = 'HTTP/1.1 400 Bad Request';
            }
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }

        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(
                json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }
}