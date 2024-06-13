<?php

namespace App\Console\Commands;

use App\Jobs\SendPaymentReminder;
use App\Models\LoanPayments;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class PaymentReminder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'remind:payment';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Payment Reminder';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        
        $payments = LoanPayments::whereNotNull('due_date')->where('status', '<>', 'completed')->get();
        $payments->map(function ($payment) {
            $due_date = Carbon::parse($payment->due_date)->startOfDay();
            $today_plus_day = Carbon::now()->addDay()->startOfDay();
            $today_plus_week = Carbon::now()->addWeek()->startOfDay();
            
            $data = [];
            $due_in_a_week = $today_plus_week->is($due_date);
            $due_tomorrow = $today_plus_day->is($due_date);

            if (($due_in_a_week || $due_tomorrow)) {
                $data['email'] = $payment->loan->user->email;
                $data['name'] = $payment->loan->user->name;
                $data['repayment_amount'] = $payment->intended_payment + $payment->penalty - $payment->user_payment;
                $data['due_date'] = $payment->due_date;
                $data['user_id'] = $payment->loan->user->id;
                $data['loan_officer_id'] = $payment->loan->subadmin_id;
                $this->info('Sent to '.$data['name']);
                Log::info("Notification sent to " .$data['email']. " for " .$data['repayment_amount']. " due on " .$data['due_date']);
                dispatch(new SendPaymentReminder($data));
            }
        });
    }
}
