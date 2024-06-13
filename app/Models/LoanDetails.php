<?php

namespace App\Models;

use App\Enums\LoanStatus;
use App\Enums\PaymentStatus;
use App\Enums\RepaymentDurations;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use App\Utilities\Calculations;
use Exception;
use Illuminate\Support\Facades\Log;

class LoanDetails extends Model
{
    protected $fillable = [
        'application_id',
        'amount',
        'approved_amount',
        'request_date',
        'purpose',
        'status',
        'duration',
        'team_lead_approval',
        'team_lead_denial_reason',
        'loan_reason',
        'bank_statement',
    ];

    protected $appends = [
        'open_duration',
        'monthly_payment',
        'total_expected_payment',
        'loan_denial_reason',
        'loan_end_date',
        'loan_officer',
        'crc_score'
    ];

    protected $casts = [
        'team_lead_approval' => 'boolean'
    ];

    protected $hidden = ['loan_denial', 'subadmin_id', 'subadmin', 'loan_type'];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function merchant()
    {
        return $this->belongsTo('App\Models\Merchant');
    }

    public function loan_type()
    {
        return $this->belongsTo('App\Models\LoanInterest', 'loan_interest_id', 'id');
    }

    public function payments()
    {
        return $this->hasMany('App\Models\LoanPayments');
    }

    public function debit_log()
    {
        return $this->hasMany('App\Models\DebitLog');
    }

    public function default_information()
    {
        return $this->hasOne('App\Models\CurrentDefaulter', 'loan_detail_id');
    }

    public function loan_denial()
    {
        return $this->hasOne('App\Models\LoanDenial', 'loan_detail_id');
    }

    public function default_history()
    {
        return $this->hasMany('App\Models\DefaultHistory', 'loan_detail_id');
    }

    public function subadmin()
    {
        return $this->hasOne('App\Models\User', 'id', 'subadmin_id');
    }

    public function paymentReceipts()
    {
        return $this->hasMany('App\Models\PaymentReceipt');
    }

    public function bankStatement()
    {
        return $this->hasOne('App\Models\BankStatement', 'loan_detail_id');
    }

    public function crcCheck()
    {
        return $this->hasOne('App\Models\CrcCheck', 'loan_detail_id');
    }

    /**
     * Loan End Date
     */
    public function getLoanEndDateAttribute()
    {
        try {
            if ($this->status == LoanStatus::APPROVED) {
                return Carbon::parse($this->request_date)->addMonth($this->duration);
            }
            return null;
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Get loan officer
     */
    public function getLoanOfficerAttribute()
    {
        try {
            if ($this->subadmin) {
                return $this->subadmin->name;
            }

            if ($this->user->officer) {
                return $this->user->officer->name;
            }

            return null;
        } catch (Exception $e) {
            return null;
        }
    }

    public function getPrincipalAttribute()
    {
        return ($this->approved_amount ? $this->approved_amount : $this->amount) ?? 0.00;
    }

    public function getRateAttribute()
    {
        if ($this->loan_type) {
            return $this->loan_type->interest;
        }

        $purpose = LoanInterest::where('purpose', $this->purpose)->get()->first();
        $interest = $purpose ? $purpose['interest'] : 8;

        return $interest;
    }

    public function getRepaymentDurationAttribute()
    {
        if ($this->loan_type) {
            return $this->loan_type->repayment_duration;
        }

        $purpose = LoanInterest::where('purpose', $this->purpose)->get('repayment_duration')->first();
        $repayment_duration = $purpose ? $purpose['repayment_duration'] : RepaymentDurations::MONTHLY;

        return $repayment_duration;
    }

    public function getTotalInterestAttribute()
    {
        return $this->principal * ($this->rate/100) * ($this->duration ?? 1);
    }

    public function getTenorAttribute()
    {
        try {
            switch ($this->loan_type->repayment_duration) {
                case RepaymentDurations::DAILY:
                    $tenor_in_days = ($this->duration * LoanInterest::DAILYLOANREPAYMENTDURATION) - $this->loan_type->moratorium;

                    return $tenor_in_days;

                case RepaymentDurations::WEEKLY:
                    $tenor_in_days = ($this->duration * LoanInterest::DAILYLOANREPAYMENTDURATION) - $this->loan_type->moratorium;

                    return intval($tenor_in_days/7);

                case RepaymentDurations::MONTHLY:

                    return $this->duration;

                default:
                    return $this->duration;
            }

        } catch (Exception $e) {
            Log::error($e->getMessage());
        }

        return $this->duration;

    }

    public function getInstalmentAttribute()
    {
        return round(($this->principal + $this->total_interest) / $this->tenor, 2);
    }

    public function getMonthlyPaymentAttribute()
    {
        $principal = $this->approved_amount ? $this->approved_amount : $this->amount;
        $principal = $principal ? $principal : 0.00;
        $interest = null;
        if ($this->loan_interest_id) {
            $interest = $this->loan_type->interest;
        } else {
            $interest = Calculations::interest_rate($this->purpose ?? '');
        }
        $duration = $this->duration ? $this->duration : 1;
        $ci = Calculations::compound_interest($principal, $interest, $duration);
        return $ci['monthly'];
    }

    public function getPurposeAttribute($value)
    {
        $purpose = is_numeric($value) ? (
            LoanInterest::find($value) ? LoanInterest::find($value)->purpose : $value
        ) : $value;
        return $purpose;
    }

    public function getTotalExpectedPaymentAttribute()
    {
        $principal = $this->approved_amount ? $this->approved_amount : $this->amount;
        $principal = $principal ? $principal : 0.00;
        $purpose = $this->purpose ? $this->purpose : '';
        $duration = $this->duration ? $this->duration : 1;
        $ci = Calculations::compound_interest($principal, Calculations::interest_rate($purpose), $duration);
        return $ci['total'];
    }

    public function getLoanDenialReasonAttribute()
    {
        if (!isset($this->loan_denial)) {
            return "";
        }
        return $this->loan_denial->reason ? $this->loan_denial->reason : "";
    }

    public function getDueDateAttribute()
    {
        if ($this->status == LoanStatus::APPROVED) {
            $incomplete_payment = $this->payments()->where('status', PaymentStatus::INCOMPLETE)->first();

            if ($incomplete_payment) {
                return $incomplete_payment->due_date ?? null;
            }
        }
        return null;
    }

    public function getOpenDurationAttribute()
    {
        if ($this->status == "pending") {
            $diff = Carbon::parse($this->request_date)->longAbsoluteDiffForHumans(now());
            return $diff;
        }
    }

    public function getCrcScoreAttribute()
    {
        if ($this->crcCheck()->exists()) {
            $decodedData = json_decode($this->crcCheck()->first()->data, true, 512, JSON_THROW_ON_ERROR);

            $crcCheck = $decodedData['ConsumerHitResponse']['BODY']['CREDIT_SCORE_DETAILS'];

            return $crcCheck['CREDIT_SCORE_SUMMARY']['CREDIT_SCORE'] ?? null;
        }
    }

}
