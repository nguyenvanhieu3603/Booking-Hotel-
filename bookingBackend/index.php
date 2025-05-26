<?php
require __DIR__ . "/inc/cors.php";
require __DIR__ . "/inc/bootstrap.php";
require __DIR__ . "/inc/AuthMiddleware.php";
require __DIR__ . "/inc/CheckIdMiddleware.php";

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
            'method' => 'GET',
            'middleware' => ['CheckIdMiddleware::checkHotelId']
        ],
        'delete' => [
            'method' => 'DELETE',
            'middleware' => ['AuthMiddleware::authorizeAdmin', 'CheckIdMiddleware::checkHotelId']
        ],
        'update' => [
            'method' => 'PUT',
            'middleware' => ['AuthMiddleware::authorizeAdmin', 'CheckIdMiddleware::checkHotelId']
        ]
    ],
    'room' => [
        'list' => [
            'method' => 'GET',
            'middleware' => ['CheckIdMiddleware::checkHotelId']
        ],
        'availability' => [
            'method' => 'GET',
            'middleware' => ['CheckIdMiddleware::checkRoomId']
        ],
        'create' => [
            'method' => 'POST',
            'middleware' => ['AuthMiddleware::authorizeAdmin', 'CheckIdMiddleware::checkHotelId']
        ]
    ],
    'booking' => [
        'create' => [
            'method' => 'POST',
            'middleware' => ['AuthMiddleware::authenticate', 'CheckIdMiddleware::checkHotelId', 'CheckIdMiddleware::checkRoomId']
        ],
        'list' => [
            'method' => 'GET',
            'middleware' => ['AuthMiddleware::authenticate']
        ],
        'all' => [
            'method' => 'GET',
            'middleware' => ['AuthMiddleware::authorizeAdmin']
        ],
        'stats' => [
            'method' => 'GET',
            'middleware' => ['AuthMiddleware::authorizeAdmin']
        ],
        'cancel' => [
            'method' => 'PUT',
            'middleware' => ['AuthMiddleware::authenticate', 'CheckIdMiddleware::checkBookingId', 'CheckIdMiddleware::checkBookingOwnership']
        ],
        'complete' => [
            'method' => 'PUT',
            'middleware' => ['AuthMiddleware::authorizeAdmin', 'CheckIdMiddleware::checkBookingId']
        ]
    ],
    'payment' => [
        'create' => [
            'method' => 'POST',
            'middleware' => ['AuthMiddleware::authenticate', 'CheckIdMiddleware::checkBookingId', 'CheckIdMiddleware::checkBookingOwnership']
        ],
        'list' => [
            'method' => 'GET',
            'middleware' => ['AuthMiddleware::authenticate', 'CheckIdMiddleware::checkBookingId', 'CheckIdMiddleware::checkBookingOwnership']
        ],
        'success' => [
            'method' => 'GET',
            'middleware' => ['AuthMiddleware::authenticate']
        ],
        'cancel' => [
            'method' => 'GET',
            'middleware' => ['AuthMiddleware::authenticate']
        ],
        'all' => [
            'method' => 'GET',
            'middleware' => ['AuthMiddleware::authorizeAdmin']
        ],
        'stats' => [
            'method' => 'GET',
            'middleware' => ['AuthMiddleware::authorizeAdmin']
        ],
        'update' => [
            'method' => 'PUT',
            'middleware' => ['AuthMiddleware::authorizeAdmin', 'CheckIdMiddleware::checkPaymentId']
        ]
    ]
];

// Xác định controller và action
$controllerName = isset($uri[3]) ? ucfirst($uri[3]) . 'Controller' : 'BaseController';
$actionName = isset($uri[4]) ? $uri[4] : 'list';
$strMethodName = $actionName . 'Action';

// Điều chỉnh cho RESTful URL
if ($controllerName === 'HotelController' && isset($uri[4]) && is_numeric($uri[4])) {
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $actionName = 'delete';
        $_GET['id'] = $uri[4];
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $actionName = 'update';
        $_POST['id'] = $uri[4];
    }
    $strMethodName = $actionName . 'Action';
} elseif ($controllerName === 'BookingController' && isset($uri[4]) && is_numeric($uri[4]) && isset($uri[5]) && $uri[5] === 'cancel') {
    $actionName = 'cancel';
    $requestData = json_decode(file_get_contents('php://input'), true) ?? [];
    $requestData['bookingId'] = $uri[4];
    $_REQUEST['requestData'] = $requestData; // Gán lại để controller truy cập
    $strMethodName = 'cancelAction';
} elseif ($controllerName === 'PaymentController' && isset($uri[4]) && is_numeric($uri[4])) {
    $actionName = 'update';
    $requestData = json_decode(file_get_contents('php://input'), true) ?? [];
    $requestData['paymentId'] = $uri[4];
    $_REQUEST['requestData'] = $requestData;
    $strMethodName = 'updateAction';
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

// Ghi đè getRequestData để dùng $_REQUEST['requestData']
if ($controllerName === 'BookingController' || $controllerName === 'PaymentController') {
    $objController->getRequestData = function() {
        return $_REQUEST['requestData'] ?? json_decode(file_get_contents('php://input'), true) ?? [];
    };
}

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
        $hotelId = $requestData['hotelId'] ?? $queryParams['hotelId'] ?? null;
        $roomId = $requestData['roomId'] ?? $queryParams['roomId'] ?? null;
        $bookingId = $requestData['bookingId'] ?? $queryParams['bookingId'] ?? null;
        $paymentId = $requestData['paymentId'] ?? null;

        foreach ($routes[$uri[3]][$actionName]['middleware'] as $middleware) {
            if ($middleware === 'CheckIdMiddleware::checkHotelId' && $hotelId) {
                call_user_func($middleware, $hotelId);
            } elseif ($middleware === 'CheckIdMiddleware::checkRoomId' && $roomId) {
                call_user_func($middleware, $roomId);
            } elseif ($middleware === 'CheckIdMiddleware::checkBookingId' && $bookingId) {
                call_user_func($middleware, $bookingId);
            } elseif ($middleware === 'CheckIdMiddleware::checkPaymentId' && $paymentId) {
                call_user_func($middleware, $paymentId);
            } elseif ($middleware === 'CheckIdMiddleware::checkBookingOwnership' && $bookingId) {
                call_user_func($middleware, $bookingId);
            } elseif (isset($routes[$uri[3]][$actionName]['requiresUserId']) && $routes[$uri[3]][$actionName]['requiresUserId']) {
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