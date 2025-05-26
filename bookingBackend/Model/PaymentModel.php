<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class PaymentModel extends Database
{
    public function createPayment($bookingId, $paymentMethod, $amount, $transactionId = null)
    {
        // Kiểm tra phương thức thanh toán
        $validMethods = ['credit_card', 'bank_transfer', 'cash', 'ewallet', 'paypal'];
        if (!in_array($paymentMethod, $validMethods)) {
            throw new Exception("Invalid payment method");
        }

        // Kiểm tra số tiền
        $booking = (new BookingModel())->getBookingById($bookingId);
        if (empty($booking)) {
            throw new Exception("Booking not found");
        }
        if ($amount != $booking[0]['totalPrice']) {
            throw new Exception("Số tiền thanh toán không đủ");
        }

        return $this->insert(
            "INSERT INTO payments (bookingId, paymentMethod, amount, transactionId) 
            VALUES (?, ?, ?, ?)",
            ["isds", $bookingId, $paymentMethod, $amount, $transactionId]
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

    public function updatePaymentStatus($paymentId, $status, $transactionId = null)
    {
        $payment = $this->getPaymentById($paymentId);
        if (empty($payment)) {
            throw new Exception("Payment not found");
        }
        if ($payment[0]['status'] === 'completed') {
            throw new Exception("Cannot modify completed payment");
        }
        $validStatuses = ['pending', 'completed', 'failed', 'refunded'];
        if (!in_array($status, $validStatuses)) {
            throw new Exception("Invalid payment status");
        }
        return $this->update(
            "UPDATE payments SET status = ?, paidAt = NOW(), transactionId = ? WHERE id = ?",
            ["ssi", $status, $transactionId, $paymentId]
        );
    }
    public function getAllPayments($limit = 10)
    {
        return $this->select(
            "SELECT p.*, u.fullName as userName, b.checkInDate, b.checkOutDate
            FROM payments p
            JOIN bookings b ON p.bookingId = b.id
            JOIN users u ON b.userId = u.id
            ORDER BY p.createdAt DESC
            LIMIT ?",
            ["i", $limit]
        );
    }

    public function countTotalPayments()
    {
        $result = $this->select("SELECT COUNT(*) as total FROM payments");
        return $result[0]['total'] ?? 0;
    }

    public function calculateTotalPayments()
    {
        $result = $this->select(
            "SELECT SUM(amount) as total 
            FROM payments 
            WHERE status = 'completed'"
        );
        return $result[0]['total'] ?? 0;
    }

    public function getPaymentsByDate()
    {
        return $this->select(
            "SELECT DATE(paidAt) as date, SUM(amount) as dailyPayments
            FROM payments
            WHERE status = 'completed' AND paidAt IS NOT NULL
            GROUP BY DATE(paidAt)
            ORDER BY DATE(paidAt) DESC"
        );
    }
    public function getPaymentByTransactionId($transactionId)
    {
        return $this->select(
            "SELECT p.*, b.userId, b.totalPrice 
            FROM payments p
            JOIN bookings b ON p.bookingId = b.id
            WHERE p.transactionId = ?",
            ["s", $transactionId]
        );
    }
}