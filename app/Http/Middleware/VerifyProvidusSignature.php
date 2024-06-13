<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\App;

class VerifyProvidusSignature
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
        $xAuthSignature = $request->header('X-Auth-Signature');

        $signature = App::environment('production') ? 
        hash('sha512', config('providus.client_id') . ":" . config('providus.client_secret')) : 
        config('providus.signature');

        if (strtolower($xAuthSignature) == strtolower($signature)) {
            return $next($request);
        }
        
        return response()->json([
            'requestSuccessful' => true,
            'sessionId' => $request->sessionId,
            'responseMessage' => 'rejected transaction',
            'responseCode' => '02',
        ]);
    }
}
