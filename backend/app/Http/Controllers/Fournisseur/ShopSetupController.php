<?php

namespace App\Http\Controllers\Fournisseur;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ShopSetupController extends Controller
{
    /**
     * Step 1 — shop page basics: profile photo, cover photo, certifications.
     * Category and description already come from registration; this step
     * only adds what registration doesn't collect.
     */
    public function updateShopPage(Request $request)
    {
        $profile = $request->user()->fournisseurProfile;

        $validator = Validator::make($request->all(), [
            'profile_photo' => 'nullable|image|max:4096',
            'cover_photo' => 'nullable|image|max:4096',
            'certifications' => 'nullable|array',
            'certifications.*' => 'string|max:100',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = [];

        if ($request->hasFile('profile_photo')) {
            if ($profile->profile_photo) {
                Storage::disk('public')->delete($profile->profile_photo);
            }
            $data['profile_photo'] = $request->file('profile_photo')->store('fournisseurs/profile', 'public');
        }

        if ($request->hasFile('cover_photo')) {
            if ($profile->cover_photo) {
                Storage::disk('public')->delete($profile->cover_photo);
            }
            $data['cover_photo'] = $request->file('cover_photo')->store('fournisseurs/cover', 'public');
        }

        if ($request->has('certifications')) {
            $data['certifications'] = $request->certifications;
        }

        if ($request->filled('description')) {
            $data['description'] = $request->description;
        }

        $profile->update($data);

        return response()->json(['profile' => $profile->fresh()]);
    }

    /**
     * Step 2 — delivery & order preferences.
     */
    public function updateOrderPreferences(Request $request)
    {
        $profile = $request->user()->fournisseurProfile;

        $validator = Validator::make($request->all(), [
            'first_order_minimum' => 'required|numeric|min:0',
            'reorder_minimum' => 'required|numeric|min:0',
            'delivery_zones' => 'required|array|min:1',
            'delivery_zones.*' => 'string',
            'lead_time_days' => 'required|integer|min:0|max:30',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $profile->update($validator->validated());

        return response()->json(['profile' => $profile->fresh()]);
    }

    /**
     * Step 3 — verification documents. Marks the wizard complete; does NOT
     * set the account's `is_verified` flag — that stays an admin-only action
     * (legal doc check + field visit), this just submits the paperwork.
     */
    public function updateVerificationDocs(Request $request)
    {
        $profile = $request->user()->fournisseurProfile;

        $validator = Validator::make($request->all(), [
            'rc_document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:8192',
            'ice_document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:8192',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($profile->rc_document) {
            Storage::disk('public')->delete($profile->rc_document);
        }
        if ($profile->ice_document) {
            Storage::disk('public')->delete($profile->ice_document);
        }

        $profile->update([
            'rc_document' => $request->file('rc_document')->store('fournisseurs/docs', 'public'),
            'ice_document' => $request->file('ice_document')->store('fournisseurs/docs', 'public'),
            'shop_setup_completed_at' => now(),
        ]);

        return response()->json(['profile' => $profile->fresh()]);
    }
}