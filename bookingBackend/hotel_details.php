    <?php
include "db_connect.php";

// Get the hotel_id from the URL
$hotel_id = isset($_GET['hotel_id']) ? intval($_GET['hotel_id']) : 0;
$checkin = isset($_GET['checkin']) ? $_GET['checkin'] : null;
$checkout = isset($_GET['checkout']) ? $_GET['checkout'] : null;
$people = isset($_GET['people']) ? intval($_GET['people']) : 1;
// Initially, fetch rooms from the database for the given hotel_id
$sql = "SELECT name, room_type, price, quantity, amenities FROM rooms WHERE hotel_id = ?";
$sql2 = "SELECT r.*
FROM rooms r
LEFT JOIN bookings b ON r.id = b.room_id
WHERE (b.id IS NULL OR NOT (b.check_in_date <= ? AND b.check_out_date >= ?))
AND r.hotel_id = ?
AND (? < 3 OR r.room_type = 'Double')";

// SQL query to fetch available rooms based on check-in and check-out dates
if ($checkin && $checkout) {
    $stmt = $conn->prepare($sql2);
    $stmt->bind_param("ssii", $checkin, $checkout, $hotel_id, $people);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    // if no check-in/check-out dates are provided, fetch all rooms for the hotel
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $hotel_id);
    $stmt->execute();
    $result = $stmt->get_result();
}
?>

<body>
    <h1>Rooms List</h1>

    <form method="GET" action="json_destination/search_result.php">
        <input type="hidden" name="hotel_id" value="<?php echo $hotel_id; ?>">

        <label for="people">Number of People:</label>
        <select id="people" name="people" required>
            <option value="1" selected>1 Adult</option>
            <option value="2">1 Adult, 2 Children</option>
            <option value="2">2 Adults</option>
            <option value="3">2 Adults, 2 Children</option>
            <option value="4">2 Adults, 4 Children</option>
            <option value="3">3 Adults</option>
            <option value="4">3 Adults, 2 Children</option>
            <option value="4">4 Adults</option>
        </select>

        <label for="checkin">Check-in Date:</label>
        <input type="date" id="checkin" name="checkin" required>

        <label for="checkout">Check-out Date:</label>
        <input type="date" id="checkout" name="checkout" required>

        <button type="submit">Search</button>
    </form>

    <table border="1">
        <thead>
            <tr>
                <th>Name</th>
                <th>Room Type</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Amenities</th>
            </tr>
        </thead>
        <tbody>
            <?php while ($row = $result->fetch_assoc()) { ?>
                <tr>
                    <td><?php echo htmlspecialchars($row['name']); ?></td>
                    <td><?php echo htmlspecialchars($row['room_type']); ?></td>
                    <td><?php echo htmlspecialchars($row['price']); ?></td>
                    <td><?php echo htmlspecialchars($row['quantity']); ?></td>
                    <td><?php echo htmlspecialchars($row['amenities']); ?></td>
                    <?php if ($checkin && $checkout) { ?>
                        <td>
                            <form method="POST" action="book_room.php">
                                <input type="hidden" name="room_id" value="<?php echo $row['id']; ?>">
                                <input type="hidden" name="hotel_id" value="<?php echo $hotel_id; ?>">
                                <input type="hidden" name="checkin" value="<?php echo $checkin; ?>">
                                <input type="hidden" name="checkout" value="<?php echo $checkout; ?>">
                                <input type="hidden" name="people" value="<?php echo $people; ?>">
                                <button type="submit">Book Now</button>
                            </form>
                        </td>
                    <?php
                    } ?>
                </tr>
            <?php } ?>
        </tbody>
    </table>
    <button onclick="window.location.href='hotels_list.php'">Back to Hotels List</button>

</body>