<?php

namespace App\Http\Controllers\Fournisseur;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get the fournisseur dashboard statistics.
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

        // Total products
        $totalProducts = Product::where('fournisseur_id', $user->id)->count();

        // Active products
        $activeProducts = Product::where('fournisseur_id', $user->id)
            ->where('is_active', true)
            ->count();

        // Total orders (incoming)
        $totalOrders = Order::where('fournisseur_id', $user->id)->count();

        // Orders by status
        $ordersByStatus = Order::where('fournisseur_id', $user->id)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Ensure all statuses are present, even if zero
        $statuses = ['pending', 'confirmed', 'delivered', 'rejected'];
        foreach ($statuses as $status) {
            if (!isset($ordersByStatus[$status])) {
                $ordersByStatus[$status] = 0;
            }
        }

        // Total revenue (sum of total_price for delivered orders)
        $totalRevenue = Order::where('fournisseur_id', $user->id)
            ->where('status', 'delivered')
            ->sum('total_price');

        // Recent orders (last 5)
        $recentOrders = Order::where('fournisseur_id', $user->id)
            ->with(['restaurant:id,name'])
            ->latest()
            ->take(5)
            ->get(['id', 'restaurant_id', 'status', 'total_price', 'created_at']);

        // Format recent orders
        $formattedRecentOrders = $recentOrders->map(function ($order) {
            return [
                'id' => $order->id,
                'restaurant_name' => $order->restaurant->name ?? 'Unknown',
                'status' => $order->status,
                'total_price' => $order->total_price,
                'created_at' => $order->created_at,
            ];
        });

        // Orders this month
        $ordersThisMonth = Order::where('fournisseur_id', $user->id)
            ->where('created_at', '>=', Carbon::now()->startOfMonth())
            ->count();

        // Low stock products (stock < min_order_qty or stock < 5 as fallback)
        $lowStockProducts = Product::where('fournisseur_id', $user->id)
            ->where(function ($query) {
                $query->where('stock', '<', 'min_order_qty')
                    ->orWhere('stock', '<', 5);
            })
            ->get(['id', 'name', 'stock', 'min_order_qty'])
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'stock' => $product->stock,
                    'min_order_qty' => $product->min_order_qty,
                ];
            });

        return response()->json([
            'total_products' => $totalProducts,
            'active_products' => $activeProducts,
            'total_orders' => $totalOrders,
            'orders_by_status' => $ordersByStatus,
            'total_revenue' => $totalRevenue,
            'recent_orders' => $formattedRecentOrders,
            'orders_this_month' => $ordersThisMonth,
            'low_stock_products' => $lowStockProducts,
        ]);
    }
}