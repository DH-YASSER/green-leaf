<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\RestaurantProfile;
use App\Models\FournisseurProfile;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;

class AdminUserController extends Controller
{
    /**
     * Display a listing of the users.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // Ensure the user is an admin (middleware should handle)
        // But we can double-check
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $query = User::with('restaurantProfile', 'fournisseurProfile');

        // Filter by role
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        // Filter by is_verified
        if ($request->has('is_verified')) {
            $query->where('is_verified', filter_var($request->is_verified, FILTER_VALIDATE_BOOLEAN));
        }

        // Filter by city (either in user's city or in profile's city? We'll use user's city)
        if ($request->has('city')) {
            $query->where('city', $request->city);
        }

        $users = $query->latest()->paginate(15);

        return response()->json([
            'current_page' => $users->currentPage(),
            'data' => $users->getCollection()->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'is_verified' => $user->is_verified,
                    'city' => $user->city,
                    'phone' => $user->phone,
                    'created_at' => $user->created_at,
                    'profile' => $user->role === 'restaurant' ? $user->restaurantProfile : ($user->role === 'fournisseur' ? $user->fournisseurProfile : null),
                ];
            }),
            'first_page_url' => $users->url(1),
            'from' => $users->firstItem(),
            'last_page' => $users->lastPage(),
            'last_page_url' => $users->url($users->lastPage()),
            'next_page_url' => $users->nextPageUrl(),
            'path' => $users->path(),
            'per_page' => $users->perPage(),
            'prev_page_url' => $users->previousPageUrl(),
            'to' => $users->lastItem(),
            'total' => $users->total(),
        ]);
    }

    /**
     * Display the specified user.
     *
     * @param  int  $id
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function show($id, Request $request)
    {
        // Ensure the user is an admin (middleware should handle)
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $user = User::with('restaurantProfile', 'fournisseurProfile')->find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'is_verified' => $user->is_verified,
            'email_verified_at' => $user->email_verified_at,
            'phone' => $user->phone,
            'city' => $user->city,
            'address' => $user->address,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
            'profile' => $user->role === 'restaurant' ? $user->restaurantProfile : ($user->role === 'fournisseur' ? $user->fournisseurProfile : null),
        ]);
    }

    /**
     * Verify the specified user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function verify(Request $request, $id)
    {
        // Ensure the user is an admin (middleware should handle)
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // Update the user to verified
        $user->update([
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);

        // Send email notification (we'll use a simple mail for now)
        // In a real app, you would use a mailable.
        // For now, we'll just log or we can use Mail::raw.
        // We'll just return a success message.

        return response()->json([
            'message' => 'User verified successfully.',
            'user' => $user->only(['id', 'is_verified', 'email_verified_at'])
        ]);
    }

    /**
     * Ban the specified user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function ban(Request $request, $id)
    {
        // Ensure the user is an admin (middleware should handle)
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $user->update([
            'is_active' => false,
        ]);

        return response()->json([
            'message' => 'User banned successfully.',
            'user' => $user->only(['id', 'is_active'])
        ]);
    }

    /**
     * Unban the specified user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function unban(Request $request, $id)
    {
        // Ensure the user is an admin (middleware should handle)
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $user->update([
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'User unbanned successfully.',
            'user' => $user->only(['id', 'is_active'])
        ]);
    }
}