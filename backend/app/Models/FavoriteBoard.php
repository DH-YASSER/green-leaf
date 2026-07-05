<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FavoriteBoard extends Model
{
    protected $fillable = ['user_id', 'name', 'description'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class, 'board_id');
    }

    public function products()
    {
        return $this->hasManyThrough(Product::class, Favorite::class, 'board_id', 'id', 'id', 'product_id');
    }
}
