<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    protected $fillable = ['company_id', 'title', 'description', 'type', 'city', 'category', 'deadline', 'salary'];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}
