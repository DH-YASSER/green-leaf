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
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}