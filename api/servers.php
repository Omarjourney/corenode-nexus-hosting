<?php

require_once __DIR__ . '/includes/ReliableSiteAPI.php';

header('Content-Type: application/json');
try {
    $api = new ReliableSiteAPI();
    $servers = $api->getServers();

    if (!$servers) {
        http_response_code(500);
        echo json_encode([
            'error' => 'No servers returned from ReliableSite API',
        ]);
        exit;
    }

    echo json_encode($servers);
} catch (Throwable $e) {
    error_log('[api/servers] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error'
    ]);
}

