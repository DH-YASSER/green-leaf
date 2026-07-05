<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favorite_boards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index('user_id');
        });

        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('board_id')->nullable()->constrained('favorite_boards')->onDelete('set null');
            $table->timestamps();

            $table->unique(['user_id', 'product_id']);
            $table->index('board_id');
        });

        Schema::create('followed_suppliers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('fournisseur_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['user_id', 'fournisseur_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('followed_suppliers');
        Schema::dropIfExists('favorites');
        Schema::dropIfExists('favorite_boards');
    }
};
