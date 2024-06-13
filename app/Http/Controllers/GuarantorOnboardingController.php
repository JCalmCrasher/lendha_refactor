<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class GuarantorOnboardingController extends Controller
{
    public function save_video(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'video' => 'required|file|mimes:mp4,mpeg,avi,webm,mov',
        ]);

        $user = User::find($request->user_id);
        
        $videoName = time().'.'.$request->video->extension();
        $videoPath = 'uploads/'.$request->user_id.'/guarantor_video';
        $request->video->move(public_path($videoPath), $videoName);


        $user->guarantor()->update([
            'video' => $videoPath.'/'.$videoName
        ]);

        return response()->json([
            'data' => [],
            'message' => 'Video uploaded successfully',
            'status' => true
        ]);
    }
}
