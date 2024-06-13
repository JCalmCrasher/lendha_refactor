<?php

namespace App\Http\Middleware;

use Closure;

class IsLocked
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
        if(!auth()->user()->locked) {
            return $next($request);
        }
        return response()->json([
            'data' => [],
            'message' => 'access denied'
        ], 400);
    }
}
