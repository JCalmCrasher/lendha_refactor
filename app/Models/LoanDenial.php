<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoanDenial extends Model
{
    protected $fillable = [
        'loan_detail_id', 'reason'
    ];

    public function loan_detail()
    {
        return $this->belongsTo('App\Models\LoanDetails');
    }
}
