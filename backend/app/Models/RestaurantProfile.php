<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RestaurantProfile extends Model
{
    protected $table = 'restaurant_profiles';

    protected $fillable = [
        'user_id',
        'restaurant_name',
        'cuisine_type',
        'rc_patente',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}