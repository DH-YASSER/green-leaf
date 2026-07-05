<?php

namespace App\Http\Controllers\Restaurant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

/**
 * Backs the buyer Account page (frontend: pages/Account.jsx).
 *
 * Assumes the `users` table (or a related `restaurant_profiles` table —
 * adjust the queries below to match your actual schema) has these columns:
 * business_name, contact_name, email, phone, address, region, bio,
 * avatar_url, and a notification_preferences JSON column.
 */
class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'business_name' => $user->business_name,
            'contact_name'  => $user->contact_name,
            'email'         => $user->email,
            'phone'         => $user->phone,
            'address'       => $user->address,
            'region'        => $user->region,
            'bio'           => $user->bio,
            'avatar_url'    => $user->avatar_url,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'business_name' => 'nullable|string|max:255',
            'contact_name'  => 'nullable|string|max:255',
            'email'         => 'nullable|email|max:255',
            'phone'         => 'nullable|string|max:30',
            'address'       => 'nullable|string|max:500',
            'region'        => 'nullable|string|max:120',
            'bio'           => 'nullable|string|max:1000',
        ]);

        $user = $request->user();
        $user->fill($data);
        $user->save();

        return response()->json(['message' => 'Profile updated']);
    }

    public function updatePassword(Request $request)
    {
        $data = $request->validate([
            'current_password' => 'required|string',
            'new_password'     => 'required|string|min:8|confirmed',
        ], [], ['new_password' => 'new password']);

        $user = $request->user();

        if (! Hash::check($data['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect.'],
            ]);
        }

        $user->password = Hash::make($data['new_password']);
        $user->save();

        return response()->json(['message' => 'Password updated']);
    }

    public function updateNotifications(Request $request)
    {
        $data = $request->validate([
            'order_updates' => 'boolean',
            'messages'      => 'boolean',
            'promos'        => 'boolean',
            'weekly'        => 'boolean',
        ]);

        $user = $request->user();
        $user->notification_preferences = $data;
        $user->save();

        return response()->json(['message' => 'Notification preferences updated']);
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|max:4096',
        ]);

        $path = $request->file('avatar')->store('avatars', 'public');
        $url = Storage::disk('public')->url($path);

        $user = $request->user();
        $user->avatar_url = $url;
        $user->save();

        return response()->json(['avatar_url' => $url]);
    }
}