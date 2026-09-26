<?php

// Ensure writable storage directory in /tmp for Vercel Serverless environment
$storagePath = '/tmp/storage';
$storageDirs = [
    $storagePath.'/app/public',
    $storagePath.'/framework/cache/data',
    $storagePath.'/framework/sessions',
    $storagePath.'/framework/views',
    $storagePath.'/logs',
];

foreach ($storageDirs as $dir) {
    if (! is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

// Adjust script name so Laravel does not prepend /api to generated routes and URLs
$_SERVER['SCRIPT_NAME'] = '/index.php';

// Forward the request to Laravel front controller
require __DIR__.'/../public/index.php';
