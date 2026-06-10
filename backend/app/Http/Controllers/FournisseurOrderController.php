<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Notification;
use App\Notifications\NewOrderNotification;
use App\Notifications\OrderStatusNotification;

class FournisseurOrderController extends Controller
{
    /**
     * Display a listing of the authenticated fournisseur's incoming orders.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user(); // Authenticated user

        // Ensure the user is a fournisseur (middleware should handle)
        if ($user->role !== 'fournisseur') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $query = Order::where('fournisseur_id', $user->id)
            ->with(['items.product', 'restaurant']);

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->latest()->paginate(15);

        return response()->json([
            'current_page' => $orders->currentPage(),
            'data' => $orders->getCollection()->map(function ($order) {
                return [
                    'id' => $order->id,
                    'restaurant' => [
                        'id' => $order->restaurant->id,
                        'name' => $order->restaurant->name,
                        'city' => $order->restaurant->city,
                    ],
                    'status' => $order->status,
                    'total_price' => $order->total_price,
                    'notes' => $order->notes,
                    'created_at' => $order->created_at,
                    'items_count' => $order->items->sum('quantity'),
                ];
            }),
            'first_page_url' => $orders->url(1),
            'from' => $orders->firstItem(),
            'last_page' => $orders->lastPage(),
            'last_page_url' => $orders->url($orders->lastPage()),
            'next_page_url' => $orders->nextPageUrl(),
            'path' => $orders->path(),
            'per_page' => $orders->perPage(),
            'prev_page_url' => $orders->previousPageUrl(),
            'to' => $orders->lastItem(),
            'total' => $orders->total(),
        ]);
    }

    /**
     * Display the specified order.
     *
     * @param  int  $id
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function show($id, Request $request)
    {
        $user = $request->user(); // Authenticated user

        // Ensure the user is a fournisseur (middleware should handle)
        if ($user->role !== 'fournisseur') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $order = Order::where('id', $id)
            ->where('fournisseur_id', $user->id)
            ->with(['items.product', 'items.promotion', 'restaurant'])
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        return response()->json([
            'id' => $order->id,
            'restaurant' => [
                'id' => $order->restaurant->id,
                'name' => $order->restaurant->name,
                'city' => $order->restaurant->city,
                'is_verified' => $order->restaurant->is_verified,
            ],
            'status' => $order->status,
            'total_price' => $order->total_price,
            'notes' => $order->notes,
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
            'items' => $order->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'price' => $item->product->price,
                        'unit' => $item->product->unit,
                    ],
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'promo_applied' => $item->promo_id ? true : false,
                ];
            }),
        ]);
    }

    /**
     * Update the status of the specified order.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateStatus(Request $request, $id)
    {
        $user = $request->user(); // Authenticated user

        // Ensure the user is a fournisseur (middleware should handle)
        if ($user->role !== 'fournisseur') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $order = Order::where('id', $id)
            ->where('fournisseur_id', $user->id)
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => [
                'required',
                'string',
                Rule::in(['pending', 'confirmed', 'rejected', 'delivered']),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $newStatus = $request->status;
        $currentStatus = $order->status;

        // Validate status transition
        $allowedTransitions = [
            'pending' => ['confirmed', 'rejected'],
            'confirmed' => ['delivered'],
            'rejected' => [], // Once rejected, cannot change
            'delivered' => [], // Once delivered, cannot change
        ];

        if (!in_array($newStatus, $allowedTransitions[$currentStatus] ?? [])) {
            return response()->json([
                'message' => "Invalid status transition from {$currentStatus} to {$newStatus}."
            ], 400);
        }

        // Update the order status
        $order->status = $newStatus;
        $order->save();

        // Send notification to the restaurant about the status update
        Notification::send($order->restaurant, new OrderStatusNotification($order));

        return response()->json([
            'message' => 'Order status updated successfully.',
            'order' => $order->only(['id', 'status'])
        ]);
    }
}