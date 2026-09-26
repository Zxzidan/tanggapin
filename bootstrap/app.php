<?php

use App\Http\Middleware\AutoAuthenticateRole;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

$app = Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');

        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            AutoAuthenticateRole::class,
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->render(function (Throwable $e, Request $request) {
            if ($e instanceof HttpExceptionInterface
                || $e instanceof ValidationException
                || $e instanceof AuthenticationException
                || $e instanceof AuthorizationException) {
                return null;
            }

            if ($request->query('debug') === '1') {
                return response(
                    '<h1>Application Error Detail</h1>'
                    .'<p><strong>Exception:</strong> '.htmlspecialchars(get_class($e)).'</p>'
                    .'<p><strong>Message:</strong> '.htmlspecialchars($e->getMessage()).'</p>'
                    .'<p><strong>File:</strong> '.htmlspecialchars($e->getFile().':'.$e->getLine()).'</p>'
                    ."<pre style='background:#f4f4f4;padding:12px;overflow:auto;'>".htmlspecialchars($e->getTraceAsString()).'</pre>',
                    500
                );
            }

            return null;
        });
    })->create();

$storagePath = env('APP_STORAGE_PATH', $_ENV['APP_STORAGE_PATH'] ?? $_SERVER['APP_STORAGE_PATH'] ?? null);
if (! $storagePath && (isset($_SERVER['VERCEL']) || isset($_ENV['VERCEL']) || is_dir('/tmp/storage'))) {
    $storagePath = '/tmp/storage';
}
if ($storagePath) {
    $app->useStoragePath($storagePath);
}

return $app;
