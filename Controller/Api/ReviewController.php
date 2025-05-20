<?php
class ReviewController extends BaseController
{
    /**
     * "/review/create" Endpoint - Create new review
     */
    public function createAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        if (strtoupper($requestMethod) == 'POST') {
            try {
                $reviewModel = new ReviewModel();
                $requestData = $this->getRequestData();
                
                // Validate input
                $requiredFields = ['userId', 'hotelId', 'bookingId', 'rating'];
                foreach ($requiredFields as $field) {
                    if (!isset($requestData[$field])) {
                        throw new Exception("Missing required field: $field");
                    }
                }
                
                // Validate rating (1-5)
                $rating = $requestData['rating'];
                if ($rating < 1 || $rating > 5) {
                    throw new Exception('Rating must be between 1 and 5');
                }
                
                // Check if user has already reviewed this booking
                $existingReview = $reviewModel->getUserReviewForBooking(
                    $requestData['userId'],
                    $requestData['bookingId']
                );
                
                if (!empty($existingReview)) {
                    throw new Exception('You have already reviewed this booking');
                }
                
                // Create review
                $reviewId = $reviewModel->createReview(
                    $requestData['userId'],
                    $requestData['hotelId'],
                    $requestData['bookingId'],
                    $rating,
                    $requestData['comment'] ?? null
                );
                
                // Update hotel average rating
                $this->updateHotelRating($requestData['hotelId']);
                
                $responseData = json_encode([
                    'id' => $reviewId,
                    'message' => 'Review submitted successfully'
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
     * "/review/list" Endpoint - Get reviews for hotel
     */
    public function listAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $reviewModel = new ReviewModel();
                
                if (!isset($arrQueryStringParams['hotelId'])) {
                    throw new Exception('Hotel ID is required');
                }
                
                $hotelId = $arrQueryStringParams['hotelId'];
                $intLimit = 10;
                if (isset($arrQueryStringParams['limit']) && $arrQueryStringParams['limit']) {
                    $intLimit = $arrQueryStringParams['limit'];
                }
                
                $arrReviews = $reviewModel->getReviewsByHotel($hotelId, $intLimit);
                $responseData = json_encode($arrReviews);
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
     * "/review/update" Endpoint - Update review
     */
    public function updateAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        if (strtoupper($requestMethod) == 'PUT') {
            try {
                $reviewModel = new ReviewModel();
                $requestData = $this->getRequestData();
                
                // Validate input
                $requiredFields = ['reviewId', 'rating'];
                foreach ($requiredFields as $field) {
                    if (!isset($requestData[$field])) {
                        throw new Exception("Missing required field: $field");
                    }
                }
                
                // Validate rating (1-5)
                $rating = $requestData['rating'];
                if ($rating < 1 || $rating > 5) {
                    throw new Exception('Rating must be between 1 and 5');
                }
                
                // Update review
                $affectedRows = $reviewModel->updateReview(
                    $requestData['reviewId'],
                    $rating,
                    $requestData['comment'] ?? null
                );
                
                if ($affectedRows === 0) {
                    throw new Exception('Review not found or no changes made');
                }
                
                // Get hotelId to update average rating
                $review = $reviewModel->getReviewById($requestData['reviewId']);
                if (!empty($review)) {
                    $this->updateHotelRating($review[0]['hotelId']);
                }
                
                $responseData = json_encode([
                    'message' => 'Review updated successfully'
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
     * Helper method to update hotel average rating
     */
    private function updateHotelRating($hotelId)
    {
        $reviewModel = new ReviewModel();
        $ratingInfo = $reviewModel->getHotelAverageRating($hotelId);
        
        if (!empty($ratingInfo)) {
            $hotelModel = new HotelModel();
            $hotelModel->updateHotelRating(
                $hotelId,
                $ratingInfo[0]['averageRating'],
                $ratingInfo[0]['reviewCount']
            );
        }
    }
}