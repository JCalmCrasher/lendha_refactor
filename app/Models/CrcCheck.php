<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrcCheck extends Model
{
    protected $fillable = [
        'loan_detail_id',
        'data'
    ];

    public function loan()
    {
        return $this->belongsTo('App\Models\LoanDetails', 'loan_detail_id', 'id');
    }
}
