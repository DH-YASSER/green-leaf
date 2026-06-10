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
                'name' => 'Fatima Zahra',
                'email' => 'fatima@fournisseur.ma',
                'phone' => '0612345678',
                'city' => 'Casablanca',
                'address' => '123 Rue Al iaqal, Maarif',
                'company_name' => 'Ferme Bio Atlas',
                'ice_number' => '00123456700012',
                'category' => 'fruits',
                'description' => 'Producteur de fruits et légumes biologiques certifiés',
            ],
            [
                'name' => 'Youssef El Amrani',
                'email' => 'youssef@fournisseur.ma',
                'phone' => '0623456789',
                'city' => 'Marrakech',
                'address' => '45 Avenue Mohammed V, Guéliz',
                'company_name' => 'Boucherie Centrale',
                'ice_number' => '00234567800023',
                'category' => 'viandes',
                'description' => 'Spécialiste de la viande halal premium',
            ],
            [
                'name' => 'Karim Bennani',
                'email' => 'karim@fournisseur.ma',
                'phone' => '0634567890',
                'city' => 'Rabat',
                'address' => '78 Rue des Consuls, Agdal',
                'company_name' => 'Épices du Maroc',
                'ice_number' => '00345678900034',
                'category' => 'epices',
                'description' => 'Importateur et distributeur d\'épices rares et précieux',
            ],
        ];

        $fournisseurs = [];
        foreach ($fournisseursData as $fournisseurData) {
            $user = User::create([
                'name' => $fournisseurData['name'],
                'email' => $fournisseurData['email'],
                'password' => Hash::make('password'),
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
                'name' => 'Le Taj Mahal',
                'email' => 'contact@letajmahal.ma',
                'phone' => '0522233445',
                'city' => 'Casablanca',
                'address' => '20 Rue Ibn Sina, Maarif',
                'cuisine_type' => 'Indien',
                'rc_patente' => 'RC123456',
            ],
            [
                'name' => 'La Maison Arabe',
                'email' => 'info@lamaisonarabe.ma',
                'phone' => '0524455667',
                'city' => 'Marrakech',
                'address' => '12 Derb Arjat, Medina',
                'cuisine_type' => 'Marocain traditionnel',
                'rc_patente' => 'RC234567',
            ],
            [
                'name' => 'Restaurant Al Fassia',
                'email' => 'reservations@alfassia.ma',
                'phone' => '0523344556',
                'city' => 'Rabat',
                'address' => '3 Avenue Hassan II, Agdal',
                'cuisine_type' => 'Franco-Marocain',
                'rc_patente' => 'RC345678',
            ],
        ];

        $restaurants = [];
        foreach ($restaurantsData as $restaurantData) {
            $user = User::create([
                'name' => $restaurantData['name'],
                'email' => $restaurantData['email'],
                'password' => Hash::make('password'),
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
            // Fatima Zahra - Fruits & Légumes (category 1)
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
            ],
            // Youssef El Amrani - Viandes & Poissons (category 2)
            [
                'name' => 'Filet de Bœuf Marocain',
                'description' => 'Filet de bœuf tendre et savoureux',
                'price' => 120.00,
                'unit' => 'kg',
                'min_order_qty' => 2,
                'stock' => 30,
                'delivery_zones' => ['Casablanca', 'Marrakech'],
                'delivery_delay' => 2,
                'is_active' => true,
                'category_id' => $categories[1]->id, // Viandes & Poissons
                'fournisseur_id' => $fournisseurs[1]->id,
            ],
            [
                'name' => 'Filet de Sardines Fraîches',
                'description' => 'Sardines fraîches pêchées ce matin',
                'price' => 25.00,
                'unit' => 'kg',
                'min_order_qty' => 5,
                'stock' => 80,
                'delivery_zones' => ['Casablanca'],
                'delivery_delay' => 1,
                'is_active' => true,
                'category_id' => $categories[1]->id,
                'fournisseur_id' => $fournisseurs[1]->id,
            ],
            // Karim Bennani - Épices & Condiments (category 3)
            [
                'name' => 'Safran du Taliouine',
                'description' => 'Safran premiun qualité de la région de Taliouine',
                'price' => 350.00,
                'unit' => 'g',
                'min_order_qty' => 1,
                'stock' => 20,
                'delivery_zones' => ['Casablanca', 'Rabat', 'Marrakech', 'Tanger'],
                'delivery_delay' => 3,
                'is_active' => true,
                'category_id' => $categories[2]->id, // Épices & Condiments
                'fournisseur_id' => $fournisseurs[2]->id,
            ],
            [
                'name' => 'Mélange Ras El Hanout',
                'description' => 'Épice traditionnelle marocaine composée de 20+ épices',
                'price' => 45.00,
                'unit' => '100g',
                'min_order_qty' => 2,
                'stock' => 60,
                'delivery_zones' => ['Tout le Maroc'],
                'delivery_delay' => 2,
                'is_active' => true,
                'category_id' => $categories[2]->id,
                'fournisseur_id' => $fournisseurs[2]->id,
            ],
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
            ],
            [
                'product_id' => $products[2]->id, // Filet de Bœuf Marocain
                'fournisseur_id' => $fournisseurs[1]->id,
                'type' => 'fixed',
                'value' => 10, // 10 MAD off per kg
                'min_qty' => 5,
                'start_date' => now()->subDays(5),
                'end_date' => now()->addDays(15),
                'usage_limit' => 30,
                'usage_count' => 8,
                'is_active' => true,
            ],
            [
                'product_id' => $products[4]->id, // Safran du Taliouine
                'fournisseur_id' => $fournisseurs[2]->id,
                'type' => 'percentage',
                'value' => 10, // 10% off
                'min_qty' => 5,
                'start_date' => now(),
                'end_date' => now()->addDays(20),
                'usage_limit' => 20,
                'usage_count' => 2,
                'is_active' => true,
            ],
        ];

        foreach ($promotionsData as $promoData) {
            Promotion::create($promoData);
        }

        // Create sample orders
        $ordersData = [
            [
                'restaurant_id' => $restaurants[0]->id, // Le Taj Mahal
                'fournisseur_id' => $fournisseurs[0]->id, // Fatima Zahra
                'status' => 'delivered',
                'total_price' => 425.00,
                'notes' => 'Livraison urgente pour service du soir',
            ],
            [
                'restaurant_id' => $restaurants[1]->id, // La Maison Arabe
                'fournisseur_id' => $fournisseurs[1]->id, // Youssef El Amrani
                'status' => 'confirmed',
                'total_price' => 680.00,
                'notes' => 'Préparer la viande pour grillades',
            ],
            [
                'restaurant_id' => $restaurants[2]->id, // Restaurant Al Fassia
                'fournisseur_id' => $fournisseurs[2]->id, // Karim Bennani
                'status' => 'pending',
                'total_price' => 225.00,
                'notes' => 'Première commande, vérifier la qualité',
            ],
        ];

        $orders = [];
        foreach ($ordersData as $orderData) {
            $orders[] = Order::create($orderData);
        }

        // Create sample order items
        $orderItemsData = [
            // Order 1: Le Taj Mahal from Fatima Zahra
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
            ],
            // Order 2: La Maison Arabe from Youssef El Amrani
            [
                'order_id' => $orders[1]->id,
                'product_id' => $products[2]->id, // Filet de Bœuf Marocain
                'quantity' => 5,
                'unit_price' => 120.00,
                'promo_id' => null, // Promotion requires min 10kg
            ],
            [
                'order_id' => $orders[1]->id,
                'product_id' => $products[3]->id, // Filet de Sardines Fraîches
                'quantity' => 10,
                'unit_price' => 25.00,
                'promo_id' => null,
            ],
            // Order 3: Restaurant Al Fassia from Karim Bennani
            [
                'order_id' => $orders[2]->id,
                'product_id' => $products[4]->id, // Safran du Taliouine
                'quantity' => 5,
                'unit_price' => 350.00,
                'promo_id' => null,
            ],
            [
                'order_id' => $orders[2]->id,
                'product_id' => $products[5]->id, // Mélange Ras El Hanout
                'quantity' => 10,
                'unit_price' => 45.00,
                'promo_id' => null,
            ],
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