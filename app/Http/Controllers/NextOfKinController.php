<?php

namespace App\Http\Controllers;

use App\Models\NextOfKin;
use App\Models\User;
use Illuminate\Http\Request;

class NextOfKinController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', NextOfKin::class);

        $nextOfKin = NextOfKin::paginate(50);

        return response()->json([
            'success' => true,
            'data' => $nextOfKin,
            'message' => 'Retrieved successfully'
        ], 200);
    }

    public function branchIndex()
    {
        $this->authorize('viewAnyBranch', NextOfKin::class);

        $nextOfKin = NextOfKin::whereHas('user', function ($query) {
            $query->where('branch_id', auth()->user()->branch_id);
        })->paginate(50);

        return response()->json([
            'success' => true,
            'data' => $nextOfKin,
            'message' => 'Retrieved successfully'
        ], 200);
    }

    public function proxyIndex(Request $request)
    {
        $this->authorize('onboardingViewAny', [NextOfKin::class]);

        $nextOfKin = NextOfKin::whereHas('user', function ($query) use ($request) {
            $query->where('officer_id', auth()->user()->id);
        })->paginate(50);

        return response()->json([
            'success' => true,
            'data' => $nextOfKin,
            'message' => 'Retrieved successfully'
        ], 200);
    }


    public function search(Request $request)
    {
        $this->authorize('viewAny', NextOfKin::class);

        $nextOfKin = NextOfKin::where('name', 'like', '%' . $request->search . '%')
            ->orWhere('relationship', 'like', '%' . $request->search . '%')
            ->orWhere('phone', 'like', '%' . $request->search . '%')
            ->orWhere('email', 'like', '%' . $request->search . '%')
            ->orWhere('address', 'like', '%' . $request->search . '%')
            ->paginate(50);

        return response()->json([
            'success' => true,
            'data' => $nextOfKin,
            'message' => 'Retrieved successfully'
        ], 200);
    }

    public function searchByBranch(Request $request)
    {
        $this->authorize('viewAnyBranch', NextOfKin::class);

        $nextOfKin = NextOfKin::whereHas('user', function ($query) {
            $query->where('branch_id', auth()->user()->branch_id);
        })->where(function ($query) use ($request) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('relationship', 'like', '%' . $request->search . '%')
                ->orWhere('phone', 'like', '%' . $request->search . '%')
                ->orWhere('email', 'like', '%' . $request->search . '%')
                ->orWhere('address', 'like', '%' . $request->search . '%');
        })->paginate(50);

        return response()->json([
            'success' => true,
            'data' => $nextOfKin,
            'message' => 'Retrieved successfully'
        ], 200);
    }

    public function proxySearch(Request $request)
    {
        $this->authorize('onboardingViewAny', [NextOfKin::class]);

        $nextOfKin = NextOfKin::whereHas('user', function ($query) use ($request) {
            $query->where('officer_id', auth()->user()->id);
        })->where(function ($query) use ($request) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('relationship', 'like', '%' . $request->search . '%')
                ->orWhere('phone', 'like', '%' . $request->search . '%')
                ->orWhere('email', 'like', '%' . $request->search . '%')
                ->orWhere('address', 'like', '%' . $request->search . '%');
        })->paginate(50);

        return response()->json([
            'success' => true,
            'data' => $nextOfKin,
            'message' => 'Retrieved successfully'
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'relationship' => 'required|string',
            'phone' => 'required|string',
            'email' => 'string',
            'address' => 'required|string'
        ]);

        $this->authorize('create', NextOfKin::class);

        $nextOfKin = NextOfKin::updateOrCreate(
            ['user_id' => auth()->user()->id],
            $request->only(['name', 'relationship', 'phone', 'email', 'address']
            ));

        return response()->json([
            'success' => true,
            'data' => $nextOfKin,
            'message' => 'Next of kin created successfully'
        ], 201);
    }

    public function proxyStore(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'relationship' => 'required|string',
            'phone' => 'required|string',
            'email' => 'string',
            'address' => 'required|string',
            'user_id' => 'required|integer|exists:users,id'
        ]);

        $this->authorize('onboardingCreate', [NextOfKin::class, User::find($request->user_id), $request->user()->id, $request->user()->type]);

        $nextOfKin = NextOfKin::updateOrCreate(
            ['user_id' => $request->user_id],
            $request->only([
                'name', 'relationship', 'phone', 'email', 'address', 'user_id'
            ]));

        return response()->json([
            'success' => true,
            'data' => $nextOfKin,
            'message' => 'Next of kin created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\NextOfKin  $nextOfKin
     * @return \Illuminate\Http\Response
     */
    public function show(NextOfKin $nextOfKin)
    {
        $this->authorize('view', $nextOfKin);

        return response()->json([
            'success' => true,
            'data' => $nextOfKin,
            'message' => 'Retrieved successfully'
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\NextOfKin  $nextOfKin
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, NextOfKin $nextOfKin)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\NextOfKin  $nextOfKin
     * @return \Illuminate\Http\Response
     */
    public function destroy(NextOfKin $nextOfKin)
    {
        $this->authorize('delete', $nextOfKin);

        $nextOfKin->delete();

        return response()->json([
            'success' => true,
            'message' => 'Next of kin deleted successfully'
        ], 200);
    }
}
