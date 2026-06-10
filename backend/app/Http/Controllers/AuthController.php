<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\RestaurantProfile;
use App\Models\FournisseurProfile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    /**
     * Register a new user (restaurant or fournisseur) and create profile.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:restaurant,fournisseur',
            'phone' => 'nullable|string|max:20',
            'city' => 'required|string|max:255',
            'address' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors'=>$validator->errors()], 422);
        }

        // Role-specific validation
        if ($request->role === 'restaurant') {
            $validator = Validator::make($request->all(), [
                'cuisine_type' => 'required|string|max:255',
                'rc_patente' => 'required|string|max:255',
            ]);
        } else { // fournisseur
            $validator = Validator::make($request->all(), [
                'company_name' => 'required|string|max:255',
                'ice_number' => 'required|string|max:255',
                'category' => 'required|in:legumes,viandes,boissons,epices,produits_secs,other',
                'description' => 'nullable|string',
            ]);
        }

        if ($validator->fails()) {
            return response()->json(['errors'=>$validator->errors()], 422);
        }

        // Create user and profile in a transaction
        return \DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'phone' => $request->phone,
                'city' => $request->city,
                'address' => $request->address,
                'email_verified_at' => null, // Will be set when verified
                'is_verified' => false,
            ]);

            if ($request->role === 'restaurant') {
                RestaurantProfile::create([
                    'user_id' => $user->id,
                    'restaurant_name' => $request->name, // or maybe a separate field? We'll use name for simplicity as per req
                    'cuisine_type' => $request->cuisine_type,
                    'rc_patente' => $request->rc_patente,
                ]);
            } else {
                FournisseurProfile::create([
                    'user_id' => $user->id,
                    'company_name' => $request->company_name,
                    'ice_number' => $request->ice_number,
                    'category' => $request->category,
                    'description' => $request->description,
                    'avg_rating' => 0.00,
                    'review_count' => 0,
                ]);
            }

            // Send email verification (mock implementation)
            // In a real app, you would send a verification email.
            // For now, we'll just set the email_verified_at to null and is_verified to false.
            // You can implement your own email sending logic here.

            return response()->json([
                'message' => 'User registered successfully. Please verify your email.',
                'user' => $user->load('restaurantProfile','fournisseurProfile')
            ], 201);
        });
    }

    /**
     * Login user and create token.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        if (! $token = Auth::attempt($credentials)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Login admin user and create token.
     */
    public function adminLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        if (! $token = Auth::attempt($credentials)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Check if the authenticated user has the admin role
        if (Auth::user()->role !== 'admin') {
            Auth::logout(); // Clear the invalid token attempt
            return response()->json(['message' => 'Unauthorized. Admin role required.'], 403);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Logout user (invalidate token).
     */
    public function logout(Request $request)
    {
        Auth::logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Get the authenticated user.
     */
    public function me()
    {
        return response()->json(Auth::user()->load('restaurantProfile','fournisseurProfile'));
    }

    /**
     * Get the token array structure.
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::guard()->getTTL() * 60,
            'user' => Auth::user()->load('restaurantProfile','fournisseurProfile')
        ]);
    }
}