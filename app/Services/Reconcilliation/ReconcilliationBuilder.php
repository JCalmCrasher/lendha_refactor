<?php
namespace App\Services\Reconcilliation;

use App\Models\LoanDetails;
use App\Models\LoanPayments;

/**
 * name
 * officer name
 * officer id
 * loan name
 * loan start date
 * loan end date ?
 * loan amount
 * principal paid ?
 * OLB (outstanding loan balance) (loan amount - paid) [x]
 * late principal [x]
 * late interest [x]
 * penalty
 * late days
 */

class ReconcilliationBuilder
{
    private $reconcilliation;

    public function __construct() {
        $this->reconcilliation = LoanPayments::query()
        ->with('loan', 'loan.user', 'loan.user.branch', 'loan.user.officer')
        ->leftJoin('loan_details', 'loan_details.id', '=', 'loan_payments.loan_details_id')
        ->leftJoin('users as s', 's.id', '=', 'loan_details.subadmin_id')
        ->leftJoin('users as u', 'u.id', '=', 'loan_details.user_id')
        ->leftJoin('users as o', 'o.id', '=', 'u.officer_id')
        ->leftJoin('branches', 'branches.id', '=', 'u.branch_id')
        ->where('loan_payments.due_date', '<=', now())
        ->where('loan_payments.status', 'incomplete')
        ->orderBy('loan_payments.due_date', 'desc');
    }

    public function filterByOfficerID(?int $officerID)
    {
        if ($officerID) {
            $this->reconcilliation = $this->reconcilliation->where('u.officer_id', $officerID)
                ->orWhere('loan_details.subadmin_id', $officerID);
        }

        return $this;
    }

    public function filterBySubadminID(?int $subadminID)
    {
        if ($subadminID) {
            $this->reconcilliation = $this->reconcilliation->where('loan_details.subadmin_id', $subadminID);
        }

        return $this;
    }

    public function filterByBranchID(?int $branchID)
    {
        if ($branchID) {
            $this->reconcilliation = $this->reconcilliation->where('u.branch_id', $branchID);
        }

        return $this;
    }

    public function filterByStartDate(?string $startDate)
    {
        if ($startDate) { //?
            $this->reconcilliation = $this->reconcilliation->where('loan_details.approval_date', '>=', $startDate);
        }

        return $this;
    }

    public function filterByEndDate(?string $endDate)
    {
        if ($endDate) {
            $this->reconcilliation = $this->reconcilliation->where('loan_payments.due_date', '<=', $endDate);
        }

        return $this;
    }

    public function paginate($pageLength)
    {
        return $this->reconcilliation->paginate($pageLength);
    }
}
