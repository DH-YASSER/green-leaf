<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('fournisseur_profiles', function (Blueprint $table) {
            // Step 1 — shop page
            $table->string('profile_photo')->nullable()->after('description');
            $table->string('cover_photo')->nullable()->after('profile_photo');
            $table->json('certifications')->nullable()->after('cover_photo');

            // Step 2 — delivery & order preferences
            $table->decimal('first_order_minimum', 10, 2)->nullable()->after('certifications');
            $table->decimal('reorder_minimum', 10, 2)->nullable()->after('first_order_minimum');
            $table->json('delivery_zones')->nullable()->after('reorder_minimum');
            $table->unsignedSmallInteger('lead_time_days')->nullable()->after('delivery_zones');

            // Step 3 — verification documents
            $table->string('rc_document')->nullable()->after('lead_time_days');
            $table->string('ice_document')->nullable()->after('rc_document');

            // Wizard completion marker — lets the dashboard know whether to
            // keep prompting the fournisseur to finish setup.
            $table->timestamp('shop_setup_completed_at')->nullable()->after('ice_document');
        });
    }

    public function down(): void
    {
        Schema::table('fournisseur_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'profile_photo',
                'cover_photo',
                'certifications',
                'first_order_minimum',
                'reorder_minimum',
                'delivery_zones',
                'lead_time_days',
                'rc_document',
                'ice_document',
                'shop_setup_completed_at',
            ]);
        });
    }
};