<?php

namespace App\Http\Controllers;

use App\Models\LoanDetails;
use App\Notifications\WebNotification;
use Illuminate\Http\Request;
use App\Models\User;
use Auth;
use Exception;
use Illuminate\Notifications\DatabaseNotification;

class WebNotificationController extends Controller
{
  
    public function __construct()
    {
        // $this->middleware('auth');
    } 
  
    public function storeToken(Request $request)
    {
        try {
            Auth::user()->update([
                'firebase_web_device_key' => $request->token,
            ]);

            return response()->json(['Token successfully stored.']);
        } catch ( Exception $e ) {
            return response()->json(['Token not stored.']);
        }
    }

    public function getNotifications()
    {
        $notifications = Auth::user()->notifications;

        return response()->json([
            'data' => $notifications->map(function($item) {
                unset($item['type'], $item['notifiable_type'], $item['notifiable_id'], $item['updated_at'] );
                return $item;
            }),
            'message' => 'success'
        ]);
    }

    public function getAllNotifications()
    {
        $notifications = DatabaseNotification::all();

        return response()->json([
            'data' => $notifications->map(function($item) {
                unset($item['type'], $item['notifiable_type'], $item['notifiable_id'], $item['updated_at'] );
                return $item;
            }),
            'message' => 'success'
        ]);
    }

    public function markNotificationsAsRead()
    {
        foreach (Auth::user()->unreadNotifications as $notification) {
            $notification->markAsRead();
        }

        return response()->json([
            'data' => [],
            'message' => 'success'
        ]);
    }
    
    public function sendWebNotification(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'message' => 'required|string',
            'recipient_type' => 'required|in:custom,denied,approved,pending,completed',
            'recipient' => 'array',
            'message_type' => 'in:web,mobile,all'
        ]);

        $message = json_decode(json_encode([
            'title' => $request->title,
            'body' => $request->message,
        ]));

        switch ($request->recipient_type) {
            case 'custom':
                if (count($request->recipient) > 0) {
                    User::where('email', $request->recipient)->get()->each->notify(new WebNotification($message,$request->message_type ?? 'all'));
                    return response()->json([
                        'data' => [],
                        'message' => 'success'
                    ]);
                } else {
                    return response()->json([
                        'data' => [],
                        'message' => 'Recipient list cannot be empty'
                    ], 400);
                }
                break;
            case 'denied':
                LoanDetails::where('status', 'denied')->with('user')->get()->map(function($loan) use ($message, $request) {
                    if ($loan->user) $loan->user->notify(new WebNotification($message,$request->message_type ?? 'all'));
                });
                return response()->json([
                    'data' => [],
                    'message' => 'success'
                ]);
                break;
            case 'approved':
                LoanDetails::where('status', 'approved')->get()->map(function($loan) use ($message, $request) {
                    if ($loan->user) $loan->user->notify(new WebNotification($message,$request->message_type ?? 'all'));
                });
                return response()->json([
                    'data' => [],
                    'message' => 'success'
                ]);
                break;
            case 'pending':
                LoanDetails::where('status', 'pending')->get()->map(function($loan) use ($message, $request) {
                    if ($loan->user) $loan->user->notify(new WebNotification($message,$request->message_type ?? 'all'));
                });
                return response()->json([
                    'data' => [],
                    'message' => 'success'
                ]);
                break;
            case 'completed':
                LoanDetails::where('status', 'completed')->get()->map(function($loan) use ($message, $request) {
                    if ($loan->user) $loan->user->notify(new WebNotification($message,$request->message_type ?? 'all'));
                });
                return response()->json([
                    'data' => [],
                    'message' => 'success'
                ]);
                break;
            
            default:
                return response()->json([
                    'data' => [],
                    'message' => 'Error getting recipients'
                ], 400);
                break;
        }

        return response()->json([
            'data' => [],
            'message' => 'success'
        ]); 
    }


}