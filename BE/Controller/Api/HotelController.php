<?php
class HotelController extends BaseController
{
    protected $hotelModel;
    public function __construct()
    {
        parent::__construct();
        $this->hotelModel = new HotelModel();
    }

    public function getHotels()
    {
        $hotels = $this->hotelModel->getAllHotels();
        $this->sendOutput(json_encode($hotels), array('Content-Type: application/json'));
    }

    public function getHotel($id)
    {
        $hotel = $this->hotelModel->getHotelById($id);
        if ($hotel) {
            $this->sendOutput(json_encode($hotel), array('Content-Type: application/json'));
        } else {
            $this->sendOutput('', array('HTTP/1.1 404 Not Found'));
        }
    }
}
?>