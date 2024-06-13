<?php

namespace App\Http\Controllers\TeamLead;

use App\Http\Controllers\Controller;
use App\Models\LoanDetails;
use App\Services\Collections\CollectionsBuilder;
use App\Models\User;
use App\Utilities\Calculations;
use App\Utilities\DateFilter;
use App\Utilities\NumberFormatter;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeamLeadController extends Controller
{
    use DateFilter;

    public function dashboard(Request $request)
    {
        $request->validate([
            'date_filter' => 'in:today,yesterday,this week,this month,this quarter,this year,custom',
            'start_date' => 'required_if:date_filter,custom|date|date_format:Y-m-d|before_or_equal:end_date|before_or_equal:today',
            'end_date' => 'required_if:date_filter,custom|date|date_format:Y-m-d|after:start_date|before_or_equal:today',
        ]);

        $user = Auth::user();

        $dateFilter = $request->date_filter;
        $startDate = $request->date_filter === 'custom' ? $request->start_date : null;
        $endDate = $request->date_filter === 'custom' ? $request->end_date : null;

        if ($dateFilter && $dateFilter !== 'custom') {
            $startEndDates = $this->filterToDate($dateFilter);
            $startDate = $startEndDates['start_date'];
            $endDate = $startEndDates['end_date'];
        }

        $previousStart = Carbon::now()->subMonth()->startOfMonth()->startOfDay()->format('Y-m-d g:i:s');
        $previousEnd = Carbon::now()->subMonth()->endOfMonth()->endOfDay()->format('Y-m-d g:i:s');

        $loanCount = LoanDetails::query()->leftJoin('users', 'users.id', '=', 'loan_details.user_id')
            ->where('users.branch_id', $user?->branch_id)
            ->when(($startDate && $endDate), function ($query) use ($startDate, $endDate) {
                return $query->whereBetween('loan_details.created_at', [$startDate, $endDate]);
            })->count();

        $customerCount = User::where('branch_id', $user?->branch_id)
            ->when(($startDate && $endDate), function ($query) use ($startDate, $endDate) {
                return $query->whereBetween('created_at', [$startDate, $endDate]);
            })->count();

        $totalCollections = (new CollectionsBuilder)
            ->filterByBranchID($user?->branch_id)
            ->filterByStartDate($startDate)
            ->filterByEndDate($endDate)
            ->sumIntendedPayment();

        $totalPaid = (new CollectionsBuilder)->filterByBranchID($user?->branch_id)
            ->filterByStartDate($startDate)
            ->filterByEndDate($endDate)
            ->sumUserPayment();

        $previousMonthLoanCount = LoanDetails::query()->leftJoin('users', 'users.id', '=', 'loan_details.user_id')
            ->where('users.branch_id', $user?->branch_id)
            ->whereBetween('loan_details.created_at', [$previousStart, $previousEnd])
            ->count();

        $previousMonthCustomerCount = User::where('branch_id', $user?->branch_id)
            ->whereBetween('created_at', [$previousStart, $previousEnd])
            ->count();

        $previousMonthTotalCollections = (new CollectionsBuilder)
            ->filterByBranchID($user?->branch_id)
            ->filterByStartDate($previousStart)
            ->filterByEndDate($previousEnd)
            ->sumIntendedPayment();

        $previousMonthTotalPaid = (new CollectionsBuilder)->filterByBranchID($user?->branch_id)
            ->filterByStartDate($previousStart)
            ->filterByEndDate($previousEnd)
            ->sumUserPayment();

        return response()->json([
            'data' => [
                'loan_count' => $loanCount,
                'previous_month_loan_count' => $previousMonthLoanCount,
                'loan_count_difference' => NumberFormatter::format_percentage(Calculations::calculateDifference($loanCount, $previousMonthLoanCount)),
                'customer_count' => $customerCount,
                'previous_month_customer_count' => $previousMonthCustomerCount,
                'customer_count_difference' => NumberFormatter::format_percentage(Calculations::calculateDifference($customerCount, $previousMonthCustomerCount)),
                'total_collections' => NumberFormatter::format_amount($totalCollections),
                'previous_total_collections' => NumberFormatter::format_amount($previousMonthTotalCollections),
                'total_collections_difference' => NumberFormatter::format_percentage(Calculations::calculateDifference($totalCollections, $previousMonthTotalCollections)),
                'total_paid' => NumberFormatter::format_amount($totalPaid),
                'previous_total_paid' => NumberFormatter::format_amount($previousMonthTotalPaid),
                'total_paid_difference' => NumberFormatter::format_percentage(Calculations::calculateDifference($totalPaid, $previousMonthTotalPaid)),
            ],
            'message' => 'success'
        ], 200);
    }

    public function getAnalyticsData(Request $request)
    {
        $request->validate([
            'year' => 'nullable|date_format:Y',
        ]);

        $year = $request->input('year', date('Y'));
        $user = Auth::user();

        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        $totalCollections = (new CollectionsBuilder)->filterByBranchID($user?->branch_id)
            ->filterByYear($year)
            ->groupByMonthlySums('loan_payments.intended_payment')
            ->getSumForEachMonth();

        $totalPaid = (new CollectionsBuilder)->filterByBranchID($user?->branch_id)
            ->filterByYear($year)
            ->groupByMonthlySums('loan_payments.user_payment')
            ->getSumForEachMonth();

        return response()->json([
            'data' => [
                'labels' => $months,
                'series' => [
                    [
                        'name' => 'Total Collections',
                        'data' => collect($totalCollections)->map(function ($amount) {
                            return NumberFormatter::format_amount($amount);
                        })->all(),
                    ],
                    [
                        'name' => 'Total Paid',
                        'data' => collect($totalPaid)->map(function ($amount) {
                            return NumberFormatter::format_amount($amount);
                        })->all(),
                    ],
                ],
            ],
            'message' => 'success'
        ], 200);
    }
}
