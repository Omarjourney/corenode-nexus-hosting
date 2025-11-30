<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../includes/db.php';

$regionMap = [
    'MIAMI' => ['label' => 'Miami, FL', 'matchers' => ['/miami/i', '/fl/']],
    'LOSANGELES' => ['label' => 'Los Angeles, CA', 'matchers' => ['/los\s*angeles/i', '/la,/i', '/california/i']],
    'NUREMBERG' => ['label' => 'Nuremberg, DE', 'matchers' => ['/nuremberg/i', '/de\b/i']],
    'JOHOR' => ['label' => 'Johor, MY', 'matchers' => ['/johor/i', '/my\b/i', '/malaysia/i']],
    'KANSASCITY' => ['label' => 'Kansas City, MO', 'matchers' => ['/kansas\s*city/i', '/mo\b/i']],
];

try {
    $mysqli = get_db_connection();

    $family = strtoupper($_GET['family'] ?? '');
    $region = strtoupper($_GET['region'] ?? '');

    $query = 'SELECT rs_id, family, location, cpu, ram, storage, bandwidth, base_price, cnx_price, qty FROM servers WHERE 1=1';
    $params = [];
    $types = '';

    if ($family && in_array($family, ['BASIC', 'CORE', 'ULTRA', 'TITAN', 'VELOCITY'], true)) {
        $query .= ' AND family = ?';
        $params[] = $family;
        $types .= 's';
    }

    $query .= ' ORDER BY cnx_price ASC';

    $stmt = $mysqli->prepare($query);

    if (!$stmt) {
        throw new RuntimeException('Failed to prepare statement');
    }

    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $servers = [];

    while ($row = $result->fetch_assoc()) {
        $status = ((int) $row['qty'] > 0) ? 'available' : 'soldout';
        $servers[] = [
            'rs_id' => $row['rs_id'],
            'family' => $row['family'],
            'location' => $row['location'],
            'cpu' => $row['cpu'],
            'ram' => $row['ram'],
            'storage' => $row['storage'],
            'bandwidth' => $row['bandwidth'],
            'base_price' => (float) $row['base_price'],
            'cnx_price' => (float) $row['cnx_price'],
            'status' => $status,
        ];
    }

    if ($region && isset($regionMap[$region])) {
        $patternSet = $regionMap[$region]['matchers'];
        $servers = array_values(array_filter($servers, static function ($server) use ($patternSet) {
            foreach ($patternSet as $regex) {
                if (preg_match($regex, $server['location'])) {
                    return true;
                }
            }
            return false;
        }));
    }

    $stmt->close();
    $mysqli->close();

    echo json_encode([
        'family' => $family ?: null,
        'region' => $region ?: null,
        'servers' => $servers,
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
    error_log('[api/servers] ' . $e->getMessage());
}

