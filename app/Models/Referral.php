<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Referral extends Model
{
    protected $fillable = [
        'user_id', 'referrer_email', 'referrer_id'
    ];

    protected $hidden = [
        'user_id', 'user'
    ];

    protected $append = [
        'email'
    ];
    
    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function getEmailAttribute()
    {
        return $this->user()->email;
    }
}
