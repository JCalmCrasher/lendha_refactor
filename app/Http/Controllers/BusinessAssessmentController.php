<?php

namespace App\Http\Controllers;

use App\Models\BusinessAssessment;
use App\Models\User;
use Illuminate\Http\Request;

class BusinessAssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'sales' => 'required|numeric',
            'cost_of_sales' => 'required|numeric',
            'gross_profit' => 'required|numeric',
            'operational_expenses' => 'required|numeric',
            'net_profit' => 'required|numeric',
            'family_and_other_expenses' => 'required|numeric',
            'repayment_capacity' => 'required|numeric',
            'user_id' => 'required|numeric|exists:users,id'
        ]);

        $user = User::find($request->user_id);

        $user->business_assessment()->create([
            'sales' => $request->sales,
            'cost_of_sales' => $request->cost_of_sales,
            'gross_profit' => $request->gross_profit,
            'operational_expenses' => $request->operational_expenses,
            'net_profit' => $request->net_profit,
            'family_and_other_expenses' => $request->family_and_other_expenses,
            'repayment_capacity' => $request->repayment_capacity
        ]);

        return response()->json([
            'step' => $user->onboarding_status,
            'message' => 'Loan assessment validated successfully'
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $request->validate(['user_id' => 'required|numeric|exists:users,id']);

        $user = User::find($request->user_id);

        $businessAssessment = $user->business_assessment;

        if ($businessAssessment->isEmpty()) {
            return response()->json([
                'data' => null,
                'message' => 'Loan assessment not found for this user'
            ], 404);
        }

        return response()->json([
            'data' => $businessAssessment,
            'message' => 'Loan assessment returned successfully'
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\BusinessAssessment  $businessAssessment
     * @return \Illuminate\Http\Response
     */
    public function edit(BusinessAssessment $businessAssessment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\BusinessAssessment  $businessAssessment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, BusinessAssessment $businessAssessment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\BusinessAssessment  $businessAssessment
     * @return \Illuminate\Http\Response
     */
    public function destroy(BusinessAssessment $businessAssessment)
    {
        //
    }
}
