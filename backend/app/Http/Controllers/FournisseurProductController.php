<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Http\Resources\ProductResource;

class FournisseurProductController extends Controller
{
    /**
     * Display a listing of the authenticated fournisseur's products.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user(); // Authenticated user

        // Ensure the user is a fournisseur
        if ($user->role !== 'fournisseur') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $query = Product::where('fournisseur_id', $user->id);

        // Filter by category if provided
        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }

        // Filter by is_active if provided
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $products = $query->with(['category', 'images', 'fournisseur'])->get();

        return ProductResource::collection($products);
    }

    /**
     * Store a newly created product in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = $request->user(); // Authenticated user

        // Ensure the user is a fournisseur
        if ($user->role !== 'fournisseur') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'unit' => 'required|in:kg,litre,caisse,piece',
            'min_order_qty' => 'required|integer|min:1',
            'stock' => 'required|integer|min:0',
            'delivery_zones' => 'nullable|array',
            'delivery_delay' => 'nullable|integer|min:0',
            'is_active' => 'sometimes|boolean',
            'images.*' => 'image|mimes:jpg,png,webp|max:2048', // 2MB max
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Limit to max 5 images
        if ($request->hasFile('images') && $request->file('images')->count() > 5) {
            return response()->json(['message' => 'You can upload a maximum of 5 images.'], 422);
        }

        // Create the product
        $product = Product::create([
            'fournisseur_id' => $user->id,
            'category_id' => $request->category_id,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'unit' => $request->unit,
            'min_order_qty' => $request->min_order_qty,
            'stock' => $request->stock,
            'delivery_zones' => $request->delivery_zones,
            'delivery_delay' => $request->delivery_delay,
            'is_active' => $request->is_active ?? true,
        ]);

        // Handle image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                // Store the image in the public disk under products directory
                $path = $image->store('products', 'public');

                // Create the product image record
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    // The first image is set as primary if no other primary is set
                    'is_primary' => !$product->images()->exists(),
                ]);
            }
        }

        // Refresh the product to load relationships
        $product->load('category', 'images', 'fournisseur');

        return response()->json(new ProductResource($product), 201);
    }

    /**
     * Update the specified product in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = $request->user(); // Authenticated user

        // Ensure the user is a fournisseur
        if ($user->role !== 'fournisseur') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Find the product and ensure it belongs to the authenticated fournisseur
        $product = Product::where('id', $id)
            ->where('fournisseur_id', $user->id)
            ->first();

        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'category_id' => 'sometimes|exists:categories,id',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'unit' => 'sometimes|in:kg,litre,caisse,piece',
            'min_order_qty' => 'sometimes|integer|min:1',
            'stock' => 'sometimes|integer|min:0',
            'delivery_zones' => 'sometimes|array',
            'delivery_delay' => 'sometimes|integer|min:0',
            'is_active' => 'sometimes|boolean',
            'images.*' => 'image|mimes:jpg,png,webp|max:2048', // 2MB max
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Limit to max 5 images (including existing ones)
        $currentImageCount = $product->images->count();
        $newImageCount = $request->hasFile('images') ? $request->file('images')->count() : 0;
        if (($currentImageCount + $newImageCount) > 5) {
            return response()->json(['message' => 'You can have a maximum of 5 images per product.'], 422);
        }

        // Update the product
        $product->update($request->only([
            'name',
            'category_id',
            'description',
            'price',
            'unit',
            'min_order_qty',
            'stock',
            'delivery_zones',
            'delivery_delay',
            'is_active',
        ]));

        // Handle new image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                // Store the image in the public disk under products directory
                $path = $image->store('products', 'public');

                // Create the product image record
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    // If no primary image exists, set the first uploaded as primary
                    'is_primary' => !$product->images()->exists(),
                ]);
            }
        }

        // Refresh the product to load relationships
        $product->load('category', 'images', 'fournisseur');

        return response()->json(new ProductResource($product));
    }

    /**
     * Remove the specified product from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = request()->user(); // Authenticated user

        // Ensure the user is a fournisseur
        if ($user->role !== 'fournisseur') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Find the product and ensure it belongs to the authenticated fournisseur
        $product = Product::where('id', $id)
            ->where('fournisseur_id', $user->id)
            ->first();

        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        // Delete associated images from storage
        foreach ($product->images as $image) {
            if (Storage::disk('public')->exists($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }
        }

        // Delete the product (images will be deleted via cascade or we can delete them manually)
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully.']);
    }

    /**
     * Toggle the active status of the specified product.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function toggleActive(Request $request, $id)
    {
        $user = $request->user(); // Authenticated user

        // Ensure the user is a fournisseur
        if ($user->role !== 'fournisseur') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Find the product and ensure it belongs to the authenticated fournisseur
        $product = Product::where('id', $id)
            ->where('fournisseur_id', $user->id)
            ->first();

        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        // Toggle the is_active field
        $product->is_active = !$product->is_active;
        $product->save();

        // Refresh the product to load relationships
        $product->load('category', 'images', 'fournisseur');

        return response()->json(new ProductResource($product));
    }
}