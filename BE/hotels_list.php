<?php
header("Content-Type: application/json");

require_once PROJECT_ROOT_PATH . "/Model/Database.php";

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