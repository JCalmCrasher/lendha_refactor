<?php

namespace App\Http\Controllers;

use App\Interfaces\IKycProvider;
use Illuminate\Http\Request;

class KYCController extends Controller
{
    private $kycProvider;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(IKycProvider $kycProvider)
    {
        $this->kycProvider = $kycProvider;
        $this->middleware('auth');
    }

    /**
     * Get the jwtToken.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getToken()
    {
        $token = $this->kycProvider->generateToken();

        return response()->json([
            'data' => $token,
            'message' => $token ? 'Token generated successfully' : 'Token generation failed',
        ], $token ? 200 : 500);
    }
}
