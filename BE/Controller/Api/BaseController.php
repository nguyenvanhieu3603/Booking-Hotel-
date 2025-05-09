<?php
class BaseController
{
    public function __call($name, $arguments)
    {
        $this->sendOutput('', array('HTTP/1.1 404 Not Found'));
    }

    protected function getUriSegments()
    {
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $uri = explode('/', $uri);
        return $uri;
    }

    protected function getQueryStringParams()
    {
        parse_str($_SERVER['QUERY_STRING'], $query);
        return $query;
    }

    protected function getRequestData()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    protected function sendOutput($data, $httpHeaders = array())
    {
        header_remove('Set-Cookie');
        
        if (is_array($httpHeaders) && count($httpHeaders)) {
            foreach ($httpHeaders as $httpHeader) {
                header($httpHeader);
            }
        }
        
        echo $data;
        exit;
    }

    protected function validateEmail($email)
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    protected function validatePassword($password)
    {
        // Minimum 8 characters, at least one letter and one number
        return preg_match('/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/', $password);
    }
}