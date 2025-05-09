<?php
header("Content-Type: application/json");

include "../db_connect.php";

// Fetch hotels from the database
$sql = "SELECT id, name, address, description, rating FROM hotels";
$result = mysqli_query($conn, $sql);

$hotels = [];
while ($row = $result->fetch_assoc()) {
    $hotels[] = $row;
}

// Send JSON response
echo json_encode($hotels);
?>