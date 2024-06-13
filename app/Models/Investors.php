<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;

class Investors extends Model
{
    use SoftDeletes;
    
    protected $fillable = ['user_id', 'investment_plan_id', 'amount', 'status'];

    protected $with = ['plan', 'user'];

    protected $appends = ['returns', 'end_of_cycle'];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function plan()
    {
        return $this->belongsTo('App\Models\InvestmentPlan', 'investment_plan_id');
    }

    public function getEndOfCycleAttribute()
    {
        if ($this->plan) {
            return Carbon::parse($this->created_at)->addMonths($this->plan->duration);
        }
        return '';
    }

    public function getReturnsAttribute()
    {
        if ($this->plan) {
            return $this->amount + (($this->plan->interest * $this->amount)/100);
        }
        return 0;
    }
}
