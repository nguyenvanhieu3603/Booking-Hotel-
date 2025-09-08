<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class ReviewModel extends Database
{
    public function createReview($userId, $hotelId, $bookingId, $rating, $comment)
    {
        return $this->insert(
            "INSERT INTO reviews (userId, hotelId, bookingId, rating, comment) 
            VALUES (?, ?, ?, ?, ?)",
            ["iiiss", $userId, $hotelId, $bookingId, $rating, $comment]
        );
    }

    public function getReviewsByHotel($hotelId)
    {
        return $this->select(
            "SELECT r.*, u.fullName as userName 
            FROM reviews r
            JOIN users u ON r.userId = u.id
            WHERE r.hotelId = ?
            ORDER BY r.createdAt DESC"
            ,
            ["i", $hotelId]
        );
    }

    public function getUserReviewForBooking($userId, $bookingId)
    {
        return $this->select(
            "SELECT * FROM reviews 
            WHERE userId = ? AND bookingId = ?",
            ["ii", $userId, $bookingId]
        );
    }

    public function updateReview($reviewId, $rating, $comment)
    {
        return $this->update(
            "UPDATE reviews SET rating = ?, comment = ? 
            WHERE id = ?",
            ["isi", $rating, $comment, $reviewId]
        );
    }

    public function getReviewById($reviewId)
    {
        return $this->select(
            "SELECT r.*, u.fullName as userName 
            FROM reviews r
            JOIN users u ON r.userId = u.id
            WHERE r.id = ?",
            ["i", $reviewId]
        );
    }
    public function deleteReview($reviewId)
    {
        return $this->delete(
            "DELETE FROM reviews WHERE id = ?",
            ["i", $reviewId]
        );
    }

    public function getHotelAverageRating($hotelId)
    {
        return $this->select(
            "SELECT AVG(rating) as averageRating, COUNT(*) as reviewCount
            FROM reviews
            WHERE hotelId = ?",
            ["i", $hotelId]
        );
    }

}