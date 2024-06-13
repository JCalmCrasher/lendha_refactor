<?php

namespace Tests\Unit;

use App\Enums\LoanStatus;
use App\Events\PaymentReceived;
use App\Listeners\UpdateLoanBalance;
use App\Models\LoanDetails;
use App\Services\LoanPaymentService\ILoanPaymentService;
use App\Models\User;
use App\Models\UserAccount;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class UpdateLoanBalanceTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function testHandlePaymentReceived()
    {
        // Mock Loan Payment Service
        $loanPaymentService = Mockery::mock(ILoanPaymentService::class);
        $this->app->instance(ILoanPaymentService::class, $loanPaymentService);

        // Factory UserAccount
        $user = factory(User::class)->create();
        $loan = factory(LoanDetails::class)->create([
            'user_id' => $user->id,
            'status' => LoanStatus::APPROVED
        ]);
        $userAccount = factory(UserAccount::class)->create([
            'user_id' => $user->id
        ]);

        // Specify amount
        $amount = 100;

        // Mock PaymentReceived event
        $event = new PaymentReceived($userAccount, $amount);

        // Expect makePayment to be called on loanPaymentService
        $loanPaymentService->shouldReceive('makePayment')->once()->with(
            \Mockery::on(function ($argLoan) use ($loan) {
                // Compare the loan attributes instead of the objects
                return $argLoan->id === $loan->id && $argLoan->status === $loan->status;
            }),
            $amount
        );

        // Create instance of UpdateLoanBalance and call handle
        $listener = new UpdateLoanBalance($loanPaymentService);
        $listener->handle($event);
    }


    // public function testHandlePaymentReceived()
    // {
    //     // Mock Loan Payment Service
    //     $loanPaymentService = Mockery::mock(ILoanPaymentService::class);
    //     $this->app->instance(ILoanPaymentService::class, $loanPaymentService);

    //     // Factory UserAccount
    //     $user = factory(User::class)->create();
    //     $loan = factory(LoanDetails::class)->create([
    //         'user_id' => $user->id,
    //         'status' => LoanStatus::APPROVED
    //     ]);
    //     $userAccount = factory(UserAccount::class)->create([
    //         'user_id' => $user->id
    //     ]);

    //     // Specify amount
    //     $amount = 100;

    //     // Mock PaymentReceived event
    //     $event = Mockery::mock(PaymentReceived::class);
    //     $event->userAccount = $userAccount;
    //     $event->amount = $amount;

    //     // Expect makePayment to be called on loanPaymentService
    //     $userLoan = $userAccount->user->loans()->where('status', 'approved')->get()->first();

    //     $loanPaymentService->shouldReceive('makePayment')->once()->with($userLoan, $amount);

    //     // Create instance of UpdateLoanBalance and call handle
    //     $listener = new UpdateLoanBalance($loanPaymentService);
    //     $listener->handle($event);
    // }

    // public function tearDown(): void
    // {
    //     Mockery::close();
    //     parent::tearDown();
    // }
}
