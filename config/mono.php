<?php

return [

    /**
     * Public key for Mono API.
     *
     * Retrieved from the environment variable MONO_PUBLIC_KEY.
     */
    'public_key' => env('MONO_PUBLIC_KEY', ''),

    /**
     * Secret key for Mono API.
     *
     * Retrieved from the environment variable MONO_SECRET_KEY.
     */
    'secret_key' => env('MONO_SECRET_KEY', ''),

    /**
     * Base URL for Mono API.
     *
     * Retrieved from the environment variable MONO_API_URL.
     */
    'url' => env('MONO_API_URL', ''),
];
