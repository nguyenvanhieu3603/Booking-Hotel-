<?php
require_once PROJECT_ROOT_PATH . "/inc/EmailService.php";
require_once PROJECT_ROOT_PATH . "/inc/vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class UserController extends BaseController
{
    private function generateToken($userId)
    {
        $payload = [
            'userId' => $userId,
            'iat' => time(),
            'exp' => time() + (30 * 24 * 60 * 60) // 30 ngày
        ];
        
        $jwt = JWT::encode($payload, JWT_SECRET, 'HS256');
        
        setcookie('jwt', $jwt, [
            'expires' => time() + (30 * 24 * 60 * 60),
            'httponly' => true,
            'secure' => $_SERVER['SERVER_NAME'] !== 'localhost',
            'samesite' => 'Strict',
            'path' => '/'
        ]);
        
        return $jwt;
    }

    public function listAction()
    {
        $this->handleCors();
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $userModel = new UserModel();
                $intLimit = 10;
                if (isset($arrQueryStringParams['limit']) && $arrQueryStringParams['limit']) {
                    $intLimit = $arrQueryStringParams['limit'];
                }
                
                $arrUsers = $userModel->getUsers($intLimit);
                $responseData = json_encode($arrUsers);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage() . ' Có lỗi xảy ra! Vui lòng liên hệ hỗ trợ.';
                $strErrorHeader = 'HTTP/1.1 500 Lỗi Máy Chủ';
            }
        } else {
            $strErrorDesc = 'Phương thức không được hỗ trợ';
            $strErrorHeader = 'HTTP/1.1 422 Không Thể Xử Lý';
        }

        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(
                json_encode(['error' => $strErrorDesc]),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    public function registerAction()
    {
        $this->handleCors();
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        if (strtoupper($requestMethod) == 'POST') {
            try {
                $userModel = new UserModel();
                $requestData = $this->getRequestData();
                
                // Validate input
                $requiredFields = ['fullName', 'email', 'password', 'phone'];
                foreach ($requiredFields as $field) {
                    if (!isset($requestData[$field]) || empty(trim($requestData[$field]))) {
                        throw new Exception("Vui lòng nhập đầy đủ thông tin: $field");
                    }
                }
                
                if (!$this->validateEmail($requestData['email'])) {
                    throw new Exception('Email không đúng định dạng');
                }
                
                if (!$this->validatePassword($requestData['password'])) {
                    throw new Exception('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt');
                }
                
                if (!$this->validatePhone($requestData['phone'])) {
                    throw new Exception('Số điện thoại không đúng định dạng Việt Nam');
                }
                
                // Check if email already exists
                $existingUser = $userModel->getUserByEmail($requestData['email']);
                if (!empty($existingUser)) {
                    throw new Exception('Email đã được đăng ký. Vui lòng sử dụng email khác');
                }
                
                // Create user
                $userId = $userModel->createUser(
                    $requestData['fullName'],
                    $requestData['email'],
                    $requestData['password'],
                    $requestData['phone']
                );
                
                // Generate OTP
                $otpCode = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
                $userModel->storeOTP($userId, $otpCode);
                
                // Send OTP and welcome email
                $emailService = new EmailService();
                $emailSent = $emailService->sendOTP($requestData['email'], $otpCode);
                
                if (!$emailSent) {
                    throw new Exception('Đăng ký thành công nhưng không thể gửi email OTP. Vui lòng liên hệ hỗ trợ.');
                }
                
                $emailService->sendWelcomeEmail($requestData['email'], $requestData['fullName']);
                
                $responseData = json_encode([
                    'id' => $userId,
                    'message' => 'Đăng ký thành công. Vui lòng kiểm tra email để nhận OTP xác minh.',
                    'requires_verification' => true,
                    'success' => true
                ]);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage();
                $strErrorHeader = 'HTTP/1.1 400 Yêu Cầu Không Hợp Lệ';
            }
        } else {
            $strErrorDesc = 'Phương thức không được hỗ trợ';
            $strErrorHeader = 'HTTP/1.1 422 Không Thể Xử Lý';
        }

        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 201 Đã Tạo')
            );
        } else {
            $this->sendOutput(
                json_encode(['success' => false, 'error' => $strErrorDesc]),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    public function loginAction()
    {
        $this->handleCors();
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        if (strtoupper($requestMethod) == 'POST') {
            try {
                $userModel = new UserModel();
                $requestData = $this->getRequestData();
                
                // Validate input
                if (!isset($requestData['email']) || !isset($requestData['password']) || 
                    empty(trim($requestData['email'])) || empty(trim($requestData['password']))) {
                    throw new Exception('Vui lòng nhập đầy đủ email và mật khẩu');
                }
                
                // Get user by email
                $user = $userModel->getUserByEmail($requestData['email']);
                if (empty($user)) {
                    throw new Exception('Email không tồn tại. Vui lòng đăng ký tài khoản');
                }
                
                $user = $user[0];
                
                // Check lockout
                if ($user['lockout_until'] && strtotime($user['lockout_until']) > time()) {
                    throw new Exception('Tài khoản bị tạm khóa. Vui lòng thử lại sau ' . 
                        ceil((strtotime($user['lockout_until']) - time()) / 60) . ' phút');
                }
                
                // Check verification
                if (!$user['is_verified']) {
                    throw new Exception('Tài khoản chưa xác minh email. Vui lòng xác minh email để đăng nhập');
                }
                
                // Verify password
                if (!password_verify($requestData['password'], $user['password'])) {
                    $userModel->incrementFailedLogin($user['email']);
                    if ($user['failed_login_attempts'] + 1 >= 5) {
                        $userModel->lockAccount($user['email']);
                        throw new Exception('Tài khoản bị tạm khóa do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút');
                    }
                    throw new Exception('Mật khẩu không chính xác');
                }
                
                // Reset failed login attempts
                $userModel->resetFailedLogin($user['email']);
                
                // Generate JWT
                $token = $this->generateToken($user['id']);
                
                $responseData = json_encode([
                    'id' => $user['id'],
                    'fullName' => $user['fullName'],
                    'email' => $user['email'],
                    'role' => $user['role'],
                    'token' => $token,
                    'message' => 'Đăng nhập thành công',
                    'success' => true
                ]);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage();
                $strErrorHeader = 'HTTP/1.1 401 Không Được Phép';
            }
        } else {
            $strErrorDesc = 'Phương thức không được hỗ trợ';
            $strErrorHeader = 'HTTP/1.1 422 Không Thể Xử Lý';
        }

        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK'),
                true // Giữ header Set-Cookie
            );
        } else {
            $this->sendOutput(
                json_encode(['success' => false, 'error' => $strErrorDesc]),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    public function logoutAction()
    {
        $this->handleCors();
        setcookie('jwt', '', [
            'expires' => time() - 3600,
            'httponly' => true,
            'secure' => $_SERVER['SERVER_NAME'] !== 'localhost',
            'samesite' => 'Strict',
            'path' => '/'
        ]);
        
        $this->sendOutput(
            json_encode(['message' => 'Đăng xuất thành công', 'success' => true]),
            array(
                'Content-Type: application/json',
                'HTTP/1.1 200 OK',
                'Set-Cookie: jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; HttpOnly; SameSite=Strict'
            )
        );
    }

    public function profileAction()
    {
        $this->handleCors();
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        if (strtoupper($requestMethod) == 'GET') {
            try {
                $userModel = new UserModel();
                $user = $_REQUEST['authenticatedUser'] ?? null;
                
                if (!$user) {
                    throw new Exception('Không tìm thấy thông tin người dùng');
                }
                
                $arrUsers = $userModel->getUserById($user['id']);
                
                if (empty($arrUsers)) {
                    throw new Exception('Người dùng không tồn tại');
                }
                
                $responseData = json_encode($arrUsers[0]);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage();
                $strErrorHeader = 'HTTP/1.1 404 Không Tìm Thấy';
            }
        } else {
            $strErrorDesc = 'Phương thức không được hỗ trợ';
            $strErrorHeader = 'HTTP/1.1 422 Không Thể Xử Lý';
        }

        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(
                json_encode(['error' => $strErrorDesc]),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    public function updateAction()
    {
        $this->handleCors();
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        if (strtoupper($requestMethod) == 'PUT') {
            try {
                $userModel = new UserModel();
                $requestData = $this->getRequestData();
                $user = $_REQUEST['authenticatedUser'] ?? null;
                
                if (!$user) {
                    throw new Exception('Không tìm thấy thông tin người dùng');
                }
                
                // Validate input
                $requiredFields = ['fullName', 'phone'];
                foreach ($requiredFields as $field) {
                    if (!isset($requestData[$field]) || empty(trim($requestData[$field]))) {
                        throw new Exception("Vui lòng nhập đầy đủ thông tin: $field");
                    }
                }
                
                if (!$this->validatePhone($requestData['phone'])) {
                    throw new Exception('Số điện thoại không đúng định dạng Việt Nam');
                }
                
                // Update user
                $affectedRows = $userModel->updateUser(
                    $user['id'],
                    $requestData['fullName'],
                    $requestData['phone']
                );
                
                if ($affectedRows === 0) {
                    throw new Exception('Cập nhật thất bại, không có thay đổi nào được thực hiện');
                }
                
                $updatedUser = $userModel->getUserById($user['id']);
                
                $responseData = json_encode([
                    'message' => 'Cập nhật thông tin thành công',
                    'user' => $updatedUser[0],
                    'success' => true
                ]);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage();
                $strErrorHeader = 'HTTP/1.1 400 Yêu Cầu Không Hợp Lệ';
            }
        } else {
            $strErrorDesc = 'Phương thức không được hỗ trợ';
            $strErrorHeader = 'HTTP/1.1 422 Không Thể Xử Lý';
        }

        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(
                json_encode(['success' => false, 'error' => $strErrorDesc]),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    public function adminUpdateAction()
    {
        $this->handleCors();
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        if (strtoupper($requestMethod) == 'PUT') {
            try {
                $userModel = new UserModel();
                $requestData = $this->getRequestData();
                
                // Validate input
                $requiredFields = ['userId', 'fullName', 'phone', 'role'];
                foreach ($requiredFields as $field) {
                    if (!isset($requestData[$field]) || empty(trim($requestData[$field]))) {
                        throw new Exception("Vui lòng nhập đầy đủ thông tin: $field");
                    }
                }
                
                if (!$this->validatePhone($requestData['phone'])) {
                    throw new Exception('Số điện thoại không đúng định dạng Việt Nam');
                }
                
                if (!in_array($requestData['role'], ['admin', 'customer'])) {
                    throw new Exception('Vai trò không hợp lệ');
                }
                
                // Check if user exists
                $existingUser = $userModel->getUserById($requestData['userId']);
                if (empty($existingUser)) {
                    throw new Exception('Người dùng không tồn tại');
                }
                
                // Update user
                $affectedRows = $userModel->updateAdminUser(
                    $requestData['userId'],
                    $requestData['fullName'],
                    $requestData['phone'],
                    $requestData['role']
                );
                
                if ($affectedRows === 0) {
                    throw new Exception('Cập nhật thất bại, không có thay đổi nào được thực hiện');
                }
                
                $updatedUser = $userModel->getUserById($requestData['userId']);
                
                $responseData = json_encode([
                    'message' => 'Cập nhật thông tin người dùng thành công',
                    'user' => $updatedUser[0],
                    'success' => true
                ]);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage();
                $strErrorHeader = 'HTTP/1.1 400 Yêu Cầu Không Hợp Lệ';
            }
        } else {
            $strErrorDesc = 'Phương thức không được hỗ trợ';
            $strErrorHeader = 'HTTP/1.1 422 Không Thể Xử Lý';
        }

        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(
                json_encode(['success' => false, 'error' => $strErrorDesc]),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    public function forgotPasswordAction()
    {
        $this->handleCors();
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        if (strtoupper($requestMethod) == 'POST') {
            try {
                $userModel = new UserModel();
                $requestData = $this->getRequestData();
                
                if (!isset($requestData['email']) || empty(trim($requestData['email']))) {
                    throw new Exception('Vui lòng nhập email');
                }
                
                if (!$this->validateEmail($requestData['email'])) {
                    throw new Exception('Email không đúng định dạng');
                }
                
                $user = $userModel->getUserByEmail($requestData['email']);
                if (empty($user)) {
                    throw new Exception('Email không tồn tại. Vui lòng kiểm tra lại hoặc đăng ký mới');
                }
                
                // Generate reset token
                $resetToken = bin2hex(random_bytes(32));
                $userModel->storeResetToken($requestData['email'], $resetToken);
                
                // Send reset email
                $emailService = new EmailService();
                $resetLink = "http://localhost:5173/reset-password?token=$resetToken";
                $emailSent = $emailService->sendResetPasswordEmail($requestData['email'], $resetLink);
                
                if (!$emailSent) {
                    throw new Exception('Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau');
                }
                
                $responseData = json_encode([
                    'message' => 'Liên kết đặt lại mật khẩu đã được gửi tới email của bạn',
                    'success' => true
                ]);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage();
                $strErrorHeader = 'HTTP/1.1 400 Yêu Cầu Không Hợp Lệ';
            }
        } else {
            $strErrorDesc = 'Phương thức không được hỗ trợ';
            $strErrorHeader = 'HTTP/1.1 422 Không Thể Xử Lý';
        }

        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(
                json_encode(['success' => false, 'error' => $strErrorDesc]),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    public function resetPasswordAction()
    {
        $this->handleCors();
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        if (strtoupper($requestMethod) == 'POST') {
            try {
                $userModel = new UserModel();
                $requestData = $this->getRequestData();
                
                // Validate input
                $requiredFields = ['token', 'password', 'confirmPassword'];
                foreach ($requiredFields as $field) {
                    if (!isset($requestData[$field]) || empty(trim($requestData[$field]))) {
                        throw new Exception("Vui lòng nhập đầy đủ thông tin: $field");
                    }
                }
                
                if ($requestData['password'] !== $requestData['confirmPassword']) {
                    throw new Exception('Mật khẩu xác nhận không khớp');
                }
                
                if (!$this->validatePassword($requestData['password'])) {
                    throw new Exception('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt');
                }
                
                // Verify reset token
                $user = $userModel->getUserByResetToken($requestData['token']);
                if (empty($user)) {
                    throw new Exception('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');
                }
                
                // Update password
                $userModel->updatePassword($user[0]['id'], $requestData['password']);
                $userModel->clearResetToken($user[0]['email']);
                
                $responseData = json_encode([
                    'message' => 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập với mật khẩu mới',
                    'success' => true
                ]);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage();
                $strErrorHeader = 'HTTP/1.1 400 Yêu Cầu Không Hợp Lệ';
            }
        } else {
            $strErrorDesc = 'Phương thức không được hỗ trợ';
            $strErrorHeader = 'HTTP/1.1 422 Không Thể Xử Lý';
        }

        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(
                json_encode(['success' => false, 'error' => $strErrorDesc]),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    public function deleteAction()
    {
        $this->handleCors();
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        if (strtoupper($requestMethod) == 'DELETE') {
            try {
                $userModel = new UserModel();
                $requestData = $this->getRequestData();
                
                // Validate input
                if (!isset($requestData['userId']) || empty(trim($requestData['userId']))) {
                    throw new Exception("Vui lòng cung cấp userId");
                }
                
                // Check if user exists
                $existingUser = $userModel->getUserById($requestData['userId']);
                if (empty($existingUser)) {
                    throw new Exception('Người dùng không tồn tại');
                }
                
                // Delete user
                $affectedRows = $userModel->deleteUser($requestData['userId']);
                
                if ($affectedRows === 0) {
                    throw new Exception('Xóa thất bại, không tìm thấy người dùng');
                }
                
                $responseData = json_encode([
                    'message' => 'Xóa người dùng thành công',
                    'success' => true
                ]);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage();
                $strErrorHeader = 'HTTP/1.1 400 Yêu Cầu Không Hợp Lệ';
            }
        } else {
            $strErrorDesc = 'Phương thức không được hỗ trợ';
            $strErrorHeader = 'HTTP/1.1 422 Không Thể Xử Lý';
        }

        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(
                json_encode(['success' => false, 'error' => $strErrorDesc]),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }
}
?>