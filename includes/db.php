<?php

function get_db_connection(): mysqli
{
    $host = getenv('DB_HOST') ?: '127.0.0.1';
    $user = getenv('DB_USER') ?: 'root';
    $password = getenv('DB_PASSWORD') ?: '';
    $database = getenv('DB_NAME') ?: 'corenodex';
    $port = getenv('DB_PORT') ?: 3306;

    $mysqli = @new mysqli($host, $user, $password, $database, (int) $port);

    if ($mysqli->connect_errno) {
        throw new RuntimeException('Database connection failed: ' . $mysqli->connect_error);
    }

    $mysqli->set_charset('utf8mb4');

    return $mysqli;
}

