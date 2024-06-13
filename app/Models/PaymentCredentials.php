<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentCredentials extends Model
{
    protected $fillable = [
        'payment_signature', 'authorization_code', 'payment_email', 'user_id'
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
