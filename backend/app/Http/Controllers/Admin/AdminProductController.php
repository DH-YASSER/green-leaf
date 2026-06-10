<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('fournisseur');

        // Filter by category if provided
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by is_active if provided
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $products = $query->get();

        return response()->json($products);
    }

    public function forceDeactivate($id)
    {
        $product = Product::findOrFail($id);
        $product->is_active = false;
        $product->save();

        return response()->json(['message' => 'Product deactivated']);
    }
}