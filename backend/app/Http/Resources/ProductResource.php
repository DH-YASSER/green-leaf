<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => $this->price,
            'unit' => $this->unit,
            'stock' => $this->stock,
            'is_active' => $this->is_active,
            'category' => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ],
            'images' => $this->images->map(function ($image) {
                return [
                    'id' => $image->id,
                    'image_path' => $image->image_path,
                    'is_primary' => $image->is_primary,
                ];
            }),
            'fournisseur_name' => $this->fournisseur->name,
        ];
    }
}