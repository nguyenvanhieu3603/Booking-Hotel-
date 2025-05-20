<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class HotelModel extends Database
{
    public function getHotels($limit = 10)
    {
        return $this->select("SELECT * FROM hotels WHERE active != 1 ORDER BY id ASC LIMIT ?", ["i", $limit]);
    }

    public function getHotelById($hotelId)
    {//Only active hotels
        return $this->select("SELECT * FROM hotels WHERE id = ? AND active != 1", ["i", $hotelId]);
    }

    public function createHotel($name, $address, $description = null, $rating = 0.0)
    {
        return $this->insert(
            "INSERT INTO hotels (name, address, description, rating, active) VALUES (?, ?, ?, ?, 0)",
            ["sssd", $name, $address, $description, $rating]
        );
    }

    public function updateHotel($hotelId, $name, $address, $description, $rating)
    {
        return $this->update(
            "UPDATE hotels SET name = ?, address = ?, description = ?, rating = ? WHERE id = ?",
            ["sssdi", $name, $address, $description, $rating, $hotelId]
        );
    }
    public function updateHotelRating($hotelId, $averageRating, $reviewCount)
    {
        return $this->update(
            "UPDATE hotels SET rating = ?, reviewCount = ? WHERE id = ?",
            ["dii", $averageRating, $reviewCount, $hotelId]
        );
    }

    public function deleteHotel($hotelId)
    {
        return $this->update("UPDATE hotels SET active = 1 WHERE id = ?", ["i", $hotelId]);
    }
}