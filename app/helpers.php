<?php

use Illuminate\Support\Facades\Http;
use Illuminate\Support\HtmlString;

function vite_assets(): HtmlString
{
    $devServerIsRunning = false;

    if (app()->environment('local')) {
        try {
            Http::get("http://localhost:5173");
            $devServerIsRunning = true;
        } catch (Exception) {
        }
    }

    if ($devServerIsRunning) {
        // load the entry files here
        return new HtmlString(<<<HTML
            <script type="module" src="http://localhost:5173/@vite/client"></script>
            <script type="module" src="http://localhost:5173/resources/js/main.js"></script>
            <link rel="stylesheet" href="http://localhost:5173/resources/css/app.css" rel="preload" as="style" fetchpriority="low" onload="this.onload=null;this.rel='stylesheet'">
        HTML);
    }

    $manifest = json_decode(file_get_contents(
        public_path('build/manifest.json')
    ), true);

    return new HtmlString(<<<HTML
        <link rel="stylesheet" href="/build/{$manifest['resources/js/main.js']['css'][0]}">
        <script type="module" src="/build/{$manifest['resources/js/main.js']['file']}"></script>
    HTML);
}
