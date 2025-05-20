<?php
class BookingController extends BaseController
{
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
                
                // Validate input
                $requiredFields = ['userId', 'hotelId', 'roomId', 'checkInDate', 'checkOutDate'];
                foreach ($requiredFields as $field) {
                    if (!isset($requestData[$field])) {
                        throw new Exception("Missing required field: $field");
                    }
                }
                
                // Check room availability
                $availability = $bookingModel->checkRoomAvailability(
                    $requestData['roomId'],
                    $requestData['checkInDate'],
                    $requestData['checkOutDate']
                );
                
                if (empty($availability) || $availability[0]['available'] <= 0) {
                    throw new Exception('Room is not available for the selected dates');
                }
                
                // Calculate total price (in real app, get price from room table)
                $totalPrice = $requestData['totalPrice'] ?? 0;
                
                // Create booking
                $bookingId = $bookingModel->createBooking(
                    $requestData['userId'],
                    $requestData['hotelId'],
                    $requestData['roomId'],
                    $requestData['checkInDate'],
                    $requestData['checkOutDate'],
                    $totalPrice
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
                
                if (!isset($arrQueryStringParams['userId'])) {
                    throw new Exception('User ID is required');
                }
                
                $userId = $arrQueryStringParams['userId'];
                $intLimit = 10;
                if (isset($arrQueryStringParams['limit']) && $arrQueryStringParams['limit']) {
                    $intLimit = $arrQueryStringParams['limit'];
                }
                
                // Thêm tham số showCancelled (mặc định false)
                $showCancelled = isset($arrQueryStringParams['showCancelled']) 
                    && $arrQueryStringParams['showCancelled'] === 'true';
                
                if ($showCancelled) {
                    $arrBookings = $bookingModel->getUserBookings($userId, $intLimit);
                } else {
                    $arrBookings = $bookingModel->getUserActiveBookings($userId, $intLimit);
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
                
                if (!isset($requestData['bookingId'])) {
                    throw new Exception('Booking ID is required');
                }
                
                $affectedRows = $bookingModel->updateBookingStatus($requestData['bookingId'], 'cancelled');
                
                if ($affectedRows === 0) {
                    throw new Exception('Booking not found or already cancelled');
                }
                
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
}