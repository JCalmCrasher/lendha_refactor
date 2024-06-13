<?php

namespace App\Http\Controllers\OnboardingOfficer;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProxyRegisterController extends Controller
{
    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    protected function create(Request $request)
    {
        $request->validate([
            'bvn' => 'required|digits:11',
            'nin' => 'required|digits:11',
            'name' => 'required|string',
            'email' => 'required_without:phone_number|string|email|unique:users',
            'phone_number' => 'required_without:email|digits_between:11,14|unique:users',
            'date_of_birth' => 'required',
        ]);

        $user = new User([
            'name' => $request->name,
            'email' => $request->email ?? null,
            'password' => bcrypt(Str::password()),
            'phone_number' => $request->phone_number,
            'date_of_birth' => Carbon::parse($request->date_of_birth)->format('Y-m-d'),
            'branch_id' => $request->user()->branch_id,
            'officer_id' => $request->user()->id,
        ]);

        $user->save();

        $user->bank()->create([
            'bvn' => $request->bvn,
            'nin' => $request->nin,
        ]);

        if ($request->email) {
            $user->sendApiEmailVerificationNotification();
        }

        if ($request->phone_number) {
            $user->sendOTP();
        }

        return response()->json([
            'data' => [
                'step' => $user->onboarding_status,
                'user' => $user
            ],
            'message' => 'Successfully created user!'
        ], 201);
    }
}
