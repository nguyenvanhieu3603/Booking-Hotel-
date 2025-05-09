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
}