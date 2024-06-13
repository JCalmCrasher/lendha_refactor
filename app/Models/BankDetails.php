<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankDetails extends Model
{
    protected $fillable = [
        'account_number', 'account_name', 'bank_name', 'bvn', 'user_id', 'nin'
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
