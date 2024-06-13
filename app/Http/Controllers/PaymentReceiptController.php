<?php

namespace App\Http\Controllers;

use App\Models\PaymentReceipt;
use Illuminate\Http\Request;

class PaymentReceiptController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json([
            'data' => PaymentReceipt::all(),
            'message' => ''
        ]);
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
            'loan_id' => 'required|exists:loan_details,id',
            'document' => 'required|file',
            'amount' => 'required|numeric'
        ]);

        $document = $request->file('document');
        $receipt = $document->move('uploads/payment_receipts', $document->getClientOriginalName())->getPathname();

        $paymentReceipt = PaymentReceipt::create([
            'loan_details_id' => $request->loan_id,
            'document' => $receipt,
            'amount' => $request->amount
        ]);

        return response()->json([
            'data' => $paymentReceipt,
            'message' => ''
        ]);
    }

    /**
     * Display receipts for a loan.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function receiptsForLoan(Request $request)
    {
        $request->validate([
            'loan_id' => 'required|exists:loan_details,id'
        ]);

        $receipts = PaymentReceipt::where('loan_details_id', $request->loan_id)->get();

        return response()->json([
            'data' => $receipts,
            'message' => ''
        ]);
    }
}
