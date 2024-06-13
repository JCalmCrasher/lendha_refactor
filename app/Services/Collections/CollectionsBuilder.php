<?php
namespace App\Services\Collections;

use App\Models\LoanPayments;
use Illuminate\Support\Facades\DB;

class CollectionsBuilder
{
    private $repayments;

    public function __construct()
    {
        $this->repayments = LoanPayments::query()
            ->with('loan', 'loan.user', 'loan.user.branch', 'loan.user.officer')
            ->leftJoin('loan_details', 'loan_details.id', '=', 'loan_payments.loan_details_id')
            ->leftJoin('users as s', 's.id', '=', 'loan_details.subadmin_id')
            ->leftJoin('users as u', 'u.id', '=', 'loan_details.user_id')
            ->leftJoin('users as o', 'o.id', '=', 'u.officer_id')
            ->leftJoin('branches', 'branches.id', '=', 'u.branch_id');
    }

    public function filterByOfficerID(?int $officerID)
    {
        if ($officerID) {
            $this->repayments = $this->repayments->where(function ($query) use ($officerID) {
                $query->where('u.officer_id', $officerID)
                    ->orWhere('loan_details.subadmin_id', $officerID);
            });
        }

        return $this;
    }

    public function filterBySubadminID(?int $subadminID)
    {
        if ($subadminID) {
            $this->repayments = $this->repayments->where('loan_details.subadmin_id', $subadminID);
        }

        return $this;
    }

    public function filterByBranchID(?int $branchID = null)
    {
        if ($branchID) {
            $this->repayments = $this->repayments->where('u.branch_id', $branchID);
        }

        return $this;
    }

    public function filterByStartDate(?string $startDate = null)
    {
        if ($startDate) {
            $this->repayments = $this->repayments->where('loan_payments.due_date', '>=', $startDate);
            $this->hasDateRange = true;
        }

        return $this;
    }

    public function filterByEndDate(?string $endDate = null)
    {
        if ($endDate) {
            $this->repayments = $this->repayments->where('loan_payments.due_date', '<=', $endDate);
            $this->hasDateRange = true;
        }

        return $this;
    }

    public function filterBySearch(?string $search = null)
    {
        if ($search) {
            $this->repayments = $this->repayments->where(function ($query) use ($search) {
                $query->where('u.name', 'like', "%$search%")
                    ->orWhere('u.email', 'like', "%$search%")
                    ->orWhere('u.phone_number', 'like', "%$search%");
            });
        }

        return $this;
    }

    public function isPaymentCompleted(bool $isPaymentCompleted)
    {
        if ($isPaymentCompleted) {
            $this->repayments = $this->repayments->where('loan_payments.status', 'complete');
            return $this;
        }

        $this->repayments = $this->repayments->where('loan_payments.status', 'incomplete');
        return $this;
    }

    public function paginate($pageLength)
    {
        return $this->repayments->paginate($pageLength);
    }

    public function sumUserPayment()
    {
        return $this->repayments->sum('loan_payments.user_payment');
    }

    public function sumIntendedPayment()
    {
        return $this->repayments->sum('loan_payments.intended_payment');
    }

    public function count(): int
    {
        return $this->repayments->count();
    }

    public function orderByColumn(string $orderByColumn)
    {
        $this->repayments = $this->repayments->orderBy($orderByColumn);

        return $this;
    }

    public function groupByMonthlySums(string $column)
    {
        $this->repayments = $this->repayments
            ->select(DB::raw("MONTH(loan_payments.due_date) as month"), DB::raw("SUM($column) as sum"))
            ->groupBy('month')
            ->orderBy('month', 'ASC');

        return $this;
    }

    public function getSumForEachMonth()
    {
        $result = $this->repayments->get();

        return collect(range(1, 12))->map(function ($month) use ($result) {
            return $result->pluck('sum', 'month')
                ->get($month, 0);
        })->all();
    }

    public function filterByYear($year)
    {
        $this->repayments = $this->repayments->whereYear('loan_payments.due_date', $year);

        return $this;
    }

}
