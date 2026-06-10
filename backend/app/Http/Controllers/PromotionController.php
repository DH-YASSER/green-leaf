<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Promotion;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Gate;
use App\Services\PromotionService;

class PromotionController extends Controller
{
    protected $promotionService;

    public function __construct(PromotionService $promotionService)
    {
        $this->promotionService = $promotionService;
    }

    /**
     * Display a listing of the authenticated fournisseur's promotions.
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

        $query = Promotion::where('fournisseur_id', $user->id)
            ->with('product');

        // We can add filters if needed, but the task says to include status (active/expired/disabled)
        // We'll compute the status in the response.

        $promotions = $query->get();

        return response()->json($promotions->map(function ($promo) {
            $now = now();
            $isActive = $promo->is_active &&
                $now->greaterThanOrEqualTo($promo->start_date) &&
                $now->lessThanOrEqualTo($promo->end_date) &&
                ($promo->usage_limit === null || $promo->usage_count < $promo->usage_limit);

            $status = $promo->is_active ? ($isActive ? 'active' : 'expired') : 'disabled';

            return [
                'id' => $promo->id,
                'product_id' => $promo->product_id,
                'product_name' => $promo->product->name,
                'type' => $promo->type,
                'value' => $promo->value,
                'min_qty' => $promo->min_qty,
                'start_date' => $promo->start_date,
                'end_date' => $promo->end_date,
                'usage_limit' => $promo->usage_limit,
                'usage_count' => $promo->usage_count,
                'is_active' => $promo->is_active,
                'status' => $status,
            ];
        }));
    }

    /**
     * Store a newly created promotion in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = $request->user(); // Authenticated user

        // Ensure the user is a fournisseur (middleware should handle)
        if ($user->role !== 'fournisseur') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'type' => 'required|in:percentage,fixed,bundle,flash',
            'value' => 'required|numeric|min:0',
            'product_id' => 'required|exists:products,id',
            'min_qty' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'usage_limit' => 'nullable|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check that the product belongs to the authenticated fournisseur
        $product = Product::find($request->product_id);
        if (!$product || $product->fournisseur_id !== $user->id) {
            return response()->json(['message' => 'Invalid product.'], 400);
        }

        $promotion = Promotion::create([
            'fournisseur_id' => $user->id,
            'product_id' => $request->product_id,
            'type' => $request->type,
            'value' => $request->value,
            'min_qty' => $request->min_qty,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'usage_limit' => $request->usage_limit,
            'usage_count' => 0,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Promotion created successfully.',
            'promotion' => $promotion
        ], 201);
    }

    /**
     * Update the specified promotion in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = $request->user(); // Authenticated user

        // Ensure the user is a fournisseur (middleware should handle)
        if ($user->role !== 'fournisseur') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $promotion = Promotion::where('id', $id)
            ->where('fournisseur_id', $user->id)
            ->first();

        if (!$promotion) {
            return response()->json(['message' => 'Promotion not found.'], 404);
        }

        // Only allow update if the promotion has not started yet
        if (now()->greaterThan($promotion->start_date)) {
            return response()->json(['message' => 'Cannot update a promotion that has already started.'], 400);
        }

        $validator = Validator::make($request->all(), [
            'type' => 'sometimes|in:percentage,fixed,bundle,flash',
            'value' => 'sometimes|numeric|min:0',
            'min_qty' => 'sometimes|integer|min:1',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'usage_limit' => 'sometimes|integer|min:1',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $promotion->update($request->only([
            'type',
            'value',
            'min_qty',
            'start_date',
            'end_date',
            'usage_limit',
            'is_active',
        ]));

        return response()->json([
            'message' => 'Promotion updated successfully.',
            'promotion' => $promotion
        ]);
    }

    /**
     * Remove the specified promotion from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = request()->user(); // Authenticated user

        // Ensure the user is a fournisseur (middleware should handle)
        if ($user->role !== 'fournisseur') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $promotion = Promotion::where('id', $id)
            ->where('fournisseur_id', $user->id)
            ->first();

        if (!$promotion) {
            return response()->json(['message' => 'Promotion not found.'], 404);
        }

        $promotion->delete();

        return response()->json(['message' => 'Promotion deleted successfully.']);
    }

    /**
     * Toggle the active status of the specified promotion.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function toggle(Request $request, $id)
    {
        $user = $request->user(); // Authenticated user

        // Ensure the user is a fournisseur (middleware should handle)
        if ($user->role !== 'fournisseur') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $promotion = Promotion::where('id', $id)
            ->where('fournisseur_id', $user->id)
            ->first();

        if (!$promotion) {
            return response()->json(['message' => 'Promotion not found.'], 404);
        }

        // Toggle the is_active field
        $promotion->is_active = !$promotion->is_active;
        $promotion->save();

        return response()->json([
            'message' => 'Promotion status updated successfully.',
            'promotion' => $promotion
        ]);
    }
}