<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\User;
use App\Models\Order;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Store a new review for a fournisseur by a restaurant.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = $request->user(); // Authenticated user

        // Ensure the user is a restaurant (middleware should handle)
        if ($user->role !== 'restaurant') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check that the order exists, is delivered, and belongs to the authenticated restaurant
        $order = Order::where('id', $request->order_id)
            ->where('restaurant_id', $user->id)
            ->where('status', 'delivered')
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found or not delivered.'], 404);
        }

        // Check if the user has already reviewed this order
        if (Review::where('order_id', $order->id)->exists()) {
            return response()->json(['message' => 'You have already reviewed this order.'], 400);
        }

        // Create the review
        $review = Review::create([
            'restaurant_id' => $user->id,
            'fournisseur_id' => $order->fournisseur_id,
            'order_id' => $order->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        // The update of the fournisseur's average rating and review count will be handled by an observer/event.

        return response()->json([
            'message' => 'Review created successfully.',
            'review' => $review
        ], 201);
    }

    /**
     * Display a listing of the reviews for a specific fournisseur.
     *
     * @param  int  $fournisseurId
     * @return \Illuminate\Http\Response
     */
    public function index($fournisseurId)
    {
        // Check if the fournisseur exists and is a fournisseur
        $fournisseur = User::where('id', $fournisseurId)
            ->where('role', 'fournisseur')
            ->first();

        if (!$fournisseur) {
            return response()->json(['message' => 'Fournisseur not found.'], 404);
        }

        $reviews = Review::where('fournisseur_id', $fournisseurId)
            ->with('restaurant') // Assuming we want to show who left the review
            ->latest()
            ->paginate(15);

        return response()->json([
            'current_page' => $reviews->currentPage(),
            'data' => $reviews->getCollection()->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'created_at' => $review->created_at,
                    'restaurant' => [
                        'id' => $review->restaurant->id,
                        'name' => $review->restaurant->name,
                    ],
                ];
            }),
            'first_page_url' => $reviews->url(1),
            'from' => $reviews->firstItem(),
            'last_page' => $reviews->lastPage(),
            'last_page_url' => $reviews->url($reviews->lastPage()),
            'next_page_url' => $reviews->nextPageUrl(),
            'path' => $reviews->path(),
            'per_page' => $reviews->perPage(),
            'prev_page_url' => $reviews->previousPageUrl(),
            'to' => $reviews->lastItem(),
            'total' => $reviews->total(),
        ]);
    }
}