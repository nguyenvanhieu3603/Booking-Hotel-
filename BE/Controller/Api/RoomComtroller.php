<?php
include "C:\Users\Hello\Desktop\Book_hotel\BE\Controller\Api\BaseController.php";
class RoomController extends BaseController
{
    private $roomsModel;

    public function getRoomsByHotelId()
    {
        $hotelId = isset($_GET['hotelId']) ? $_GET['hotelId'] : null;
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            if (!isset($hotelId) || empty($hotelId)) {
                $this->sendOutput('', array('HTTP/1.1 400 Bad Request'));
                return;
            }
            $this->roomsModel = new RoomModel();
            $rooms = $this->roomsModel->getRoomsByHotelId($hotelId);
            $this->sendOutput(json_encode($rooms), array('Content-Type: application/json'));
        }
    }

    public function getAvailableRooms()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->sendOutput('', array('HTTP/1.1 405 Method Not Allowed'));
            return;
        }
        $this->roomsModel = new RoomModel();
        $hotelId = isset($_GET['hotelId']) ? $_GET['hotelId'] : null;
        $checkInDate = isset($_GET['checkInDate']) ? $_GET['checkInDate'] : null;
        $checkOutDate = isset($_GET['checkOutDate']) ? $_GET['checkOutDate'] : null;
        $people = isset($_GET['people']) ? $_GET['people'] : null;

        if (!$hotelId || !$checkInDate || !$checkOutDate || !$people) {
            $this->sendOutput('', array('HTTP/1.1 400 Bad Request'));
            return;
        }

        $availableRooms = $this->roomsModel->getAvailableRooms($hotelId, $checkInDate, $checkOutDate, $people);

        if ($availableRooms) {
            $this->sendOutput(json_encode($availableRooms), array('Content-Type: application/json'));
        } else {
            $this->sendOutput('', array('HTTP/1.1 404 Not Found'));
        }
    }
}
