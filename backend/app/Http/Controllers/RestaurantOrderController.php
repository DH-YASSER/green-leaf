<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class RestaurantOrderController extends Controller
{
    /**
     * Place a new order.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = $request->user(); // Authenticated user

        // Ensure the user is a restaurant and is_verified (middleware should handle, but double-check)
        if ($user->role !== 'restaurant' || !$user->is_verified) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'fournisseur_id' => 'required|exists:users,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check that the fournisseur exists and is a fournisseur (role)
        $fournisseur = User::find($request->fournisseur_id);
        if (!$fournisseur || $fournisseur->role !== 'fournisseur') {
            return response()->json(['message' => 'Invalid fournisseur.'], 400);
        }

        // Start a database transaction
        return DB::transaction(function () use ($request, $user, $fournisseur) {
            try {
                $totalPrice = 0;
                $orderItemsData = [];

                // Validate each item and calculate total
                foreach ($request->items as $item) {
                    $product = Product::find($item['product_id']);

                    // Check if product exists, is active, and belongs to the fournisseur
                    if (!$product || !$product->is_active || $product->fournisseur_id !== $fournisseur->id) {
                        throw new \Exception("Invalid product: {$item['product_id']}");
                    }

                    // Check stock availability
                    if ($product->stock < $item['quantity']) {
                        throw new \Exception("Insufficient stock for product: {$product->name}");
                    }

                    // Check for active promotion
                    $promo = $product->activePromotion;
                    $unitPrice = $product->price;

                    if ($promo && $item['quantity'] >= $promo->min_qty) {
                        // Apply promotion
                        if ($promo->type === 'percentage') {
                            $unitPrice = $product->price * (1 - $promo->value / 100);
                        } elseif ($promo->type === 'fixed') {
                            $unitPrice = $product->price - $promo->value;
                        } // For 'bundle' and 'flash', we might need more logic, but we'll stick to percentage and fixed for now.
                        // Ensure unit price doesn't go below zero
                        $unitPrice = max($unitPrice, 0);
                    }

                    $totalPrice += $unitPrice * $item['quantity'];

                    $orderItemsData[] = [
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'unit_price' => round($unitPrice, 2),
                        'promo_id' => $promo ? $promo->id : null,
                    ];
                }

                // Create the order
                $order = Order::create([
                    'restaurant_id' => $user->id,
                    'fournisseur_id' => $fournisseur->id,
                    'status' => 'pending',
                    'total_price' => round($totalPrice, 2),
                    'notes' => $request->notes,
                ]);

                // Create order items and decrement stock
                foreach ($orderItemsData as $itemData) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $itemData['product_id'],
                        'quantity' => $itemData['quantity'],
                        'unit_price' => $itemData['unit_price'],
                        'promo_id' => $itemData['promo_id'],
                    ]);

                    // Decrement product stock
                    $product = Product::find($itemData['product_id']);
                    $product->decrement('stock', $itemData['quantity']);
                }

                // Refresh the order to load relationships
                $order->load([
                    'items.product',
                    'items.promotion',
                    'restaurant',
                    'fournisseur'
                ]);

                return response()->json([
                    'message' => 'Order placed successfully.',
                    'order' => $order
                ], 201);
            } catch (\Exception $e) {
                // If an exception occurs, the transaction will be rolled back automatically
                return response()->json(['message' => $e->getMessage()], 400);
            }
        });
    }

    /**
     * Display a listing of the authenticated restaurant's orders.
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

        $query = Order::where('restaurant_id', $user->id)
            ->with(['items.product', 'fournisseur']);

        // Filter by status if provided
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search by order ID or fournisseur name
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhereHas('fournisseur', function ($fq) use ($search) {
                      $fq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Sort
        $sortBy = $request->get('sort', 'newest');
        if ($sortBy === 'oldest') {
            $query->oldest();
        } elseif ($sortBy === 'price_high') {
            $query->orderBy('total_price', 'desc');
        } elseif ($sortBy === 'price_low') {
            $query->orderBy('total_price', 'asc');
        } else {
            $query->latest();
        }

        $orders = $query->paginate(15);

        return response()->json([
            'current_page' => $orders->currentPage(),
            'data' => $orders->getCollection()->map(function ($order) {
                return [
                    'id' => $order->id,
                    'fournisseur' => [
                        'id' => $order->fournisseur->id,
                        'name' => $order->fournisseur->name,
                    ],
                    'status' => $order->status,
                    'total_price' => $order->total_price,
                    'notes' => $order->notes,
                    'created_at' => $order->created_at,
                    'items' => $order->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product_name' => $item->product->name,
                            'quantity' => $item->quantity,
                            'unit_price' => $item->unit_price,
                            'promo_applied' => $item->promo_id ? true : false,
                        ];
                    }),
                ];
            }),
            'first_page_url' => $orders->url(1),
            'from' => $orders->firstItem(),
            'last_page' => $orders->lastPage(),
            'last_page_url' => $orders->url($orders->lastPage()),
            'next_page_url' => $orders->nextPageUrl(),
            'path' => $orders->path(),
            'per_page' => $orders->perPage(),
            'prev_page_url' => $orders->previousPageUrl(),
            'to' => $orders->lastItem(),
            'total' => $orders->total(),
        ]);
    }

    /**
     * Display the specified order.
     *
     * @param  int  $id
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function show($id, Request $request)
    {
        $user = $request->user(); // Authenticated user

        // Ensure the user is a restaurant and is_verified (middleware should handle)
        if ($user->role !== 'restaurant' || !$user->is_verified) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $order = Order::where('id', $id)
            ->where('restaurant_id', $user->id)
            ->with(['items.product', 'items.promotion', 'fournisseur'])
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        return response()->json([
            'id' => $order->id,
            'fournisseur' => [
                'id' => $order->fournisseur->id,
                'name' => $order->fournisseur->name,
                'city' => $order->fournisseur->city,
            ],
            'status' => $order->status,
            'total_price' => $order->total_price,
            'notes' => $order->notes,
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
            'items' => $order->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'price' => $item->product->price,
                        'unit' => $item->product->unit,
                    ],
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'promo' => $item->promotion ? [
                        'id' => $item->promotion->id,
                        'type' => $item->promotion->type,
                        'value' => $item->promotion->value,
                    ] : null,
                ];
            }),
        ]);
    }

    /**
     * Export orders as CSV spreadsheet.
     */
    public function exportCsv(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'restaurant' || !$user->is_verified) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $orders = Order::where('restaurant_id', $user->id)
            ->with(['items.product', 'fournisseur'])
            ->latest()
            ->get();

        $csvLines = [];
        $csvLines[] = ['Order ID', 'Date', 'Supplier', 'Status', 'Product', 'Qty', 'Unit Price', 'Line Total', 'Order Total'];

        foreach ($orders as $order) {
            $first = true;
            foreach ($order->items as $item) {
                $csvLines[] = [
                    $first ? $order->id : '',
                    $first ? $order->created_at->format('Y-m-d H:i') : '',
                    $first ? ($order->fournisseur->name ?? 'N/A') : '',
                    $first ? $order->status : '',
                    $item->product->name ?? 'N/A',
                    $item->quantity,
                    number_format($item->unit_price, 2),
                    number_format($item->quantity * $item->unit_price, 2),
                    $first ? number_format($order->total_price, 2) : '',
                ];
                $first = false;
            }
            if ($order->items->isEmpty()) {
                $csvLines[] = [$order->id, $order->created_at->format('Y-m-d H:i'), $order->fournisseur->name ?? 'N/A', $order->status, '', '', '', '', number_format($order->total_price, 2)];
            }
        }

        $callback = function () use ($csvLines) {
            $file = fopen('php://output', 'w');
            foreach ($csvLines as $line) {
                fputcsv($file, $line);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="orders_' . date('Y-m-d') . '.csv"',
        ]);
    }
}