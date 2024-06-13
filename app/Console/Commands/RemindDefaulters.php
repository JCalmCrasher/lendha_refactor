<?php

namespace App\Console\Commands;

use App\Models\CurrentDefaulter;
use Illuminate\Console\Command;
use App\Jobs\SendDefaultNotice;
use Carbon\Carbon;

class RemindDefaulters extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'defaulters:remind';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remind clients of due payment';

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
        $defaulters = CurrentDefaulter::all();
        $defaulter = $defaulters->first();
        
        foreach ($defaulters as $defaulter) {
            $data = [];
            $data['email'] = $defaulter->loan_detail->user->email;
            $data['name'] = $defaulter->loan_detail->user->name;
            $data['repayment_amount'] = $defaulter->owed_amount;
            $data['due_date'] = Carbon::parse($defaulter->loan_detail->approval_date)->addMonth()->toFormattedDateString();
            dispatch(new SendDefaultNotice($data));
        }
    }
}
