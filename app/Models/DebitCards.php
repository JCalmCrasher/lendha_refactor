<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DebitCards extends Model
{
    protected $fillable = [
        'card_number', 'card_expiry', 'cvv', 'user_id'
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
