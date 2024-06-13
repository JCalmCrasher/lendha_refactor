<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DefaultHistory extends Model
{
    protected $fillable = ['loan_detail_id', 'status', 'duration_days'];

    public function loan_detail()
    {
        return $this->belongsTo('App\Models\LoanDetails', 'loan_detail_id');
    }
}
