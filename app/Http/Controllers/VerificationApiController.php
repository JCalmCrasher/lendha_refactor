<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;

class VerificationApiController extends Controller
{
    public function show()
    {
        //
    }

    public function verify(Request $request)
    {
        $userID = $request['id'];
        $user = User::findOrFail($userID);
        $date = date("Y-m-d g:i:s");
        $user->email_verified_at = $date; // to enable the “email_verified_at field of that user be a current time stamp by mimicing the must verify email feature
        $user->save();
        return redirect()->away(env('FRONTEND_URL', '/'));
    }

    /**
    * Resend the email verification notification.
    *
    * @param \Illuminate\Http\Request $request
    * @return \Illuminate\Http\Response
    */
    public function resend(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);
        $user = User::where('email', $request->email)->first();
        if ($user) {
            if ($user->hasVerifiedEmail()) {
                return response()->json('User has already verified email!', 422);
            }
            $user->sendEmailVerificationNotification();
            return response()->json('The notification has been resubmitted');
        }
        return response()->json('invalid email', 400);
        
    }
}
