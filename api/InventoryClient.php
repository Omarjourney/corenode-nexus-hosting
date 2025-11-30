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
            $client = new SoapClient($this->wsdl, [
                'trace' => true,
                'exceptions' => true,
            ]);
                return [
                    'error' => 'Invalid SOAP response: expected property ServersListResult. Received: ' . print_r($response, true)
                ];
            $params = [
                'ApiKey' => $this->apiKey
            ];

            $response = $client->ServersList($params);

            if (!$response || !isset($response->ServersListResult)) {
                return ['error' => 'Invalid SOAP response'];
            }

            $result = $response->ServersListResult;
                "servers" => $this->objectToArray($servers)
            ];

        } catch (Exception $e) {
            return ["error" => $e->getMessage()];
        }
    }
    /**
     * Recursively convert objects to arrays.
     *
     * @param mixed $data
     * @return mixed
     */
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
            return [
                "success" => true,
                "count" => is_array($servers) ? count($servers) : 1,
                "servers" => json_decode(json_encode($servers), true)
            ];

        } catch (Exception $e) {
            return ["error" => $e->getMessage()];
        }
    }
}
