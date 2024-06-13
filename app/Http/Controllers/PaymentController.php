<?php

namespace App\Http\Controllers;

use App\Models\DebitLog;
use App\Models\LoanDetails;
use Illuminate\Support\Facades\Config;
use App\Utilities\ExternalApiCalls;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    // not a step in the onboarding process but is needed for loan payment confirmation
    public function confirm(Request $request)
    {
        $request->validate([
            'transaction_reference' => 'required',
            'update_repayment' => 'boolean'
        ]);

        //verify transaction
        $key = Config::get('paystack.lendhakey');
        $http_response = ExternalApiCalls::send(
            'GET',
            'https://api.paystack.co/transaction/verify/'.$request->transaction_reference,
            [
                'Authorization' => 'Bearer '.$key,
                'Accept' => 'application/json'
            ]
        );

        if ($http_response['message'] == "success") {
            $json_data = json_decode($http_response['data']);
            $json_data = $json_data->data;
            if ($json_data->status == 'success') {
                // update payment in DB
                // send response

                return response()->json([
                    "data" => [],
                    "message" => "success"
                ]);
            }
            return response()->json([
                "data" => [],
                "message" => "Payment failed"
            ], 400);
        }
        return response()->json([
            "data" => [],
            "message" => "Error verifying transaction"
        ], 400);
    }

    // public function debit_user(Request $request)
    // {
    //     // allow user change the key to lendha
    //     $request->validate([
    //         'id' => 'required',
    //         'amount' => 'required|numeric',
    //         'payment_key' => 'string|in:lendha,bazuze'
    //     ]);

    //     $id = $request->id;
    //     $amount = $request->amount;

    //     $this_loan = LoanDetails::find($id);
    //     $user = $this_loan ? $this_loan->user : false;
    //     $credentials = $user ? $user->payment_credentials : false;
        
    //     $loan_id = $this_loan ? $this_loan->id : false;

    //     if ($credentials) {
    //         $api_key = ($credentials->api_key == 'bazuze') ? config('paystack.bazuzekey') : config('paystack.lendhakey');
        
    //         $http_response = ExternalApiCalls::send(
    //             'POST',
    //             'https://api.paystack.co/transaction/charge_authorization',
    //             [
    //                 'Authorization' => 'Bearer '.$api_key, 
    //                 'Content-Type' => 'application/json'
    //             ],
    //             [
    //                 'amount' => $amount.'00',
    //                 'authorization_code' => $credentials->authorization_code,
    //                 'email' => $credentials->payment_email
    //             ]
    //         );

    //         if ($http_response['message'] == "success") {
    //             $json_data = json_decode($http_response['data']);
    //             $json_data = $json_data->data;

    //             if ($json_data->status == 'success') {
    //                 //save to db log
    //                 $log = new DebitLog();
    //                 $log->amount = $amount;
    //                 $log->response = $json_data->gateway_response;
    //                 $log->status = 'success';
    //                 $log->loan_detail_id = $loan_id;
    //                 $log->save();
    //             } else {
    //                 $log = new DebitLog();
    //                 $log->amount = $amount;
    //                 $log->response = $json_data->gateway_response;
    //                 $log->status = 'failed';
    //                 $log->loan_detail_id = $loan_id;
    //                 $log->save();
    //             }

    //             return response()->json([
    //                 "data" => $http_response['data'],
    //                 "message" => $json_data->gateway_response
    //             ]);
    //         }
    //         return response()->json([
    //             "data" => $http_response,
    //             "message" => "failed"
    //         ]);
    //     }
    // }
}
