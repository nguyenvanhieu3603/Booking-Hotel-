<?php
class RoomController extends BaseController
{
    /**
     * "/room/list" Endpoint - Get list of rooms by hotel
     */
    public function listAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $roomModel = new RoomModel();

                if (!isset($arrQueryStringParams['hotelId'])) {
                    throw new Exception('Hotel ID is required');
                }

                $hotelId = $arrQueryStringParams['hotelId'];
                $intLimit = 10;
                if (isset($arrQueryStringParams['limit']) && $arrQueryStringParams['limit']) {
                    $intLimit = $arrQueryStringParams['limit'];
                }

                $arrRooms = $roomModel->getRoomsByHotel($hotelId, $intLimit);
                $responseData = json_encode($arrRooms);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage() . ' Something went wrong! Please contact support.';
                $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
            }
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }

        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(
                json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    /**
     * "/room/available" Endpoint - Check room availability
     */
    public function availableAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $bookingModel = new BookingModel();
                if (
                    !isset($arrQueryStringParams['hotelId']) ||
                    !isset($arrQueryStringParams['people']) ||
                    !isset($arrQueryStringParams['checkInDate']) ||
                    !isset($arrQueryStringParams['checkOutDate'])
                ) {
                    throw new Exception('Parameters hotelId, checkInDate and checkOutDate are required');
                }

                $hotelId = (int) $arrQueryStringParams['hotelId'];
                $people = isset($arrQueryStringParams['people']) ? (int) $arrQueryStringParams['people'] : 1;
                $checkInDate = $arrQueryStringParams['checkInDate'];
                $checkOutDate = $arrQueryStringParams['checkOutDate'];

                $checkIn = DateTime::createFromFormat('Y-m-d', $checkInDate);
                $checkOut = DateTime::createFromFormat('Y-m-d', $checkOutDate);

                if (!$checkIn || !$checkOut) {
                    throw new Exception('Invalid date format. Use YYYY-MM-DD');
                }
                if ($checkIn >= $checkOut) {
                    throw new Exception('Check-in date must be before check-out date');
                }
                if ($people < 1 || $people > 4) {
                    throw new Exception('People must be an integer between 1 and 4');
                }
                if (!is_numeric($hotelId) || $hotelId <= 0) {
                    throw new Exception('Invalid hotel ID');
                }

                $availability = $bookingModel->checkAvailability($hotelId, $people, $checkInDate, $checkOutDate);
                $responseData = json_encode($availability);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage();
                $strErrorHeader = 'HTTP/1.1 400 Bad Request';
            }
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }

        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(
                json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    /**
     * "/room/create" Endpoint - Create new room
     */
    public function createAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];

        if (strtoupper($requestMethod) == 'POST') {
            try {
                $roomModel = new RoomModel();
                $requestData = $_POST;
                $validRoomTypes = ['Single', 'Double'];

                if (
                    empty($requestData['hotelId']) ||
                    empty($requestData['name']) ||
                    empty($requestData['roomType']) ||
                    empty($requestData['price']) 
                ) {
                    throw new Exception('Missing required fields: hotelId, name, roomType, price');
                }

                if (!in_array($requestData['roomType'], $validRoomTypes)) {
                    throw new Exception('Invalid room type. Must be "Single" or "Double".');
                }

                if (!is_numeric($requestData['price']) ) {
                    throw new Exception('Price must be numeric values');
                }

                if ($requestData['price'] <= 0) {
                    throw new Exception('Price must be greater than zero');
                }

                if ($roomModel->isRoomNameExists($requestData['hotelId'], $requestData['name'])) {
                    throw new Exception('A room with this name already exists for this hotel.');
                }
                $roomId = $roomModel->createRoom(
                    $requestData['hotelId'],
                    $requestData['name'],
                    $requestData['roomType'],
                    $requestData['price'],
                    $requestData['amenities'] ?? null
                );
                $imagePaths = [];
                if (!empty($_FILES['images'])) {
                    $uploadDir = 'uploads/rooms/';
                    if (!file_exists($uploadDir)) {
                        mkdir($uploadDir, 0777, true);
                    }

                    foreach ($_FILES['images']['tmp_name'] as $index => $tmpName) {
                        $originalName = basename($_FILES['images']['name'][$index]);
                        $targetPath = $uploadDir . time() . '_' . $originalName;

                        if (move_uploaded_file($tmpName, $targetPath)) {
                            $roomModel->addRoomImage($roomId, $targetPath);
                            $imagePaths[] = $targetPath;
                        }
                    }
                }

                $responseData = json_encode([
                    'id' => $roomId,
                    'images' => $imagePaths,
                    'message' => 'Room created successfully'
                ]);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage();
                $strErrorHeader = 'HTTP/1.1 400 Bad Request';
            }
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }

        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 201 Created')
            );
        } else {
            $this->sendOutput(
                json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

        /**
     * "/room/update" Endpoint - Update existing room
     */
     public function updateAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];

        if (strtoupper($requestMethod) == 'POST') {
            try {
                $roomModel = new RoomModel();
                $requestData = $_POST;
                $validRoomTypes = ['Single', 'Double'];

                if (
                    empty($requestData['hotelId']) ||
                    empty($requestData['name']) ||
                    empty($requestData['roomType']) ||
                    empty($requestData['price']) 
                ) {
                    throw new Exception('Missing required fields: hotelId, name, roomType, price');
                }

                if (!in_array($requestData['roomType'], $validRoomTypes)) {
                    throw new Exception('Invalid room type. Must be "Single" or "Double".');
                }

                if (!is_numeric($requestData['price']) ) {
                    throw new Exception('Price must be numeric values');
                }

                if ($requestData['price'] <= 0) {
                    throw new Exception('Price must be greater than zero');
                }

                if ($roomModel->isRoomNameExists($requestData['hotelId'], $requestData['name'])) {
                    throw new Exception('A room with this name already exists for this hotel.');
                }
                $roomId = $roomModel->updateRoom(
                    $requestData['hotelId'],
                    $requestData['name'],
                    $requestData['roomType'],
                    $requestData['price'],
                    $requestData['amenities'] ?? null
                );
                $imagePaths = [];
                if (!empty($_FILES['images'])) {
                    $uploadDir = 'uploads/rooms/';
                    if (!file_exists($uploadDir)) {
                        mkdir($uploadDir, 0777, true);
                    }

                    foreach ($_FILES['images']['tmp_name'] as $index => $tmpName) {
                        $originalName = basename($_FILES['images']['name'][$index]);
                        $targetPath = $uploadDir . time() . '_' . $originalName;

                        if (move_uploaded_file($tmpName, $targetPath)) {
                            $roomModel->addRoomImage($roomId, $targetPath);
                            $imagePaths[] = $targetPath;
                        }
                    }
                }

                $responseData = json_encode([
                    'id' => $roomId,
                    'images' => $imagePaths,
                    'message' => 'Room created successfully'
                ]);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage();
                $strErrorHeader = 'HTTP/1.1 400 Bad Request';
            }
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }

        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 201 Created')
            );
        } else {
            $this->sendOutput(
                json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }
}