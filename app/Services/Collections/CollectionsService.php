<?php

namespace App\Services\Collections;

use App\Models\LoanPayments;
use App\Services\BaseLoanSummaryService;
use App\Utilities\NumberFormatter;

class CollectionsService extends BaseLoanSummaryService
{
    public function getCollectionsSummary(?int $branchId = null, ?int $officerId = null, $startDate = null, $endDate = null): array
    {
        $previousMonthStart = now()->startOfMonth()->subMonthsNoOverflow()->toDateTimeString();
        $previousMonthEnd = now()->subMonthsNoOverflow()->endOfMonth()->toDateTimeString();

        $baseQuery = $this->getBaseQuery($branchId, $officerId);

        $totalCollections = $this->calculateTotal($baseQuery, $startDate, $endDate, 'loan_payments.intended_payment');
        $previousMonthTotalCollections = $this->calculateTotal($baseQuery, $previousMonthStart, $previousMonthEnd, 'loan_payments.intended_payment');

        $totalRepayments = $this->calculateTotal($baseQuery, $startDate, $endDate, 'loan_payments.user_payment');
        $previousMonthTotalRepayments = $this->calculateTotal($baseQuery, $previousMonthStart, $previousMonthEnd, 'loan_payments.user_payment');

        $performance = $this->calculatePerformance($totalCollections, $totalRepayments);
        $previousMonthPerformance = $this->calculatePerformance($previousMonthTotalCollections, $previousMonthTotalRepayments);

        $collectionsDifference = $this->calculateDifference($totalCollections, $previousMonthTotalCollections);
        $repaymentsDifference = $this->calculateDifference($totalRepayments, $previousMonthTotalRepayments);
        $performanceDifference = $this->calculateDifference($performance, $previousMonthPerformance);

        return [
            'total_collections' => NumberFormatter::format_amount($totalCollections),
            'previous_month_total_collections' => NumberFormatter::format_amount($previousMonthTotalCollections),
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
        return LoanPayments::leftJoin('loan_details', 'loan_details.id', '=', 'loan_payments.loan_details_id')
            ->leftJoin('users', 'users.id', '=', 'loan_details.user_id')
            ->when($officerId, function ($query) use ($officerId) {
                return $query->where('users.officer_id', $officerId);
            })
            ->when($branchId, function ($query) use ($branchId) {
                return $query->where('users.branch_id', $branchId);
            });
    }
}
