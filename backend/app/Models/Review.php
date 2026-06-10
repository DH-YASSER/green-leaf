<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $table = 'reviews';

    protected $fillable = [
        'restaurant_id',
        'fournisseur_id',
        'order_id',
        'rating',
        'comment',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'restaurant_id');
    }

    public function fournisseur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'fournisseur_id');
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Boot the observer.
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function ($review) {
            // Update the fournisseur's average rating and review count
            $fournisseurId = $review->fournisseur_id;

            // Calculate the average rating and review count for the fournisseur
            $avgRating = Review::where('fournisseur_id', $fournisseurId)->avg('rating');
            $reviewCount = Review::where('fournisseur_id', $fournisseurId)->count();

            // Update the fournisseur's profile
            $fournisseurProfile = \App\Models\FournisseurProfile::where('user_id', $fournisseurId)->first();

            if ($fournisseurProfile) {
                $fournisseurProfile->update([
                    'avg_rating' => round($avgRating, 2),
                    'review_count' => $reviewCount,
                ]);
            }
        });
    }
}