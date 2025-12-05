<?php
// Suppress PHP notices from leaking into JSON responses
ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate');

require_once __DIR__ . '/../includes/db.php';

try {
    $mysqli = get_db_connection();

    $family   = $_GET['family']   ?? null;
    // Allow both `location` and the older `region` parameter name
    $location = $_GET['location'] ?? ($_GET['region'] ?? null);

    $where  = ['qty > 0'];
    $params = [];
    $types  = '';

    if ($family) {
        $where[]  = 'family = ?';
        $params[] = $family;
        $types   .= 's';
    }

    if ($location) {
        $where[]  = 'location = ?';
        $params[] = $location;
        $types   .= 's';
    }

    $sql = 'SELECT rs_id, family, location, cpu, ram, storage, bandwidth, base_price, cnx_price, qty, raw_json
            FROM servers';

    if ($where) {
        $sql .= ' WHERE ' . implode(' AND ', $where);
    }

    $stmt = $mysqli->prepare($sql);
    if ($stmt === false) {
        throw new RuntimeException('Prepare failed: ' . $mysqli->error);
    }

    if ($params) {
        $stmt->bind_param($types, ...$params);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    if ($result === false) {
        throw new RuntimeException('Query failed: ' . $stmt->error);
    }

    $servers = $result->fetch_all(MYSQLI_ASSOC);

    $stmt->close();
    $mysqli->close();

    echo json_encode([
        'success' => true,
        'count'   => count($servers),
        'servers' => $servers,
    ], JSON_INVALID_UTF8_SUBSTITUTE);
} catch (Throwable $e) {
    error_log('[api/servers] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => $e->getMessage(),
    ], JSON_INVALID_UTF8_SUBSTITUTE);
}
