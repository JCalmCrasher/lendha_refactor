<?php

return [
    'url' => env('FRONTEND_PASSWORD_RESET_URL',
        env('FRONTEND_URL', 'https://lendha.com').'/reset'
    ),
];