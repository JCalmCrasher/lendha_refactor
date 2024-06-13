<?php

namespace App\Utilities;

use App\Utilities\ExternalApiCalls;

class SendSMS
{
    public static function send(Array $phone_numbers, String $message, String $sender = 'Lendha')
    {
        $user_name = getenv("SMS_USERNAME");
        $password = getenv("SMS_PASSWORD");
        $phones = implode(',', $phone_numbers);

        $response = ExternalApiCalls::send(
            'GET', 
            'http://portal.nigeriabulksms.com/api/?username='.$user_name.'&password='.$password.'&message='.$message.'&sender='.$sender.'&mobiles='.$phones, 
            ['Accept' => 'application/json']
        );

        if ($response['message'] == "success") {
            return json_decode($http_response['data']);
        }

        return "error";
    }
}
