<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsVerifiedMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $user = Auth::user();
        if (!$user->is_verified) {
            return response()->json(['message' => 'Account pending admin approval'], 403);
        }

        return $next($request);
    }
}