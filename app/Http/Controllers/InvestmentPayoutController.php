<?php

namespace App\Http\Controllers;

use App\Models\InvestmentPayout;

class InvestmentPayoutController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json([
            'data' => InvestmentPayout::all(),
            'message' => 'success'
        ]);
    }
}
