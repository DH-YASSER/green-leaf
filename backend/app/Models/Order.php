<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $table = 'orders';

    protected $fillable = [
        'restaurant_id',
        'fournisseur_id',
        'status',
        'total_price',
        'notes',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
    ];

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'restaurant_id');
    }

    public function fournisseur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'fournisseur_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}