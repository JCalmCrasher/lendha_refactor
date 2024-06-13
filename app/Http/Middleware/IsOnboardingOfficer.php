<?php

namespace App\Http\Middleware;

use Closure;

class IsOnboardingOfficer
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
        if(auth()->user()->isOnboardingOfficer() || auth()->user()->isAdmin() || auth()->user()->isTeamLead()) {
            return $next($request);
        }
        return response()->json([
            'data' => [],
            'message' => 'access denied'
        ], 400);
    }
}
