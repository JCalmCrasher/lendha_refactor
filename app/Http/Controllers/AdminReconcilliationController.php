<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReconcilliationResource;
use App\Services\Reconcilliation\ReconciliationsService;
use App\Services\Reconcilliation\ReconcilliationBuilder;
use Illuminate\Http\Request;

class AdminReconcilliationController extends Controller
{
    /**
     * Get the collections for onboarding officer and subadmin
     */
    public function index()
    {
        $reconcilliation = new ReconcilliationBuilder();

        return ReconcilliationResource::collection($reconcilliation->paginate(50));

    }

    public function filter(Request $request, ReconciliationsService $reconciliationsService)
    {
        $request->validate([
            'start_date' => 'date',
            'end_date' => 'date|after:start_date',
            'branch_id' => 'numeric|exists:branches,id',
            'officer_id' => 'numeric|exists:users,id',
            'subadmin_id' => 'numeric|exists:users,id',
        ]);

        $reconcilliation = new ReconcilliationBuilder();

        $filtered = $reconcilliation
            ->filterByBranchID($request->branch_id)
            ->filterByOfficerID($request->officer_id)
            ->filterBySubadminID($request->subadmin_id)
            ->filterByStartDate($request->start_date)
            ->filterByEndDate($request->end_date)
            ->paginate(50);

        $reconciliationSummary = $reconciliationsService
            ->getReconciliationsSummary($request->branch_id, $request->officer_id, $request->start_date, $request->end_date);

        return ReconcilliationResource::collection($filtered)->additional($reconciliationSummary);
    }
}
