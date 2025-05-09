<?php
include "../db_connect.php"; // Include DB connection

header("Content-Type: application/json"); // Set JSON output format

// Get parameters
$hotel_id = isset($_GET['hotel_id']) ? intval($_GET['hotel_id']) : 0;
$checkin = isset($_GET['checkin']) ? $_GET['checkin'] : null;
$checkout = isset($_GET['checkout']) ? $_GET['checkout'] : null;
$people = isset($_GET['people']) ? intval($_GET['people']) : 1;

// Check if parameters are valid
if (!strtotime($checkin) || !strtotime($checkout) || $hotel_id <= 0 || $people <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid parameters"]);
    exit;
}

// Initially, fetch rooms from the database for the given hotel_id
$sql = "SELECT name, room_type, price, quantity, amenities FROM rooms WHERE hotel_id = ?";
$sql2 = "SELECT r.*
FROM rooms r
LEFT JOIN bookings b ON r.id = b.room_id
WHERE (b.id IS NULL OR NOT (b.check_in_date <= ? AND b.check_out_date >= ?))
AND r.hotel_id = ?          
AND (? < 3 OR r.room_type = 'Double')"; // Only show double rooms if >= 3 people

// SQL query to fetch available rooms based on check-in and check-out dates
if ($checkin && $checkout && $people) {
    // Prepare the SQL statement 
    $stmt = $conn->prepare($sql2);
    $stmt->bind_param("ssii", $checkin, $checkout, $hotel_id, $people);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    // If no check-in/check-out dates are provided, fetch all rooms for the hotel
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $hotel_id);
    $stmt->execute();
    $result = $stmt->get_result();
}


$response = ["success" => true, "data" => []];

while ($row = $result->fetch_assoc()) {
    $response["data"][] = $row;
}

echo json_encode($response);
?>