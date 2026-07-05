<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

// Authentication routes
Route::post('/register', [App\Http\Controllers\AuthController::class, 'register']);
Route::post('/login', [App\Http\Controllers\AuthController::class, 'login']);
Route::post('/logout', [App\Http\Controllers\AuthController::class, 'logout']);
Route::get('/me', [App\Http\Controllers\AuthController::class, 'me']);
Route::post('/admin/login', [App\Http\Controllers\AuthController::class, 'adminLogin']);
Route::post('/auth/check-email', [App\Http\Controllers\AuthController::class, 'checkEmail']);

// Email verification
Route::get('/email/verify/{id}/{hash}', [App\Http\Controllers\AuthController::class, 'verifyEmail'])
    ->middleware(['signed'])
    ->name('verification.verify');
Route::post('/email/verification-notification', [App\Http\Controllers\AuthController::class, 'resendVerification'])
    ->middleware(['auth:api', 'throttle:6,1']);

// Admin panel routes (protected by auth and role:admin)
Route::middleware(['auth:api', 'role:admin'])->prefix('admin')->group(function () {
    // User management
    Route::get('/users', [App\Http\Controllers\AdminUserController::class, 'index']);
    Route::get('/users/{id}', [App\Http\Controllers\AdminUserController::class, 'show']);
    Route::patch('/users/{id}/verify', [App\Http\Controllers\AdminUserController::class, 'verify']);
    Route::patch('/users/{id}/ban', [App\Http\Controllers\AdminUserController::class, 'ban']);
    Route::patch('/users/{id}/unban', [App\Http\Controllers\AdminUserController::class, 'unban']);

    // Stats
    Route::get('/stats', [App\Http\Controllers\AdminStatsController::class, 'dashboard']);

    // Product management
    Route::get('/products', [App\Http\Controllers\Admin\AdminProductController::class, 'index']);
    Route::patch('/products/{id}/deactivate', [App\Http\Controllers\Admin\AdminProductController::class, 'forceDeactivate']);

    // Order management
    Route::get('/orders', [App\Http\Controllers\Admin\AdminOrderController::class, 'index']);
    Route::get('/orders/{id}', [App\Http\Controllers\Admin\AdminOrderController::class, 'show']);

    // Promotion management
    Route::get('/promotions', [App\Http\Controllers\Admin\AdminPromoController::class, 'index']);
    Route::patch('/promotions/{id}/disable', [App\Http\Controllers\Admin\AdminPromoController::class, 'forceDisable']);

    // Audit logs
    Route::get('/logs', [App\Http\Controllers\Admin\AdminLogController::class, 'index']);
});

// Restaurant routes (protected by auth and role:restaurant)
Route::middleware(['auth:api', 'role:restaurant'])->prefix('restaurant')->group(function () {
    Route::get('/orders', [App\Http\Controllers\RestaurantOrderController::class, 'index']);
    Route::get('/orders/export', [App\Http\Controllers\RestaurantOrderController::class, 'exportCsv']);
    Route::get('/orders/{id}', [App\Http\Controllers\RestaurantOrderController::class, 'show']);
    Route::post('/orders', [App\Http\Controllers\RestaurantOrderController::class, 'store']);

    Route::get('/conversations', [App\Http\Controllers\MessageController::class, 'conversations']);
    Route::get('/messages/{userId}', [App\Http\Controllers\MessageController::class, 'show']);
    Route::post('/messages', [App\Http\Controllers\MessageController::class, 'store']);
    Route::get('/messages/unread-count', [App\Http\Controllers\MessageController::class, 'unreadCount']);

    // Favorites & Boards
    Route::get('/favorites', [App\Http\Controllers\Restaurant\FavoriteController::class, 'savedProducts']);
    Route::post('/favorites/toggle', [App\Http\Controllers\Restaurant\FavoriteController::class, 'toggleFavorite']);
    Route::patch('/favorites/{id}/move', [App\Http\Controllers\Restaurant\FavoriteController::class, 'moveToBoard']);
    Route::get('/boards', [App\Http\Controllers\Restaurant\FavoriteController::class, 'boards']);
    Route::post('/boards', [App\Http\Controllers\Restaurant\FavoriteController::class, 'createBoard']);
    Route::put('/boards/{id}', [App\Http\Controllers\Restaurant\FavoriteController::class, 'updateBoard']);
    Route::delete('/boards/{id}', [App\Http\Controllers\Restaurant\FavoriteController::class, 'deleteBoard']);
    Route::get('/boards/{id}/products', [App\Http\Controllers\Restaurant\FavoriteController::class, 'boardProducts']);

    // Following suppliers
    Route::get('/following', [App\Http\Controllers\Restaurant\FavoriteController::class, 'following']);
    Route::post('/following/toggle', [App\Http\Controllers\Restaurant\FavoriteController::class, 'toggleFollow']);

    Route::get('/profile', [App\Http\Controllers\Restaurant\ProfileController::class, 'show']);
    Route::put('/profile', [App\Http\Controllers\Restaurant\ProfileController::class, 'update']);
    Route::put('/password', [App\Http\Controllers\Restaurant\ProfileController::class, 'updatePassword']);
    Route::put('/notifications', [App\Http\Controllers\Restaurant\ProfileController::class, 'updateNotifications']);
    Route::post('/avatar', [App\Http\Controllers\Restaurant\ProfileController::class, 'uploadAvatar']);
});

// Fournisseur routes (protected by auth and role:fournisseur)
Route::middleware(['auth:api', 'role:fournisseur'])->prefix('fournisseur')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Fournisseur\DashboardController::class, 'index']);

    // Shop setup wizard (post-registration, 3 steps)
    Route::put('/shop-setup/page', [App\Http\Controllers\Fournisseur\ShopSetupController::class, 'updateShopPage']);
    Route::put('/shop-setup/order-preferences', [App\Http\Controllers\Fournisseur\ShopSetupController::class, 'updateOrderPreferences']);
    Route::post('/shop-setup/verification-docs', [App\Http\Controllers\Fournisseur\ShopSetupController::class, 'updateVerificationDocs']);

    Route::get('/products', [App\Http\Controllers\FournisseurProductController::class, 'index']);
    Route::post('/products', [App\Http\Controllers\FournisseurProductController::class, 'store']);
    Route::put('/products/{id}', [App\Http\Controllers\FournisseurProductController::class, 'update']);
    Route::delete('/products/{id}', [App\Http\Controllers\FournisseurProductController::class, 'destroy']);
    Route::patch('/products/{id}/toggle', [App\Http\Controllers\FournisseurProductController::class, 'toggleActive']);
    Route::get('/promotions', [App\Http\Controllers\PromotionController::class, 'index']);
    Route::post('/promotions', [App\Http\Controllers\PromotionController::class, 'store']);
    Route::put('/promotions/{id}', [App\Http\Controllers\PromotionController::class, 'update']);
    Route::delete('/promotions/{id}', [App\Http\Controllers\PromotionController::class, 'destroy']);
    Route::patch('/promotions/{id}/toggle', [App\Http\Controllers\PromotionController::class, 'toggle']);
    Route::get('/orders', [App\Http\Controllers\FournisseurOrderController::class, 'index']);
    Route::get('/orders/{id}', [App\Http\Controllers\FournisseurOrderController::class, 'show']);
    Route::get('/messages', [App\Http\Controllers\MessageController::class, 'index']);
    Route::get('/messages/{userId}', [App\Http\Controllers\MessageController::class, 'show']);
    Route::post('/messages', [App\Http\Controllers\MessageController::class, 'store']);
});

// Public routes (no authentication required)
Route::get('/products', [App\Http\Controllers\PublicProductController::class, 'browse']);
Route::get('/products/search', [App\Http\Controllers\PublicProductController::class, 'search']);
Route::get('/products/{id}', [App\Http\Controllers\PublicProductController::class, 'show']);
Route::get('/products/{id}/promo', [App\Http\Controllers\PublicProductController::class, 'getPromo']);
Route::get('/fournisseurs/{id}', [App\Http\Controllers\PublicFournisseurController::class, 'show']);
Route::get('/fournisseurs/{id}/products', [App\Http\Controllers\PublicFournisseurController::class, 'products']);