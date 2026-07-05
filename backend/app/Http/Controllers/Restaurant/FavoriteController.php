<?php

namespace App\Http\Controllers\Restaurant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FavoriteBoard;
use App\Models\Favorite;
use App\Models\FollowedSupplier;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class FavoriteController extends Controller
{
    // ── BOARDS ──────────────────────────────────────────────────────────

    public function boards(Request $request)
    {
        $boards = FavoriteBoard::where('user_id', $request->user()->id)
            ->withCount('favorites')
            ->latest()
            ->get()
            ->map(function ($board) {
                $firstProduct = $board->favorites()->with('product')->first();
                return [
                    'id' => $board->id,
                    'name' => $board->name,
                    'description' => $board->description,
                    'product_count' => $board->favorites_count,
                    'thumbnail' => $firstProduct?->product?->image ?? null,
                    'created_at' => $board->created_at,
                ];
            });

        return response()->json($boards);
    }

    public function createBoard(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $board = FavoriteBoard::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json([
            'id' => $board->id,
            'name' => $board->name,
            'description' => $board->description,
            'product_count' => 0,
            'thumbnail' => null,
            'created_at' => $board->created_at,
        ], 201);
    }

    public function updateBoard(Request $request, $id)
    {
        $board = FavoriteBoard::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$board) {
            return response()->json(['message' => 'Board not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $board->update($request->only('name', 'description'));

        return response()->json(['message' => 'Board updated.', 'board' => $board]);
    }

    public function deleteBoard(Request $request, $id)
    {
        $board = FavoriteBoard::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$board) {
            return response()->json(['message' => 'Board not found.'], 404);
        }

        // Unfavorite products OR move them to "no board" 
        Favorite::where('board_id', $id)->update(['board_id' => null]);
        $board->delete();

        return response()->json(['message' => 'Board deleted.']);
    }

    public function boardProducts(Request $request, $id)
    {
        $board = FavoriteBoard::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$board) {
            return response()->json(['message' => 'Board not found.'], 404);
        }

        $products = Favorite::where('board_id', $id)
            ->with(['product' => function ($q) {
                $q->with('fournisseur');
            }])
            ->latest()
            ->get()
            ->map(function ($fav) {
                $p = $fav->product;
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'price' => $p->price,
                    'unit' => $p->unit,
                    'image' => $p->image,
                    'fournisseur_name' => $p->fournisseur->name ?? null,
                    'favorited_at' => $fav->created_at,
                ];
            });

        return response()->json($products);
    }

    // ── FAVORITES (add/remove products) ─────────────────────────────────

    public function savedProducts(Request $request)
    {
        $favorites = Favorite::where('user_id', $request->user()->id)
            ->with(['product' => function ($q) {
                $q->with('fournisseur');
            }, 'board'])
            ->latest()
            ->get()
            ->map(function ($fav) {
                $p = $fav->product;
                return [
                    'id' => $fav->id,
                    'product_id' => $p->id,
                    'name' => $p->name,
                    'price' => $p->price,
                    'unit' => $p->unit,
                    'image' => $p->image,
                    'fournisseur_name' => $p->fournisseur->name ?? null,
                    'board_id' => $fav->board_id,
                    'board_name' => $fav->board->name ?? null,
                    'created_at' => $fav->created_at,
                ];
            });

        return response()->json($favorites);
    }

    public function toggleFavorite(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'board_id' => 'nullable|exists:favorite_boards,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $existing = Favorite::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['message' => 'Removed from favorites.', 'favorited' => false]);
        }

        Favorite::create([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
            'board_id' => $request->board_id,
        ]);

        return response()->json(['message' => 'Added to favorites.', 'favorited' => true], 201);
    }

    public function moveToBoard(Request $request, $favoriteId)
    {
        $validator = Validator::make($request->all(), [
            'board_id' => 'nullable|exists:favorite_boards,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $fav = Favorite::where('id', $favoriteId)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$fav) {
            return response()->json(['message' => 'Favorite not found.'], 404);
        }

        $fav->update(['board_id' => $request->board_id]);

        return response()->json(['message' => 'Moved to board.']);
    }

    // ── FOLLOWING SUPPLIERS ─────────────────────────────────────────────

    public function following(Request $request)
    {
        $following = FollowedSupplier::where('user_id', $request->user()->id)
            ->with(['fournisseur' => function ($q) {
                $q->with('fournisseurProfile');
            }])
            ->latest()
            ->get()
            ->map(function ($f) {
                $u = $f->fournisseur;
                return [
                    'id' => $f->id,
                    'fournisseur_id' => $u->id,
                    'name' => $u->name,
                    'city' => $u->city,
                    'company_name' => $u->fournisseurProfile->company_name ?? $u->name,
                    'followed_at' => $f->created_at,
                ];
            });

        return response()->json($following);
    }

    public function toggleFollow(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fournisseur_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check that the target is actually a fournisseur
        $target = User::find($request->fournisseur_id);
        if (!$target || $target->role !== 'fournisseur') {
            return response()->json(['message' => 'Invalid supplier.'], 400);
        }

        $existing = FollowedSupplier::where('user_id', $request->user()->id)
            ->where('fournisseur_id', $request->fournisseur_id)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['message' => 'Unfollowed.', 'following' => false]);
        }

        FollowedSupplier::create([
            'user_id' => $request->user()->id,
            'fournisseur_id' => $request->fournisseur_id,
        ]);

        return response()->json(['message' => 'Now following.', 'following' => true], 201);
    }
}
