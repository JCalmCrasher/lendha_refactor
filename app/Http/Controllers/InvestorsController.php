<?php

namespace App\Http\Controllers;

use App\Models\InvestmentPayout;
use Illuminate\Http\Request;

use App\Models\Investors;
use App\Models\InvestmentPlan;
use App\Models\User;

use App\Utilities\ExternalApiCalls;
use Auth;

class InvestorsController extends Controller
{
    public function get_investors_list()
    {
        return response()->json([
            'data' => Investors::all(),
            'message' => 'success'
        ]); 
    }

    public function update_status(Request $request)
    {
        $request->validate([
            'investment_id' => 'required|numeric',
            'status' => 'required|in:active,completed'
        ]);

        $investment = Investors::find($request->investment_id);

        if ($investment) {
            $investment->status = $request->status;
            if ($investment->save()) {
                if ($investment->status === 'completed') {
                    $payout = new InvestmentPayout();
                    $payout->user_id = $investment->user_id;
                    $payout->investors_id = $investment->id;
                    $payout->investment_plan_id = $investment->investment_plan_id;
                    $payout->amount = $investment->amount;
                    
                    if ($payout->save()) {
                        $investment->delete();

                        return response()->json([
                            'data' => [],
                            'message' => 'success'
                        ]);
                    }
                }
                return response()->json([
                    'data' => $investment,
                    'message' => 'success'
                ]);
            }
            return response()->json([
                'data' => [],
                'message' => 'error: could not save'
            ], 400);
        }
    }

    public function get_investment_info()
    {
        $user = Auth::user();
        $investments = $user->investments();
        $sum_of_investments = $investments->sum('amount');
        $total_expected_returns = 0;
        $unpaid_investments = $investments->where('status', 'active');
        $total_expected_returns = $unpaid_investments ? $unpaid_investments->get()->sum('returns') : 0;
        $next_end_of_cycle = $unpaid_investments->oldest()->first() ? $unpaid_investments->oldest()->first()->end_of_cycle : '';
        return response()->json([
            'data' => [
                'sum_of_investments' => $sum_of_investments,
                'total_expected_returns' => $total_expected_returns,
                'next_end_of_cycle' => $next_end_of_cycle,
                'investments' => $user->investments()->get()
            ],
            'message' => 'success'
        ]);
    }

    //user: subscribe to investment plan
    public function invest(Request $request)
    {
        $request->validate([
            'transaction_reference' => 'required',
            'charge_amount' => 'required|numeric',
            'investment_amount' => 'required|numeric',
            'investment_plan_id' => 'required|numeric',
            'user_id' => 'required|numeric'
        ]);

        $user = Auth::user();
        
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
                $investment_plan = InvestmentPlan::find($request->investment_plan_id);

                if ($investment_plan) {
                    $amount_paid = doubleval($json_data->amount)/100;
                    // check that the amount in reference matches total amount paid
                    $total_amount = $request->charge_amount + $request->investment_amount;
                    if ($total_amount != $amount_paid) {
                        return response()->json([
                            "data" => [],
                            "message" => "Payment does not match, contact admin to proceed"
                        ], 400); 
                    }

                    //check if the amount paid matches the plan
                    if ($request->investment_amount >= $investment_plan->min_amount && $request->investment_amount <= $investment_plan->max_amount) {
                        //add investor
                        $investor = new Investors;
                        $investor->amount = $request->investment_amount;
                        $investor->user_id = $user->id;
                        $investor->investment_plan_id = $request->investment_plan_id;
                        if ($investor->save()) {
                            return response()->json([
                                'data' => [],
                                'message' => 'success'
                            ]);
                        }
                    }
                    
                    return response()->json([
                        "data" => [],
                        "message" => "Incorrect payment, contact admin to proceed"
                    ], 400);
                }
                return response()->json([
                    "data" => [],
                    "message" => "Plan does not exist"
                ], 400);
            }
            return response()->json([
                "data" => [],
                "message" => "Payment failed"
            ], 400);
        }

        return response()->json([
            'data' => [],
            'message' => $http_response['message'] ? $http_response['message'] : 'error processing request'
        ], 400);
    }

    //admin: add user investment
    public function add_investment(Request $request)
    {
        $request->validate([
            'amount_paid' => 'required|numeric',
            'email' => 'required|string',
            'investment_plan_id' => 'required|numeric'
        ]);

        $this_user = User::where('email', $request->email)->first();
        if (!isset($this_user)) {
            return response()->json([
                'data' => [],
                'message' => 'incorrect user email'
            ], 400); 
        }
        
        $investment_plan = InvestmentPlan::find($request->investment_plan_id);

        if ($investment_plan) {
            $amount_paid = $request->amount_paid;
            //check if the amount paid matches the plan
            if ($amount_paid >= $investment_plan->min_amount && $amount_paid <= $investment_plan->max_amount) {
                //add investor
                $investor = new Investors;
                $investor->amount = $amount_paid;
                $investor->user_id = $this_user->id;
                $investor->investment_plan_id = $request->investment_plan_id;
                if ($investor->save()) {
                    return response()->json([
                        'data' => [],
                        'message' => 'success'
                    ]);
                }
            }
            
            return response()->json([
                "data" => [],
                "message" => "Incorrect payment, contact admin to proceed"
            ], 400);
        }
        return response()->json([
            "data" => [],
            "message" => "Plan does not exist"
        ], 400);
    }
}
