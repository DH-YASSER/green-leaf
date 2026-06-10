<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['restaurant', 'fournisseur', 'items.product']);

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range if provided
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
        }

        // Filter by restaurant if provided
        if ($request->has('restaurant_id')) {
            $query->where('restaurant_id', $request->restaurant_id);
        }

        // Filter by fourniseur if provided
        if ($request->has('fournisseur_id')) {
            $query->where('fournisseur_id', $request->fournisseur_id);
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($orders);
    }

    public function show($id)
    {
        $order = Order::with(['restaurant', 'fournisseur', 'items.product'])->findOrFail($id);
        return response()->json($order);
    }
}