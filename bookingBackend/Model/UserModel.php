<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class UserModel extends Database
{
    public function getUsers($limit = 10)
    {
        return $this->select("SELECT id, fullName, email, phone, role, createdAt FROM users ORDER BY id ASC LIMIT ?", ["i", $limit]);
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
        $query = "INSERT INTO users (fullName, email, password, phone, role) VALUES (?, ?, ?, ?, ?)";
        return $this->insert($query, ["sssss", $fullName, $email, $hashedPassword, $phone, $role]);
    }

    public function updateUser($userId, $fullName, $phone)
    {
        return $this->update(
            "UPDATE users SET fullName = ?, phone = ? WHERE id = ?",
            ["ssi", $fullName, $phone, $userId]
        );
    }

    public function updateAdminUser($userId, $fullName, $phone, $role)
    {
        return $this->update(
            "UPDATE users SET fullName = ?, phone = ?, role = ? WHERE id = ?",
            ["sssi", $fullName, $phone, $role, $userId]
        );
    }

    public function updatePassword($userId, $newPassword)
    {
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        return $this->update(
            "UPDATE users SET password = ? WHERE id = ?",
            ["si", $hashedPassword, $userId]
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
        $user = $this->select(
            "SELECT * 
            FROM users 
            WHERE email = ? 
            AND otp_code = ?",
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

    public function incrementFailedLogin($email)
    {
        return $this->update(
            "UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE email = ?",
            ["s", $email]
        );
    }

    public function lockAccount($email, $lockoutMinutes = 15)
    {
        $lockoutUntil = date('Y-m-d H:i:s', time() + $lockoutMinutes * 60);
        return $this->update(
            "UPDATE users SET lockout_until = ? WHERE email = ?",
            ["ss", $lockoutUntil, $email]
        );
    }

    public function resetFailedLogin($email)
    {
        return $this->update(
            "UPDATE users SET failed_login_attempts = 0, lockout_until = NULL WHERE email = ?",
            ["s", $email]
        );
    }

    public function storeResetToken($email, $token)
    {
        $expiresAt = date('Y-m-d H:i:s', time() + 900); // 15 phút
        return $this->update(
            "UPDATE users SET reset_token = ?, reset_token_expires_at = ? WHERE email = ?",
            ["sss", $token, $expiresAt, $email]
        );
    }

    public function getUserByResetToken($token)
    {
        return $this->select(
            "SELECT * FROM users WHERE reset_token = ?",
            ["s", $token]
        );
    }

    public function clearResetToken($email)
    {
        return $this->update(
            "UPDATE users SET reset_token = NULL, reset_token_expires_at = NULL WHERE email = ?",
            ["s", $email]
        );
    }
}
?>