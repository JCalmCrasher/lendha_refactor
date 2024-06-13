<?php

namespace App\Http\Controllers\TeamLead\Collections;

use App\Models\Branch;
use App\Http\Controllers\Controller;
use App\Http\Resources\CollectionResource;
use App\Models\LoanDetails;
use App\Services\Collections\CollectionsBuilder;
use App\Services\Collections\CollectionsService;
use Illuminate\Http\Request;

class BranchCollectionsController extends Controller
{
     /**
     * List all collections for branch team lead
     */
    public function index(Branch $branch)
    {
        $this->authorize('viewLoansByBranch', [LoanDetails::class, $branch]);

        $repayments = new CollectionsBuilder();
        $repayments = $repayments->filterByBranchID($branch->id)
            ->orderByColumn('loan_payments.due_date');


        return CollectionResource::collection($repayments->paginate(50));
    }

    public function filter(Branch $branch, Request $request, CollectionsService $collectionsService)
    {
        $this->authorize('viewLoansByBranch', [LoanDetails::class, $branch]);

        $request->validate([
            'search' => 'nullable|string',
            'start_date' => 'date|before:end_date|after:yesterday',
            'end_date' => 'date|after:start_date|after:yesterday',
            'officer_id' => 'exists:users,id',
        ]);

        $repayments = new CollectionsBuilder();
        $repayments = $repayments
            ->filterByBranchID($branch->id)
            ->filterByOfficerID($request->officer_id)
            ->filterByStartDate($request->start_date)
            ->filterByEndDate($request->end_date)
            ->filterBySearch($request->search)
            ->orderByColumn('loan_payments.due_date');

        $summary = $collectionsService
            ->getCollectionsSummary($request->branch_id, $request->officer_id, $request->start_date, $request->end_date);

        return CollectionResource::collection($repayments->paginate(50))->additional($summary);
    }
}
