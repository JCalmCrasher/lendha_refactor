<?php

namespace App\Jobs;

use App\Models\ExternalServiceAccount;
use App\Models\LoanDetails;
use App\Models\User;
use App\Notifications\BankStatementNotification;
use App\Services\BankStatementService;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class FetchBankStatementJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(private readonly User   $user,
                                private readonly string $code,
                                private readonly string $loanApplicationId)
    {
    }

    /**
     * Execute the job.
     * @throws Exception
     */
    public function handle(BankStatementService $bankStatementService): void
    {
        try {
            $bankStatement = $bankStatementService->getBankStatement($this->user, $this->code);

            $bankStatementJson = $bankStatement['bank_statement'];
            $accountId = $bankStatement['account_id'];

            $this->updateUserLoan($bankStatementJson, $accountId);
        } catch (Exception $exception) {
            Log::error($exception);

            $admin = User::join('user_types', 'users.user_type_id', '=', 'user_types.id')
                ->where('user_types.type', User::ADMIN_TYPE)->first();

            $admin->notify(new BankStatementNotification($this->user, $exception->getPrevious()?->getMessage()));
        }
    }

    /**
     * @throws Exception
     */
    private function updateUserLoan(array $bankStatement, string $accountId): void
    {
        try {
            $loanDetail = LoanDetails::where('application_id', $this->loanApplicationId)->first();
            $loanDetail->bankStatement()->create(['data' => json_encode($bankStatement, JSON_THROW_ON_ERROR)]);

            $loanDetail->user->externalServiceAccounts()->create([
                'name' => ExternalServiceAccount::MONO,
                'account_id' => $accountId,
            ]);
        } catch (Exception $exception) {
            throw new $exception;
        }
    }
}
