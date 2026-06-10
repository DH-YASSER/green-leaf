<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminLog extends Model
{
    protected $table = 'admin_logs';

    protected $fillable = [
        'admin_id',
        'action',
        'target_type',
        'target_id',
    ];

    protected $casts = [
        'admin_id' => 'integer',
        'target_id' => 'integer',
    ];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}