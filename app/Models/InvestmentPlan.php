<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvestmentPlan extends Model
{
    protected $fillable = ['name', 'min_amount', 'max_amount', 'duration', 'interest', 'status'];
}
