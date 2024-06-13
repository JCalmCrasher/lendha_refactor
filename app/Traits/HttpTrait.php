<?php
namespace App\Traits;

use GuzzleHttp\Client;

trait HttpTrait
{
    public function post($url, $data, $headers = [])
    {
        $client = new Client([
            'headers' => $headers
        ]);

        $response = $client->request('POST', $url, [
            'json' => $data
        ]);
        return json_decode($response->getBody()->getContents(), false);
    }

    public function get($url, $headers = [])
    {
        $client = new \GuzzleHttp\Client();
        $response = $client->request('GET', $url, [
            'headers' => $headers
        ]);
        return json_decode($response->getBody()->getContents(), false);
    }
}