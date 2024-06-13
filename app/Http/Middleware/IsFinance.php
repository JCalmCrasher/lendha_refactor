<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsFinance
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): mixed
    {
        if (auth()->user()->isFinance()) {
            return $next($request);
        }
        return response()->json([
            'data' => [],
            'message' => 'access denied'
        ], 400);
    }
}
