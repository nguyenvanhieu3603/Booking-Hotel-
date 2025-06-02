<?php
class HotelController extends BaseController
{
    /**
     * "/hotel/list" Endpoint - Get list of hotels
     */
    public function listAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $hotelModel = new HotelModel();

                $arrHotels = $hotelModel->getHotels();

                // Add hotel images to each hotel
                foreach ($arrHotels as &$hotel) {
                    $images = $hotelModel->getImagesByHotelId($hotel['id']);

                    // If no images found, add default
                    if (empty($images)) {
                        $hotel['images'] = ['uploads/hotel/default_hotel.png'];
                    } else {
                        // Convert flat image_url results to array
                        $hotel['images'] = array_column($images, 'image_url');
                    }
                }

                $responseData = json_encode($arrHotels);
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
     * "/hotel/province" Endpoint - List hotels by province
     */
    public function provinceAction(){
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                if (!isset($arrQueryStringParams['province'])) {
                    throw new Exception('Province parameter is required');
                }

                $hotelModel = new HotelModel();
                $province = $arrQueryStringParams['province'];

                $arrHotels = $hotelModel->getHotelsByAddress($province);

                // Add hotel images to each hotel
                foreach ($arrHotels as &$hotel) {
                    $images = $hotelModel->getImagesByHotelId($hotel['id']);

                    // If no images found, add default
                    if (empty($images)) {
                        $hotel['images'] = ['uploads/hotel/default_hotel.png'];
                    } else {
                        // Convert flat image_url results to array
                        $hotel['images'] = array_column($images, 'image_url');
                    }
                }

                $responseData = json_encode($arrHotels);
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
     * "/hotel/all" Endpoint - Get list of hotels and room
     */
    public function allAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $hotelModel = new HotelModel();
                $roomModel = new RoomModel();
                $arrHotels = $hotelModel->getAllHotels();

                foreach ($arrHotels as &$hotel) {
                    $hotelId = $hotel['id'];


                    $images = $hotelModel->getImagesByHotelId($hotelId);
                    $hotel['images'] = !empty($images)
                        ? array_column($images, 'image_url')
                        : ['uploads/hotel/default_hotel.png'];


                    $rooms = $roomModel->getRoomsByHotelId($hotelId);
                    foreach ($rooms as &$room) {
                        $roomImages = $roomModel->getImagesByRoomId($room['id']);
                        $room['images'] = !empty($roomImages)
                            ? array_column($roomImages, 'image_url')
                            : ['uploads/room/default_room.png'];
                    }

                    $hotel['rooms'] = $rooms;
                }

                $responseData = json_encode($arrHotels);
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
                ['Content-Type: application/json', 'HTTP/1.1 200 OK']
            );
        } else {
            $this->sendOutput(
                json_encode(['error' => $strErrorDesc]),
                ['Content-Type: application/json', $strErrorHeader]
            );
        }
    }

    /**
     * "/hotel/create" Endpoint - Create new hotel
     */
    public function createAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];

        if (strtoupper($requestMethod) == 'POST') {
            try {
                $hotelModel = new HotelModel();
                $requestData = $_POST;

                if (!isset($requestData['name']) || !isset($requestData['address'])) {
                    throw new Exception('Missing required fields: name, address');
                }

                $hotelId = $hotelModel->createHotel(
                    $requestData['name'],
                    $requestData['address'],
                    $requestData['description'] ?? null,
                    $requestData['rating'] ?? 0.0
                );

                $imagePaths = [];
                if (!empty($_FILES['images'])) {
                    $uploadDir = 'uploads/hotel/';
                    if (!file_exists($uploadDir)) {
                        mkdir($uploadDir, 0777, true);
                    }

                    foreach ($_FILES['images']['tmp_name'] as $index => $tmpName) {
                        $originalName = basename($_FILES['images']['name'][$index]);
                        $targetPath = $uploadDir . time() . '_' . $originalName;

                        if (move_uploaded_file($tmpName, $targetPath)) {
                            $hotelModel->addHotelImage($hotelId, $targetPath);
                            $imagePaths[] = $targetPath;
                        }
                    }
                }

                $responseData = json_encode([
                    'id' => $hotelId,
                    'images' => $imagePaths,
                    'message' => 'Hotel created successfully'
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
     * "/hotel/get" Endpoint - Get hotel details
     */
    public function getAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];

        if (strtoupper($requestMethod) == 'GET') {
            try {
                if (!isset($_GET['id'])) {
                    throw new Exception('Hotel ID is required');
                }

                $hotelId = $_GET['id'];
                $hotelModel = new HotelModel();
                $arrHotels = $hotelModel->getHotelById($hotelId);

                if (empty($arrHotels)) {
                    throw new Exception('Hotel not found');
                }

                $hotelData = $arrHotels[0];

                $hotelImages = $hotelModel->getImagesByHotelId($hotelId);
                if (empty($hotelImages)) {
                    $hotelData['images'] = ['uploads/default-hotel.jpg']; // 🖼️ Default image path
                } else {
                    $hotelData['images'] = array_column($hotelImages, 'image_url');
                }

                $responseData = json_encode($hotelData);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage();
                $strErrorHeader = 'HTTP/1.1 404 Not Found';
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
     * "/hotel/delete" Endpoint - Set hotel status to 1 (deleted)
     */
    public function deleteAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];

        if (strtoupper($requestMethod) == 'GET') {
            try {
                if (!isset($_GET['id'])) {
                    throw new Exception('Hotel ID is required');
                }

                $hotelId = $_GET['id'];
                $hotelModel = new HotelModel();

                $hotel = $hotelModel->getHotelById($hotelId);
                if (!$hotel) {
                    throw new Exception("Hotel with ID $hotelId not found");
                }
                if ($hotel[0]['active'] == 1) {
                    throw new Exception("Hotel with ID $hotelId is already deleted");
                }

                $hotelModel->deleteHotel($hotelId);

                $responseData = json_encode([
                    'message' => 'Hotel removed from active list successfully'
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
     * "/hotel/update" Endpoint 
     */
    public function updateAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];

        if (strtoupper($requestMethod) == 'POST') {
            try {
                if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
                    throw new Exception('Invalid or missing hotel ID in URL');
                }
                $hotelId = $_GET['id'];
                if (!is_numeric($hotelId)) {
                    throw new Exception('Invalid or missing hotel ID in URL');
                }

                if (!isset($_POST['name']) || !isset($_POST['address'])) {
                    throw new Exception('Missing required fields: name, address');
                }

                $hotelModel = new HotelModel();

                $hotelModel->updateHotel(
                    $hotelId,
                    $_POST['name'],
                    $_POST['address'],
                    $_POST['description'] ?? null,
                    $_POST['rating'] ?? 0.0
                );

                $imagePaths = [];
                $deletedImages = [];

                if (!empty($_POST['delete_images']) && is_array($_POST['delete_images'])) {
                    foreach ($_POST['delete_images'] as $imgPath) {
                        $realPath = realpath($imgPath);
                        if ($realPath && strpos($realPath, realpath('uploads/hotel/')) === 0) {
                            $hotelModel->deleteHotelImage($hotelId, $imgPath); // delete from DB
                            if (file_exists($imgPath)) {
                                unlink($imgPath); // delete from filesystem
                            }
                            $deletedImages[] = $imgPath; // collect for response
                        }
                    }
                }

                if (!empty($_FILES['images']) && is_array($_FILES['images']['tmp_name'])) {
                    $uploadDir = 'uploads/hotel/';
                    if (!file_exists($uploadDir)) {
                        mkdir($uploadDir, 0777, true);
                    }

                    foreach ($_FILES['images']['tmp_name'] as $index => $tmpName) {
                        $originalName = basename($_FILES['images']['name'][$index]);
                        $uniqueName = uniqid() . '_' . $originalName;
                        $targetPath = $uploadDir . $uniqueName;

                        if (move_uploaded_file($tmpName, $targetPath)) {
                            $hotelModel->addHotelImage($hotelId, $targetPath);
                            $imagePaths[] = $targetPath;
                        }
                    }
                }

                $responseData = json_encode([
                    'message' => 'Hotel updated successfully',
                    'images_added' => $imagePaths,
                    'images_deleted' => $deletedImages
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
                ['Content-Type: application/json', 'HTTP/1.1 200 OK']
            );
        } else {
            $this->sendOutput(
                json_encode(['error' => $strErrorDesc]),
                ['Content-Type: application/json', $strErrorHeader]
            );
        }
    }
}
