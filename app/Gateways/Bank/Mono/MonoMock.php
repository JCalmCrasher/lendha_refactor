<?php

namespace App\Gateways\Bank\Mono;

use Exception;
use Illuminate\Support\Facades\Http;

class MonoMock extends Mono
{
    /**
     * @throws Exception
     */
    public function getAuthId(string $code): ?string
    {
        $url = $this->baseUrl . "/accounts/auth";

       if (preg_match('/^code_[a-zA-Z0-9]+$/', $code)) {
            Http::fake([
                $url => Http::response([
                    "status" => "successful",
                    "message" => "Request was successfully completed",
                    "timestamp" => "2024-04-15T18:45:15.371Z",
                    "data" => [
                        "id" => "661d759280dbf646242634cc"
                    ],
                ], 200)
            ]);

            return parent::getAuthId($code);
        }

        Http::fake([
            $url => Http::response([], 400)
        ]);

        return parent::getAuthId($code);
    }

    /**
     * @throws Exception
     */
    public function getBankStatement(string $accountId): mixed
    {
        $url = $this->baseUrl . "/accounts/$accountId/statement?period=last12months&format=v2";

        if (preg_match('/[0-9a-fA-F]{8}$/', $accountId)) {
            Http::fake([
                $url => Http::response([
                    "status" => "successful",
                    "message" => "Successfully fetched statement",
                    "data" => [
                        "count" => 578,
                        "requested_length" => null,
                        "available_length" => 328,
                        "statement" => [
                            [
                                "id" => "652045cd9d3a9e048485b81b",
                                "type" => "credit",
                                "amount" => 6500,
                                "balance" => null,
                                "date" => "2023-10-06T17:33:56.000Z",
                                "narration" => "KIP:WEMA/SAMUEL OLAMIDE/KUDA-",
                                "currency" => "NGN"
                            ]
                        ]
                    ]
                ], 200),
            ]);

            return parent::getBankStatement($accountId);
        }

        Http::fake([
            $url => Http::response([], 400),
        ]);

        return parent::getBankStatement($accountId);
    }

    /**
     * @throws Exception
     */
    public function getAccountInfo(string $accountId, string $name): ?array
    {
        $url = $this->baseUrl . "/accounts/$accountId";

        if (preg_match('/[0-9a-fA-F]{8}/', $accountId)) {
            Http::fake([
                $url => Http::response([
                    "status" => "successful",
                    "message" => "Request was successfully completed",
                    "timestamp" => "2024-04-12T06:31:02.289Z",
                    "data" => [
                        "account" => [
                            "id" => "64779d900000000000b3de23aeb8",
                            "name" => $name,
                            "currency" => "NGN",
                            "type" => "Digital Savings Account",
                            "account_number" => "1234567890",
                            "balance" => 333064,
                            "bvn" => "0065",
                            "institution" => [
                                "name" => "GTBank",
                                "bank_code" => "058",
                                "type" => "PERSONAL_BANKING"
                            ]
                        ],
                        "meta" => [
                            "data_status" => "AVAILABLE",
                            "auth_method" => "internet_banking"
                        ]
                    ],
                ], 200),
            ]);

            return parent::getAccountInfo($accountId, $name);
        }

        Http::fake([
            $url => Http::response([
                "status" => "resource_not_found",
                "message" => "This account does not exist.",
                "data" => null
            ], 404),
        ]);

        return parent::getAccountInfo($accountId, $name);
    }

    /**
     * @throws Exception
     */
    public function getJobStatus(string $accountId, string $jobId): ?array
    {
        $url = $this->baseUrl . "/accounts/$accountId/statement/jobs/$jobId";

        if (preg_match('/[0-9a-fA-F]{8}/', $accountId) && preg_match('/^[a-zA-Z0-9]{20}$/', $jobId)) {
            Http::fake([
                $url => Http::response([
                    "status" => "successful",
                    "message" => "Request was successfully completed",
                    "timestamp" => "2024-04-15T18:45:15.371Z",
                    "data" => [
                        "id" => "2ojHeRva4Bfk9vvIuCuO",
                        "status" => "BUILT",
                        "path" => "https://api.withmono.com/statements/0XmnvkiJZ8dWOYQOF6tM.pdf",
                    ],
                ], 200),
            ]);

            return parent::getJobStatus($accountId, $jobId);
        }

        Http::fake([
            $url => Http::response([], 400),
        ]);

        return parent::getJobStatus($accountId, $jobId);
    }
}
