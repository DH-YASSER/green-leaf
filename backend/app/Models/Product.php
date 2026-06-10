<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $table = 'products';

    protected $fillable = [
        'fournisseur_id',
        'category_id',
        'name',
        'description',
        'price',
        'unit',
        'min_order_qty',
        'stock',
        'delivery_zones',
        'delivery_delay',
        'is_active',
    ];

    protected $casts = [
        'delivery_zones' => 'array',
        'price' => 'decimal:2',
        'min_order_qty' => 'integer',
        'stock' => 'integer',
        'delivery_delay' => 'integer',
        'is_active' => 'boolean',
    ];

    public function fournisseur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'fournisseur_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }

    public function promotions(): HasMany
    {
        return $this->hasMany(Promotion::class);
    }

    /**
     * Get the active promotion for the product, if any.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function activePromotion()
    {
        return $this->promotions()
            ->where('is_active', true)
            ->whereDate('start_date', '<=', now())
            ->whereDate('end_date', '>=', now());
    }

    /**
     * Get the first active promotion for the product, if any.
     *
     * @return \App\Models\Promotion|null
     */
    public function getActivePromotionAttribute()
    {
        return $this->activePromotion()->first();
    }
}