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
                $strErrorDesc = $e->getMessage().' Something went wrong! Please contact support.';
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
     * "/room/availability" Endpoint - Check room availability
     */
    public function availabilityAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $roomModel = new RoomModel();
                
                if (!isset($arrQueryStringParams['roomId']) || 
                    !isset($arrQueryStringParams['checkInDate']) || 
                    !isset($arrQueryStringParams['checkOutDate'])) {
                    throw new Exception('Parameters roomId, checkInDate and checkOutDate are required');
                }
                
                $roomId = $arrQueryStringParams['roomId'];
                $checkInDate = $arrQueryStringParams['checkInDate'];
                $checkOutDate = $arrQueryStringParams['checkOutDate'];
                
                $availability = $roomModel->checkAvailability($roomId, $checkInDate, $checkOutDate);
                $responseData = json_encode($availability[0]);
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
                $requestData = $this->getRequestData();
                
                if (!isset($requestData['hotelId']) || 
                    !isset($requestData['name']) || 
                    !isset($requestData['roomType']) || 
                    !isset($requestData['price']) || 
                    !isset($requestData['quantity'])) {
                    throw new Exception('Missing required fields: hotelId, name, roomType, price, quantity');
                }
                
                $roomId = $roomModel->createRoom(
                    $requestData['hotelId'],
                    $requestData['name'],
                    $requestData['roomType'],
                    $requestData['price'],
                    $requestData['quantity'],
                    $requestData['amenities'] ?? null
                );
                
                $responseData = json_encode([
                    'id' => $roomId,
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