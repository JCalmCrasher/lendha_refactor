<?php

namespace App\Http\Controllers;

use App\Models\LoanDetails;
use App\Models\LoanPayments;
use App\Models\Merchant;
use App\Models\User;
use App\Services\Collections\CollectionsBuilder;
use App\Utilities\Calculations;
use App\Utilities\DateFilter;
use App\Utilities\NumberFormatter;
use Auth;
use Carbon\Carbon;
use Illuminate\Http\Request;

class MerchantController extends Controller
{
    use DateFilter;

    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('is_merchant');
    }

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

        $previousStart = Carbon::parse($startDate)->subMonth()->format('Y-m-d');
        $previousEnd = Carbon::parse($endDate)->subMonth()->format('Y-m-d');

        $loanCount = LoanDetails::query()->leftJoin('users', 'users.id', '=', 'loan_details.user_id')
            ->where('users.officer_id', $user?->id)
            ->when(($startDate && $endDate), function ($query) use ($startDate, $endDate) {
                return $query->whereBetween('loan_details.created_at', [$startDate, $endDate]);
            })->count();

        $customerCount = User::where('officer_id', $user?->id)
            ->when(($startDate && $endDate), function ($query) use ($startDate, $endDate) {
                return $query->whereBetween('created_at', [$startDate, $endDate]);
            })->count();

        $totalPaid = (new CollectionsBuilder)->filterByOfficerID($user?->id)
            ->filterByStartDate($startDate)
            ->filterByEndDate($endDate)
            ->sumUserPayment();

        $previousMonthLoanCount = LoanDetails::query()->leftJoin('users', 'users.id', '=', 'loan_details.user_id')
            ->where('users.officer_id', $user?->id)
            ->whereBetween('loan_details.created_at', [$previousStart, $previousEnd])
            ->count();

        $previousMonthCustomerCount = User::where('officer_id', $user?->id)
            ->whereBetween('created_at', [$previousStart, $previousEnd])
            ->count();

        $previousMonthTotalPaid = (new CollectionsBuilder)->filterByOfficerID($user?->id)
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
                'total_paid' => NumberFormatter::format_amount($totalPaid),
                'previous_total_paid' => NumberFormatter::format_amount($previousMonthTotalPaid),
                'total_paid_difference' => NumberFormatter::format_percentage(Calculations::calculateDifference($totalPaid, $previousMonthTotalPaid)),
            ],
            'message' => 'success'
        ], 200);
    }

    public function list_loans()
    {
        $merchant = Merchant::where('users_id', Auth::user()->id)->first();
        if ($merchant) {
            $loans = $merchant->loans->load(['user']);
            return response()->json([
                'data' => $loans,
                'message' => ''
            ]);
        }
        return response()->json([
            'data' => [],
            'message' => 'not a merchant'
        ], 400);

    }
}
