<?php
require __DIR__ . "/inc/bootstrap.php";

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

// All of our endpoints start with /api
if (!isset($uri[2]) || $uri[2] !== 'api') {
    header("HTTP/1.1 404 Not Found");
    exit();
}

// Determine controller based on URI
$controllerName = ucfirst($uri[3]) . 'Controller';
$controllerFile = PROJECT_ROOT_PATH . "/Controller/Api/" . $controllerName . ".php";

if (!file_exists($controllerFile)) {
    header("HTTP/1.1 404 Not Found");
    exit();
}

require $controllerFile;

$objController = new $controllerName();
$strMethodName = $uri[4] . 'Action';
$objController->{$strMethodName}();
?>