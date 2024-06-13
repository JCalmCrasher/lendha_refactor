<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactusMail;

class ContactusController extends Controller
{
   
    public function send (Request $request){
        $this->validate($request, [
            'name' => 'required',
            'email'  => 'required|email',
            'message' => 'required'
        ]);
        
        $data = array(
            'name' => $request->name,
            'email' => $request->email,
            'message' =>$request->message
        );

        Mail::send(new ContactusMail($data));

        return response()->json([
            "data" => $data,
            "message" => 'success'
        ]);

    }
   
}