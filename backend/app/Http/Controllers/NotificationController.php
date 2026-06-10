<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Get the authenticated user's unread notifications.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $notifications = $user->unreadNotifications;

        return response()->json($notifications);
    }

    /**
     * Mark a notification as read.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function markAsRead(Request $request, $id)
    {
        $user = $request->user();

        $notification = $user->notifications()->find($id);

        if (!$notification) {
            return response()->json(['message' => 'Notification not found.'], 404);
        }

        $notification->markAsRead();

        return response()->json(['message' => 'Notification marked as read.']);
    }
}