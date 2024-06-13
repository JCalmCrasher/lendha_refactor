<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class LoanPayments extends Model
{
    protected $fillable = ['intended_payment', 'user_payment', 'due_date', 'penalty', 'status'];

    protected $appends = ['total_due', 'instalment_principal', 'instalment_principal_paid', 'loan_balance', 'late_instalment_principal', 'interest', 'interest_paid', 'late_interest', 'late_days'];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
    
    public function loan()
    {
        return $this->belongsTo('App\Models\LoanDetails', 'loan_details_id');
    }

    public function payment_log()
    {
        return $this->hasMany('App\Models\PaymentLog');
    }

    public function getTotalDueAttribute()
    {
        return $this->intended_payment + $this->penalty;
    }

    public function getInstalmentPrincipalAttribute()
    {
        return ceil($this->loan->approved_amount / $this->loan->duration);
    }

    public function getInstalmentPrincipalPaidAttribute()
    {
        $balance = $this->instalment_principal - $this->user_payment;

        return $balance < 0 ? $this->instalment_principal : $this->user_payment;
    }

    public function getLoanBalanceAttribute()
    {
        return ($this->intended_payment + $this->penalty) - $this->user_payment;
    }

    public function getLateInstalmentPrincipalAttribute()
    {
        return $this->instalment_principal - $this->instalment_principal_paid;
    }
    
    public function getInterestAttribute()
    {
        return $this->intended_payment - $this->instalment_principal;
    }

    public function getInterestPaidAttribute()
    {
        if ($this->user_payment <= $this->instalment_principal) {
            return 0;
        } 
        
        if ($this->user_payment > $this->instalment_principal && $this->user_payment < $this->intended_payment) {
            return $this->user_payment - $this->instalment_principal;
        }
        
        if ($this->user_payment == $this->intended_payment) {
            return $this->interest;
        }

        return 0;
    }

    public function getLateInterestAttribute()
    {
        return $this->interest - $this->interest_paid;
    }

    public function getLateDaysAttribute()
    {
        $due_date = Carbon::parse($this->due_date);
        $today = Carbon::now();

        return $today->diffInDays($due_date);
    }


}
