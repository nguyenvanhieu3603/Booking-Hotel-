<?php
require __DIR__ . "/inc/cors.php"; // Thêm dòng này
require __DIR__ . "/inc/bootstrap.php";

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

// All of our endpoints start with /api
if (!isset($uri[2]) || $uri[2] !== 'api') {
    header("HTTP/1.1 404 Not Found");
    exit();
}

// Handle OTP endpoints separately
if (isset($uri[3]) && $uri[3] === 'otp') {
    require PROJECT_ROOT_PATH . "/Controller/Api/OTPController.php";
    
    if (!isset($uri[4])) {
        header("HTTP/1.1 404 Not Found");
        exit();
    }
    
    $objController = new OTPController();
    $strMethodName = $uri[4] . 'Action';
    
    if (!method_exists($objController, $strMethodName)) {
        header("HTTP/1.1 404 Not Found");
        exit();
    }
    
    $objController->{$strMethodName}();
    exit();
}

// Determine controller based on URI
$controllerName = isset($uri[3]) ? ucfirst($uri[3]) . 'Controller' : 'BaseController';
$controllerFile = PROJECT_ROOT_PATH . "/Controller/Api/" . $controllerName . ".php";

if (!file_exists($controllerFile)) {
    header("HTTP/1.1 404 Not Found");
    exit();
}

require $controllerFile;

$objController = new $controllerName();
$strMethodName = (isset($uri[4])) ? $uri[4] . 'Action' : 'listAction';

if (!method_exists($objController, $strMethodName)) {
    header("HTTP/1.1 404 Not Found");
    exit();
}

$objController->{$strMethodName}();
?>
