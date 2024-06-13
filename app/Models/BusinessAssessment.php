<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessAssessment extends Model
{
    protected $fillable = [
        'sales',
        'cost_of_sales',
        'gross_profit',
        'operational_expenses',
        'net_profit',
        'family_and_other_expenses',
        'repayment_capacity',
        'user_id',
        'daily_sales'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
