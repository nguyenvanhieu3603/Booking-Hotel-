<?php
require_once PROJECT_ROOT_PATH . "/inc/config.php";
require_once PROJECT_ROOT_PATH . "/inc/vendor/autoload.php";

class BaseController
{
    public function __callperiment($name, $arguments)
    {
        $this->sendOutput('', array('HTTP/1.1 404 Không Tìm Thấy'));
    }

    protected function getUriSegments()
    {
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $uri = explode('/', $uri);
        return $uri;
    }

    protected function getQueryStringParams()
    {
        parse_str($_SERVER['QUERY_STRING'], $query);
        return $query;
    }

    protected function getRequestData()
    {
        return json_decode(file_get_contents('php://input'), true) ?? [];
    }

    protected function sendOutput($data, $httpHeaders = array(), $preserveSetCookie = false)
    {
        if (!$preserveSetCookie) {
            header_remove('Set-Cookie');
        }
        
        if (is_array($httpHeaders) && count($httpHeaders)) {
            foreach ($httpHeaders as $httpHeader) {
                header($httpHeader);
            }
        }
        
        echo $data;
        exit;
    }

    protected function validateEmail($email)
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    protected function validatePassword($password)
    {
        // Ít nhất 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt
        return preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/', $password);
    }

    protected function validatePhone($phone)
    {
        // Định dạng số điện thoại Việt Nam: bắt đầu bằng 03, 05, 07, 08, 09, theo sau là 8 số
        return preg_match('/^(03|05|07|08|09)[0-9]{8}$/', $phone);
    }

    protected function handleCors()
    {
        header("Access-Control-Allow-Origin: http://localhost:5173");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Access-Control-Allow-Credentials: true");
        
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            header("HTTP/1.1 200 OK");
            exit();
        }
    }

    protected function authenticate()
    {
        $this->handleCors();
        $jwt = $_COOKIE['jwt'] ?? null;

        if (!$jwt) {
            $this->sendOutput(
                json_encode(['error' => 'Không có token xác thực']),
                ['Content-Type: application/json', 'HTTP/1.1 401 Không Được Phép']
            );
        }

        try {
            require_once PROJECT_ROOT_PATH . "/inc/vendor/autoload.php";
            $decoded = \Firebase\JWT\JWT::decode($jwt, new \Firebase\JWT\Key(JWT_SECRET, 'HS256'));
            $userModel = new UserModel();
            $user = $userModel->getUserById($decoded->userId);

            if (empty($user)) {
                throw new Exception('Người dùng không tồn tại');
            }

            return $user[0];
        } catch (Exception $e) {
            $this->sendOutput(
                json_encode(['error' => 'Token không hợp lệ: ' . $e->getMessage()]),
                ['Content-Type: application/json', 'HTTP/1.1 401 Không Được Phép']
            );
        }
    }

    protected function authorizeAdmin()
    {
        $user = $this->authenticate();
        if ($user['role'] !== 'admin') {
            $this->sendOutput(
                json_encode(['error' => 'Không có quyền admin']),
                ['Content-Type: application/json', 'HTTP/1.1 403 Cấm']
            );
        }
        return $user;
    }
}
?>