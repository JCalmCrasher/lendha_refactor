<?php

return [

    /**
     * Username for CRC check API.
     *
     * Retrieved from the environment variable CRC_USERNAME.
     */
    'username' => env('CRC_USERNAME', ''),

    /**
     * Password for CRC check API.
     *
     * Retrieved from the environment variable CRC_PASSWORD.
     */
    'password' => env('CRC_PASSWORD', ''),

    /**
     * Base URL for CRC check API.
     *
     * Retrieved from the environment variable CRC_API_URL.
     */
    'url' => env('CRC_API_URL', ''),
];
