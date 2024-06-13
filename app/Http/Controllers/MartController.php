<?php

namespace App\Http\Controllers;
use Auth;
use Illuminate\Http\Request;
use App\Utilities\ExternalApiCalls;
use App\Models\MartPackages;
use App\Models\Mart;
use App\Models\LoanDetails;

class MartController extends Controller
{
    // admin only
    public function add_mart_package(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'price' => 'required|numeric',
            'description' => 'string',
            'duration' => 'required|numeric',
        ]);
        $package = MartPackages::updateOrCreate(
            ['name' => $request->name],
            [
                'price' => $request->price,
                'description' => $request->description,
                'duration' => $request->duration
            ]
        );
        return response()->json([
            'data' => $package,
            'message' => 'success'
        ]); 
    }

    // user
    public function loan(Request $request)
    {
        $request->validate([
            'package_id' => 'required|numeric',
            'transaction_reference' => 'required'
        ]);

        $user = Auth::user();

        if ($user->suspended) {
            return response()->json([
                'data' => [],
                'message' => 'account suspended'
            ], 401);
        }
        
        $approved_loans = $user->loans->where('status', 'approved');
        $pending_loans = $user->loans->where('status', 'pending');

        if (count($approved_loans) || count($pending_loans)) {
            return response()->json([
                'data' => [],
                'message' => 'user already has an active or pending loan'
            ], 400);
        }

        //{
        $key = config('paystack.lendhakey');
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
                $mart_package = MartPackages::find($request->package_id);

                if ($mart_package) {
                    $amount_paid = doubleval($json_data->amount)/100;
                    if ((($mart_package->price * 30)/100) == $amount_paid) {
                        $loan = new LoanDetails();
                        $loan->application_id = md5(now().$user->email);
                        $loan->amount = $mart_package->price - $amount_paid;
                        $loan->purpose = 'mart';
                        $loan->duration = $mart_package->duration;
                        $loan->request_date = now();
                        $loan->merchant_id = 0;
                        $new_mart_loan = $user->loans()->save($loan);

                        $mart = new Mart();
                        $mart->mart_package_id = $request->package_id;
                        $mart->loan_detail_id = $new_mart_loan->id;
                        $mart_saved = $mart->save();

                        if ($mart_saved) {
                            return response()->json([
                                'data' => [],
                                'message' => 'success'
                            ]);
                        }
                        return response()->json([
                            'data' => [],
                            'message' => 'could not save details, please contact admin.'
                        ], 400);
                        
                    }
                    
                    return response()->json([
                        "data" => [],
                        "message" => "Incorrect payment, contact admin to proceed"
                    ], 400);
                }
                return response()->json([
                    "data" => [],
                    "message" => "Package does not exist"
                ], 400);
            }
            return response()->json([
                "data" => [],
                "message" => "Payment failed"
            ], 400);
        }
        //}

        return response()->json([
            'data' => [],
            'message' => $http_response['message'] ? $http_response['message'] : 'error processing request'
        ], 400);
    }
}
