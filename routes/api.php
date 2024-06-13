<?php

use App\Http\Controllers\AdminCollectionsController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminReconcilliationController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BankController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\BusinessAssessmentController;
use App\Http\Controllers\BusinessManagementWaitingListController;
use App\Http\Controllers\ClientVisitationController;
use App\Http\Controllers\ContactusController;
use App\Http\Controllers\GuarantorOnboardingController;
use App\Http\Controllers\InvestmentPayoutController;
use App\Http\Controllers\InvestmentPlanController;
use App\Http\Controllers\InvestorsController;
use App\Http\Controllers\KYCController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\MartController;
use App\Http\Controllers\MerchantController;
use App\Http\Controllers\NextOfKinController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\OnboardingOfficer\OnboardingOfficerCollectionsController;
use App\Http\Controllers\OnboardingOfficer\OnboardingOfficerController;
use App\Http\Controllers\OnboardingOfficer\ProxyOnboardingController;
use App\Http\Controllers\OnboardingOfficer\ProxyRegisterController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentReceiptController;
use App\Http\Controllers\ProvidusCallbackController;
use App\Http\Controllers\ReferralChannelController;
use App\Http\Controllers\TeamLead\Collections\BranchCollectionsController;
use App\Http\Controllers\TeamLead\Reconcilliation\BranchReconcilliationController;
use App\Http\Controllers\TeamLead\TeamLeadController;
use App\Http\Controllers\UserAccountController;
use App\Http\Controllers\UserAccountPaymentLogController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserTransferController;
use App\Http\Controllers\UserTypeController;
use App\Http\Controllers\VerificationApiController;
use App\Http\Controllers\WebNotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
// Auth::routes(['verify' => true]);
Route::get('email/verify/{id}', [VerificationApiController::class, 'verify'])->name('verification.verify');
Route::get('email/resend', [VerificationApiController::class, 'resend'])->name('verificationapi.resend');

Route::group([
    'prefix' => 'auth',
], function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('signup', [AuthController::class, 'signup']);

    Route::group([
      'middleware' => 'auth:api',
    ], function() {
        Route::get('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
        Route::post('password', [AuthController::class, 'password']);
    });
});

Route::group([
    'middleware' => 'auth:api',
    'prefix' => 'kyc'
], function () {
    // Route::get('token', [KYCController::class, 'getToken']);
});

Route::group([
    'namespace' => 'Auth',
    'middleware' => 'api',
    'prefix' => 'password'
], function () {
    Route::post('create', [ResetPasswordController::class ,'create'])->name('password.email');
    Route::get('find/{token}', [ResetPasswordController::class ,'find']);
    Route::post('reset', [ResetPasswordController::class ,'reset']);
});

// Team Lead Routes
Route::group([
    'prefix' => 'branch',
    'middleware' => ['auth:api', 'force_password_update']
], function(){
    Route::prefix('dashboard')->group(function () {
        Route::get('/', [TeamLeadController::class, 'dashboard']);
        Route::get('analytics', [TeamLeadController::class, 'getAnalyticsData']);
    });

    Route::get('{branch}/loan', [LoanController::class, 'listByLoanBranch']);
    Route::get('{branch}/loan/search', [LoanController::class, 'searchLoanByBranch']);
    Route::get('loan/{loan}', [LoanController::class, 'getLoanDetailByBranch']);
    Route::patch('loan/review', [LoanController::class, 'reviewLoan']);

    Route::get('{branch}/officers', [BranchController::class, 'getOnboardingOfficers']);

    Route::get('{branch}/user', [UserController::class, 'listByUserBranch']);
    Route::get('{branch}/user/search', [UserController::class, 'searchUserListByBranch']);
    Route::get('user/{user}', [UserController::class, 'getUserDetailByBranch']);
    Route::post('user/{user}/transfer', [UserTransferController::class, 'requestCustomerTransfer']);

    Route::get('{branch}/next_of_kin', [NextOfKinController::class, 'branchIndex']); // not needed for now
    Route::get('{branch}/next_of_kin/search', [NextOfKinController::class, 'searchByBranch']); // not needed for now

    Route::get('{branch}/collections', [BranchCollectionsController::class, 'index'])->name('branchCollections.index');
    Route::get('{branch}/collections/filter', [BranchCollectionsController::class, 'filter'])->name('branchCollections.filter');

    Route::get('{branch}/reconcilliation', [BranchReconcilliationController::class, 'index']);
    Route::get('{branch}/reconcilliation/filter', [BranchReconcilliationController::class, 'filter']);
});

// Subadmin (and Admin) routes
Route::group([
    'prefix' => 'admin',
    'middleware' => ['auth:api', 'is_sub_admin', 'force_password_update']
], function () {
    Route::get('/loan/{id}', [AdminController::class, 'loan']);
    Route::get('loans', [AdminController::class, 'list_loans']);
    Route::get('dashboard', [AdminController::class, 'dashboard']);
    Route::get('search/loan', [AdminController::class, 'search_loans']);
    Route::get('search/users', [AdminController::class, 'search_users']);
    Route::get('users', [AdminController::class, 'list_users']);
    Route::get('defaulters', [AdminController::class, 'defaulters_list']);
    Route::get('merchants', [AdminController::class, 'merchants']);
    Route::get('referrals', [AdminController::class, 'get_referrals']);
    Route::get('get_user/{id}', [AdminController::class, 'get_user']);

    Route::get('next_of_kin', [NextOfKinController::class, 'index']); // not needed for now
    Route::get('next_of_kin/search', [NextOfKinController::class, 'search']); // not needed for now
    Route::get('next_of_kin/{id}', [NextOfKinController::class, 'show']); // not needed for now
    Route::delete('next_of_kin/{id}', [NextOfKinController::class, 'destroy']); // not needed for now

    Route::post('payment_receipt/', [PaymentReceiptController::class, 'store']);

    Route::prefix('user')->group(function () {
        Route::get('account', [UserAccountController::class, 'getUserAccountDetails']);
        Route::get('business_assessment', [BusinessAssessmentController::class, 'show']);
        Route::get('wallet_payments', [UserAccountPaymentLogController::class, 'getUserPayments']);
    });
});

// Exclusive Admin routes
Route::group([
    'prefix' => 'admin',
    'middleware' => ['auth:api', 'is_admin', 'force_password_update']
], function (){
    Route::post('users', [AdminController::class, 'addUser']);

    Route::get('investors', [InvestorsController::class, 'get_investors_list']);

    Route::post('loan_detail', [AdminController::class, 'update_loan_detail']);
    Route::post('loan_status', [AdminController::class, 'update_loan_status']);
    Route::post('loan_interest', [LoanController::class, 'add_loan_interest']);
    Route::post('modify_user_loan_purpose', [LoanController::class, 'modify_users_loan_type']);
    Route::post('update_loan_subadmin', [AdminController::class, 'update_loan_subadmin']);

    Route::post('investment_plan', [InvestmentPlanController::class, 'add_investment_plan']);
    Route::post('investment_status', [InvestorsController::class, 'update_status']);
    Route::post('investment_payment', [InvestorsController::class, 'add_investment']);

    Route::post('investment_plan_update', [InvestmentPlanController::class, 'update']);

    Route::get('investment_payouts', [InvestmentPayoutController::class, 'index']);

    Route::post('auto_deny', [LoanController::class, 'auto_deny']);
    Route::post('lock_account', [UserController::class, 'lock_account']);
    Route::get('user-transfers', [UserTransferController::class, 'getCustomerTransfers']);
    Route::get('user-transfers/{user_transfer}', [UserTransferController::class, 'getCustomerTransfer']);
    Route::patch('user-transfers/{user_transfer}/review', [UserTransferController::class, 'reviewCustomerTransfer']);

    // Route::post('auto_debit', 'PaymentController@debit_user');

    Route::post('edit_customer_profile', [AdminController::class, 'modify_user_information']);

    Route::get('user-types', UserTypeController::class);

    Route::put('update_loan_payments', [AdminController::class, 'update_loan_payments']);
    Route::put('suspend_user', [AdminController::class, 'suspend_user']);
    Route::put('loan_interest', [LoanController::class, 'update_loan_interest']);

    Route::delete('user/{id}', [AdminController::class, 'delete_user']);

    Route::get('loan_officers', [AdminController::class, 'get_loan_officers']);

    Route::get('subadmins', [AdminController::class, 'get_subadmins']);

    Route::group(['prefix' => 'mart'], function () {
        Route::post('package', [MartController::class, 'add_mart_package']);
    });

    Route::get('payment_receipt/', [PaymentReceiptController::class, 'receiptsForLoan']);

    Route::resource('branch', BranchController::class);
    Route::get('branch/{branch}/officer/{user}', [BranchController::class, 'getOfficerByBranch']);


    Route::prefix('collections')->group(function () {
        Route::get('/', [AdminCollectionsController::class, 'index']);
        Route::get('filter', [AdminCollectionsController::class, 'filter']);
    });

    Route::prefix('reconcilliation')->group(function () {
        Route::get('/', [AdminReconcilliationController::class, 'index']);
        Route::get('filter', [AdminReconcilliationController::class, 'filter']);
    });
});

// Client Visitation routes
Route::group([
    'prefix' => 'admin',
    'middleware' => ['auth:api']
], function () {
    Route::resource('client_visitation', ClientVisitationController::class)->middleware('is_sub_admin')->except('index');
    Route::resource('client_visitation', ClientVisitationController::class)->middleware('is_admin')->only('index');
});

// Merchant routes
Route::group([
    'prefix' => 'merchant',
    'middleware' => ['auth:api', 'is_merchant', 'force_password_update']
], function() {
    Route::get('/loans', [MerchantController::class, 'list_loans']);
    Route::get('dashboard', [MerchantController::class, 'dashboard']);
});

// User routes
Route::group([
    'prefix' => 'user',
    'middleware' => ['is_locked', 'force_password_update'],
], function () {
    // Route::post('/contact');

    Route::group([
        'middleware' => 'auth:api'
    ], function() {
        Route::get('dashboard', [UserController::class, 'dashboard']);
        Route::get('eligible', [LoanController::class, 'eligible']);
        Route::get('investments', [InvestorsController::class, 'get_investment_info']);

        Route::post('account', [UserController::class, 'account']);
        Route::post('loan', [LoanController::class, 'loan']);

        Route::post('mart', [MartController::class, 'loan']);
        Route::post('invest', [InvestorsController::class, 'invest']);
        Route::post('generate_payment_url', [LoanController::class, 'generate_repayment_url']);

        Route::get('/account', [UserAccountController::class, 'getAccountDetails']);
        Route::get('/wallet_payments', [UserAccountPaymentLogController::class, 'getPayments']);

        Route::group([
            'prefix' => 'onboarding'
        ], function () {
            Route::post('bank', [OnboardingController::class, 'bank']);
            Route::post('employment', [OnboardingController::class, 'employment']);
            // Route::post('card', [OnboardingController::class, 'card']);
            Route::post('social_media_handles', [OnboardingController::class, 'social_media_handles']);
            Route::post('guarantor', [OnboardingController::class, 'guarantor']);
            Route::post('home_address', [OnboardingController::class, 'home_address']);
            Route::post('business', [OnboardingController::class, 'business']);
            Route::post('home_address', [OnboardingController::class, 'home_address']);
            Route::post('business', [OnboardingController::class, 'business']);
            Route::post('cac', [OnboardingController::class, 'validateCac']);

            Route::get('next_of_kin/{id}', [NextOfKinController::class, 'show']); // not needed for now
            Route::post('next_of_kin', [NextOfKinController::class, 'store']);

            Route::group([
                'prefix' => 'documents'
            ], function () {
                Route::post('passport_photo', [OnboardingController::class, 'documents_upload_passport_photo']);
                Route::post('work_id', [OnboardingController::class, 'documents_upload_work_id']);
                Route::post('valid_id', [OnboardingController::class, 'documents_upload_valid_id']);
                Route::post('residence_proof', [OnboardingController::class, 'documents_upload_residence_proof']);
                Route::post('business_registration', [OnboardingController::class, 'business_registration']);
            });
        });

        Route::group([
            'prefix' => 'documents'
        ], function () {
            Route::get('all', [UserController::class, 'get_documents']);
        });
    });
});

// Payment routes
Route::group([
    'prefix' => 'payment',
    'middleware' => ['is_locked'],
], function () {
    Route::group([
        'middleware' => 'auth:api'
    ], function() {
        Route::post('confirm', [PaymentController::class, 'confirm']);
    });
});

// { Notification routes
Route::group([
    'prefix' => 'notifications',
    'middleware' => ['auth:api']
], function () {
    Route::post('/store-token', [WebNotificationController::class, 'storeToken'])->name('store.token');
    Route::post('/read', [WebNotificationController::class, 'markNotificationsAsRead']);

    Route::get('/', [WebNotificationController::class, 'getNotifications']);

    Route::group([
        'middleware' => ['is_admin']
    ], function () {
        Route::get('/all', [WebNotificationController::class, 'getAllNotifications']);
        Route::post('/', [WebNotificationController::class, 'sendWebNotification']);
    });
});
// }

Route::group([
    'prefix' => 'bank',
    'middleware' => ['auth:api'],
], function () {
    Route::get('list', [BankController::class, 'bank_list']);
    Route::get('account_name/bank/{bank_code}/account/{account_number}', [BankController::class, 'account_name']);
});

Route::middleware(['auth:api'])->group(function () {
    // Route::get('/user', function (Request $request) {
    //     return $request->user();
    // });

    // Route::post('/contact');

    // // User registration
    // Route::post('/initiate_registration', 'Auth\RegisterController@register');

    // Route::post('/personal_details');

    // Route::post('/bvn_verification');

    // // Profile update
    // Route::post('/change_password');
});

Route::get('/investment_plans', [InvestmentPlanController::class, 'get_all_plans']);
Route::get('loan_interests', [LoanController::class, 'get_loan_interests']);
Route::get('referral_channel', [ReferralChannelController::class, 'all']);

/**
 * add contact us route to send message to email
 */
Route::post('/contactus/send', [ContactusController::class, 'send'] );

Route::post('business_management_waiting_list', [BusinessManagementWaitingListController::class, 'store']);

// Onboarding officers' routes

Route::group([
    'prefix' => 'onboarding_officer',
    'middleware' => ['auth:api', 'is_onboarding_officer', 'force_password_update'],
], function () {
    Route::prefix('dashboard')->group(function () {
        Route::get('/', [OnboardingOfficerController::class, 'dashboard']);
        Route::get('analytics', [OnboardingOfficerController::class, 'getAnalyticsData']);
    });
    Route::post('create_user', [ProxyRegisterController::class, 'create']);

    Route::group([
        'prefix' => 'onboarding',
    ], function () {
        Route::post('bank', [ProxyOnboardingController::class, 'bank']);
        Route::post('otp_verification', [ProxyOnboardingController::class, 'otp_verification']);
        Route::post('employment', [ProxyOnboardingController::class, 'employment']);
        Route::post('social_media_handles', [ProxyOnboardingController::class, 'social_media_handles']);
        Route::post('guarantor', [ProxyOnboardingController::class, 'guarantor']);
        Route::post('guarantor_video', [GuarantorOnboardingController::class, 'save_video'])->name('guarantor.save_video');
        Route::post('home_address', [ProxyOnboardingController::class, 'home_address']);
        Route::post('business', [ProxyOnboardingController::class, 'business']);
        Route::post('business_assessment', [BusinessAssessmentController::class, 'store']);

        Route::get('next_of_kin', [NextOfKinController::class, 'proxyIndex']); // not needed for now
        Route::get('next_of_kin/search', [NextOfKinController::class, 'proxySearch']); // not needed for now
        Route::post('next_of_kin', [NextOfKinController::class, 'proxyStore']);

        Route::post('resend_otp', [ProxyOnboardingController::class, 'resend_otp']);

         Route::post('/bvn', [ProxyOnboardingController::class, 'validateBvn']);

        Route::group([
            'prefix' => 'documents'
        ], function () {
            Route::post('passport_photo', [ProxyOnboardingController::class, 'documents_upload_passport_photo']);
            Route::post('work_id', [ProxyOnboardingController::class, 'documents_upload_work_id']);
            Route::post('valid_id', [ProxyOnboardingController::class, 'documents_upload_valid_id']);
            Route::post('residence_proof', [ProxyOnboardingController::class, 'documents_upload_residence_proof']);
            Route::post('business_registration', [ProxyOnboardingController::class, 'business_proof_registration']);
        });
    });

    Route::get('users', [OnboardingOfficerController::class, 'listUsers']);
    Route::get('search', [OnboardingOfficerController::class, 'searchLoan']);

    Route::prefix('loans')->group(function () {
        Route::get('/', [OnboardingOfficerController::class, 'listLoans']);
        Route::get('history', [OnboardingOfficerController::class, 'userLoanHistory']);
    });

    Route::get('profile', [OnboardingOfficerController::class, 'profile']);

    Route::prefix('user')->group(function () {
        Route::get('account', [UserAccountController::class, 'getUserAccountDetails']);
        Route::get('wallet_payments', [UserAccountPaymentLogController::class, 'getUserPayments']);
    });

    Route::group([
        'middleware' => ['is_proxy']
    ], function () {
        Route::get('user', [OnboardingOfficerController::class, 'userDetail']);

        Route::get('loan', [OnboardingOfficerController::class, 'loanDetail']);

        Route::post('loan_application', [OnboardingOfficerController::class, 'loanApplication']);
        Route::post('loan_payment', [OnboardingOfficerController::class, 'loanPayment']);
    });

    Route::prefix('collections')->group(function () {
        Route::get('/', [OnboardingOfficerCollectionsController::class, 'index']);
        Route::get('filter', [OnboardingOfficerCollectionsController::class, 'filter']);
    });
});

Route::prefix('finance')->middleware(['auth:api', 'is_finance', 'force_password_update'])->group(function () {
    Route::get('collections', [AdminCollectionsController::class, 'filter']);

    Route::get('reconciliations', [AdminReconcilliationController::class, 'filter']);

    Route::get('users', [UserController::class, 'getDefaultUsers']);
});

Route::post('providus_callback', [ProvidusCallbackController::class, 'payment']);
