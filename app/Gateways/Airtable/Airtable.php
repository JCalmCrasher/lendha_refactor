<?php

namespace App\Gateways\Airtable;

use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Psr7\StreamWrapper;

class Airtable
{
    protected string $secretKey;
    protected string $baseUrl;
    protected string $baseId;

    public function __construct()
    {
        $this->secretKey = config('airtable.secret_key', '');
        $this->baseUrl = config('airtable.url', '');
        $this->baseId = config('airtable.base_id', '');
    }

    /**
     * @throws Exception|GuzzleException
     */
    public function fetchUserRecords($offset = null, ?int $pageSize = null)
    {
        try {
            $url = $this->baseUrl . "/$this->baseId/users";

            $params = [];

            if ($pageSize) {
                $params['pageSize'] = $pageSize;
            }

            if ($offset) {
                $params['offset'] = $offset;
            }

            $response = (new Client())->get($url, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->secretKey
                ],
                'query' => $params
            ]);

            if ($response->getStatusCode() !== 200) {
                throw new Exception('Error fetching user records from Airtable');
            }

            return StreamWrapper::getResource($response->getBody());
        } catch (Exception $e) {
            throw new Exception('Unable to start user migration, please try again in a few minutes', 500, $e);
        }
    }
}
