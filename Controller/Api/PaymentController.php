<?php
class PaymentController extends BaseController
{
    /**
     * "/payment/create" Endpoint - Create payment for booking
     */
    public function createAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        if (strtoupper($requestMethod) == 'POST') {
            try {
                $paymentModel = new PaymentModel();
                $bookingModel = new BookingModel();
                $requestData = $this->getRequestData();
                
                // Validate input
                $requiredFields = ['bookingId', 'paymentMethod', 'amount'];
                foreach ($requiredFields as $field) {
                    if (!isset($requestData[$field])) {
                        throw new Exception("Missing required field: $field");
                    }
                }
                
                // Verify booking exists
                $booking = $bookingModel->getBookingById($requestData['bookingId']);
                if (empty($booking)) {
                    throw new Exception('Booking not found');
                }
                
                // Create payment
                $paymentId = $paymentModel->createPayment(
                    $requestData['bookingId'],
                    $requestData['paymentMethod'],
                    $requestData['amount']
                );
                
                // Update booking status to confirmed
                $bookingModel->updateBookingStatus($requestData['bookingId'], 'confirmed');
                
                $responseData = json_encode([
                    'id' => $paymentId,
                    'message' => 'Payment created successfully'
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
     * "/payment/list" Endpoint - Get payments for booking
     */
    public function listAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $paymentModel = new PaymentModel();
                
                if (!isset($arrQueryStringParams['bookingId'])) {
                    throw new Exception('Booking ID is required');
                }
                
                $bookingId = $arrQueryStringParams['bookingId'];
                $arrPayments = $paymentModel->getPaymentsByBooking($bookingId);
                $responseData = json_encode($arrPayments);
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
     * "/payment/update" Endpoint - Update payment status
     */
    public function updateAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        if (strtoupper($requestMethod) == 'PUT') {
            try {
                $paymentModel = new PaymentModel();
                $requestData = $this->getRequestData();
                
                // Validate input
                $requiredFields = ['paymentId', 'status'];
                foreach ($requiredFields as $field) {
                    if (!isset($requestData[$field])) {
                        throw new Exception("Missing required field: $field");
                    }
                }
                
                // Update payment status
                $affectedRows = $paymentModel->updatePaymentStatus(
                    $requestData['paymentId'],
                    $requestData['status']
                );
                
                if ($affectedRows === 0) {
                    throw new Exception('Payment not found or status not changed');
                }
                
                $responseData = json_encode([
                    'message' => 'Payment status updated successfully'
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