<?php
namespace App\Gateways\KYC;

use App\Interfaces\KYC\IBVNCheck;
use App\Interfaces\KYC\ICACCheck;
use Illuminate\Support\Facades\Http;
use JsonException;

class IdentityPass implements IBVNCheck, ICACCheck {
    // TODO: Refactor: Discontinue use of HttpTrait, instead use Http Facade

    protected $baseUrl;
    protected $headers;

    public function __construct() {
        $this->baseUrl = config('identitypass.baseurl');
        $this->headers = [
            'x-api-key' => config('identitypass.api_key'),
            'app-id' => config('identitypass.app_id')
        ];
    }

    /**
     * @throws JsonException
     */
    public function bvnCheck($bvn, ?string $name = null)
    {
        $url = $this->baseUrl.'/verification/bvn';

        $response = Http::withHeaders($this->headers)->acceptJson()->contentType('application/json')
            ->post($url,
                [
                    'number' => $bvn
                ]
            )->body();

        return json_decode($response, false, 512, JSON_THROW_ON_ERROR);
    }

    /**
     * @throws JsonException
     */
    public function cacCheck(string $rcNumber, string $companyName, string $companyType)
    {
        $url = $this->baseUrl.'/verification/cac/advance';

        $response = Http::withHeaders($this->headers)->acceptJson()->contentType('application/json')
            ->post($url,
            [
                'rc_number' => $rcNumber,
                'company_name' => $companyName,
                'company_type' => $companyType,
            ]
        )->body();

        return json_decode($response, false, 512, JSON_THROW_ON_ERROR);
    }
}
