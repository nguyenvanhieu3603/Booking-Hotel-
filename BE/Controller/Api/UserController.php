<?php
use App\Models\ReviewModel; // Add this line to import the ReviewModel class

class UserController extends BaseController
{
    /**
     * "/user/list" Endpoint - Get list of users
     */
    public function listAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {
            try {
                $userModel = new UserModel();
                
                $intLimit = 10;
                if (isset($arrQueryStringParams['limit']) && $arrQueryStringParams['limit']) {
                    $intLimit = $arrQueryStringParams['limit'];
                }
                
                $arrUsers = $userModel->getUsers($intLimit);
                $responseData = json_encode($arrUsers);
            } catch (Exception $e) {  // Thay Error bằng Exception
                $strErrorDesc = $e->getMessage() . ' Something went wrong! Please contact support.';
                $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
            }
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }

        // send output 
        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(json_encode(array('error' => $strErrorDesc)), 
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    /**
     * "/user/register" Endpoint - Register new user
     */
    public function registerAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        if (strtoupper($requestMethod) == 'POST') {
            try {
                $userModel = new UserModel();
                $requestData = $this->getRequestData();
                
                // Validate input
                if (!isset($requestData['fullName']) || !isset($requestData['email']) || !isset($requestData['password'])) {
                    throw new Exception('Missing required fields: fullName, email, password');
                }
                
                if (!$this->validateEmail($requestData['email'])) {
                    throw new Exception('Invalid email format');
                }
                
                if (!$this->validatePassword($requestData['password'])) {
                    throw new Exception('Password must be at least 8 characters long and contain at least one letter and one number');
                }
                
                // Check if email already exists
                $existingUser = $userModel->getUserByEmail($requestData['email']);
                if (!empty($existingUser)) {
                    throw new Exception('Email already registered');
                }
                
                // Create user
                $phone = isset($requestData['phone']) ? $requestData['phone'] : null;
                $userId = $userModel->createUser(
                    $requestData['fullName'],
                    $requestData['email'],
                    $requestData['password'],
                    $phone
                );
                
                $responseData = json_encode([
                    'id' => $userId,
                    'message' => 'User registered successfully'
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
     * "/user/login" Endpoint - User login
     */
    public function loginAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        if (strtoupper($requestMethod) == 'POST') {
            try {
                $userModel = new UserModel();
                $requestData = $this->getRequestData();
                
                // Validate input
                if (!isset($requestData['email']) || !isset($requestData['password'])) {
                    throw new Exception('Missing required fields: email, password');
                }
                
                // Get user by email
                $user = $userModel->getUserByEmail($requestData['email']);
                if (empty($user)) {
                    throw new Exception('Invalid email or password');
                }
                
                // Verify password
                if (!password_verify($requestData['password'], $user[0]['password'])) {
                    throw new Exception('Invalid email or password');
                }
                
                // In a real application, you would generate a JWT token here
                $responseData = json_encode([
                    'id' => $user[0]['id'],
                    'fullName' => $user[0]['fullName'],
                    'email' => $user[0]['email'],
                    'role' => $user[0]['role'],
                    'message' => 'Login successful'
                ]);
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage();
                $strErrorHeader = 'HTTP/1.1 401 Unauthorized';
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
     * "/user/profile" Endpoint - Get user profile
     */
    public function profileAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        if (strtoupper($requestMethod) == 'GET') {
            try {
                // In a real application, you would validate the JWT token here
                // and get the user ID from the token
                
                if (!isset($_GET['id'])) {
                    throw new Exception('User ID is required');
                }
                
                $userId = $_GET['id'];
                $userModel = new UserModel();
                $arrUsers = $userModel->getUserById($userId);
                
                if (empty($arrUsers)) {
                    throw new Exception('User not found');
                }
                
                $responseData = json_encode($arrUsers[0]);
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
     * "/user/update" Endpoint - Update user profile
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
}