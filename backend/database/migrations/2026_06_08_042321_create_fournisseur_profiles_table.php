<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('fournisseur_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->string('company_name');
            $table->string('ice_number');
            $table->string('category');
            $table->text('description')->nullable();
            $table->decimal('avg_rating', 3, 2)->default(0.00);
            $table->integer('review_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fournisseur_profiles');
    }
};
