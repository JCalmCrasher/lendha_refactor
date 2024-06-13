<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\CollectionResource;
use App\Services\Collections\CollectionsBuilder;
use App\Services\Collections\CollectionsService;
use Illuminate\Http\Request;

class AdminCollectionsController extends Controller
{
    /**
     * Get the collections for onboarding officer and subadmin
     */
    public function index()
    {
        $repayments = new CollectionsBuilder();

        return CollectionResource::collection($repayments->orderByColumn('loan_payments.due_date')
            ->paginate(50));
    }

    public function filter(Request $request, CollectionsService $collectionsService)
    {
        $request->validate([
            'start_date' => 'date|before:end_date',
            'end_date' => 'date|after:start_date',
            'branch_id' => 'numeric|exists:branches,id',
            'officer_id' => 'numeric|exists:users,id',
        ]);

        $collection = new CollectionsBuilder();

        $filtered = $collection
            ->filterByBranchID($request->branch_id)
            ->filterByOfficerID($request->officer_id)
            ->filterByStartDate($request->start_date)
            ->filterByEndDate($request->end_date)
            ->orderByColumn('loan_payments.due_date')
            ->paginate(50);

        $collectionSummary = $collectionsService
            ->getCollectionsSummary($request->branch_id, $request->officer_id, $request->start_date, $request->end_date);

        return CollectionResource::collection($filtered)->additional($collectionSummary);
    }
}
