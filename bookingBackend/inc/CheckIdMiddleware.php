<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";
require_once PROJECT_ROOT_PATH . "/Model/HotelModel.php";
require_once PROJECT_ROOT_PATH . "/Model/RoomModel.php";
require_once PROJECT_ROOT_PATH . "/Model/BookingModel.php";
require_once PROJECT_ROOT_PATH . "/Model/PaymentModel.php";

class CheckIdMiddleware
{
    public static function checkHotelId($hotelId)
    {
        $hotelModel = new HotelModel();
        $hotel = $hotelModel->getHotelById($hotelId);
        if (empty($hotel)) {
            header('Content-Type: application/json');
            header('HTTP/1.1 404 Không Tìm Thấy');
            echo json_encode(['success' => false, 'error' => 'Khách sạn không tồn tại']);
            exit();
        }
    }

    public static function checkRoomId($roomId)
    {
        $roomModel = new RoomModel();
        $room = $roomModel->getRoomById($roomId);
        if (empty($room)) {
            header('Content-Type: application/json');
            header('HTTP/1.1 404 Không Tìm Thấy');
            echo json_encode(['success' => false, 'error' => 'Phòng không tồn tại']);
            exit();
        }
    }

    public static function checkBookingId($bookingId)
    {
        $bookingModel = new BookingModel();
        $booking = $bookingModel->getBookingById($bookingId);
        if (empty($booking)) {
            header('Content-Type: application/json');
            header('HTTP/1.1 404 Không Tìm Thấy');
            echo json_encode(['success' => false, 'error' => 'Đặt phòng không tồn tại']);
            exit();
        }
    }

    public static function checkPaymentId($paymentId)
    {
        $paymentModel = new PaymentModel();
        $payment = $paymentModel->getPaymentById($paymentId);
        if (empty($payment)) {
            header('Content-Type: application/json');
            header('HTTP/1.1 404 Không Tìm Thấy');
            echo json_encode(['success' => false, 'error' => 'Thanh toán không tồn tại']);
            exit();
        }
    }

    public static function checkBookingOwnership($bookingId)
    {
        $bookingModel = new BookingModel();
        $user = $_REQUEST['authenticatedUser'] ?? null;
        if (!$user) {
            header('Content-Type: application/json');
            header('HTTP/1.1 401 Không Được Phép');
            echo json_encode(['success' => false, 'error' => 'Không tìm thấy thông tin người dùng']);
            exit();
        }
        $booking = $bookingModel->getBookingById($bookingId);
        if (empty($booking) || $booking[0]['userId'] != $user['id']) {
            header('Content-Type: application/json');
            header('HTTP/1.1 403 Cấm');
            echo json_encode(['success' => false, 'error' => 'Bạn không có quyền truy cập đặt phòng này']);
            exit();
        }
    }
}
?>