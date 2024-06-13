<?php

namespace App\Http\Controllers;

use App\Services\IAccountResolutionService;
use Illuminate\Http\Request;
use App\Utilities\ExternalApiCalls;
use Illuminate\Support\Facades\Config;
use Validator;

class BankController extends Controller
{
    public function bank_list(IAccountResolutionService $accountService)
    {
        //return bank list
        $http_response = $accountService->bank_list();

        if ($http_response->getStatus() === true) {
            $json_data = $http_response->getData();
            
            if ($json_data) {
                return response()->json([
                    "data" => [
                        'list' => $json_data
                    ],
                    "message" => ""
                ]);
            }
        }

        return response()->json([
            "data" => [],
            "message" => "Bank list could not be fetched."
        ], 400);
    }

    public function account_name($bank_code, $account_number, IAccountResolutionService $accountService)
    {
        $validator = Validator::make(['bank_code' => $bank_code, 'account_number' => $account_number], [
            'bank_code' => 'required|numeric',
            'account_number' => 'required|digits:10'
        ]);

        if ($validator->fails()) {
            return response()->json([
                "data" => $validator->errors(),
                "message" => 'error'
            ]);
        }

        $account_name_resolution = $accountService->resolve(
            $account_number,
            $bank_code
        );

        if ($account_name_resolution->getStatus() === true) {
            $json_data = $account_name_resolution->getData();
            
            if ($json_data->account_name) {
                return response()->json([
                    "data" => [
                        'name' => $json_data->account_name
                    ],
                    "message" => ''
                ]);
            }
        }

        return response()->json([
            "data" => [],
            "message" => "Your account name could not be fetched."
        ], 400);
    }
}
