<?php
namespace App\Http\Controllers\TeamLead\Reconcilliation;

use App\Models\Branch;
use App\Http\Controllers\Controller;
use App\Http\Resources\ReconcilliationResource;
use App\Models\LoanDetails;
use App\Services\Reconcilliation\ReconcilliationBuilder;
use Illuminate\Http\Request;

class BranchReconcilliationController extends Controller
{
    public function index(Branch $branch)
    {
        $this->authorize('viewLoansByBranch', [LoanDetails::class, $branch]);
        // list all reconcilliations for branch team lead
        $reconcilliation = new ReconcilliationBuilder();
        $reconcilliation = $reconcilliation->filterByBranchID($branch->id);

        return ReconcilliationResource::collection($reconcilliation->paginate(50));
    }

    public function filter(Branch $branch, Request $request)
    {
        $this->authorize('viewLoansByBranch', [LoanDetails::class, $branch]);
        
        $request->validate([
            'start_date' => 'date',
            'end_date' => 'date|after:start_date',
            'officer_id' => 'exists:users,id',
            'subadmin_id' => 'exists:users,id',
        ]);
        
        // filter reconcilliations for branch team lead
        $reconcilliation = new ReconcilliationBuilder();
        $reconcilliation = $reconcilliation
            ->filterByBranchID($branch->id)
            ->filterByOfficerID($request->officer_id)
            ->filterBySubadminID($request->subadmin_id)
            ->filterByStartDate($request->start_date)
            ->filterByEndDate($request->end_date);
        
        return ReconcilliationResource::collection($reconcilliation->paginate(50));
    }
}