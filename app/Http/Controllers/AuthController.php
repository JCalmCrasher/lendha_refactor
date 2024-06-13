<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Merchant;
use App\Models\Referral;
use Carbon\CarbonInterval;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Validator;
use Carbon\Carbon;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Create user
     *
     * @param  [string] name
     * @param  [string] email
     * @param  [string] password
     * @param  [string] password_confirmation
     * @param  [string] phone_number
     * @return [object] data
     * @return [string] message
     */
    public function signup(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'business_name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|confirmed',
            'phone_number' => 'required',
            'date_of_birth' => 'required',
            'referral_channel' => 'exists:referral_channels,id',
            'terms_accepted' => 'required|accepted'
        ]);

        $user = new User([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'phone_number' => $request->phone_number,
            'date_of_birth' => Carbon::parse($request->date_of_birth)->format('Y-m-d'),
            'terms_accepted' => $request->terms_accepted
        ]);

        $user->save();

        $user->business()->create([
            'name' => $request->business_name,
        ]);

        if ($request->has('referral_channel') && $request->referral_channel){
            $user->referral_channel()->associate($request->referral_channel)->save();
        }

        $user->sendApiEmailVerificationNotification();

        // $user->loans()->save($loan);

        return response()->json([
            'data' => [
                'step' => 0
            ],
            'message' => 'Successfully created user!'
        ], 201);
    }

    /**
     * Login user and create token
     *
     * @param  [string] email
     * @param  [string] password
     * @param  [boolean] remember_me
     * @return [string] access_token
     * @return [string] token_type
     * @return [string] expires_at
     * @throws Exception
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
            'remember_me' => 'boolean'
        ]);

        if (RateLimiter::tooManyAttempts($request->email, 3)) {
            $availableIn = CarbonInterval::seconds(RateLimiter::availableIn($request->email))->cascade()->forHumans();

            return response()->json([
                'message' => 'Too many login attempts. Please try again in ' . $availableIn . '.'
            ], 429);
        }

        $credentials = request(['email', 'password']);
        if(!Auth::attempt($credentials)) {
            RateLimiter::hit($request->email, (60 * 5));

            return response()->json([
                'message' => 'Invalid email or password!'
            ], 401);
        }
        $user = $request->user();

        if($user->email_verified_at !== NULL){
            $tokenResult = $user->createToken('Personal Access Token');
            $token = $tokenResult->token;

            RateLimiter::clear($request->email);

            if ($request->remember_me) {
                $token->expires_at = Carbon::now()->addWeek();
            } else {
                $token->expires_at = Carbon::now()->addHour();
            }
            $token->save();

            activity()->causedBy($user)->performedOn($user)->log('User Logged In');

            return response()->json([
                'permissions' => $user->type,
                'access_token' => $tokenResult->accessToken,
                'token_type' => 'Bearer',
                'expires_at' => Carbon::parse(
                    $tokenResult->token->expires_at
                )->toDateTimeString(),
                'step' => $user->onboarding_status,
                'branch_id' => $user->branch_id,
            ]);
        }else{
            return response()->json(['error'=>'Please Verify Email'], 401);
        }
    }

    /**
     * Logout user (Revoke the token)
     *
     * @return [string] message
     */
    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    /**
     * Get the authenticated User
     *
     * @return [json] user object
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function password(Request $request)
    {
        $request->validate([
            'password' => 'required|string|confirmed',
            'old_password' => 'required|string'
        ]);
        $user = Auth::user();
        if (password_verify($request->old_password, $user->password)){
            $user->update([
                'password' => bcrypt($request->password)
            ]);
            return response()->json([
                'data' => [],
                'message'=>'password update successful'
            ]);
        } else {
            return response()->json([
                'data' => [],
                'message'=>'Incorrect password'
            ], 401);
        }

    }
}
