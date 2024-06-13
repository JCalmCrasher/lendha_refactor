<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAccountPaymentLog extends Model
{
    protected $fillable = [
        'transaction_id',
        'user_account_id',
        'amount',
        'transaction_date',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'laravel_through_key'
    ];

    public function userAccount()
    {
        return $this->belongsTo(UserAccount::class);
    }
}
