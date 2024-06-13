<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAccount extends Model
{
    protected $fillable = [
        'account_number',
        'account_name',
        'bank_name',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'user_id',
        'id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function paymentLogs()
    {
        return $this->hasMany(UserAccountPaymentLog::class);
    }
}
