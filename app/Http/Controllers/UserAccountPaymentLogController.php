<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserAccountPaymentLogController extends Controller
{
    public function getPayments(Request $request)
    {
        $user = $request->user();
        $payments = $user->account_payment_logs;//()->orderBy('created_at', 'desc')->get();

        return response()->json([
            'data' => $payments,
            'message' => 'User payments retrieved successfully'
        ]);
    }

    public function getUserPayments(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id'
        ]);

        $user = User::find($request->user_id);
        $payments = $user->account_payment_logs;//()->orderBy('created_at', 'desc')->get();

        return response()->json([
            'data' => $payments,
            'message' => 'User payments retrieved successfully'
        ]);
    }
}
