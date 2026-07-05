<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user if it doesn't exist
        $admin = User::firstOrCreate(
            ['email' => 'admin@markeat.ma'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('Admin@123'),
                'role' => 'admin',
                'is_verified' => true,
                'email_verified_at' => now(),
            ]
        );

        // Create sample categories
        $categoriesData = [
            ['name' => 'Fruits & Légumes', 'slug' => 'fruits-legumes'],
            ['name' => 'Viandes & Poissons', 'slug' => 'viandes-poissons'],
            ['name' => 'Épices & Condiments', 'slug' => 'epices-condiments'],
            ['name' => 'Produits Laitiers', 'slug' => 'produits-laitiers'],
            ['name' => 'Céréales & Légumineuses', 'slug' => 'cereales-legumineuses'],
            ['name' => 'Boissons', 'slug' => 'boissons'],
        ];

        $categories = [];
        foreach ($categoriesData as $categoryData) {
            $categories[] = Category::create($categoryData);
        }

        // Create sample fournisseur users and profiles
        $fournisseursData = [
            [
                'name' => 'Demo Fournisseur',
                'email' => 'fournisseur@demo.com',
                'phone' => '0600000000',
                'city' => 'Casablanca',
                'address' => 'Demo Address',
                'company_name' => 'Demo Supplier Inc',
                'ice_number' => '00000000000000',
                'category' => 'fruits',
                'description' => 'Compte de démonstration fournisseur',
            ]
        ];

        $fournisseurs = [];
        foreach ($fournisseursData as $fournisseurData) {
            $user = User::create([
                'name' => $fournisseurData['name'],
                'email' => $fournisseurData['email'],
                'password' => Hash::make('demo123'),
                'phone' => $fournisseurData['phone'],
                'city' => $fournisseurData['city'],
                'address' => $fournisseurData['address'],
                'role' => 'fournisseur',
                'is_verified' => true,
                'email_verified_at' => now(),
            ]);

            // Create fournisseur profile
            \App\Models\FournisseurProfile::create([
                'user_id' => $user->id,
                'company_name' => $fournisseurData['company_name'],
                'ice_number' => $fournisseurData['ice_number'],
                'category' => $fournisseurData['category'],
                'description' => $fournisseurData['description'],
                'avg_rating' => rand(35, 50) / 10, // 3.5 to 5.0
                'review_count' => rand(10, 50),
            ]);

            $fournisseurs[] = $user;
        }

        // Create sample restaurant users and profiles
        $restaurantsData = [
            [
                'name' => 'Demo Restaurant',
                'email' => 'restaurant@demo.com',
                'phone' => '0500000000',
                'city' => 'Casablanca',
                'address' => 'Demo Address',
                'cuisine_type' => 'Internationale',
                'rc_patente' => 'RC000000',
            ]
        ];

        $restaurants = [];
        foreach ($restaurantsData as $restaurantData) {
            $user = User::create([
                'name' => $restaurantData['name'],
                'email' => $restaurantData['email'],
                'password' => Hash::make('demo123'),
                'phone' => $restaurantData['phone'],
                'city' => $restaurantData['city'],
                'address' => $restaurantData['address'],
                'role' => 'restaurant',
                'is_verified' => true,
                'email_verified_at' => now(),
            ]);

            // Create restaurant profile
            \App\Models\RestaurantProfile::create([
                'user_id' => $user->id,
                'restaurant_name' => $restaurantData['name'],
                'cuisine_type' => $restaurantData['cuisine_type'],
                'rc_patente' => $restaurantData['rc_patente'],
            ]);

            $restaurants[] = $user;
        }

        // Create sample products for each fournisseur
        $productsData = [
            // Demo Fournisseur - Fruits & Légumes (category 1)
            [
                'name' => 'Oranges Marocaines',
                'description' => 'Oranges juteuses et sucrées du Maroc',
                'price' => 8.50,
                'unit' => 'kg',
                'min_order_qty' => 5,
                'stock' => 100,
                'delivery_zones' => ['Casablanca', 'Rabat', 'Marrakech'],
                'delivery_delay' => 2,
                'is_active' => true,
                'category_id' => $categories[0]->id, // Fruits & Légumes
                'fournisseur_id' => $fournisseurs[0]->id,
            ],
            [
                'name' => 'Tomates Cerises Bio',
                'description' => 'Tomates cerises cultivées sans pesticides',
                'price' => 15.00,
                'unit' => 'kg',
                'min_order_qty' => 3,
                'stock' => 50,
                'delivery_zones' => ['Casablanca', 'Rabat'],
                'delivery_delay' => 1,
                'is_active' => true,
                'category_id' => $categories[0]->id,
                'fournisseur_id' => $fournisseurs[0]->id,
            ]
        ];

        $products = [];
        foreach ($productsData as $productData) {
            $products[] = Product::create($productData);
        }

        // Create sample promotions
        $promotionsData = [
            [
                'product_id' => $products[0]->id, // Oranges Marocaines
                'fournisseur_id' => $fournisseurs[0]->id,
                'type' => 'percentage',
                'value' => 15, // 15% off
                'min_qty' => 10,
                'start_date' => now()->subDays(2),
                'end_date' => now()->addDays(10),
                'usage_limit' => 50,
                'usage_count' => 5,
                'is_active' => true,
            ]
        ];

        foreach ($promotionsData as $promoData) {
            Promotion::create($promoData);
        }

        // Create sample orders
        $ordersData = [
            [
                'restaurant_id' => $restaurants[0]->id, // Demo Restaurant
                'fournisseur_id' => $fournisseurs[0]->id, // Demo Fournisseur
                'status' => 'delivered',
                'total_price' => 425.00,
                'notes' => 'Livraison urgente pour service du soir',
            ]
        ];

        $orders = [];
        foreach ($ordersData as $orderData) {
            $orders[] = Order::create($orderData);
        }

        // Create sample order items
        $orderItemsData = [
            // Order 1: Demo Restaurant from Demo Fournisseur
            [
                'order_id' => $orders[0]->id,
                'product_id' => $products[0]->id, // Oranges Marocaines
                'quantity' => 30,
                'unit_price' => 8.50,
                'promo_id' => null, // No promotion applied (less than min_qty for promo)
            ],
            [
                'order_id' => $orders[0]->id,
                'product_id' => $products[1]->id, // Tomates Cerises Bio
                'quantity' => 20,
                'unit_price' => 15.00,
                'promo_id' => null,
            ]
        ];

        foreach ($orderItemsData as $orderItemData) {
            OrderItem::create($orderItemData);
        }

        // Update product stock based on orders
        foreach ($orderItemsData as $orderItemData) {
            $product = Product::find($orderItemData['product_id']);
            if ($product) {
                $product->decrement('stock', $orderItemData['quantity']);
            }
        }

        $this->command->info('Database seeded successfully with sample Markeat data!');
    }
}