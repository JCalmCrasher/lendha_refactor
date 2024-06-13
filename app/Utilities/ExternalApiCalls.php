<?php

namespace App\Utilities;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Psr\Http\Message\ResponseInterface;
use GuzzleHttp\Exception\RequestException;

class ExternalApiCalls
{
    public static function send(String $method, String $url, Array $headers, Array $body = [])
    {
        $client = new Client([
            'headers' => $headers
        ]);

        $modified_body = array(
            'form_params' => $body
        );

        try {
            if ( strtolower($method) =='get') {
                $http_response = $client->request($method, $url);
            }
            else {
                $http_response = $client->request($method, $url, $modified_body);
            }
            
            if ($http_response->getStatusCode() == 200) {
                $response_data = $http_response->getBody()->getContents();
                return [
                    'data' => $response_data,
                    'message' => 'success'
                ];
            }

            return [
                'data' => $http_response,
                'message' => $http_response->getReasonPhrase()
            ];
        } catch (RequestException $exception) {
            if ($exception->hasResponse()) {
                $error = $exception->getResponse()->getBody(true);
                return (array) json_decode($error);
            }
            
            return [
                'data' => 400,
                'message' => 'error processing request'
            ];
            
        }
    }
}
