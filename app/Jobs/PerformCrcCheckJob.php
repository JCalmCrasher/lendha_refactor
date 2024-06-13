<?php

namespace App\Jobs;

use App\Models\LoanDetails;
use App\Models\User;
use App\Notifications\CrcCheckNotification;
use App\Services\CrcCheckService;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class PerformCrcCheckJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(private readonly User       $user,
                                private readonly string|int $bvn,
                                private readonly string     $loanApplicationId)
    {
    }

    /**
     * Execute the job.
     * @throws Exception
     */
    public function handle(CrcCheckService $crcCheckService): void
    {
        try {
            $crcCheckData = $crcCheckService->crcCheck($this->user, $this->bvn);

            $this->updateUserLoan($crcCheckData);
        } catch (Exception $exception) {
            Log::error($exception);

            if (is_null($exception->getPrevious()?->getMessage())) {
                $this->fail($exception);
            }

            $admin = User::join('user_types', 'users.user_type_id', '=', 'user_types.id')
                ->where('user_types.type', User::ADMIN_TYPE)->first();

            Notification::send([$this->user, $admin, $this->user->officer], new CrcCheckNotification($this->user, $exception->getPrevious()?->getMessage()));
        }
    }

    /**
     * @throws Exception
     */
    private function updateUserLoan(array $crcCheckData): void
    {
        try {
            $loanDetail = LoanDetails::where('application_id', $this->loanApplicationId)->first();
            $loanDetail->crcCheck()->create(['data' => json_encode($crcCheckData, JSON_THROW_ON_ERROR)]);
        } catch (Exception $exception) {
            throw new $exception;
        }
    }
}
