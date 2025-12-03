<?php

function get_db_connection(): mysqli
{
    $host = getenv('DB_HOST') ?: 'localhost';
    $user = getenv('DB_USER') ?: 'root';
    $password = getenv('DB_PASSWORD') ?: '';
    $database = getenv('DB_NAME') ?: 'corenodex';
    $port = (int) (getenv('DB_PORT') ?: 3306);

    $mysqli = new mysqli($host, $user, $password, $database, $port);

    if ($mysqli->connect_errno) {
        throw new RuntimeException('Failed to connect to MySQL: ' . $mysqli->connect_error);
    }

    $mysqli->set_charset('utf8mb4');

    return $mysqli;
}

