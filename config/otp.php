<?php

return [
    /*
    |--------------------------------------------------------------------------
    | PIN ATTEMPTS
    |--------------------------------------------------------------------------
    |
    | The number of times the the OTP should be attempted
    |
    */
    'pin_attempts' => env('OTP_PIN_ATTEMPTS', 3),

    /*
    |--------------------------------------------------------------------------
    | PIN EXPIRY (In Minutes)
    |--------------------------------------------------------------------------
    |
    | How long should the OTP last before expiring
    |
    */
    'pin_expiry' => env('OTP_PIN_EXPIRY', 2),

    /*
    |--------------------------------------------------------------------------
    | PIN LENGTH
    |--------------------------------------------------------------------------
    |
    | How many characters should the OTP have
    |
    */
    'pin_length' => env('OTP_PIN_LENGTH', 6),

    /*
    |--------------------------------------------------------------------------
    | PIN TYPE
    |--------------------------------------------------------------------------
    |
    | Should the OTP be NUMERIC or ALPHANUMERIC
    |
    */
    'pin_type' => "ALPHANUMERIC"
];