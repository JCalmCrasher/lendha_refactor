<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class BankStatement extends Model
{
    protected $fillable = [
        'loan_detail_id',
        'data'
    ];

    public function loan()
    {
        return $this->belongsTo('App\Models\LoanDetails', 'loan_detail_id', 'id');
    }

    protected function data(): Attribute
    {
        return Attribute::make(
            get: fn($value) => json_decode($value, false, 512, JSON_THROW_ON_ERROR)
        );
    }
}
