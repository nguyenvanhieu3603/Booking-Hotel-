<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class UserModel extends Database
{
    public function getUsers($limit = 10)
    {
        return $this->select("SELECT * FROM users ORDER BY id ASC LIMIT ?", ["i", $limit]);
    }

    public function getUserById($userId)
    {
        return $this->select("SELECT id, fullName, email, phone, role, createdAt FROM users WHERE id = ?", ["i", $userId]);
    }

    public function getUserByEmail($email)
    {
        return $this->select("SELECT * FROM users WHERE email = ?", ["s", $email]);
    }

    public function createUser($fullName, $email, $password, $phone = null, $role = 'customer')
    {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        return $this->insert(
            "INSERT INTO users (fullName, email, password, phone, role) VALUES (?, ?, ?, ?, ?)",
            ["sssss", $fullName, $email, $hashedPassword, $phone, $role]
        );
    }

    public function updateUser($userId, $fullName, $phone)
    {
        return $this->update(
            "UPDATE users SET fullName = ?, phone = ? WHERE id = ?",
            ["ssi", [$fullName, $phone, $userId]]
        );
    }

    public function updatePassword($userId, $newPassword)
    {
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        return $this->update(
            "UPDATE users SET password = ? WHERE id = ?",
            ["si", [$hashedPassword, $userId]]
        );
    }

    public function deleteUser($userId)
    {
        return $this->delete("DELETE FROM users WHERE id = ?", ["i", $userId]);
    }
    public function storeOTP($userId, $otpCode)
    {
        $expiresAt = date('Y-m-d H:i:s', time() + 300); // 5 phút
        return $this->update(
            "UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?",
            ["ssi", $otpCode, $expiresAt, $userId]
        );
    }

    public function verifyOTP($email, $otpCode)
    {
        // Sửa lại query kiểm tra cả email và OTP
        $user = $this->select(
            "SELECT * 
            FROM users 
            WHERE email = ? 
            AND otp_code = ? ",
            ["ss", $email, $otpCode]
        );
        
        if (!empty($user)) {
            $this->update(
                "UPDATE users 
                SET is_verified = TRUE, 
                    otp_code = NULL, 
                    otp_expires_at = NULL 
                WHERE email = ?",
                ["s", $email]
            );
            return true;
        }
        return false;
    }

    public function markAsVerified($userId)
    {
        return $this->update(
            "UPDATE users SET is_verified = TRUE WHERE id = ?",
            ["i", $userId]
        );
    }
}
