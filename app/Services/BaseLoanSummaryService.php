<?php

namespace App\Services;

abstract class BaseLoanSummaryService
{
    protected function getPreviousMonthStart(): string
    {
        return now()->startOfMonth()->subMonthsNoOverflow()->toDateTimeString();
    }

    protected function getPreviousMonthEnd(): string
    {
        return now()->subMonthsNoOverflow()->endOfMonth()->toDateTimeString();
    }

    protected function calculateTotal($query, $startDate, $endDate, string $paymentField)
    {
        $query = clone $query;

        if ($startDate) {
            $query->where('loan_payments.due_date', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('loan_payments.due_date', '<=', $endDate);
        }

        return $query->sum($paymentField);
    }

    protected function calculatePerformance($totalCollections, $totalRepayments): int|float
    {
        if (abs($totalRepayments) < 0.001) {
            return 0;
        }

        return ($totalCollections / $totalRepayments) * 100;
    }

    protected function calculateDifference($currentValue, $previousValue): int|float
    {
        if (abs($previousValue) < 0.001) {
            return 0;
        }

        return ($currentValue - $previousValue) / $previousValue * 100;
    }

    abstract protected function getBaseQuery();
}
