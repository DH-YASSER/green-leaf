<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminStatsController extends Controller
{
    /**
     * Get the admin dashboard statistics.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function dashboard(Request $request)
    {
        // Ensure the user is an admin (middleware should handle)
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Total restaurants (users with role=restaurant)
        $totalRestaurants = User::where('role', 'restaurant')->count();

        // Total fournisseurs (users with role=fournisseur)
        $totalFournisseurs = User::where('role', 'fournisseur')->count();

        // Pending verifications (users with is_verified=false and role in ['restaurant', 'fournisseur'])
        $pendingVerifications = User::whereIn('role', ['restaurant', 'fournisseur'])
            ->where('is_verified', false)
            ->count();

        // Total orders
        $totalOrders = Order::count();

        // Orders by status
        $ordersByStatus = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Ensure all statuses are present, even if zero
        $statuses = ['pending', 'confirmed', 'delivered', 'rejected', 'cancelled'];
        foreach ($statuses as $status) {
            if (!isset($ordersByStatus[$status])) {
                $ordersByStatus[$status] = 0;
            }
        }

        // New users this month (users created in the current month)
        $newUsersThisMonth = User::where('created_at', '>=', Carbon::now()->startOfMonth())
            ->count();

        // Top 5 fournisseurs by order count
        $topFournisseurs = User::where('role', 'fournisseur')
            ->select('users.id', 'users.name', DB::raw('count(orders.id) as order_count'))
            ->leftJoin('orders', 'users.id', '=', 'orders.fournisseur_id')
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('order_count')
            ->limit(5)
            ->get();

        // Total revenue (sum of total_price for delivered orders)
        $totalRevenue = Order::where('status', 'delivered')
            ->sum('total_price');

        return response()->json([
            'total_restaurants' => $totalRestaurants,
            'total_fournisseurs' => $totalFournisseurs,
            'pending_verifications' => $pendingVerifications,
            'total_orders' => $totalOrders,
            'orders_by_status' => $ordersByStatus,
            'new_users_this_month' => $newUsersThisMonth,
            'top_5_fournisseurs' => $topFournisseurs,
            'total_revenue' => $totalRevenue,
        ]);
    }
}