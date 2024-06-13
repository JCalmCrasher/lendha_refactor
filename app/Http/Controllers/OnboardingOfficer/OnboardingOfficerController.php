<?php

namespace App\Http\Controllers\OnboardingOfficer;

use App\Http\Controllers\Controller;
use App\Http\Requests\OnboardingOfficer\LoanApplicationRequest;
use App\Http\Resources\LoanDetailResource;
use App\Http\Resources\LoanHistoryResource;
use App\Models\LoanDetails;
use App\Services\Collections\CollectionsBuilder;
use App\Services\Loan\LoanApplicationService;
use App\Models\User;
use App\Utilities\Calculations;
use App\Utilities\DateFilter;
use App\Utilities\NumberFormatter;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class OnboardingOfficerController extends Controller
{
    use DateFilter;
    // list all ikorodu users
    public function listUsers(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string',
            'page' => 'numeric|gt:0',
            'status' => 'nullable|string|in:incomplete,complete',
        ]);

        $officer_id = Auth::user()->id;
        $status = $request->status ?? null;

        $users = User::where('officer_id', $officer_id)->with('officer')->where(function ($query) use ($request) {
            $query->where('name', 'like', "%$request->search%")
                ->orWhere('phone_number', 'like', "%$request->search%")
                ->orWhere('email', 'like', "%$request->search%");
        })->when($status, function ($query) use ($status) {
            return $query->withProfileStatus($status);
        })->orderByDesc('created_at')->paginate(50);

        return response()->json([
            'data' => $users,
            'message' => ''
        ]);
    }

    // apply for loan
    public function loanApplication(LoanApplicationRequest $request, LoanApplicationService $applicationService)
    {
        $user = $request->representedUser();

        $applicationService->setUser($user);

        try {
            $loanApplication = $applicationService->apply();

            activity()->causedBy(Auth::user())->performedOn($user->loans->last())->log('Loan application submitted');

            return $loanApplication;

        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            return response()->json([
                'status' => false,
                'message' => $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    // loan list
    public function listLoans(Request $request)
    {
        $loans = LoanDetails::whereHas('user', function($q) use($request) {
            $q->where('officer_id', $request->user()->id);
        })->get();

        return response()->json([
            'data' => LoanDetailResource::collection($loans),
            'message' => ''
        ]);
    }

    // search loan
    public function searchLoan(Request $request)
    {
        $request->validate([
            'search' => 'required' // name, phone number, email
        ]);

        $loans = LoanDetails::whereHas('user', function($q) use($request) {
            $q->where('officer_id', $request->user()->id);
        });

        if ($request->has('search')) {
            $loans = $loans->whereHas('user', function($q) use($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('phone_number', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        return response()->json([
            'data' => $loans->get(),
            'message' => ''
        ]);
    }

    // loan details
    public function loanDetail(Request $request)
    {
        $request->validate([
            'loan_id' => 'required|exists:loan_details,id'
        ]);

        $loan = LoanDetails::find($request->loan_id);

        return response()->json([
            'data' => $loan,
            'message' => ''
        ]);
    }

    // user details
    public function userDetail(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $user = User::with(['officer', 'userTransfers' => function ($query) {
            $query->latest('created_at')->take(1);
        }])->find($request->user_id);

        return response()->json([
            'data' => $user,
            'message' => ''
        ]);
    }

    // onboarding officer profile
    public function profile(Request $request)
    {
        return response()->json([
            'data' => $request->user(),
            'message' => ''
        ]);
    }

    // upload loan payment receipt
    public function loanPayment(Request $request)
    {
        $request->validate([
            'loan_id' => 'required|exists:loan_details,id',
            'document' => 'required|file',
            'amount' => 'required|numeric'
        ]);

        $loan = LoanDetails::find($request->loan_id);

        $document = $request->file('document');
        $receipt = $document->move('payment_receipts', $document->getClientOriginalName())->getPathname();

        $loan->paymentReceipts()->firstOrCreate([
            'document' => $receipt,
            'amount' => $request->amount
        ]);

        activity()->causedBy(Auth::user())->performedOn($loan)->log('Proxy Loan Payment Receipt');

        return response()->json([
            'data' => [],
            'message' => 'Payment Receipt uploaded successfully'
        ]);
    }

    // user's loans
    public function userLoanHistory(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $loans = User::find($request->user_id)->loans;
         //LoanDetails::where('user_id', $request->user_id)->get();
        // $loans = $user->loans;

        return response()->json([
            'data' => LoanHistoryResource::collection($loans),
            'message' => ($loans && !$loans->isEmpty()) ? 'Retrieved successfully' : 'No loans found'
        ]);
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

        $previousStart = Carbon::now()->subMonth()->startOfMonth()->startOfDay()->format('Y-m-d g:i:s');
        $previousEnd = Carbon::now()->subMonth()->endOfMonth()->endOfDay()->format('Y-m-d g:i:s');

        $loanCount = LoanDetails::query()->leftJoin('users', 'users.id', '=', 'loan_details.user_id')
            ->where('users.officer_id', $user?->id)
            ->when(($startDate && $endDate), function ($query) use ($startDate, $endDate) {
                return $query->whereBetween('loan_details.created_at', [$startDate, $endDate]);
            })->count();

        $customerCount = User::where('officer_id', $user?->id)
            ->when(($startDate && $endDate), function ($query) use ($startDate, $endDate) {
                return $query->whereBetween('created_at', [$startDate, $endDate]);
            })->count();

        $totalCollections = (new CollectionsBuilder)
            ->filterByOfficerID($user?->id)
            ->filterByStartDate($startDate)
            ->filterByEndDate($endDate)
            ->sumIntendedPayment();

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

        $previousMonthTotalCollections = (new CollectionsBuilder)
            ->filterByOfficerID($user?->id)
            ->filterByStartDate($previousStart)
            ->filterByEndDate($previousEnd)
            ->sumIntendedPayment();

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

        $totalCollections = (new CollectionsBuilder)->filterByOfficerID($user?->id)
            ->filterByYear($year)
            ->groupByMonthlySums('loan_payments.intended_payment')
            ->getSumForEachMonth();

        $totalPaid = (new CollectionsBuilder)->filterByOfficerID($user?->id)
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
