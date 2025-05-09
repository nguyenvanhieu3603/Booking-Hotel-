<?php
class Database
{
    protected $connection = null;

    public function __construct()
    {
        try {
            $this->connection = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE_NAME);
    	
            if (mysqli_connect_errno()) {
                throw new Exception("Could not connect to database.");   
            }
        } catch (Exception $e) {
            throw new Exception($e->getMessage());   
        }			
    }

    public function select($query = "", $params = [])
    {
        try {
            $stmt = $this->executeStatement($query, $params);
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);				
            $stmt->close();
            return $result;
        } catch(Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    public function insert($query = "", $params = [])
    {
        try {
            $stmt = $this->executeStatement($query, $params);
            $insertId = $stmt->insert_id;
            $stmt->close();
            return $insertId;
        } catch(Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    public function update($query = "", $params = [])
    {
        try {
            $stmt = $this->executeStatement($query, $params);
            $affectedRows = $stmt->affected_rows;
            $stmt->close();
            return $affectedRows;
        } catch(Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    public function delete($query = "", $params = [])
    {
        try {
            $stmt = $this->executeStatement($query, $params);
            $affectedRows = $stmt->affected_rows;
            $stmt->close();
            return $affectedRows;
        } catch(Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    private function executeStatement($query = "", $params = [])
    {
        try {
            $stmt = $this->connection->prepare($query);
            
            if($stmt === false) {
                throw new Exception("Unable to do prepared statement: " . $query);
            }

            if($params && count($params) > 1) {
                $types = array_shift($params);
                $stmt->bind_param($types, ...$params);
            }

            $stmt->execute();
            return $stmt;
        } catch(Exception $e) {
            throw new Exception($e->getMessage());
        }	
    }
}