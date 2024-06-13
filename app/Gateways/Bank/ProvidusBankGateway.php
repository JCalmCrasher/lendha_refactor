<?php
namespace App\Gateways\Bank;

use App\Interfaces\Bank\IBank;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProvidusBankGateway implements IBank
{

    private $baseUrl;
    private $header;

    public function __construct() {
        $this->baseUrl = config('providus.base_url');

        $signature = App::environment('production') ?
            hash('sha512', config('providus.client_id') . ":" . config('providus.client_secret')) :
            config('providus.signature');

        $this->header = [
            'Content-Type' => 'application/json',
            'Client-Id' => config('providus.client_id'),
            'X-Auth-Signature' => $signature,
        ];
    }

    public function createReservedAccount(User $user): ?array
    {
        try {
            $url = $this->baseUrl . '/PiPCreateReservedAccountNumber';

            $response = Http::withHeaders($this->header)->acceptJson()->contentType('application/json')
                ->post($url,
                    [
                        'account_name' => $user->name,
                        'bvn' => $user->bvn ?? '',
                    ],
                )->body();

            $response = json_decode($response, false, 512, JSON_THROW_ON_ERROR);

            if ($response && isset($response->requestSuccessful) && $response->requestSuccessful) {
                $account = [
                    'account_number' => $response->account_number,
                    'account_name' => $response->account_name,
                    'bank_name' => 'Providus Bank',
                ];

                return $account;
            }

            return null;

        } catch (Exception $e) {
            Log::error($e->getMessage());
        }

        return null;
    }
}
