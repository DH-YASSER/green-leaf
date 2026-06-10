<?php

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Check If Application Is Under Maintenance
|--------------------------------------------------------------------------
|
| If the application is in maintenance / demo mode via the "down" command
| we will require the "down" file so that any previo us request is redirected
| to the /down URI. This prevents any hit to the application while it is
| in maintenance / demo mode. If the "down" file is expired, we'll simply
| delete the file.
|
*/

if (file_exists(__DIR__.'/../storage/framework/maintenance.php')) {
    require __DIR__.'/../storage/framework/maintenance.php';
}

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
|
| Composer provides a convenient, automatically generated class loader for
| our application. We just need to utilize it! We'll require it into
| the script here so that we don't need to worry about loading
| manual classes or anything along those lines.
|
*/

require __DIR__.'/../vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Run The Application
|--------------------------------------------------------------------------
|
| Once we have the application, we can handle the incoming request
| using the kernel's HTTP handle method. After that, we will emit the
| response and sent it back to the client's browser allowing them
| to enjoy the application we made for them.
|
*/

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Kernel::class);

$response = tap($kernel->handle(
    $request = Request::capture()
))->send();

$kernel->terminate($request, $response);