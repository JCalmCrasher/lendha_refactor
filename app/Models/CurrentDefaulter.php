<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CurrentDefaulter extends Model
{
    protected $fillable = ['loan_detail_id', 'owed_amount'];

    public function loan_detail()
    {
        return $this->belongsTo('App\Models\LoanDetails', 'loan_detail_id');
    }
}
