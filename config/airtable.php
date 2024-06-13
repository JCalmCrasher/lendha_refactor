<?php

return [

    /**
     * Secret key for Airtable API.
     *
     * Retrieved from the environment variable AIRTABLE_SECRET_KEY.
     */
    'secret_key' => env('AIRTABLE_SECRET_KEY', ''),

    /**
     * Base ID for Airtable API.
     *
     * Retrieved from the environment variable AIRTABLE_BASE_ID.
     */
    'base_id' => env('AIRTABLE_BASE_ID', ''),

    /**
     * Base URL for Airtable API.
     *
     * Retrieved from the environment variable AIRTABLE_API_URL.
     */
    'url' => env('AIRTABLE_API_URL', ''),
];
