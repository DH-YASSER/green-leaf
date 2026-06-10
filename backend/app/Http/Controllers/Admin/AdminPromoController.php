<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Illuminate\Http\Request;

class AdminPromoController extends Controller
{
    public function index(Request $request)
    {
        $query = Promotion::with('product.fournisseur');

        // Optionally filter by is_active if needed
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $promotions = $query->get();

        return response()->json($promotions);
    }

    public function forceDisable($id)
    {
        $promotion = Promotion::findOrFail($id);
        $promotion->is_active = false;
        $promotion->save();

        return response()->json(['message' => 'Promotion disabled']);
    }
}