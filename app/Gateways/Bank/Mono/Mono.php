<?php

namespace App\Gateways\Bank\Mono;

use App\Interfaces\Bank\IBankStatement;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class Mono implements IBankStatement
{
    protected string $secretKey;
    protected string $baseUrl;

    public function __construct()
    {
        $this->secretKey = config('mono.secret_key', '');
        $this->baseUrl = config('mono.url', '');
    }

    /**
     * @throws Exception
     */
    public function getBankStatement(string $accountId): mixed
    {
        try {
            $url = $this->baseUrl . "/accounts/$accountId/statement?period=last12months&format=v2";

            $response = Http::acceptJson()->withHeaders(['mono-sec-key' => $this->secretKey])->get($url)->json();

            Log::info(json_encode($response, JSON_THROW_ON_ERROR));

            if ($response && $response['status'] === 'successful') {
                return $response['data']['statement'];
            }
        } catch (Exception $e) {
            throw new Exception('Unable to process your statement of account, please try again in a few minutes', 500, $e);
        }

        return null;
    }

    /**
     * @throws Exception
     */
    public function getAuthId(string $code): ?string
    {
        try {
            $url = $this->baseUrl . "/accounts/auth";

            $response = Http::withHeaders(['mono-sec-key' => $this->secretKey])->post($url, ['code' => $code])->json();

            Log::info(json_encode($response, JSON_THROW_ON_ERROR));

            if ($response && $response['status'] === 'successful') {
                return $response['data']['id'];
            }
        } catch (Exception $e) {
            throw new Exception('Unable to process your linked account, please try again in a few minutes', 500, $e);
        }

        return null;
    }

    /**
     * @throws Exception
     */
    public function getAccountInfo(string $accountId, string $name): ?array
    {
        try {
            $url = $this->baseUrl . "/accounts/$accountId";

            $response = Http::acceptJson()->withHeaders(['mono-sec-key' => $this->secretKey])->get($url)->json();

            Log::info(json_encode($response, JSON_THROW_ON_ERROR));

            if ($response && $response['status'] === 'successful') {
                return [
                    'account_id' => $response['data']['account']['id'],
                    'name' => $response['data']['account']['name'],
                ];
            }
        } catch (Exception $e) {
            throw new Exception('Unable to process your account info, please try again in a few minutes', 500, $e);
        }

        return null;
    }

    /**
     * @throws Exception
     */
    public function getJobStatus(string $accountId, string $jobId): ?array
    {
        try {
            $url = $this->baseUrl . "/accounts/$accountId/statement/jobs/$jobId";

            $response = Http::acceptJson()->withHeaders(['mono-sec-key' => $this->secretKey])->get($url)->json();

            Log::info(json_encode($response, JSON_THROW_ON_ERROR));

            if ($response && $response['status'] === 'successful') {
                return [
                    'job_id' => $response['data']['id'],
                    'status' => $response['data']['status'],
                    'path' => $response['data']['path']
                ];
            }
        } catch (Exception $e) {
            throw new Exception('Unable to process your statement of account, please try again in a few minutes', 500, $e);
        }

        return null;
    }
}
