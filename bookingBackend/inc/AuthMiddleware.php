<?php
require_once PROJECT_ROOT_PATH . "/inc/config.php";
require_once PROJECT_ROOT_PATH . "/inc/vendor/autoload.php";
require_once PROJECT_ROOT_PATH . "/Model/UserModel.php";

class AuthMiddleware
{
    public static function authenticate($requiredUserId = null)
    {
        // Xử lý CORS
        header("Access-Control-Allow-Origin: http://localhost:5173");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Access-Control-Allow-Credentials: true");
        
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            header("HTTP/1.1 200 OK");
            exit();
        }

        $jwt = $_COOKIE['jwt'] ?? null;

        if (!$jwt) {
            header('Content-Type: application/json');
            header('HTTP/1.1 401 Không Được Phép');
            echo json_encode(['success' => false, 'error' => 'Vui lòng đăng nhập để thực hiện chức năng này']);
            exit();
        }

        try {
            $decoded = \Firebase\JWT\JWT::decode($jwt, new \Firebase\JWT\Key(JWT_SECRET, 'HS256'));
            $userModel = new UserModel();
            $user = $userModel->getUserById($decoded->userId);

            if (empty($user)) {
                throw new Exception('Người dùng không tồn tại');
            }

            $user = $user[0];

            // Kiểm tra userId nếu được cung cấp
            if ($requiredUserId && $user['id'] != $requiredUserId) {
                header('Content-Type: application/json');
                header('HTTP/1.1 403 Cấm');
                echo json_encode(['success' => false, 'error' => 'Không có quyền truy cập user này']);
                exit();
            }

            // Lưu user để controller truy cập nếu cần (không bắt buộc)
            $_REQUEST['authenticatedUser'] = $user;
            return $user;
        } catch (Exception $e) {
            header('Content-Type: application/json');
            header('HTTP/1.1 401 Không Được Phép');
            echo json_encode(['success' => false, 'error' => 'Token không hợp lệ: ' . $e->getMessage()]);
            exit();
        }
    }

    public static function authorizeAdmin()
    {
        $user = self::authenticate();
        if ($user['role'] !== 'admin') {
            header('Content-Type: application/json');
            header('HTTP/1.1 403 Cấm');
            echo json_encode(['success' => false, 'error' => 'Không có quyền admin']);
            exit();
        }
        return $user;
    }
}
?>