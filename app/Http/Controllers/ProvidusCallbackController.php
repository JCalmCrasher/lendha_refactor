<?php

namespace App\Http\Controllers;

use App\Events\PaymentReceived;
use App\Models\UserAccount;
use App\Models\UserAccountPaymentLog;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ProvidusCallbackController extends Controller
{
    public function __construct() {
        $this->middleware('providus.signature');
    }

    public function payment(Request $request)
    {
        // {
        //     "sessionId":"0000042103011805345648005069266636442357859508",
        //     "accountNumber":"9977581536",
        //     "tranRemarks":"FROM UBA/ CASAFINA CREDIT-EASY LOAN-NIP/SEYI OLUFEMI/CASAFINA CAP/0000042103015656180548005069266636",
        //     "transactionAmount":"1",
        //     "settledAmount":"1",
        //     "feeAmount":"0",
        //     "vatAmount":"0",
        //     "currency":"NGN",
        //     "initiationTranRef":"",
        //     "settlementId":"202210301006807600001432",
        //     "sourceAccountNumber":"2093566866",
        //     "sourceAccountName":"CASAFINA CREDIT-EASY LOAN",
        //     "sourceBankName":"UNITED BANK FOR AFRICA",
        //     "channelId":"1",
        //     "tranDateTime":"2021-03-01 18:06:20.000"
        //     }
        try {
            $request->validate([
                'settlementId' => 'required',
                'accountNumber' => 'required|numeric',
                'transactionAmount' => 'required|numeric',
                'tranDateTime' => 'required|date_format:Y-m-d H:i:s',
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage(), $request->all());

            return response()->json([
                'requestSuccessful' => true,
                'sessionId' => $request->sessionId,
                'responseMessage' => 'rejected transaction',
                'responseCode' => '02',
            ]);
        }

        $settlementId = $request->settlementId;

        $payment = UserAccountPaymentLog::firstOrNew(['transaction_id' => $settlementId]);

        if ($payment->exists) {
            return response()->json([
                'requestSuccessful' => true,
                'sessionId' => $request->sessionId,
                'responseMessage' => 'duplicate transaction',
                'responseCode' => '01',
            ]);
        }

        Log::channel('providus_payments')->info('payment callback', $request->all());

        $userAccount = UserAccount::where('account_number', $request->accountNumber)->first();

        if (!$userAccount || !$userAccount->exists) {
            return response()->json([
                'requestSuccessful' => true,
                'sessionId' => $request->sessionId,
                'responseMessage' => 'failed transaction',
                'responseCode' => '02',
            ]);
        }

        $payment->transaction_id = $settlementId;
        $payment->user_account_id = $userAccount->id;
        $payment->amount = $request->transactionAmount;
        $payment->transaction_date = $request->tranDateTime;
        $payment->save();

        activity()->causedBy($userAccount->user)->performedOn($payment)->log('Payment received');

        event(new PaymentReceived($userAccount, $request->transactionAmount, $request->tranDateTime));

        return response()->json([
            "requestSuccessful" => true,
            "sessionId" => $request->sessionId,
            "responseMessage" => "success",
            "responseCode" => "00"
        ]);
    }
}
