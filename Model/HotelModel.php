<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class HotelModel extends Database
{
    public function getHotels()
    {
        return $this->select("SELECT * FROM hotels WHERE active != 1 ORDER BY id ASC ", ["i"]);
    }

    public function getAllHotels()
    {
        return $this->select("SELECT * FROM hotels ORDER BY id ASC ", ["i"]);
    }

    public function getHotelsByAddress($address)
    {
        return $this->select(
            "SELECT * FROM hotels WHERE TRIM(SUBSTRING_INDEX(address, ',', -1)) = ? ORDER BY id ASC",
            ["s", "$address"]
        );
    }

    public function getHotelByRating($rating)
    {
        return $this->select(
            "SELECT * FROM hotels WHERE rating >= ? AND active != 1 ORDER BY id ASC",
            ["d", $rating]
        );
    }

    public function getHotelById($hotelId)
    { //Only active hotels
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

    public function addHotelImage($hotelId, $imagePath)
    {
        return $this->insert(
            "INSERT INTO hotel_images (hotel_id, image_url) VALUES (?, ?)",
            ["is", $hotelId, $imagePath]
        );
    }
    public function getImagesByHotelId($hotelId)
    {
        return $this->select(
            "SELECT image_url FROM hotel_images WHERE hotel_id = ?",
            ["i", $hotelId]
        );
    }

    public function deleteHotelImage($hotelId, $imagePath)
    {
        return $this->delete(
            "DELETE FROM hotel_images WHERE hotel_id = ? AND image_url = ?",
            ["is", $hotelId, $imagePath]
        );
        if (file_exists($imagePath)) {
            unlink($imagePath);
        }
    }

    public function countHotelsByProvince($address)
    {
        $result = $this->select(
            "SELECT COUNT(*) as count FROM hotels WHERE TRIM(SUBSTRING_INDEX(address, ',', -1)) = ?",
            ["s", $address]
        );
        return $result[0]['count'] ?? 0;
    }

    public function filterHotelsByRatingAndProvince($province, $rating)
    {
        return $this->select("SELECT * FROM hotels 
        WHERE active != 1 
        AND TRIM(SUBSTRING_INDEX(address, ',', -1)) = ?
        AND rating >= ? ORDER BY id ASC", ["sd", $province, $rating]);
    }
}
