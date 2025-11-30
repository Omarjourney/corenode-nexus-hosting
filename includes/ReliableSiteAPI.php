<?php

class ReliableSiteAPI
{
    private const BASE_URL = 'https://dedicated-servers.reliablesite.dev/v2';
    private const TOKEN_ENDPOINT = '/Login/Token';
    private const VERIFY_ENDPOINT = '/Login/VerifyToken';
    private const INVENTORY_ENDPOINT = '/Inventory/GetAvailableServers';

    private string $apiKey;
    private string $tokenCacheFile;

    public function __construct(?string $cacheFile = null)
    {
        $this->apiKey = getenv('RELIABLESITE_API_KEY') ?: '';
        $this->tokenCacheFile = $cacheFile ?: __DIR__ . '/../storage/rs_token_cache.json';

        if (!is_dir(dirname($this->tokenCacheFile))) {
            mkdir(dirname($this->tokenCacheFile), 0775, true);
        }
    }

    public function authenticate(): ?string
    {
        if (!$this->apiKey) {
            error_log('[ReliableSiteAPI] Missing RELIABLESITE_API_KEY');
            return null;
        }

        $cached = $this->readCachedToken();
        if ($cached && $cached['token'] && !$this->isExpired($cached['expires_at'])) {
            return $cached['token'];
        }

        $payload = json_encode(['ApiKey' => $this->apiKey]);

        $response = $this->request('POST', self::TOKEN_ENDPOINT, [
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Content-Length: ' . strlen($payload),
            ],
        ]);

        if (!$response || !isset($response['http_code']) || $response['http_code'] !== 200) {
            error_log('[ReliableSiteAPI] Failed to authenticate with ReliableSite');
            return null;
        }

        $data = json_decode($response['body'], true);
        $token = $data['token'] ?? $data['Token'] ?? null;
        $expiresIn = $data['expiresIn'] ?? $data['expires_in'] ?? 0;
        $expiresAt = $expiresIn ? (time() + (int) $expiresIn - 60) : (time() + 25 * 60);

        if ($token) {
            $this->writeCachedToken($token, $expiresAt);
        }

        return $token;
    }

    public function verifyToken(string $token): bool
    {
        $response = $this->request('GET', self::VERIFY_ENDPOINT, [
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $token,
            ],
        ]);

        if (!$response || !isset($response['http_code'])) {
            return false;
        }

        return $response['http_code'] === 200;
    }

    public function getServers(array $filters = []): array
    {
        $token = $this->authenticate();
        if (!$token) {
            return [];
        }

        if (!$this->verifyToken($token)) {
            $this->clearCachedToken();
            $token = $this->authenticate();
            if (!$token) {
                return [];
            }
        }

        $query = http_build_query(array_filter([
            'location' => $filters['location'] ?? null,
            'cpu' => $filters['cpu'] ?? null,
            'ram' => $filters['ram'] ?? null,
        ], static fn($value) => $value !== null && $value !== ''));

        $endpoint = self::INVENTORY_ENDPOINT . ($query ? ('?' . $query) : '');

        $response = $this->request('GET', $endpoint, [
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $token,
            ],
        ]);

        if (!$response || ($response['http_code'] ?? 0) !== 200) {
            error_log('[ReliableSiteAPI] Failed to fetch server inventory. HTTP ' . ($response['http_code'] ?? 'N/A'));
            return [];
        }

        $decoded = json_decode($response['body'], true);
        if (!is_array($decoded)) {
            return [];
        }

        if (isset($decoded['data']) && is_array($decoded['data'])) {
            return $decoded['data'];
        }

        return $decoded;
    }

    public function mapServerToCNX(array $server): array
    {
        $family = $this->mapCpuToFamily($server['cpu'] ?? $server['CPU'] ?? '');
        $markup = $this->getMarkup($family);
        $basePrice = $this->extractNumeric($server['base_price'] ?? $server['BasePrice'] ?? $server['price'] ?? $server['Price'] ?? 0);
        $location = $server['location'] ?? $server['Location'] ?? 'Unknown';

        return [
            'rs_id' => (string) ($server['id'] ?? $server['Id'] ?? $server['serverId'] ?? $server['ServerId'] ?? $server['inventoryId'] ?? uniqid('rs_', true)),
            'family' => $family,
            'location' => $location,
            'cpu' => $server['cpu'] ?? $server['CPU'] ?? 'Unknown CPU',
            'ram' => $server['ram'] ?? $server['RAM'] ?? '—',
            'storage' => $server['storage'] ?? $server['Storage'] ?? '—',
            'bandwidth' => $server['bandwidth'] ?? $server['Bandwidth'] ?? '—',
            'base_price' => round($basePrice, 2),
            'cnx_price' => round($basePrice * (1 + $markup), 2),
            'family_markup' => $markup,
            'raw_json' => json_encode($server),
        ];
    }

    public function getMarkup(string $family): float
    {
        return match (strtoupper($family)) {
            'BASIC' => 0.38,
            'CORE' => 0.45,
            'ULTRA' => 0.52,
            'TITAN' => 0.60,
            'VELOCITY' => 0.55,
            default => 0.45,
        };
    }

    private function request(string $method, string $endpoint, array $options = []): ?array
    {
        $ch = curl_init();
        $url = rtrim(self::BASE_URL, '/') . $endpoint;

        $defaults = [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_CUSTOMREQUEST => strtoupper($method),
            CURLOPT_FOLLOWLOCATION => true,
        ];

        foreach ($options as $key => $value) {
            $defaults[$key] = $value;
        }

        curl_setopt_array($ch, $defaults);

        $body = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if (curl_errno($ch)) {
            error_log('[ReliableSiteAPI] cURL error: ' . curl_error($ch));
            curl_close($ch);
            return null;
        }

        curl_close($ch);

        return [
            'body' => $body,
            'http_code' => $httpCode,
        ];
    }

    private function readCachedToken(): ?array
    {
        if (!file_exists($this->tokenCacheFile)) {
            return null;
        }

        $content = file_get_contents($this->tokenCacheFile);
        if (!$content) {
            return null;
        }

        $data = json_decode($content, true);
        if (!is_array($data)) {
            return null;
        }

        return $data;
    }

    private function writeCachedToken(string $token, int $expiresAt): void
    {
        file_put_contents($this->tokenCacheFile, json_encode([
            'token' => $token,
            'expires_at' => $expiresAt,
        ]));
    }

    private function clearCachedToken(): void
    {
        if (file_exists($this->tokenCacheFile)) {
            @unlink($this->tokenCacheFile);
        }
    }

    private function isExpired($timestamp): bool
    {
        if (!$timestamp) {
            return true;
        }

        return time() >= (int) $timestamp;
    }

    private function extractNumeric($value): float
    {
        if (is_numeric($value)) {
            return (float) $value;
        }

        if (is_string($value)) {
            $numeric = preg_replace('/[^0-9.]/', '', $value);
            return (float) ($numeric ?: 0);
        }

        return 0.0;
    }

    private function mapCpuToFamily(string $cpu): string
    {
        $normalized = strtolower($cpu);

        if (str_contains($normalized, 'ryzen') || str_contains($normalized, 'threadripper') || str_contains($normalized, '7950') || str_contains($normalized, '5950')) {
            return 'VELOCITY';
        }

        if (str_contains($normalized, 'turin') || preg_match('/epyc\s*9[0-9]{3}/', $normalized)) {
            return 'TITAN';
        }

        if (str_contains($normalized, 'epyc') && (str_contains($normalized, '75') || str_contains($normalized, '74') || str_contains($normalized, '73'))) {
            return 'ULTRA';
        }

        if (str_contains($normalized, 'gold 6') || str_contains($normalized, 'epyc 7')) {
            return 'ULTRA';
        }

        if (str_contains($normalized, 'platinum') || str_contains($normalized, 'dual')) {
            return 'TITAN';
        }

        if (str_contains($normalized, 'silver') || str_contains($normalized, 'e-23') || str_contains($normalized, 'e-22')) {
            return 'CORE';
        }

        if (str_contains($normalized, 'e3') || str_contains($normalized, 'e5') || str_contains($normalized, 'bronze')) {
            return 'BASIC';
        }

        return 'CORE';
    }
}

