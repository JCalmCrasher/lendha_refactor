<?php

namespace App\Utilities;

use App\Models\LoanInterest;
use Carbon\Carbon;

trait DateFilter
{
    public function filterToDate(string $dateFilter): array
    {
        $startDate = null;
        $endDate = null;

        switch ($dateFilter) {
            case 'today':
                $startDate = Carbon::today()->startOfDay()->format('Y-m-d g:i:s');
                $endDate = Carbon::today()->endOfDay()->format('Y-m-d g:i:s');
                break;
            case 'yesterday':
                $startDate = Carbon::yesterday()->startOfDay()->format('Y-m-d g:i:s');
                $endDate = Carbon::yesterday()->endOfDay()->format('Y-m-d g:i:s');
                break;
            case 'this week':
                $startDate = Carbon::today()->startOfWeek()->format('Y-m-d g:i:s');
                $endDate = Carbon::today()->endOfWeek()->format('Y-m-d g:i:s');
                break;
            case 'this month':
                $startDate = Carbon::today()->startOfMonth()->format('Y-m-d g:i:s');
                $endDate = Carbon::today()->endOfMonth()->format('Y-m-d g:i:s');
                break;
            case 'this quarter':
                $startDate = Carbon::today()->startOfQuarter()->format('Y-m-d g:i:s');
                $endDate = Carbon::today()->endOfQuarter()->format('Y-m-d g:i:s');
                break;
            case 'this year':
                $startDate = Carbon::today()->startOfYear()->format('Y-m-d g:i:s');
                $endDate = Carbon::today()->endOfYear()->format('Y-m-d g:i:s');
                break;
        }

        return [
            'start_date' => $startDate,
            'end_date' => $endDate
        ];
    }
}
