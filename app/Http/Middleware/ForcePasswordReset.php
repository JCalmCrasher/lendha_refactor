<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;

class ForcePasswordReset
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $user = $request->user();
        $password_changed_at = new Carbon(($user->password_changed_at) ? $user->password_changed_at : $user->created_at);
        // TODO: create profile page for admin and subadmin so that they can also change password
        if (
            Carbon::now()->diffInMonths($password_changed_at) >= 3 &&
            (!$user->isAdmin()) &&
            (!$user->isSubAdmin()) &&
            (!$user->isOnboardingOfficer()) &&
            (!$user->isTeamLead())
        ) {
            return response()->json([
                "data" => [],
                "message" => "Your password has expired, please change your password."
            ], 401);
        }

        return $next($request);
    }
}
