<?php
define("PROJECT_ROOT_PATH", __DIR__ . "/../");

// include main configuration file 
require_once PROJECT_ROOT_PATH . "/inc/config.php";

// include the base controller file 
require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";

// include model files
require_once PROJECT_ROOT_PATH . "/Model/Database.php";
require_once PROJECT_ROOT_PATH . "/Model/UserModel.php";
require_once PROJECT_ROOT_PATH . "/Model/HotelModel.php";
require_once PROJECT_ROOT_PATH . "/Model/RoomModel.php";
require_once PROJECT_ROOT_PATH . "/Model/BookingModel.php";  
require_once PROJECT_ROOT_PATH . "/Model/PaymentModel.php";  
require_once PROJECT_ROOT_PATH . "/Model/ReviewModel.php";
?>