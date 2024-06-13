<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Notifications\PasswordResetRequest;
use App\Notifications\PasswordResetSuccess;
use App\Providers\RouteServiceProvider;
use App\Models\User;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Auth\Events\PasswordReset as EventsPasswordReset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;


class ResetPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset requests
    | and uses a simple trait to include this behavior. You're free to
    | explore this trait and override any methods you wish to tweak.
    |
    */

    //use ResetsPasswords;

    /**
     * Where to redirect users after resetting their password.
     *
     * @var string
     */
    //protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * create token password reset
     *
     * @params [string] email
     * @return [string] message
     */
    public function create (Request $request){
        $request->validate([
            'email' =>'required|email',
        ]);

        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT ?
            response()->json(['status' => __($status)]) :
            response()->json(['email' => __($status)], 400);

        // $user = User::where('email', $request->email)->first();

        // if (!$user) {
        //     return response()->json([
        //         'message' =>"Email does not exist"
        //     ], 400);
        // }

        // $passwordReset = PasswordReset::updateOrCreate(
        //     [
        //         'email' => $user->email
        //     ],
        //     [
        //         'email' => $user->email,
        //         'token' => Str::random(60)
        //     ]
        // );

        // if ($user && $passwordReset){
        //     $user->notify(new PasswordResetRequest($passwordReset->token));
        // }

        // return response()->json([
        //     'message'=> "We have e-mailed your password reset link"
        // ]);
    }

    /**
     * Reset password
     *
     * @param  [string] email
     * @param  [string] password
     * @param  [string] password_confirmation
     * @param  [string] token
     * @return [string] message
     * @return [bool] status
     */
    public function reset(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string|confirmed',
            'token' => 'required|string'
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                if ($user->email_verified_at === null) {
                    $user->email_verified_at = now();
                }

                $user->save();

                event(new EventsPasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
                    ? response()->json([
                        'message' => __($status),
                        'status' => true
                    ])
                    : response()->json(['email' => __($status)], 400);

        // $passwordReset = PasswordReset::where([
        //     ['token', $request->token],
        //     ['email', $request->email]
        // ])->first();

        // if (!$passwordReset)
        //     return response()->json([
        //         'message' => 'This password reset token is invalid.'
        //     ], 404);

        // $user = User::where('email', $passwordReset->email)->first();
        // if (!$user)
        //     return response()->json([
        //         'message' => 'We cannot find a user with that e-mail address.'
        //     ], 404);

        // $user->password = bcrypt($request->password);
        // $user->password_changed_at = Carbon::now();
        // $user->save();
        // $passwordReset->delete();
        // $user->notify(new PasswordResetSuccess($passwordReset));

        // return response()->json($user);
    }

}
