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
                
                $intLimit = 10;
                if (isset($arrQueryStringParams['limit']) && $arrQueryStringParams['limit']) {
                    $intLimit = $arrQueryStringParams['limit'];
                }
                
                $arrHotels = $hotelModel->getHotels($intLimit);
                $responseData = json_encode($arrHotels);
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
     * "/hotel/create" Endpoint - Create new hotel
     */
    public function createAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        if (strtoupper($requestMethod) == 'POST') {
            try {
                $hotelModel = new HotelModel();
                $requestData = $this->getRequestData();
                
                if (!isset($requestData['name']) || !isset($requestData['address'])) {
                    throw new Exception('Missing required fields: name, address');
                }
                
                $hotelId = $hotelModel->createHotel(
                    $requestData['name'],
                    $requestData['address'],
                    $requestData['description'] ?? null,
                    $requestData['rating'] ?? 0.0
                );
                
                $responseData = json_encode([
                    'id' => $hotelId,
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
                
                $responseData = json_encode($arrHotels[0]);
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
}