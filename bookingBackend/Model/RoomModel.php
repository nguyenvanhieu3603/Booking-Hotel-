<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class RoomModel extends Database
{
    public function getRoomsByHotelId($hotelId)
    {
        return $this->select(
            "SELECT * FROM rooms WHERE hotelId = ? ORDER BY id ASC",
            ["i", $hotelId]
        );
    }

    public function getRoomById($roomId)
    {
        return $this->select("SELECT * FROM rooms WHERE id = ?", ["i", $roomId]);
    }

    public function createRoom($hotelId, $name, $roomType, $price, $amenities)
    {
        return $this->insert(
            "INSERT INTO rooms (hotelId, name, room_type, price, amenities) VALUES (?, ?, ?, ?, ?)",
            ["issds", $hotelId, $name, $roomType, $price, $amenities]
        );
    }

    public function updateRoom($roomId, $name, $roomType, $price, $amenities)
    {
        return $this->update(
            "UPDATE rooms SET name = ?, room_type = ?, price = ?, amenities = ? WHERE id = ?",
            ["ssdsi", $name, $roomType, $price, $amenities, $roomId]
        );
    }

    public function deleteRoom($roomId)
    {
        return $this->delete("DELETE FROM rooms WHERE id = ?", ["i", $roomId]);
    }


    public function addRoomImage($roomId, $imagePath)
    {
        return $this->insert(
            "INSERT INTO room_images (room_id, image_url) VALUES (?, ?)",
            ["is", $roomId, $imagePath]
        );
    }
    public function getImagesByRoomId($roomId)
    {
        return $this->select(
            "SELECT image_url FROM room_images WHERE room_id = ?",
            ["i", $roomId]
        );
    }
    public function isRoomNameExists($hotelId, $name, $excludeRoomId = null)
    {
        $query = "SELECT COUNT(*) as count FROM rooms WHERE hotelId = ? AND name = ?";
        $params = ["is", $hotelId, $name];

        if ($excludeRoomId !== null) {
            $query .= " AND id != ?";
            $params[0] .= "i";  
            $params[] = $excludeRoomId;
        }

        $result = $this->select($query, $params);

        return isset($result[0]['count']) && $result[0]['count'] > 0;
    }
    public function deleteRoomImage($roomId, $imagePath)
    {
        if (file_exists($imagePath)) {
            unlink($imagePath);
        }
        return $this->delete(
            "DELETE FROM room_images WHERE room_id = ? AND image_url = ?",
            ["is", $roomId, $imagePath]
        );
    }
}