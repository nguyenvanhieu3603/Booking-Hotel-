<?php
require_once PROJECT_ROOT_PATH . "/inc/EmailService.php"; // Thêm dòng này
class OTPController extends BaseController
{
    /**
     * "/otp/send" Endpoint - Gửi OTP
     */
    public function sendAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        if (strtoupper($requestMethod) == 'POST') {
            try {
                $requestData = $this->getRequestData();
                
                if (!isset($requestData['email'])) {
                    throw new Exception('Email is required');
                }
                
                $userModel = new UserModel();
                $user = $userModel->getUserByEmail($requestData['email']);
                
                if (empty($user)) {
                    throw new Exception('Email not registered');
                }
                
                // Generate OTP
                $otpCode = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
                
                // Store OTP in database
                $userModel->storeOTP($user[0]['id'], $otpCode);
                
                // Send OTP via email
                $emailService = new EmailService();
                $emailSent = $emailService->sendOTP($requestData['email'], $otpCode);
                
                if (!$emailSent) {
                    throw new Exception('Failed to send OTP email');
                }
                
                $responseData = json_encode([
                    'success' => true,
                    'message' => 'OTP sent successfully'
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
                json_encode(array('success' => false, 'error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }
    
    /**
     * "/otp/verify" Endpoint - Xác thực OTP
     */
    public function verifyAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        if (strtoupper($requestMethod) == 'POST') {
            try {
                $requestData = $this->getRequestData();
                
                $requiredFields = ['email', 'otp'];
                foreach ($requiredFields as $field) {
                    if (!isset($requestData[$field])) {
                        throw new Exception("Missing required field: $field");
                    }
                }
                
                $userModel = new UserModel();
                $user = $userModel->getUserByEmail($requestData['email']);
                
                if (empty($user)) {
                    throw new Exception('Email not registered');
                }
                
                $verified = $userModel->verifyOTP(
                    $requestData['email'], 
                    $requestData['otp']
                );
                
                if (!$verified) {
                    throw new Exception('Invalid or expired OTP');
                }
                
                $responseData = json_encode([
                    'success' => true,
                    'message' => 'Email verified successfully'
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
                json_encode(array('success' => false, 'error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }
}
