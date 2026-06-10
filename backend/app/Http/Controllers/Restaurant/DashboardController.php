<?php

namespace App\Http\Controllers\Restaurant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get the restaurant dashboard statistics.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user(); // Authenticated user

        // Ensure the user is a restaurant and is_verified (middleware should handle)
        if ($user->role !== 'restaurant' || !$user->is_verified) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Total orders for this restaurant
        $totalOrders = Order::where('restaurant_id', $user->id)->count();

        // Orders by status
        $ordersByStatus = Order::where('restaurant_id', $user->id)
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
        $totalRevenue = Order::where('restaurant_id', $user->id)
            ->where('status', 'delivered')
            ->sum('total_price');

        // Recent orders (last 5)
        $recentOrders = Order::where('restaurant_id', $user->id)
            ->with(['fournisseur:id,name'])
            ->latest()
            ->take(5)
            ->get(['id', 'fournisseur_id', 'status', 'total_price', 'created_at']);

        // Format recent orders
        $formattedRecentOrders = $recentOrders->map(function ($order) {
            return [
                'id' => $order->id,
                'fournisseur_name' => $order->fournisseur->name ?? 'Unknown',
                'status' => $order->status,
                'total_price' => $order->total_price,
                'created_at' => $order->created_at,
            ];
        });

        // Orders this month
        $ordersThisMonth = Order::where('restaurant_id', $user->id)
            ->where('created_at', '>=', Carbon::now()->startOfMonth())
            ->count();

        return response()->json([
            'total_orders' => $totalOrders,
            'orders_by_status' => $ordersByStatus,
            'total_revenue' => $totalRevenue,
            'recent_orders' => $formattedRecentOrders,
            'orders_this_month' => $ordersThisMonth,
        ]);
    }
}