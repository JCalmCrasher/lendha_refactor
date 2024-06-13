<?php
namespace App\Services;

use App\Utilities\ExternalApiCalls;
use Exception;
use Illuminate\Support\Facades\Log;

class AccountResolutionService implements IAccountResolutionService {
    public function bank_list(): ApiResponse
    {
        $key = config('flutterwave.api_key');

        try {
            $response = ExternalApiCalls::send(
                'GET', 
                'https://api.flutterwave.com/v3/banks/NG',
                [
                    'Authorization' => 'Bearer '.$key, 
                    'Content-Type' => 'application/json'
                ]
            );
            
            $message = '';
            $status = false;
            $data = null;

            if ($response['message'] == 'success') {
                $decode_response = json_decode($response['data']);

                $message = $decode_response->message;
                $status = $decode_response->status == 'success';
                $data = $decode_response->data;
            }

            return new ApiResponse(
                $status,
                $message,
                $data
            );
        } catch (Exception $e) {
            Log::error($e->getMessage());

            return new ApiResponse(
                false,
                'Failed to retrieve bank list.',
                null
            );
        }
    }

    public function resolve($account_number, $bank): ApiResponse
    {
        try {
            $key = config('flutterwave.api_key');
            
            $response = ExternalApiCalls::send(
                'POST', 
                'https://api.flutterwave.com/v3/accounts/resolve',
                [
                    'Authorization' => 'Bearer '.$key, 
                    'Content-Type' => 'application/json'
                ],
                [
                    'account_number' => $account_number,
                    'account_bank' => $bank
                ]
            );

            $message = '';
            $status = false;
            $data = null;

            if ($response['message'] == 'success') {
                $decode_response = json_decode($response['data']);

                $message = $decode_response->message;
                $status = $decode_response->status == 'success';
                $data = $decode_response->data;
            }

            return new ApiResponse(
                $status,
                $message,
                $data
            );
        } catch (Exception $e) {
            Log::error($e->getMessage());
            
            return new ApiResponse(
                false,
                'Failed to retrieve account number.',
                null
            );
        }
    }
}