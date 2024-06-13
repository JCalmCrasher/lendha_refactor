<?php

namespace App\Services\Reconcilliation;

use App\Models\LoanPayments;
use App\Services\BaseLoanSummaryService;
use App\Utilities\NumberFormatter;

class ReconciliationsService extends BaseLoanSummaryService
{
    public function getReconciliationsSummary(?int $branchId = null, ?int $officerId = null, $startDate = null, $endDate = null): array
    {
        $previousMonthStart = $this->getPreviousMonthStart();
        $previousMonthEnd = $this->getPreviousMonthEnd();

        $baseQuery = $this->getBaseQuery($branchId, $officerId);

        $totalReconciliation = $this->calculateTotal($baseQuery, $startDate, $endDate, 'loan_payments.intended_payment');
        $previousMonthTotalReconciliation = $this->calculateTotal($baseQuery, $previousMonthStart, $previousMonthEnd, 'loan_payments.intended_payment');

        $totalRepayments = $this->calculateTotal($baseQuery, $startDate, $endDate, 'loan_payments.user_payment');
        $previousMonthTotalRepayments = $this->calculateTotal($baseQuery, $previousMonthStart, $previousMonthEnd, 'loan_payments.user_payment');

        $performance = $this->calculatePerformance($totalReconciliation, $totalRepayments);
        $previousMonthPerformance = $this->calculatePerformance($previousMonthTotalReconciliation, $previousMonthTotalRepayments);

        $collectionsDifference = $this->calculateDifference($totalReconciliation, $previousMonthTotalReconciliation);
        $repaymentsDifference = $this->calculateDifference($totalRepayments, $previousMonthTotalRepayments);
        $performanceDifference = $this->calculateDifference($performance, $previousMonthPerformance);

        return [
            'total_reconciliations' => NumberFormatter::format_amount($totalReconciliation),
            'previous_month_total_reconciliations' => NumberFormatter::format_amount($previousMonthTotalReconciliation),
            'collections_difference' => NumberFormatter::format_percentage($collectionsDifference),
            'total_repayments' => NumberFormatter::format_amount($totalRepayments),
            'previous_month_total_repayments' => NumberFormatter::format_amount($previousMonthTotalRepayments),
            'repayments_difference' => NumberFormatter::format_percentage($repaymentsDifference),
            'performance' => NumberFormatter::format_percentage($performance),
            'previous_month_performance' => NumberFormatter::format_percentage($previousMonthPerformance),
            'performance_difference' => NumberFormatter::format_percentage($performanceDifference),
        ];
    }
    protected function getBaseQuery(?int $branchId = null, ?int $officerId = null)
    {
        return LoanPayments::query()->leftJoin('loan_details', 'loan_details.id', '=', 'loan_payments.loan_details_id')
            ->leftJoin('users', 'users.id', '=', 'loan_details.user_id')
            ->where('loan_payments.due_date', '<=', now())
            ->where('loan_payments.status', 'incomplete')
            ->when($officerId, function ($query) use ($officerId) {
                return $query->where('users.officer_id', $officerId);
            })
            ->when($branchId, function ($query) use ($branchId) {
                return $query->where('users.branch_id', $branchId);
            });
    }
}
