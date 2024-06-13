<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InvestmentPlan;

class InvestmentPlanController extends Controller
{
    //admin: create investment plan
    public function add_investment_plan(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'min_amount' => 'required|numeric',
            'max_amount' => 'required|numeric',
            'duration' => 'required|numeric',
            'interest' => 'required|numeric',
        ]);

        $investment_plan = InvestmentPlan::updateOrCreate(
            ['name' => $request->name],
            [
                'min_amount' => $request->min_amount,
                'max_amount' => $request->max_amount,
                'duration' => $request->duration,
                'interest' => $request->interest
            ]
        );

        if ($investment_plan) {
            return response()->json([
                'data' => $investment_plan,
                'message' => 'success'
            ]);
        }
    }

    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|numeric|exists:investment_plans',
            'name' => 'string',
            'min_amount' => 'numeric',
            'max_amount' => 'numeric',
            'duration' => 'numeric',
            'interest' => 'numeric',
            'status' => 'string|in:active,inactive'
        ]);

        $investment_plan = InvestmentPlan::find($request->id);

        $investment_plan->update($request->all());
        

        return response()->json([
            'data' => $investment_plan,
            'message' => 'success'
        ]);
    }

    public function get_all_plans()
    {
        return response()->json([
            'data' => InvestmentPlan::where('status', 'active')->get(),
            'message' => 'success'
        ]); 
    }
}
