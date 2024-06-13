<?php

namespace App\Http\Controllers;

use App\Enums\PaymentStatus;
use App\Models\Branch;
use App\Models\CovidModel;
use App\Models\LoanDetails;
use App\Models\Merchant;
use App\Models\User;
use App\Utilities\Calculations;
use Auth;
use DB;
use Carbon\Carbon;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();

        if($user){
            // remove work ID
            if ($user->documents) {
                $user->documents->makeHidden('work_id');
            }

            $approved_loan = $user->loans->where('status', 'approved')->last();

            $current_application = $user->loans->last();

            $loan_total = ($approved_loan) ? $approved_loan->approved_amount : 0.00;
            $total_loan_paid = ($approved_loan) ? $approved_loan->payments->sum('user_payment') : 0.00;

            $compound_interest = ($approved_loan) ? Calculations::compound_interest($loan_total,Calculations::interest_rate($approved_loan->purpose),$approved_loan->duration): 0;
            $total_interest = ($compound_interest) ? $compound_interest["total"] : 0;
            $monthly_payment = ($compound_interest) ? $compound_interest["monthly"] : 0;

            $loan_cycle = ($approved_loan) ? $approved_loan->payments->count('user_payment') : '00-00-00';

            // owed payment + the closest payment amount =  next payment

            $owed_amount = $approved_loan ? (
                $approved_loan
                ->payments()
                ->where('status', '!=', 'completed')
                ->whereDate('due_date', '<', now())
                ->sum(DB::raw('intended_payment + penalty'))
            ) : 0;

            $closest_payment = $approved_loan ? (
                $approved_loan
                ->payments()
                ->where('status', '!=', 'completed')
                ->whereDate('due_date', '>=', now())
                ->first()
            ) : 0;

            $closest_payment = !empty($closest_payment) ? (
                $closest_payment->intended_payment + $closest_payment->penalty - $closest_payment->user_payment
            ) : 0;

            $next_payment = $owed_amount + $closest_payment;

            $subadmin = ($approved_loan && $approved_loan->subadmin) ? $approved_loan->subadmin : null;

            $credit_officer = [
                "name" => $subadmin ? $subadmin->name : '',
                "email" => $subadmin ? $subadmin->email : '',
                "image" => ($subadmin && $subadmin->user_documents) ?
                    $subadmin->user_documents->passport_photo : '',
            ];

            $paybackCycle = ($approved_loan?->payments->count('user_payment') ?? 0) - ($approved_loan?->payments
                    ->where('status', PaymentStatus::COMPLETE)->count('user_payment') ?? 0);

            return response()->json([
                'data' => [
                    'loan_total' =>  $loan_total,
                    "total_loan_paid" => $total_loan_paid,
                    "total_interest" => $total_interest,
                    "next_payment_amount" => $next_payment,
                    "current_application" =>
                    [
                        "application_id" => $current_application ? $current_application->application_id : '',
                        "amount" => $current_application ? ($current_application->approved_amount ? $current_application->approved_amount:$current_application->amount) : 0,
                        "status" => $current_application ? $current_application->status: '',
                        "loan_denial_reason" => $current_application ? $current_application->loan_denial_reason: '',
                        "payback_cycle" => $paybackCycle,
                    ],
                    "user" => $user,
                    "credit_officer" => $credit_officer
                ],
                'message' => 'success'
            ], 200);



            return response()->json([
                'data' => [],
                'message' => 'no loans requested'
            ], 400);
        }
        return response()->json([
            'data' => [],
            'message' => 'incorrect id'
        ], 400);
    }

    public function account(Request $request)
    {
        $request->validated([
            'name' => 'required|string',
            'email' => 'required|string|email',
        ]);
        return Auth::user()->loans;
    }

    public function get_documents()
    {
        $user = Auth::user();
        return response()->json([
            'data' => $user->documents ? $user->documents : [],
            'message' => 'success'
        ]);
    }

    public function lock_account(Request $request)
    {
        $request->validate([
            'user_id' => 'required|numeric',
            'status' => 'required|boolean'
        ]);

        $user = User::find($request->user_id);

        $user->locked = $request->status;

        $update = $user->save();

        return response()->json([
            'data' => $update,
            'message' => 'success'
        ]);
    }

    public function listByUserBranch(Branch $branch)
    {
        $this->authorize('viewUsersByBranch', [User::class, $branch]);

        $users = User::where('branch_id', $branch->id)->with(['officer', 'userTransfers' => function ($query) {
            $query->latest('created_at')->take(1);
        }])->orderByDesc('created_at')->paginate(50);

        return response()->json([
            'data' => $users,
            'message' => 'success'
        ]);
    }

    public function searchUserListByBranch(Request $request, Branch $branch)
    {
        $this->authorize('viewUsersByBranch', [User::class, $branch]);

        $request->validate([
            'search' => 'required'
        ]);

        $users = User::where('branch_id', $branch->id)->where(function ($query) use ($request) {
            $query->where('name', 'like', "%{$request->search}%")
                ->orWhere('phone_number', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%");
        })->paginate(50);

        return response()->json([
            'data' => $users,
            'message' => 'success'
        ]);
    }

    public function getUserDetailByBranch(User $user)
    {
        $this->authorize('viewUserByBranch', $user);

        $user->load(['officer', 'userTransfers' => function ($query) {
            return $query->latest('created_at')->take(1);
        }]);

        return response()->json([
            'data' => $user,
            'message' => 'success'
        ]);
    }

    public function getDefaultUsers()
    {
        $users = User::whereHas('type', function ($query) {
            $query->where('type', User::DEFAULT_TYPE);
        })->with('officer')->orderByDesc('created_at')->paginate(50);

        return response()->json([
            'data' => $users,
            'message' => 'success'
        ]);
    }

}
