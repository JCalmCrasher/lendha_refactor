<?php

namespace App\Http\Controllers;

use App\Events\LoanApplicationCompleted;
use App\Http\Requests\LoanReviewRequest;
use App\Http\Resources\LoanDetailResource;
use App\Jobs\FetchBankStatementJob;
use App\Models\Branch;
use App\Models\User;
use App\Services\BankStatementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Auth;
use App\Models\Merchant;
use App\Models\CovidModel;
use App\Enums\RepaymentDurations;
use App\Models\LoanDetails;
use App\Models\LoanInterest;
use App\Utilities\ExternalApiCalls;
use Exception;
use Illuminate\Http\UploadedFile;

class LoanController extends Controller
{
    public function eligible()
    {
        $user = Auth::user();
        if (!$user->suspended) {
            $active_loan = $user->loans()->where('status', 'approved')->get()->first();
            $pending_loan = $user->loans()->where('status', 'pending')->get()->first();
            if ($active_loan || $pending_loan) {
                return response()->json([
                    'data' => [],
                    'message' => 'user has an active or pending loan'
                ], 401);
            }
            return response()->json([
                'data' => [],
                'message' => 'eligible'
            ]);
        }
        return response()->json([
            'data' => [],
            'message' => 'account suspended'
        ], 401);
    }

    public function loan(Request $request)
    {
        $user = Auth::user();
        $request->validate([
            'loan_amount' => 'required|numeric',
            'loan_interest_id' => 'required|numeric|exists:loan_interests,id',
            'loan_term' => 'numeric',
            'code' => 'nullable|string',
            'bank_statement' => 'required_if:code,null|file|mimes:pdf,png,jpeg,jpg|max:2048',
            'loan_reason' => 'nullable|string'
        ]);

        $thisLoan = LoanInterest::find($request->loan_interest_id);

        if (
            (!$request->loan_term) &&
            $thisLoan->repayment_duration == RepaymentDurations::MONTHLY
        ) {
            return response()->json([
                'data' => [],
                'message' => 'loan term cannot be empty for monthly loans'
            ], 400);
        }

        $loanTerm = 0;

        switch ($thisLoan->repayment_duration) {
            case RepaymentDurations::DAILY:
                $loanTerm = 1;
                break;
            case RepaymentDurations::WEEKLY:
                $loanTerm = 1;
                break;
            case RepaymentDurations::MONTHLY:
                $loanTerm = $request->loan_term;
                break;
            default:
                $loanTerm = $request->loan_term;
                break;
        }

        if ($user->suspended) {
            return response()->json([
                'data' => [],
                'message' => 'user account suspended. contact admin'
            ], 400);
        }

        $approved_loans = $user->loans->where('status', 'approved');
        $pending_loans = $user->loans->where('status', 'pending');

        if (count($approved_loans) || count($pending_loans)) {
            return response()->json([
                'data' => [],
                'message' => 'user already has an active or pending loan'
            ], 400);
        }

        $loan = new LoanDetails();
        $loan->application_id = md5(now().$user->email);
        $loan->amount = $request->loan_amount;
        $loan->purpose = $thisLoan->purpose;
        $loan->loan_interest_id = $thisLoan->id;
        $loan->duration = $loanTerm;
        $loan->request_date = now();

        if ($request->has('code') || $request->has('bank_statement')) {
            $this->handleBankStatement($user, $loan, $request->input('code'), $request->input('bank_statement'));
        }

        if ($request->has('loan_reason')) {
            $this->handleLoanReason($loan, $request->input('loan_reason'));
        }

        $user->loans()->save($loan);

        activity()->causedBy($user)->performedOn($loan)->log('Loan application submitted');

        event(new LoanApplicationCompleted($loan));

        return response()->json([
            'data' => [],
            'message' => 'success'
        ]);
    }

    private function handleBankStatement(User $user, LoanDetails $loan, ?string $code = null, ?UploadedFile $bankStatementFile = null): void
    {
        if ($code) {
            FetchBankStatementJob::dispatch($user, $code, $loan->application_id);
            return;
        }

        $bankStatement = $bankStatementFile?->move('uploads/' . $user->id, $bankStatementFile?->getClientOriginalName())->getPathname();
        $loan->bank_statement = $bankStatement;
    }

    private function handleLoanReason(LoanDetails $loan, ?string $loanReason = null,): void
    {
        $loan->loan_reason = $loanReason;
    }

    public function add_loan_interest(Request $request)
    {
        $request->validate([
            'interest' => 'required|numeric',
            'purpose' => 'required|unique:loan_interests'
        ]);
        $interest = new LoanInterest;
        $interest->interest = $request->interest;
        $interest->purpose = $request->purpose;
        $saved = $interest->save();
        if ($saved) {
            return response()->json([
                'data' => [],
                'message' => 'success'
            ]);
        }
        return response()->json([
            'data' => [],
            'message' => 'could not save'
        ], 401);
    }

    public function update_loan_interest(Request $request)
    {
        $request->validate([
            'interest' => 'required|numeric',
            'id' => 'required|numeric'
        ]);
        $interest = LoanInterest::find($request->id);
        $interest->interest = $request->interest;
        $saved = $interest->save();
        if ($saved) {
            return response()->json([
                'data' => [],
                'message' => 'success'
            ]);
        }
        return response()->json([
            'data' => [],
            'message' => 'could not save'
        ], 401);
    }

    public function get_loan_interests()
    {
        return response()->json([
            'data' => LoanInterest::all(),
            'message' => 'success'
        ]);
    }

    public function auto_deny(Request $request)
    {
        $request->validate([
            'dates' => 'required|array'
        ]);

        $loans = LoanDetails::where('status', 'pending')->whereBetween('created_at', $request->dates)->update(['status' => 'denied']);

        return response()->json([
            'data' => [],
            'message' => "$loans loans denied."
        ]);
    }

    public function modify_users_loan_type(Request $request)
    {
        $request->validate([
            'loan_details_id' => 'required|numeric',
            'new_loan_purpose_id' => 'required|numeric|exists:loan_interests,id'
        ]);

        $loan_application = LoanDetails::find($request->loan_details_id);

        if ($loan_application) {
            $loan_interest = LoanInterest::find($request->new_loan_purpose_id);

            $loan_application->purpose = $loan_interest->purpose;
            $loan_application->loan_interest_id = $loan_interest->id;

            $loan_application->save();
            return response()->json([
                'data' => [],
                'message' => 'success'
            ]);
        }

        return response()->json([
            'data' => [],
            'message' => 'no loan with that id'
        ], 400);
    }

    public function generate_repayment_url(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'amount' => 'required|numeric'
        ]);

        $api_key = config('paystack.lendhakey');

        $http_response = ExternalApiCalls::send(
            'POST',
            'https://api.paystack.co/transaction/initialize',
            [
                'Authorization' => 'Bearer '.$api_key,
                'Content-Type' => 'application/json'
            ],
            [
                'amount' => $request->amount * 100,
                'email' => $request->email
            ]
        );

        if ($http_response['message'] == "success") {
            $json_data = json_decode($http_response['data']);
            $json_data = $json_data->data;

            if ($json_data->authorization_url) {
                return response()->json([
                    'data' => $json_data->authorization_url,
                    'message' => 'success'
                ]);
            }

            return response()->json([
                'data' => [],
                'message' => 'error processing request'
            ], 500);
        }

    }

    public function listByLoanBranch(Branch $branch)
    {
        $this->authorize('viewLoansByBranch', [LoanDetails::class, $branch]);

        $loans = $branch->users()->with('loans')->get()->map->only('loans')->flatten();

        return response()->json([
            'data' => LoanDetailResource::collection($loans),
            'message' => 'success'
        ]);
    }

    public function searchLoanByBranch(Request $request, Branch $branch)
    {
        $request->validate([
            'search' => 'required' // name, phone number, email
        ]);

        $this->authorize('viewLoansByBranch', [LoanDetails::class, $branch]);

        $loans = LoanDetails::whereHas('user', function($q) use($branch) {
            $q->where('branch_id', $branch->id);
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
            'message' => 'success'
        ]);
    }

    public function getLoanDetailByBranch(LoanDetails $loan)
    {
        $this->authorize('viewLoanDetailByBranch', [LoanDetails::class, $loan->user]);

        return response()->json([
            'data' => $loan,
            'message' => 'success'
        ]);
    }

    public function reviewLoan(LoanReviewRequest $request): JsonResponse
    {
        $loan = LoanDetails::find($request->input('id'));

        $this->authorize('reviewLoans', [LoanDetails::class, $loan->user]);

        if ($loan) {
            $loan->team_lead_approval = $request->status;
            $loan->team_lead_denial_reason = $request->team_lead_denial_reason;
            $loan->save();
            return response()->json([
                "data" => [],
                "message" => 'updated'
            ]);
        }

        return response()->json([
            "data" => [],
            "message" => 'loan does not exist'
        ]);
    }
}
