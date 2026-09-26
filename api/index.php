<?php

// Ensure writable storage directory in /tmp for Vercel Serverless environment
$storagePath = '/tmp/storage';
$storageDirs = [
    $storagePath.'/app/public',
    $storagePath.'/framework/cache/data',
    $storagePath.'/framework/sessions',
    $storagePath.'/framework/views',
    $storagePath.'/logs',
    $storagePath.'/bootstrap/cache',
];

foreach ($storageDirs as $dir) {
    if (! is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

// Redirect storage and bootstrap caches to writable /tmp
putenv('APP_STORAGE_PATH='.$storagePath);
$_ENV['APP_STORAGE_PATH'] = $storagePath;
$_SERVER['APP_STORAGE_PATH'] = $storagePath;

putenv('VIEW_COMPILED_PATH='.$storagePath.'/framework/views');
$_ENV['VIEW_COMPILED_PATH'] = $storagePath.'/framework/views';

putenv('APP_SERVICES_CACHE='.$storagePath.'/bootstrap/cache/services.php');
putenv('APP_PACKAGES_CACHE='.$storagePath.'/bootstrap/cache/packages.php');
putenv('APP_CONFIG_CACHE='.$storagePath.'/bootstrap/cache/config.php');
putenv('APP_ROUTES_CACHE='.$storagePath.'/bootstrap/cache/routes-v7.php');
putenv('APP_EVENTS_CACHE='.$storagePath.'/bootstrap/cache/events.php');
$_ENV['APP_SERVICES_CACHE'] = $storagePath.'/bootstrap/cache/services.php';
$_ENV['APP_PACKAGES_CACHE'] = $storagePath.'/bootstrap/cache/packages.php';
$_ENV['APP_CONFIG_CACHE'] = $storagePath.'/bootstrap/cache/config.php';
$_ENV['APP_ROUTES_CACHE'] = $storagePath.'/bootstrap/cache/routes-v7.php';
$_ENV['APP_EVENTS_CACHE'] = $storagePath.'/bootstrap/cache/events.php';

// Adjust script name so Laravel does not prepend /api to generated routes and URLs
$_SERVER['SCRIPT_NAME'] = '/index.php';

// Forward the request to Laravel front controller
try {
    require __DIR__.'/../public/index.php';
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: text/html');
    echo '<h1>Fatal Startup Error</h1>';
    echo '<p><strong>Class:</strong> '.htmlspecialchars(get_class($e)).'</p>';
    echo '<p><strong>Message:</strong> '.htmlspecialchars($e->getMessage()).'</p>';
    echo '<p><strong>Location:</strong> '.htmlspecialchars($e->getFile().':'.$e->getLine()).'</p>';
    echo "<pre style='background:#f4f4f4;padding:12px;overflow:auto;'>".htmlspecialchars($e->getTraceAsString()).'</pre>';
    exit(1);
}
