<?php
require_once PROJECT_ROOT_PATH . "/inc/EmailService.php";
require_once PROJECT_ROOT_PATH . "/inc/vendor/autoload.php";

use PayPalCheckoutSdk\Core\PayPalHttpClient;
use PayPalCheckoutSdk\Core\SandboxEnvironment;
use PayPalCheckoutSdk\Orders\OrdersCreateRequest;
use PayPalCheckoutSdk\Orders\OrdersCaptureRequest;

class PaymentController extends BaseController
{
     private function getPayPalClient()
    {
        $clientId = PAYPAL_CLIENT_ID;
        $clientSecret = PAYPAL_CLIENT_SECRET;
        
        $environment = new SandboxEnvironment($clientId, $clientSecret);
        return new PayPalHttpClient($environment);
    }
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
                
                // Verify booking exists and status
                $booking = $bookingModel->getBookingById($requestData['bookingId']);
                if (empty($booking)) {
                    throw new Exception('Booking not found');
                }
                if ($booking[0]['statusId'] === 'cancelled') {
                    throw new Exception("Cannot create payment for cancelled booking");
                }
                if ($requestData['amount'] != $booking[0]['totalPrice']) {
                    throw new Exception("Số tiền thanh toán không đủ");
                }
                if ($booking[0]['userId'] != $this->authenticate()['id']) {
                    throw new Exception("Unauthorized to create payment for this booking");
                }
                // $user = $this->authenticate();
                // Xử lý thanh toán qua PayPal
                if ($requestData['paymentMethod'] === 'paypal') {
                    $paypalClient = $this->getPayPalClient();
                    
                    $request = new OrdersCreateRequest();
                    $request->prefer('return=representation');
                    $request->body = [
                        "intent" => "CAPTURE",
                        "purchase_units" => [[
                            "reference_id" => "booking_" . $requestData['bookingId'],
                            "description" => "Booking #" . $requestData['bookingId'],
                            "amount" => [
                                "value" => $requestData['amount'],
                                "currency_code" => "USD",
                                "breakdown" => [
                                    "item_total" => [
                                        "currency_code" => "USD",
                                        "value" => $requestData['amount']
                                    ]
                                ]
                            ]
                        ]],
                        "application_context" => [
                            "cancel_url" => BASE_URL . "/payment/cancel",
                            "return_url" => BASE_URL . "/payment/success"
                        ]
                    ];

                    try {
                        $response = $paypalClient->execute($request);
                        
                        // Lưu thông tin thanh toán tạm thời (pending)
                        $paymentId = $paymentModel->createPayment(
                            $requestData['bookingId'],
                            'paypal',
                            $requestData['amount'],
                            $response->result->id // Lưu PayPal transaction ID
                        );
                        
                        $responseData = json_encode([
                            'id' => $paymentId,
                            'paypal_approval_url' => $this->getApprovalLink($response->result->links),
                            'message' => 'PayPal payment initiated'
                        ]);
                        
                        $this->sendOutput(
                            $responseData,
                            array('Content-Type: application/json', 'HTTP/1.1 201 Created')
                        );
                        return;
                        
                    } catch (Exception $e) {
                        throw new Exception("PayPal error: " . $e->getMessage());
                    }
                }
                
                // Xử lý các phương thức thanh toán khác (credit_card, bank_transfer, cash, ewallet)
                $paymentId = $paymentModel->createPayment(
                    $requestData['bookingId'],
                    $requestData['paymentMethod'],
                    $requestData['amount'],
                    $requestData['transactionId'] ?? null
                );
                
                // Update booking status to confirmed
                $bookingModel->updateBookingStatus($requestData['bookingId'], 'confirmed');

                // Gửi email xác nhận thanh toán
                $emailService = new EmailService();
                $emailService->sendPaymentConfirmation(
                    $this->authenticate()['email'],
                    $this->authenticate()['fullName'],
                    $booking[0]['hotelName'],
                    $requestData['amount'],
                    $requestData['paymentMethod']
                );
                
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
    private function getApprovalLink($links)
    {
        foreach ($links as $link) {
            if ($link->rel === 'approve') {
                return $link->href;
            }
        }
        return null;
    }
    /**
     * "/payment/success" Endpoint - Xử lý khi thanh toán PayPal thành công
     */
    public function successAction()
    {
        $strErrorDesc = '';
        
        try {
            if (!isset($_GET['token'])) {
                throw new Exception('Missing PayPal token');
            }

            $token = $_GET['token'];
            $paymentModel = new PaymentModel();
            $bookingModel = new BookingModel();

            // Lấy thông tin payment từ database dựa trên PayPal token
            $payment = $paymentModel->getPaymentByTransactionId($token);
            if (empty($payment)) {
                throw new Exception('Payment not found');
            }

            // Xác nhận thanh toán với PayPal
            $paypalClient = $this->getPayPalClient();
            $request = new OrdersCaptureRequest($token);
            $request->prefer('return=representation');
            
            $response = $paypalClient->execute($request);
            
            if ($response->result->status !== 'COMPLETED') {
                throw new Exception('PayPal payment not completed');
            }

            // Cập nhật trạng thái thanh toán
            $paymentModel->updatePaymentStatus(
                $payment[0]['id'],
                'completed',
                $response->result->id
            );

            // Cập nhật trạng thái booking
            $bookingModel->updateBookingStatus($payment[0]['bookingId'], 'confirmed');

            // Gửi email xác nhận
            $booking = $bookingModel->getBookingById($payment[0]['bookingId']);
            $user = $this->authenticate();
            
            if ($user) {
                $emailService = new EmailService();
                $emailService->sendPaymentConfirmation(
                    $user['email'],
                    $user['fullName'],
                    $booking[0]['hotelName'],
                    $payment[0]['amount'],
                    'paypal'
                );
            }

            $responseData = json_encode([
                'message' => 'Payment completed successfully',
                'payment_id' => $payment[0]['id'],
                'booking_id' => $payment[0]['bookingId']
            ]);
            
        } catch (Exception $e) {
            $strErrorDesc = $e->getMessage();
            $strErrorHeader = 'HTTP/1.1 400 Bad Request';
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
     * "/payment/cancel" Endpoint - Xử lý khi hủy thanh toán PayPal
     */
    public function cancelAction()
    {
        $responseData = json_encode([
            'message' => 'Payment was cancelled',
            'success' => false
        ]);
        
        $this->sendOutput(
            $responseData,
            array('Content-Type: application/json', 'HTTP/1.1 200 OK')
        );
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
                $bookingModel = new BookingModel();
                
                if (!isset($arrQueryStringParams['bookingId'])) {
                    throw new Exception('Booking ID is required');
                }
                
                $bookingId = $arrQueryStringParams['bookingId'];
                $booking = $bookingModel->getBookingById($bookingId);
                if (empty($booking)) {
                    throw new Exception('Booking not found');
                }
                if ($booking[0]['userId'] != $this->authenticate()['id']) {
                    throw new Exception("Unauthorized to view payments for this booking");
                }

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

                // Kiểm tra quyền sở hữu
                // $payment = $paymentModel->getPaymentById($requestData['paymentId']);
                // if (empty($payment)) {
                //     throw new Exception("Payment not found");
                // }
                // if ($payment[0]['userId'] != $this->authenticate()['id']) {
                //     throw new Exception("Unauthorized to update this payment");
                // }
                
                // Update payment status
                $affectedRows = $paymentModel->updatePaymentStatus(
                    $requestData['paymentId'],
                    $requestData['status'],
                    $requestData['transactionId'] ?? null
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
    public function allAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $paymentModel = new PaymentModel();

                $intLimit = 10;
                if (isset($arrQueryStringParams['limit']) && $arrQueryStringParams['limit']) {
                    $intLimit = $arrQueryStringParams['limit'];
                }

                $arrPayments = $paymentModel->getAllPayments($intLimit);
                $responseData = json_encode($arrPayments);
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
     * "/payment/stats" Endpoint - Get payment statistics (admin only)
     */
    public function statsAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $paymentModel = new PaymentModel();

                $totalPayments = $paymentModel->countTotalPayments();
                $totalAmount = $paymentModel->calculateTotalPayments();
                $paymentsByDate = $paymentModel->getPaymentsByDate();

                $responseData = json_encode([
                    'totalPayments' => $totalPayments,
                    'totalAmount' => $totalAmount,
                    'paymentsByDate' => $paymentsByDate
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
}