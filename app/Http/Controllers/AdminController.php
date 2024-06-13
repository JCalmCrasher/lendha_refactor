<?php

namespace App\Http\Controllers;

use App\Enums\PaymentStatus;
use App\Events\LoanDisbursed;
use App\Events\UserAdded;
use App\Http\Requests\Admin\AddUserRequest;
use App\Http\Resources\UserResource;
use App\Models\LoanDetails;
use App\Models\User;
use App\Models\LoanPayments;
use App\Models\PaymentLog;
use App\Models\Response;
use App\Models\CurrentDefaulter;
use App\Enums\LoanStatus;
use App\Events\LoanApproved;
use App\Events\LoanDenied;
use App\Exports\LoanDetailsExport;
use App\Models\LoanDenial;
use App\Models\Merchant;
use App\Models\Referral;
use App\Notifications\TeamMemberInvitationNotification;
use App\Services\LoanRepaymentService;
use App\Models\UserType;
use App\Utilities\Calculations;
use App\Notifications\PaymentNotification;
use App\Notifications\AdminPaymentNotification;
use App\Notifications\PaymentCompletionNotification;
use App\Notifications\AdminPaymentCompletionNotification;

use Carbon\Carbon;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\Paginator;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class AdminController extends Controller
{
    private $res;

    public function __construct()
    {
        $this->middleware('auth');
        // $this->middleware('is_admin');
        $this->res = new Response();
        $this->res->data = [];
        $this->res->message = "error";
    }

    public function dashboard()
    {
        $today_loan_request = LoanDetails::whereDate('created_at', Carbon::today())->count();
        $week_loan_request = LoanDetails::whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count();
        $month_loan_request = LoanDetails::whereBetween('created_at', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()])->count();
        $total_loan_request = LoanDetails::all()->count();

        $loan_details = LoanDetails::latest()->with('user:id,name,email,phone_number')->limit(5)->get();

        return response()->json([
            "data" => [
                "today_loan_request" => $today_loan_request,
                "week_loan_request" => $week_loan_request,
                "month_loan_request" => $month_loan_request,
                "total_loan_request" => $total_loan_request,
                "loan_requests" => $loan_details
            ],
            "message" => ""
        ]);
    }

    public function defaulters_list()
    {
        $defaulters = CurrentDefaulter::with(['loan_detail.user:id,name,email'])->paginate(50);
        return response()->json([
            'data' => $defaulters,
            'message' => ''
        ]);
    }

    public function suspend_user(Request $request)
    {
        $request->validate([
            'user_id' => 'required|numeric',
            'suspension_status' => 'required|boolean'
        ]);
        $user = User::find($request->user_id);
        if ($user) {
            $user->suspended = $request->suspension_status;
            $user->save();

            activity()->causedBy(Auth::user())->performedOn($user)->log('User ' . ($request->suspension_status ? 'suspended' : 'unsuspended'));
            return response()->json([
                'data' => [],
                'message' => 'Suspension status updated'
            ]);
        }
        return response()->json([
            'data' => [],
            'message' => 'Suspension status update failed'
        ], 400);
    }

    /**
     * Get all loan officers
     */
    public function get_loan_officers()
    {
        $officers = User::whereIn('user_type_id', [
            UserType::where('type', User::SUB_ADMIN_TYPE)->first()->id,
            UserType::where('type', User::ONBOARDING_OFFICER_TYPE)->first()->id
        ])->get()->map->only('id', 'name', 'email');

        return response()->json([
            'data' => $officers,
            'message' => 'success'
        ]);
    }

    /**
     * Get all subadmins
     * @return json
     */
    public function get_subadmins()
    {
        $sub_admins = UserType::find(UserType::where('type', 'subadmin')->first()->id)
            ->user
            ->map
            ->only('id', 'name', 'email');

        return response()->json([
            'data' => $sub_admins,
            'message' => 'success'
        ]);
    }

    public function loan($id)
    {
        // $res = new Response();
        $loan = LoanDetails::where('application_id', $id)->first();
        if ($loan) {
            $user = $loan->user;
            $approved_loan = ($loan->status == "approved") ? $loan : false;

            $loan_total = ($approved_loan) ? $approved_loan->approved_amount : 0.00;
            $total_loan_paid = ($approved_loan) ? $approved_loan->payments->sum('user_payment') : 0.00;

            $compound_interest = ($approved_loan) ? Calculations::compound_interest($loan_total,Calculations::interest_rate($approved_loan->purpose),$approved_loan->duration): 0;
            $total_interest = ($compound_interest) ? $compound_interest["total"] : 0;
            $monthly_payment = ($compound_interest) ? $compound_interest["monthly"] : 0;

            $loan_cycle = ($approved_loan) ? $approved_loan->payments->where('status', PaymentStatus::COMPLETE)
                ->count('user_payment') : '0';
            $remaining_cycle = ($approved_loan) ? (($approved_loan?->payments->count('user_payment') ?? 0) - $loan_cycle) : 0;

            if ($approved_loan) {
                $approved_date = Carbon::parse($approved_loan->approval_date);
                $diff = $approved_date->diffInMonths(now());
                $next_payment_date = $approved_date->addMonths($diff+1);
            } else {
                $next_payment_date = "00-00-00";
            }

            $user = $user->load(['userTransfers' => function ($query) {
                $query->latest('created_at')->take(1);
            }]);

            $loan = $loan->load('bankStatement');

            if ($user->bank && $user->documents) {
                $this->res->data = [
                    'user' => $user->makeHidden(['state_of_residence','gender','address','type','created_at','updated_at','bank', 'documents', 'employment', 'cards', 'loans']),
                    'approval_information' => [
                        'payback_amount' => $total_interest,
                        'remaining_payback_cycle' => $remaining_cycle,
                        'next_payback_amount' => $monthly_payment,
                        'approval_date' => ($approved_loan) ? $approved_loan->approval_date : 00-00-00,
                        'next_payback_date' => $next_payment_date,
                    ],
                    'loan_details' => $loan->makeHidden(['user','id','user_id', 'subadmin', 'created_at','updated_at']),
                    'bank_account' => $user->bank->makeHidden(['id','user_id','created_at','updated_at']),
                    'employment_details' => $user->employment ? $user->employment->makeHidden(['id','user_id','created_at','updated_at']) : [],
                    'documents' => $user->documents->makeHidden(['id','user_id','created_at','updated_at']),
                    'loan_history' => $user->loans,
                    'credit_officer' => $loan->subadmin,
                    'lendha_wallet' => $user->account ?? null
                ];
                $this->res->message = 'success';
                return response()->json($this->res, 200);
            }
            $this->res->message = 'user has not completed profile';
            return response()->json($this->res, 200);
        }

        $this->res->message = "no loan exists for that id";
        return response()->json($this->res, 204);

    }

    public function list_loans()
    {
        $loan_details = LoanDetails::with(['user:id,name,email,phone_number', 'bankStatement:loan_detail_id,data'])->latest('created_at')->paginate(50);
        return response()->json([
            'data' => $loan_details,
            'message' => ''
        ]);
    }

    public function update_loan_payments(Request $request)
    {
        $request->validate([
            'loan_payments_id' => 'required|numeric',
            'amount' => 'required|numeric|gt:0'
        ]);

        $loan_payment = LoanPayments::find($request->loan_payments_id);

        if ($loan_payment) {
            $payment_log = new PaymentLog;
            $payment_log->loan_payments_id = $request->loan_payments_id;
            $payment_log->payment = $request->amount;

            if ($payment_log->save()) {
                $loan_payment->user_payment += $request->amount;
                if ($loan_payment->user_payment >= ($loan_payment->intended_payment + $loan_payment->penalty)) {
                    $loan_payment->status = 'completed';
                }

                if ($loan_payment->save()) {
                    # check if loan payments is complete
                    $this_loan = $loan_payment->loan;
                    $uncompleted_payments = $this_loan->payments()->where('status', '!=', 'completed')->get();

                    if (count($uncompleted_payments) === 0) {
                        # loan repayment is complete
                        $this_loan->status = 'completed';
                        $this_loan->save();
                        # send loand repayment completion notification
                        $this->notification($loan_payment, $request->amount, true);
                    }

                    # send loand repayment notification
                    $this->notification($loan_payment, $request->amount);

                    return response()->json([
                        "data" => [],
                        "message" => 'success'
                    ]);
                }
            }

            return response()->json([
                "data" => [],
                "message" => 'could not save payment'
            ], 500);
        }

        # error: repayment does not exist
        return response()->json([
            "data" => [],
            "message" => 'loan repayment does not exist'
        ], 400);
    }

    public function update_loan_status(Request $request)
    {
        $list_of_status = LoanStatus::getAllAsArray();

        $request->validate([
            'id' => 'required|numeric',
            'loan_status' => 'required|in:'.implode(',',$list_of_status),
            'loan_denial_reason' => 'required_if:loan_status,denied|string|max:100',
            'subadmin_id' => 'numeric',
        ]);

        $loan = LoanDetails::find($request->id);
        if ($loan) {
            if ($request->loan_status==LoanStatus::APPROVED) {
                $loan->approved_amount = ($loan->approved_amount) ?  $loan->approved_amount : $loan->amount;
                $loan->approval_date = now();

                // assign subadmin
                if (!$request->subadmin_id) {
                    return response()->json([
                        'error' => [
                            'subadmin_id' => 'the subadmin is required for loan approvals'
                        ],
                        'message' => 'subadmin required'
                    ], 400);
                }

                $loan->subadmin_id = $request->subadmin_id;

                event(new LoanApproved($loan));
                event(new LoanDisbursed($loan));

                // create repayment schedule
                (new LoanRepaymentService($loan))->createSchedule();
            }
            if ($request->loan_status==LoanStatus::DENIED && !empty($request->loan_denial_reason)) {
                // Dispatch LoanDenied event
                event(new LoanDenied($loan, $request->loan_denial_reason));
            }
            $loan->status = $request->loan_status;
            $loan->save();

            activity()->causedBy(Auth::user())->performedOn($loan)->log('Admin ' . $loan->status . ' loan application');

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

    public function update_loan_subadmin(Request $request)
    {
        $request->validate([
            'id' => 'required|numeric',
            'subadmin_id' => 'required|numeric',
        ]);

        $loan = LoanDetails::find($request->id);
        $loan->subadmin_id = $request->subadmin_id;

        if ($loan->save()) {
            return response()->json([
                'data' => [],
                'message' => 'subadmin updated'
            ]);
        }
    }

    public function update_loan_detail(Request $request)
    {
        $request->validate([
            'id' => 'required|numeric',
            'loan_amount' => 'required|numeric',
            'loan_term' => 'required|numeric'
        ]);

        $loan = LoanDetails::find($request->id);
        if ($loan) {
            $loan->approved_amount = $request->loan_amount;
            $loan->duration = $request->loan_term;
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

    public function merchants()
    {
        return response()->json([
            'data' => Merchant::all(),
            'message' => 'success'
        ]);
    }

    public function search_loans(Request $request)
    {
        $request->validate([
            'email' => 'email',
            'status' => 'in:pending,approved,completed,denied,all',
            'merchant_id' => 'numeric|gt:0',
            'page' => 'required|numeric|gt:0',
            'date_filter'=> 'in:today,yesterday,this week,this month,this quarter,this year,custom',
            'start_date' => 'required_if:date_filter,==,custom|date|date_format:Y-m-d|before:end_date|before_or_equal:today',
            'end_date' => 'required_if:date_filter,==,custom|date|date_format:Y-m-d|after:start_date|before_or_equal:today',
            'export' => 'in:true,false',
        ]);

        $email = $request->email;
        $status = $request->status;
        $merchant = $request->merchant_id;
        $page = $request->page;
        $date_filter = $request->date_filter;
        $start_date = $request->date_filter === 'custom' ? $request->start_date : null;
        $end_date = $request->date_filter === 'custom' ? $request->end_date : null;

        if ($date_filter && $date_filter !== 'custom') {
            $start_end_dates = $this->filter_to_date($date_filter);
            $start_date = $start_end_dates['start_date'];
            $end_date = $start_end_dates['end_date'];
        }

        $loans = LoanDetails::with(['user:id,email,name,phone_number']);

        if ($merchant) {
            $loans = $loans->where('merchant_id', $merchant);
        }

        if ($status) {
            $loans = $loans->where('status',$status);
        }

        if ($start_date && $end_date) {
            $loans = $loans->whereBetween('created_at', [$start_date, $end_date]);
        }

        if ($email) {
            $loans = $loans->whereHas('user', function($query) use ($email) {
                $query->where('email', $email);
            });
        }

        if ($request->export) {
            return Excel::download(new LoanDetailsExport($loans->get()), 'loans.csv');
        }

        return response()->json([
            "data" => $loans->paginate(50),
            "message" => ''
        ]);
    }

    private function paginate($items, $perPage = 50, $page = null, $options = [])
    {
        $page = $page ? Paginator::resolveCurrentPage() : 1;
        $items = $items instanceof Collection ? $items : Collection::make($items);
        return new LengthAwarePaginator($items->forPage($page, $perPage), $items->count(), $perPage, $page, $options);
    }

    public function list_users(Request $request)
    {
        $request->validate([
            'filter' => 'nullable|array:user_type',
            'filter.user_type' => 'nullable|array',
            'filter.user_type.*' => 'in:admin,subadmin,merchant,onboarding_officer,team_lead',
        ]);

        $filter = $request->get('filter', []);

        $query = User::query();

        if (!empty($filter['user_type'])) {
            $userType = $filter['user_type'];

            $query->join('user_types', 'users.user_type_id', '=', 'user_types.id')
                ->select('users.*')
                ->whereIn('user_types.type', $userType);
        }

        $user = $query->orderByDesc('users.created_at')->paginate(50);

        return response()->json([
            "data" => $user,
            "message" => ''
        ]);
    }

    public function search_users(Request $request)
    {
        $request->validate([
            'email' => 'email',
            'status' => 'nullable|in:complete,incomplete',
            'page' => 'numeric|gt:0'
        ]);

        $email = $request->email;
        $status = $request->status;
        $user = User::query();

        if ($email) {
            $user = $user->where('email', $email);
        }

        if ($status) {
            $user = $user->withProfileStatus($status);
        }

        $user = $user->paginate(50);

        return response()->json([
            "data" => $user,
            "message" => ''
        ]);
    }

    public function get_user($id)
    {
        $user = User::with(['userTransfers' => function ($query) {
            $query->latest('created_at')->take(1);
        }])->find($id);

        return response()->json([
            "data" => $user,
            "message" => "success"
        ]);
    }

    public function delete_user($id){
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json([
                "data" => $validator->errors(),
                "message" => 'error'
            ]);
        }

        $user = User::find($id);
        $status = $user->delete();

        return response()->json([
            'data' => [],
            'message' => 'delete status: '.$status
        ]);
    }

    public function modify_user_information(Request $request)
    {
        $request->validate([
            'user_id' => 'required|numeric',
            'user_name' => 'required|string'
        ]);

        $user = User::find($request->user_id);
        $user->name = $request->user_name;
        $user->save();

        return response()->json([
            'data' => [],
            'message' => 'success'
        ]);
    }

    public function get_referrals()
    {
        return response()->json([
            'data' => Referral::all(),
            'message' => ''
        ]);
    }

    /**
     * Convert date filter to start and end dates
     *
     * @param string $date_filter
     * @return array
     */
    private function filter_to_date(string $date_filter) : array
    {
        $start_date = null;
        $end_date = null;

        switch ($date_filter) {
            case 'today':
                $start_date = Carbon::today()->startOfDay()->format('Y-m-d g:i:s');
                $end_date = Carbon::today()->endOfDay()->format('Y-m-d g:i:s');
                break;
            case 'yesterday':
                $start_date = Carbon::yesterday()->startOfDay()->format('Y-m-d g:i:s');
                $end_date = Carbon::yesterday()->endOfDay()->format('Y-m-d g:i:s');
                break;
            case 'this week':
                $start_date = Carbon::today()->startOfWeek()->format('Y-m-d g:i:s');
                $end_date = Carbon::today()->endOfWeek()->format('Y-m-d g:i:s');
                break;
            case 'this month':
                $start_date = Carbon::today()->startOfMonth()->format('Y-m-d g:i:s');
                $end_date = Carbon::today()->endOfMonth()->format('Y-m-d g:i:s');
                break;
            case 'this quarter':
                $start_date = Carbon::today()->startOfQuarter()->format('Y-m-d g:i:s');
                $end_date = Carbon::today()->endOfQuarter()->format('Y-m-d g:i:s');
                break;
            case 'this year':
                $start_date = Carbon::today()->startOfYear()->format('Y-m-d g:i:s');
                $end_date = Carbon::today()->endOfYear()->format('Y-m-d g:i:s');
                break;
        }

        return [
            'start_date' => $start_date,
            'end_date' => $end_date
        ];
    }

    public function notification(LoanPayments $payment, $amount, bool $completed = false){
        $data = [];
        $loan = $payment->loan;
        $data['amount'] = $amount;
        $data['name'] = $loan->user->name;
        $data['email'] = $loan->user->email;
        $data['user_id'] = $loan->user->id;
        $data['due_date'] = $payment->due_date;
        $data['amount_paid'] = $payment->user_payment;
        $data['loan_officer_id'] = $loan->subadmin_id;
        $data['total_amount'] = $payment->intended_payment + $payment->penalty;
        $data['repayment_amount'] = $payment->intended_payment + $payment->penalty - $payment->user_payment;

        if ($completed) {
            # send loand repayment completion notification
            $user = User::find($loan->user->id);
            $user->notify(new PaymentCompletionNotification($data));
            $loan_officer = User::find($loan->subadmin_id);
            return $loan_officer->notify(new AdminPaymentCompletionNotification($data));
        }
        # send loand repayment notification
        $user = User::find($loan->user->id);
        $user->notify(new PaymentNotification($data));
        $loan_officer = User::find($loan->subadmin_id);
        return $loan_officer->notify(new AdminPaymentNotification($data));
    }

    public function addUser(AddUserRequest $request): JsonResponse
    {
        $userData = collect($request->safe()->only(['name', 'email', 'phone_number', 'date_of_birth', 'user_type_id', 'branch_id'])
        )->merge(['password' => Hash::make(Str::password(8))])->toArray();

        $user = User::create($userData);

        $token = Password::broker()->createToken($user);

        $url = config('passwordreset.url') . '?token=' . $token . '&email=' . $user->getEmailForPasswordReset();

        activity()->causedBy(Auth::user())->performedOn($user)->log('Admin added a new user');

        event(new UserAdded($user, $url));

        return response()->json([
            'data' => UserResource::make($user),
            'message' => 'success'
        ]);
    }
}
