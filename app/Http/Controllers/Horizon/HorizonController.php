<?php
namespace App\Http\Controllers\Horizon;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class HorizonController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $request->session()->put('expires_at', now()->addMinutes(5));
            return redirect()->to('horizon');
        } else {
            // Authentication failed, redirect back to the login page with an error message
            return redirect()->back()->with('error', 'Invalid credentials');
        }
    }
}