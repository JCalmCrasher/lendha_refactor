<?php

namespace App\Http\Middleware;

use App\Services\OnboardingOfficer\UserAuthorityService;
use Closure;

class IsProxy
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
        $service = new UserAuthorityService();

        if (
            $request->has('user_id') && 
            is_numeric($request->input('user_id')) && 
            $service->canProxy($request->input('user_id'))
        ) {
            return $next($request);
        }

        if (
            $request->has('loan_id') && 
            is_numeric($request->input('loan_id')) && 
            $service->canProxyLoan($request->input('loan_id'))
        ) {
            return $next($request);
        }
        
        return response()->json([
            'data' => [],
            'message' => 'Cannot make request for this user. Please contact admin!'
        ], 403);
    }
}
