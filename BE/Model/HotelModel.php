<?php
class HotelModel extends Database
{
    public function getAllHotels()
    {
        return $this->select("SELECT * FROM hotels ORDER BY id ASC");
    }

    public function getHotelById($hotelId)
    {
        return $this->select("SELECT * FROM hotels WHERE id = ?", ["i", $hotelId]);
    }

    public function createHotel($name, $location, $price, $description)
    {
        return $this->insert(
            "INSERT INTO hotels (name, location, price, description) VALUES (?, ?, ?, ?)",
            ["ssds", $name, $location, $price, $description]
        );
    }

    public function updateHotel($hotelId, $name, $location, $price, $description)
    {
        return $this->update(
            "UPDATE hotels SET name = ?, location = ?, price = ?, description = ? WHERE id = ?",
            ["ssdsd", [$name, $location, $price, $description, $hotelId]]
        );
    }

    public function deleteHotel($hotelId)
    {
        return $this->delete("DELETE FROM hotels WHERE id = ?", ["i", $hotelId]);
    }

    public function detailHotel($hotelId)
    {
        return $this->select("SELECT * FROM rooms WHERE hotel_id = ?", ["i", $hotelId]);
    }
}
?>