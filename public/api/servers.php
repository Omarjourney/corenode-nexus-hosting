<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../../includes/db.php';

try {
    $mysqli = get_db_connection();

    $family   = $_GET['family']   ?? null;
    $location = $_GET['location'] ?? null;

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
    $result  = $stmt->get_result();
    $servers = $result->fetch_all(MYSQLI_ASSOC);

    $stmt->close();
    $mysqli->close();

    echo json_encode([
        'success' => true,
        'count'   => count($servers),
        'servers' => $servers,
    ]);
} catch (Throwable $e) {
    error_log('[api/servers] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => $e->getMessage(),
    ]);
}
