<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Merchant extends Model
{
    protected $fillable = ['name', 'code'];

    public function loans()
    {
        return $this->hasMany('App\Models\LoanDetails');
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User', 'users_id');
    }
}
