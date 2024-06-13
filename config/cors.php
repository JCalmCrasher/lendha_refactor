<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => [
        'api/onboarding_officer/*',
        'api/auth/*',
        'api/bank/*',
        'api/loan_interests',
        'api/referral_channel',
        'api/user/dashboard',
        'api/password/create',
        'api/branch/*',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [env('CORS_ALLOWED_ORIGINS', '*.lendha.com')],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
