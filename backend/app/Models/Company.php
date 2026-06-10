<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = ['user_id', 'name', 'logo', 'website', 'city', 'description'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function offers()
    {
        return $this->hasMany(Offer::class);
    }
}
