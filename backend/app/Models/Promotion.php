<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Carbon;

class Promotion extends Model
{
    protected $table = 'promotions';

    protected $fillable = [
        'product_id',
        'fournisseur_id',
        'type',
        'value',
        'min_qty',
        'start_date',
        'end_date',
        'usage_limit',
        'usage_count',
        'is_active',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'min_qty' => 'integer',
        'usage_limit' => 'integer',
        'usage_count' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function fournisseur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'fournisseur_id');
    }

    /**
     * Scope a query to only include active promotions.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        $now = Carbon::now()->toDateString();
        return $query->where('is_active', true)
            ->where('start_date', '<=', $now)
            ->where('end_date', '>=', $now);
    }
}