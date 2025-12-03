<?php

class ReliableSiteInventory
{
    private string $wsdl = "https://api.reliablesite.net/Inventory.svc/Inventory?wsdl";
    private string $apiKey;

    public function __construct()
    {
        $apiKey = getenv('RELIABLESITE_API_KEY');
        if ($apiKey === false || empty($apiKey)) {
            throw new \RuntimeException('RELIABLESITE_API_KEY environment variable is not set.');
        }
        $this->apiKey = $apiKey;
    }

    public function listServers(): array
    {
        try {
            $client = new \SoapClient($this->wsdl, [
                'trace'      => true,
                'exceptions' => true,
            ]);

            $params = [
                'ApiKey' => $this->apiKey,
            ];

            $response = $client->ServersList($params);

            if (!$response || !isset($response->ServersListResult)) {
                return [
                    'success' => false,
                    'error'   => 'Invalid SOAP response: missing ServersListResult',
                ];
            }

            $servers = $response->ServersListResult;
            $serversArray = $this->objectToArray($servers);

            if (!is_array($serversArray) || (isset($serversArray['Id']) && !isset($serversArray[0]))) {
                $serversArray = [$serversArray];
            }

            return [
                'success' => true,
                'count'   => count($serversArray),
                'servers' => $serversArray,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error'   => $e->getMessage(),
            ];
        }
    }

    private function objectToArray($data)
    {
        if (is_object($data)) {
            $data = get_object_vars($data);
        }
        if (is_array($data)) {
            return array_map([$this, 'objectToArray'], $data);
        }
        return $data;
    }
}
