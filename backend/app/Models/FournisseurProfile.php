<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FournisseurProfile extends Model
{
    protected $table = 'fournisseur_profiles';

    protected $fillable = [
        'user_id',
        'company_name',
        'ice_number',
        'category',
        'description',
        'avg_rating',
        'review_count',
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
    ];

    protected $casts = [
        'certifications' => 'array',
        'delivery_zones' => 'array',
        'shop_setup_completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}