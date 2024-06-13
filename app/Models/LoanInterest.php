<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoanInterest extends Model
{
    const DAILYLOANREPAYMENTDURATION = 30;
    const WEEKLYLOANREPAYMENTDURATION = 28;

    protected $fillable = ['purpose', 'interest', 'repayment_duration', 'moratorium'];

    public function loans()
    {
        return $this->hasMany('App\Models\LoanDetails');
    }
}
