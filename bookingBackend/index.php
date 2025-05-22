<?php
require __DIR__ . "/inc/cors.php";
require __DIR__ . "/inc/bootstrap.php";
require __DIR__ . "/inc/AuthMiddleware.php";

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

// All endpoints start with /api
if (!isset($uri[2]) || $uri[2] !== 'api') {
    header("HTTP/1.1 404 Không Tìm Thấy");
    exit();
}

// Định nghĩa routes
$routes = [
    'user' => [
        'list' => [
            'method' => 'GET',
            'middleware' => ['AuthMiddleware::authorizeAdmin']
        ],
        'profile' => [
            'method' => 'GET',
            'middleware' => ['AuthMiddleware::authenticate']
        ],
        'update' => [
            'method' => 'PUT',
            'middleware' => ['AuthMiddleware::authenticate']
        ],
        'adminUpdate' => [
            'method' => 'PUT',
            'middleware' => ['AuthMiddleware::authorizeAdmin'],
            'requiresUserId' => true
        ],
        'delete' => [
            'method' => 'DELETE',
            'middleware' => ['AuthMiddleware::authorizeAdmin'],
            'requiresUserId' => true
        ],
        'register' => ['method' => 'POST'],
        'login' => ['method' => 'POST'],
        'logout' => ['method' => 'POST'],
        'forgotpassword' => ['method' => 'POST'],
        'resetpassword' => ['method' => 'POST']
    ],
    'otp' => [
        'send' => ['method' => 'POST'],
        'verify' => ['method' => 'POST']
    ],
    'hotel' => [
        'list' => [
            'method' => 'GET'
        ],
        'create' => [
            'method' => 'POST',
            'middleware' => ['AuthMiddleware::authorizeAdmin']
        ],
        'get' => [
            'method' => 'GET'
        ],
        'delete' => [
            'method' => 'DELETE',
            'middleware' => ['AuthMiddleware::authorizeAdmin']
        ],
        'update' => [
            'method' => 'PUT',
            'middleware' => ['AuthMiddleware::authorizeAdmin']
        ]
    ]
];

// Xác định controller và action
$controllerName = isset($uri[3]) ? ucfirst($uri[3]) . 'Controller' : 'BaseController';
$actionName = isset($uri[4]) ? $uri[4] : 'list';
$strMethodName = $actionName . 'Action';

// Điều chỉnh cho RESTful URL (ví dụ: /api/hotel/123)
if ($controllerName === 'HotelController' && isset($uri[4]) && is_numeric($uri[4])) {
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $actionName = 'delete';
        $_GET['id'] = $uri[4]; // Gán id cho deleteAction
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $actionName = 'update';
        $_POST['id'] = $uri[4]; // Gán id cho updateAction
    }
    $strMethodName = $actionName . 'Action';
}

$controllerFile = PROJECT_ROOT_PATH . "/Controller/Api/" . $controllerName . ".php";

if (!file_exists($controllerFile)) {
    header("HTTP/1.1 404 Không Tìm Thấy");
    exit();
}

require $controllerFile;

if (!class_exists($controllerName)) {
    header("HTTP/1.1 404 Không Tìm Thấy");
    exit();
}

$objController = new $controllerName();

if (!method_exists($objController, $strMethodName)) {
    header("HTTP/1.1 404 Không Tìm Thấy");
    exit();
}

// Áp dụng middleware
$endpoint = strtolower($uri[3] . '/' . $actionName);
$requestMethod = $_SERVER["REQUEST_METHOD"];

if (isset($routes[$uri[3]][$actionName]) && $routes[$uri[3]][$actionName]['method'] === $requestMethod) {
    if (!empty($routes[$uri[3]][$actionName]['middleware'])) {
        $requestData = json_decode(file_get_contents('php://input'), true) ?? [];
        $queryParams = $_GET ?? [];
        $userId = $requestData['userId'] ?? $queryParams['userId'] ?? null;

        foreach ($routes[$uri[3]][$actionName]['middleware'] as $middleware) {
            if (isset($routes[$uri[3]][$actionName]['requiresUserId']) && $routes[$uri[3]][$actionName]['requiresUserId']) {
                if (!$userId) {
                    header('Content-Type: application/json');
                    header('HTTP/1.1 400 Yêu Cầu Không Hợp Lệ');
                    echo json_encode(['success' => false, 'error' => 'Vui lòng cung cấp userId']);
                    exit();
                }
                call_user_func($middleware, $userId);
            } else {
                call_user_func($middleware);
            }
        }
    }
} else {
    header("HTTP/1.1 404 Không Tìm Thấy");
    exit();
}

// Gọi action
$objController->$strMethodName();
?>