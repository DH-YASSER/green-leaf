<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\AdminLog; // Assuming we have an AdminLog model

class LogAdminAction
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Only log if the user is an admin and the request is within admin routes
        if (Auth::check() && Auth::user()->role === 'admin' && $request->is('api/admin/*')) {
            // Determine the action (route name) and target info
            $action = $request->route()->getName() ?: $request->method() . ' ' . $request->path();
            $target_type = null;
            $target_id = null;

            // Attempt to extract target type and ID from route parameters
            // This is a simple implementation; you might want to adjust based on your routes
            $routeParams = $request->route()->parameters();
            foreach ($routeParams as $key => $value) {
                if (preg_match('/(.+)_id$/', $key, $matches)) {
                    $target_type = $matches[1]; // e.g., 'user', 'product', 'order'
                    $target_id = $value;
                    break; // Use the first matched ID as target
                }
            }

            // If no specific target found, we can try to infer from the route
            // For simplicity, we'll leave target_type and target_id as null if not found.

            // Log the action
            AdminLog::create([
                'admin_id' => Auth::id(),
                'action' => $action,
                'target_type' => $target_type,
                'target_id' => $target_id,
            ]);
        }

        return $response;
    }
}