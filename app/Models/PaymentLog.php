<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentLog extends Model
{
    protected $fillable = [
        'loan_payments_id', 'payment'
    ];

    public function payment()
    {
        return $this->belongsTo('App\Models\LoanPayments');
    }
}
