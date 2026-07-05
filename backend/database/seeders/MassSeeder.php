<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ensure categories exist
        $categoriesData = [
            'Fruits & Légumes', 'Viandes & Poissons', 'Épices & Condiments',
            'Produits Laitiers', 'Céréales & Légumineuses', 'Boissons', 'Boulangerie', 'Surgelés'
        ];

        $categories = [];
        foreach ($categoriesData as $cat) {
            $categories[] = Category::firstOrCreate(['slug' => Str::slug($cat)], ['name' => $cat]);
        }

        // 2. Create multiple fournisseurs
        $cities = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir'];
        $fournisseurs = [];

        for ($i = 1; $i <= 10; $i++) {
            $user = User::firstOrCreate(
                ['email' => "mass_supplier{$i}@demo.com"],
                [
                    'name' => "Supplier {$i}",
                    'password' => Hash::make('demo123'),
                    'phone' => '06' . rand(10000000, 99999999),
                    'city' => $cities[array_rand($cities)],
                    'address' => "Address {$i}",
                    'role' => 'fournisseur',
                    'is_verified' => true,
                    'email_verified_at' => now(),
                ]
            );

            \App\Models\FournisseurProfile::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'company_name' => "Grand Supplier {$i} SARL",
                    'ice_number' => 'ICE' . rand(100000000, 999999999),
                    'category' => 'general',
                    'description' => "Fournisseur de qualité pour restaurants",
                    'avg_rating' => rand(30, 50) / 10, // 3.0 to 5.0
                    'review_count' => rand(5, 150),
                ]
            );

            $fournisseurs[] = $user;
        }

        // 3. Generate 100-150 Products
        $adjectives = ['Premium', 'Frais', 'Bio', 'Local', 'Artisanal', 'Gourmet', 'Extra', 'Authentique'];
        $nouns = ['Tomates', 'Poulet', 'Huile d\'Olive', 'Fromage', 'Lait', 'Pain', 'Jus d\'Orange', 'Pommes', 'Oignons', 'Bœuf', 'Saumon', 'Crevettes', 'Miel', 'Café', 'Thé', 'Farine', 'Riz', 'Pâtes', 'Beurre'];
        $units = ['kg', 'L', 'pièce', 'carton', 'pack'];

        $totalProducts = 150;
        $productsToInsert = [];

        for ($i = 0; $i < $totalProducts; $i++) {
            $adj = $adjectives[array_rand($adjectives)];
            $noun = $nouns[array_rand($nouns)];
            $f = $fournisseurs[array_rand($fournisseurs)];
            $c = $categories[array_rand($categories)];
            
            $basePrice = rand(10, 500);

            $productsToInsert[] = [
                'name' => "{$adj} {$noun} " . rand(1, 100),
                'description' => "Produit de haute qualité: {$adj} {$noun}.",
                'price' => $basePrice,
                'unit' => $units[array_rand($units)],
                'min_order_qty' => rand(1, 10),
                'stock' => rand(20, 500),
                'delivery_zones' => json_encode([$f->city]),
                'delivery_delay' => rand(1, 5),
                'is_active' => true,
                'category_id' => $c->id,
                'fournisseur_id' => $f->id,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Insert in chunks
        $chunks = array_chunk($productsToInsert, 50);
        foreach ($chunks as $chunk) {
            Product::insert($chunk);
        }

        $this->command->info("Mass seeding completed! Created 10 suppliers and 150 products.");
    }
}
