<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DebitLog extends Model
{
    protected $fillable = ['loan_detail_id', 'amount', 'status', 'response'];

    public function loan_detail()
    {
        return $this->belongsTo('App\Models\LoanDetails');
    }
}
