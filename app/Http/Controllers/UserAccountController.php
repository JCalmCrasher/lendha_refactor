<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserAccountController extends Controller
{
    // get the account details of a user
    public function getAccountDetails(Request $request)
    {
        $user = $request->user();
        $account = $user->account()->first();
        if ($account) {
            return response()->json([
                'status' => true,
                'data' => $account
            ]);
        }
        return response()->json([
            'status' => false,
            'message' => 'No account details found'
        ], 404);
    }

    public function getUserAccountDetails(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $user = User::find($request->user_id);
        $account = $user->account()->first();
        if ($account) {
            return response()->json([
                'status' => true,
                'data' => $account
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'No account details found'
        ], 404);
    }
}
