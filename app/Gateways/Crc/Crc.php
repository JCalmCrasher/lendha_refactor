<?php

namespace App\Gateways\Crc;

use App\Interfaces\ICrcProvider;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class Crc implements ICrcProvider
{
    protected string $username;
    protected string $password;
    protected string $baseUrl;

    public function __construct()
    {
        $this->username = config('crc.username', '');
        $this->password = config('crc.password', '');
        $this->baseUrl = config('crc.url', '');
    }

    /**
     * @throws Exception
     */
    public function crcCheck(string|int $bvn, string $name)
    {
        try {
            $url = $this->baseUrl . "/JsonLiveRequest/JsonService.svc/CIRRequest/ProcessRequestJson";

            $requestData = [
                "Request" => json_encode([
                    '@REQUEST_ID' => '1',
                    'REQUEST_PARAMETERS' => [
                        'REPORT_PARAMETERS' => [
                            '@REPORT_ID' => '2',
                            '@SUBJECT_TYPE' => '1',
                            '@RESPONSE_TYPE' => '5'
                        ],
                        'INQUIRY_REASON' => [
                            '@CODE' => '1'
                        ],
                        'APPLICATION' => [
                            '@PRODUCT' => '017',
                            '@NUMBER' => '232',
                            '@AMOUNT' => '15000',
                            '@CURRENCY' => 'NGN'
                        ],
                        'SEARCH_PARAMETERS' => [
                            '@SEARCH-TYPE' => '4',
                            'BVN_NO' => $bvn
                        ]
                    ]
                ], JSON_THROW_ON_ERROR),
                "UserName" => $this->username,
                "Password" => $this->password
            ];

            $response = Http::acceptJson()->post($url, $requestData);

            Log::info(json_encode($response->json(), JSON_THROW_ON_ERROR));

            if ($response->successful()) {
                return $response->json();
            }
        } catch (Exception $e) {
            throw new Exception('Unable to process crc check, please try again in a few minutes', 500, $e);
        }

        return null;
    }
}
