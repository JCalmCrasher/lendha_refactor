<?php

namespace App\Gateways\SMS;

use App\Interfaces\SMS\ISMSProvider;
use App\Utilities\PhoneNumberUtility;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TermiiSMSGateway implements ISMSProvider
{

    private $token;
    private $baseUrl;
    private $appName;

    public function __construct()
    {
        $this->token = config('termii.token', '');
        $this->baseUrl = config('termii.url');
        $this->appName = env('APP_NAME', 'Lendha');
    }

    public function sendSMS($to, $message): bool
    {
        try {
            $url = $this->baseUrl . '/sms/send';

            $payload = [
                "api_key" => $this->token,
                "to" => PhoneNumberUtility::internationalize($to),
                "from" => $this->appName,
                "sms" => $message,
                "type" => "plain",
                "channel" => "dnd"
            ];

            $response = Http::acceptJson()->post($url, $payload)->body();

            Log::info(json_encode($response, JSON_THROW_ON_ERROR));

            $response = json_decode($response, false, 512, JSON_THROW_ON_ERROR);

            if ($response && $response->code === 'ok') {
                return true;
            }
        } catch (Exception $e) {
            throw new Exception('Unable to send SMS at the moment, please try again in a few minutes', 500, $e);
        }

        return false;
    }
}
