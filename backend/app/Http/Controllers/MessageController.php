<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    /**
     * Get a list of conversations for the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function conversations(Request $request)
    {
        $user = $request->user();

        // Get all users that the authenticated user has exchanged messages with
        $conversationUserIds = Message::where('sender_id', $user->id)
            ->orWhere('receiver_id', $user->id)
            ->get()
            ->map(function ($message) use ($user) {
                return $message->sender_id == $user->id ? $message->receiver_id : $message->sender_id;
            })
            ->unique();

        $conversations = [];

        foreach ($conversationUserIds as $otherUserId) {
            $otherUser = User::find($otherUserId);
            if (!$otherUser) {
                continue;
            }

            // Get the last message between the two users
            $lastMessage = Message::where(function ($query) use ($user, $otherUserId) {
                $query->where('sender_id', $user->id)
                    ->where('receiver_id', $otherUserId);
            })->orWhere(function ($query) use ($user, $otherUserId) {
                $query->where('sender_id', $otherUserId)
                    ->where('receiver_id', $user->id);
            })
                ->latest()
                ->first();

            // Count unread messages from the other user to the authenticated user
            $unreadCount = Message::where('sender_id', $otherUserId)
                ->where('receiver_id', $user->id)
                ->whereNull('read_at')
                ->count();

            $conversations[] = [
                'id' => $otherUser->id,
                'name' => $otherUser->name,
                'role' => $otherUser->role,
                'last_message' => $lastMessage ? $lastMessage->body : null,
                'last_message_time' => $lastMessage ? $lastMessage->created_at : null,
                'unread_count' => $unreadCount,
            ];
        }

        return response()->json($conversations);
    }

    /**
     * Get the message thread between the authenticated user and another user.
     *
     * @param  int  $userId
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function show($userId, Request $request)
    {
        $user = $request->user();

        // Check if the other user exists
        $otherUser = User::find($userId);
        if (!$otherUser) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // Get all messages between the two users, ordered by creation date
        $messages = Message::where(function ($query) use ($user, $userId) {
                $query->where('sender_id', $user->id)
                    ->where('receiver_id', $userId);
            })->orWhere(function ($query) use ($user, $userId) {
                $query->where('sender_id', $userId)
                    ->where('receiver_id', $user->id);
            })
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark messages from the other user to the authenticated user as read
        Message::where('sender_id', $userId)
            ->where('receiver_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json($messages->map(function ($message) {
            return [
                'id' => $message->id,
                'sender_id' => $message->sender_id,
                'receiver_id' => $message->receiver_id,
                'body' => $message->body,
                'created_at' => $message->created_at,
                'read_at' => $message->read_at,
            ];
        }));
    }

    /**
     * Send a new message.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'receiver_id' => 'required|exists:users,id',
            'body' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Prevent sending a message to oneself
        if ($request->receiver_id == $user->id) {
            return response()->json(['message' => 'You cannot send a message to yourself.'], 400);
        }

        $message = Message::create([
            'sender_id' => $user->id,
            'receiver_id' => $request->receiver_id,
            'body' => $request->body,
        ]);

        return response()->json([
            'id' => $message->id,
            'sender_id' => $message->sender_id,
            'receiver_id' => $message->receiver_id,
            'body' => $message->body,
            'created_at' => $message->created_at,
        ], 201);
    }

    /**
     * Get the total unread messages count for the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function unreadCount(Request $request)
    {
        $user = $request->user();

        $count = Message::where('receiver_id', $user->id)
            ->whereNull('read_at')
            ->count();

        return response()->json(['count' => $count]);
    }
}