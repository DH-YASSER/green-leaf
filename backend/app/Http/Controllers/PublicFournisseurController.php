<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Support\Facades\DB;

class PublicFournisseurController extends Controller
{
    /**
     * Show a single fournisseur detail.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $fournisseur = User::with(['reviews', 'reviews.user'])
            ->where('id', $id)
            ->where('role', 'fournisseur')
            ->first();

        if (!$fournisseur) {
            return response()->json(['message' => 'Fournisseur not found.'], 404);
        }

        // Get products for this fournisseur
        $products = Product::where('fournisseur_id', $fournisseur->id)
            ->where('is_active', true)
            ->with(['category', 'images'])
            ->get();

        // Calculate average rating from reviews
        $avgRating = $fournisseur->reviews->avg('rating') ?? 0;
        $reviewCount = $fournisseur->reviews->count();

        return response()->json([
            'id' => $fournisseur->id,
            'name' => $fournisseur->name,
            'email' => $fournisseur->email,
            'city' => $fournisseur->city,
            'company_name' => $fournisseur->fournisseurProfile->company_name ?? null,
            'ice_number' => $fournisseur->fournisseurProfile->ice_number ?? null,
            'category' => $fournisseur->fournisseurProfile->category ?? null,
            'description' => $fournisseur->fournisseurProfile->description ?? null,
            'avg_rating' => round($avgRating, 2),
            'review_count' => $reviewCount,
            'is_verified' => $fournisseur->is_verified,
            'products' => $products->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'unit' => $product->unit,
                    'stock' => $product->stock,
                    'is_active' => $product->is_active,
                    'category' => [
                        'id' => $product->category->id,
                        'name' => $product->category->name,
                        'slug' => $product->category->slug,
                    ],
                    'images' => $product->images->map(function ($image) {
                        return [
                            'id' => $image->id,
                            'image_path' => $image->image_path,
                            'is_primary' => $image->is_primary,
                        ];
                    }),
                ];
            }),
        ]);
    }

    /**
     * Get products for a fournisseur.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function products($id)
    {
        $fournisseur = User::where('id', $id)
            ->where('role', 'fournisseur')
            ->first();

        if (!$fournisseur) {
            return response()->json(['message' => 'Fournisseur not found.'], 404);
        }

        $products = Product::where('fournisseur_id', $fournisseur->id)
            ->where('is_active', true)
            ->with(['category', 'images'])
            ->get();

        return response()->json($products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'unit' => $product->unit,
                'stock' => $product->stock,
                'is_active' => $product->is_active,
                'category' => [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                    'slug' => $product->category->slug,
                ],
                'images' => $product->images->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'image_path' => $image->image_path,
                        'is_primary' => $image->is_primary,
                    ];
                }),
                'active_promotion' => $product->activePromotion ? [
                    'id' => $product->activePromotion->id,
                    'type' => $product->activePromotion->type,
                    'value' => $product->activePromotion->value,
                    'min_qty' => $product->activePromotion->min_qty,
                ] : null,
            ];
        }));
    }
}