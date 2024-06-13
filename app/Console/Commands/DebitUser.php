<?php

namespace App\Console\Commands;

use App\Models\DebitLog;
use App\Models\LoanDetails;
use App\Utilities\ExternalApiCalls;
use Illuminate\Console\Command;
use Carbon\Carbon;

class DebitUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'debit:user {id} {amount}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Auto debit a single user';

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
        $application_id = $this->argument('id');
        $amount = $this->argument('amount');
        
        if ($application_id && $amount) {
            $this_loan = LoanDetails::where('application_id', $application_id)->first();
            $user = $this_loan ? $this_loan->user : false;
            $credentials = $user ? $user->payment_credentials : false;
            
            $loan_id = $this_loan ? $this_loan->id : false;
            $try_again = 0;

            if ($credentials) {
                /**
                 * if the transaction was processed then check if the amount is the full amount. 
                    *If it is the full amount then remove user from the table and put him in history log
                    *else do nothing
                 * if the amount was not processed (false) try again with the same amount
                 * if the result is insufficient balance then try again with an amount that is less than the previous amount but is greater than 5k
                */
                do {
                    $debit_result = $this->debit($amount, $credentials, $loan_id);
                    $this->info($debit_result);
                    if ($debit_result == $amount) {
                        $amount_paid = $debit_result/100;
                        $payment = $this_loan->payments->where('completed', false);
                        foreach ($payment as $a_payment) {
                            if ($amount_paid > 0 && $amount_paid >= $a_payment->total_due) {
                                $a_payment->user_payment = $a_payment->total_due;
                                $amount_paid = $amount_paid - $a_payment->total_due;
                            } elseif ($amount_paid > 0 && $amount_paid < $a_payment->total_due) {
                                $a_payment->user_payment = $amount_paid;
                                $amount_paid = 0;
                            }
                            $a_payment->save();
                        }
                        $this->info('Success');
                    } else if (stripos($debit_result, 'Insufficient funds')!==false) {
                        $amount = $amount - 100000;
                        $this->warn('Insufficient funds');
                    } else if ($debit_result === false) {
                        $try_again = $try_again + 1;
                        $this->warn("Trying again. Trial time: $try_again");
                    } else if (is_numeric($debit_result) && $debit_result > 0) {
                        //user was debited but not the full amount
                        $amount_paid = $debit_result/100;
                        $payment = $this_loan->payments->where('completed', false);
                        foreach ($payment as $a_payment) {
                            if ($amount_paid > 0 && $amount_paid >= $a_payment->total_due) {
                                $a_payment->user_payment = $a_payment->total_due;
                                $amount_paid = $amount_paid - $a_payment->total_due;
                            } elseif ($amount_paid > 0 && $amount_paid < $a_payment->total_due) {
                                $a_payment->user_payment = $amount_paid;
                                $amount_paid = 0;
                            }
                            $a_payment->save();
                        }

                        $defaulter->owed_amount = $defaulter->owed_amount - ($debit_result/100);
                        $defaulter->save();
                        $this->warn('Partial debit.');
                    } 
                    
                } while (($debit_result === false && $try_again < 3) || ((stripos($debit_result, 'Insufficient funds') !== false) && $amount > 500000));
                
            } else {
                $this->error('user or payment details does not exist');
            }
        } else {
            $this->error('error reading id or amount');
        }

    }

    public function debit($amount, $credentials, $loan_id)
    {
        $api_key = ($credentials->api_key == 'bazuze') ? config('paystack.bazuzekey') : config('paystack.lendhakey');
        
        $http_response = ExternalApiCalls::send(
            'POST',
            'https://api.paystack.co/transaction/charge_authorization',
            [
                'Authorization' => 'Bearer '.$api_key, 
                'Content-Type' => 'application/json'
            ],
            [
                'amount' => $amount,
                'authorization_code' => $credentials->authorization_code,
                'email' => $credentials->payment_email
            ]
        );

        if ($http_response['message'] == "success") {
            $json_data = json_decode($http_response['data']);
            $json_data = $json_data->data;

            $this->info($http_response['data']);

            if ($json_data->status == 'success') {
                //save to db log
                $log = new DebitLog();
                $log->amount = $amount/100;
                $log->response = $json_data->gateway_response;
                $log->status = 'success';
                $log->loan_detail_id = $loan_id;
                $log->save();

                return $amount;
            }
            $log = new DebitLog();
            $log->amount = $amount/100;
            $log->response = $json_data->gateway_response;
            $log->status = 'failed';
            $log->loan_detail_id = $loan_id;
            $log->save();
            
            return $json_data->gateway_response;
        }
        $this->info(json_encode($http_response));
        return false;
    }
}
