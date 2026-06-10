<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PublicProductController extends Controller
{
    /**
     * Browse products with filters and sorting.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function browse(Request $request)
    {
        $query = Product::where('is_active', true)
            ->with(['fournisseur', 'category', 'images']);

        // Filter by category
        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filter by city (via fournisseur)
        if ($request->has('city')) {
            $query->whereHas('fournisseur', function ($q) use ($request) {
                $q->where('city', $request->city);
            });
        }

        // Filter by price range
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Filter by is_verified_only (on fournisseur)
        if ($request->has('is_verified_only') && filter_var($request->is_verified_only, FILTER_VALIDATE_BOOLEAN)) {
            $query->whereHas('fournisseur', function ($q) {
                $q->where('is_verified', true);
            });
        }

        // Filter by min_rating
        if ($request->has('min_rating')) {
            $minRating = $request->min_rating;
            $query->whereHas('fournisseur', function ($q) use ($minRating) {
                $q->whereExists(function ($query) use ($minRating) {
                    $query->select(DB::raw(1))
                        ->from('reviews')
                        ->whereColumn('reviews.fournisseur_id', 'users.id')
                        ->groupBy('reviews.fournisseur_id')
                        ->havingRaw('AVG(rating) >= ?', [$minRating]);
                });
            });
        }

        // Sorting
        $sortBy = $request->sort_by ?? 'newest';
        switch ($sortBy) {
            case 'rating':
                // We'll sort by the average rating of the fournisseur (descending)
                $query->orderByDesc(DB::raw('(SELECT AVG(rating) FROM reviews WHERE reviews.fournisseur_id = users.id)'));
                break;
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        // Paginate
        $products = $query->paginate(15);

        // We'll return a custom structure for each product
        return response()->json([
            'current_page' => $products->currentPage(),
            'data' => $products->getCollection()->map(function ($product) {
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
                    'fournisseur' => [
                        'id' => $product->fournisseur->id,
                        'name' => $product->fournisseur->name,
                        'city' => $product->fournisseur->city,
                        'avg_rating' => $product->fournisseur->reviews ? $product->fournisseur->reviews->avg('rating') : 0,
                        'is_verified' => $product->fournisseur->is_verified,
                        'verified_badge' => $product->fournisseur->is_verified ? 'verified' : null,
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
            }),
            'first_page_url' => $products->url(1),
            'from' => $products->firstItem(),
            'last_page' => $products->lastPage(),
            'last_page_url' => $products->url($products->lastPage()),
            'links' => $products->toArray()['links'],
            'next_page_url' => $products->nextPageUrl(),
            'path' => $products->path(),
            'per_page' => $products->perPage(),
            'prev_page_url' => $products->previousPageUrl(),
            'to' => $products->lastItem(),
            'total' => $products->total(),
        ]);
    }

    /**
     * Show a single product detail.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $product = Product::with(['fournisseur', 'category', 'images', 'activePromotion'])
            ->where('id', $id)
            ->where('is_active', true)
            ->first();

        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        return response()->json([
            'id' => $product->id,
            'name' => $product->name,
            'description' => $product->description,
            'price' => $product->price,
            'unit' => $product->unit,
            'stock' => $product->stock,
            'is_active' => $product->is_active,
            'category' => [
                'id' => $product->category->id,
                'name' => $product->category->name,
                'slug' => $product->category->slug,
            ],
            'fournisseur' => [
                'id' => $product->fournisseur->id,
                'name' => $product->fournisseur->name,
                'city' => $product->fournisseur->city,
                'avg_rating' => $product->fournisseur->reviews ? $product->fournisseur->reviews->avg('rating') : 0,
                'review_count' => $product->fournisseur->reviews ? $product->fournisseur->reviews->count() : 0,
                'is_verified' => $product->fournisseur->is_verified,
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
                'start_date' => $product->activePromotion->start_date,
                'end_date' => $product->activePromotion->end_date,
            ] : null,
        ]);
    }

    /**
     * Search products by name or description.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:1',
        ]);

        $searchTerm = $request->q;

        $products = Product::where('is_active', true)
            ->where(function ($query) use ($searchTerm) {
                $query->where('name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('description', 'like', '%' . $searchTerm . '%');
            })
            ->with(['fournisseur', 'category', 'images'])
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
                'fournisseur' => [
                    'id' => $product->fournisseur->id,
                    'name' => $product->fournisseur->name,
                    'city' => $product->fournisseur->city,
                    'avg_rating' => $product->fournisseur->reviews ? $product->fournisseur->reviews->avg('rating') : 0,
                    'is_verified' => $product->fournisseur->is_verified,
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

    /**
     * Get the active promotion for a product.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getPromo($id)
    {
        $product = Product::with('activePromotion')
            ->where('id', $id)
            ->where('is_active', true)
            ->first();

        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        if (!$product->activePromotion) {
            return response()->json(['message' => 'No active promotion for this product.'], 404);
        }

        return response()->json([
            'id' => $product->activePromotion->id,
            'type' => $product->activePromotion->type,
            'value' => $product->activePromotion->value,
            'min_qty' => $product->activePromotion->min_qty,
            'start_date' => $product->activePromotion->start_date,
            'end_date' => $product->activePromotion->end_date,
            'usage_limit' => $product->activePromotion->usage_limit,
            'usage_count' => $product->activePromotion->usage_count,
        ]);
    }
}