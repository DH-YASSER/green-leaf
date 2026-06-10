<?php

namespace App\Services;

use App\Models\Promotion;
use Carbon\Carbon;

class PromotionService
{
    /**
     * Get the active promotion for a product given a quantity.
     *
     * @param  int  $product_id
     * @param  int  $quantity
     * @return \App\Models\Promotion|null
     */
    public function getActivePromoForProduct($product_id, $quantity)
    {
        return Promotion::where('product_id', $product_id)
            ->where('is_active', true)
            ->whereDate('start_date', '<=', Carbon::now())
            ->whereDate('end_date', '>=', Carbon::now())
            ->where(function ($query) {
                $query->where('usage_limit', null)
                    ->orWhereColumn('usage_count', '<', 'usage_limit');
            })
            ->where('min_qty', '<=', $quantity)
            ->first();
    }
}