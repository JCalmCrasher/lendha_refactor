<?php

namespace App\Http\Controllers\OnboardingOfficer;

use App\Http\Controllers\Controller;
use App\Http\Resources\CollectionResource;
use App\Services\Collections\CollectionsBuilder;
use App\Services\Collections\CollectionsService;
use Illuminate\Http\Request;

class OnboardingOfficerCollectionsController extends Controller
{
    /**
     * List all collections for onboarding officer
     */
    public function index(Request $request)
    {
        $officer_id = $request->user()->id;

        $repayments = (new CollectionsBuilder())
            ->filterByOfficerID($officer_id)
            ->orderByColumn('loan_payments.due_date')
            ->paginate(50);

        return response()->json([
            'data' => $repayments
        ]);
    }

    public function filter(Request $request, CollectionsService $collectionsService)
    {
        $request->validate([
            'search' => 'nullable|string',
            'start_date' => 'date|before:end_date|after:yesterday',
            'end_date' => 'date|after:start_date|after:yesterday',
        ]);

        $officer_id = $request->user()->id;

        $filtered = (new CollectionsBuilder())
            ->filterByOfficerID($officer_id)
            ->filterByStartDate($request->start_date)
            ->filterByEndDate($request->end_date)
            ->filterBySearch($request->search)
            ->orderByColumn('loan_payments.due_date')
            ->paginate(50);

        $collectionSummary = $collectionsService
            ->getCollectionsSummary(officerId: $request->officer_id, startDate: $request->start_date, endDate: $request->end_date);

        return CollectionResource::collection($filtered)->additional($collectionSummary);
    }
}
