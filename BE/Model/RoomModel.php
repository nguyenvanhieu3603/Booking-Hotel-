<?php
class RoomModel extends Database
{
    public function getRoomsByHotelId($hotelId)
    {
        return $this->select("SELECT * FROM rooms WHERE hotel_id = ?", ["i", $hotelId]);
    }
    public function getAvailableRooms($hotelId, $checkInDate, $checkOutDate, $people)
    {
        return $this->select(
            "SELECT r.*
                FROM rooms r
                LEFT JOIN bookings b ON r.id = b.room_id
            WHERE (b.id IS NULL OR 
            NOT (b.check_in_date <= ? AND b.check_out_date >= ?))
            AND r.hotel_id = ?          
            AND (? < 3 OR r.room_type = 'Double')",
            ["issi", $hotelId, $checkInDate, $checkOutDate, $people]
        );
    }
}
