<?php
// */10 * * * * /usr/bin/php /path/to/project/cron/cron_sync_servers.php >/dev/null 2>&1

require_once dirname(__DIR__) . '/includes/ReliableSiteAPI.php';
require_once dirname(__DIR__) . '/includes/db.php';

$api = new ReliableSiteAPI();

try {
    $servers = $api->getServers();
    $mappedServers = array_map(static fn($server) => $api->mapServerToCNX($server), $servers);

    $mysqli = get_db_connection();

    if (empty($mappedServers)) {
        $mysqli->query('UPDATE servers SET qty = 0');
    } else {
        $stmt = $mysqli->prepare(
            'INSERT INTO servers (rs_id, family, location, cpu, ram, storage, bandwidth, base_price, cnx_price, qty, raw_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE family=VALUES(family), location=VALUES(location), cpu=VALUES(cpu), ram=VALUES(ram), storage=VALUES(storage), bandwidth=VALUES(bandwidth), base_price=VALUES(base_price), cnx_price=VALUES(cnx_price), qty=VALUES(qty), raw_json=VALUES(raw_json)'
        );

        if (!$stmt) {
            throw new RuntimeException('Failed to prepare statement: ' . $mysqli->error);
        }

        $activeIds = [];

        foreach ($mappedServers as $server) {
            $qty = 1;
            $stmt->bind_param(
                'sssssssddis',
                $server['rs_id'],
                $server['family'],
                $server['location'],
                $server['cpu'],
                $server['ram'],
                $server['storage'],
                $server['bandwidth'],
                $server['base_price'],
                $server['cnx_price'],
                $qty,
                $server['raw_json']
            );
            $stmt->execute();
            $activeIds[] = $server['rs_id'];
        }

        if (!empty($activeIds)) {
            $placeholders = implode(',', array_fill(0, count($activeIds), '?'));
            $types = str_repeat('s', count($activeIds));
            $updateStmt = $mysqli->prepare("UPDATE servers SET qty = 0 WHERE rs_id NOT IN ($placeholders)");
            if ($updateStmt) {
                $updateStmt->bind_param($types, ...$activeIds);
                $updateStmt->execute();
                $updateStmt->close();
            }
        }

        $stmt->close();
    }

    $mysqli->close();
} catch (Throwable $e) {
    error_log('[cron_sync_servers] ' . $e->getMessage());
    http_response_code(500);
    echo 'Sync failed';
    exit(1);
}

