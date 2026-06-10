<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminLog;
use Illuminate\Http\Request;

class AdminLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AdminLog::with('admin'); // Assuming relation 'admin' exists on AdminLog model

        // Optional: filter by admin_id if provided
        if ($request->has('admin_id')) {
            $query->where('admin_id', $request->admin_id);
        }

        // Optional: filter by target_type if provided
        if ($request->has('target_type')) {
            $query->where('target_type', $request->target_type);
        }

        // Optional: filter by action if provided (like contains)
        if ($request->has('action')) {
            $query->where('action', 'like', '%' . $request->action . '%');
        }

        $logs = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($logs);
    }
}