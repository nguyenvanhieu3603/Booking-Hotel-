<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class PaymentModel extends Database
{
    public function createPayment($bookingId, $paymentMethod, $amount)
    {
        return $this->insert(
            "INSERT INTO payments (bookingId, paymentMethod, amount) 
            VALUES (?, ?, ?)",
            ["isd", $bookingId, $paymentMethod, $amount]
        );
    }

    public function getPaymentById($paymentId)
    {
        return $this->select(
            "SELECT p.*, b.userId, b.totalPrice 
            FROM payments p
            JOIN bookings b ON p.bookingId = b.id
            WHERE p.id = ?",
            ["i", $paymentId]
        );
    }

    public function getPaymentsByBooking($bookingId)
    {
        return $this->select(
            "SELECT * FROM payments WHERE bookingId = ? ORDER BY createdAt DESC",
            ["i", $bookingId]
        );
    }

    public function updatePaymentStatus($paymentId, $status)
    {
        return $this->update(
            "UPDATE payments SET status = ?, paidAt = NOW() WHERE id = ?",
            ["si", $status, $paymentId]
        );
    }
}