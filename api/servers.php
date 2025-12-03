<?php
header('Content-Type: application/json');

require_once __DIR__ . '/InventoryClient.php';

try {
    $inventory = new ReliableSiteInventory();
    $result = $inventory->listServers();
    echo json_encode($result);
} catch (\Throwable $e) {
    echo json_encode([
        'success' => false,
        'error'   => $e->getMessage(),
    ]);
}
