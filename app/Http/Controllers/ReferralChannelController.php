<?php

namespace App\Http\Controllers;

use App\Models\ReferralChannel;
use Illuminate\Http\Request;

class ReferralChannelController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function all(){
        return response()->json([
            'data' => ReferralChannel::all(['id', 'name']),
            'message' => 'Successfully retrieved all referral channels',
        ], 200);
    }
}
