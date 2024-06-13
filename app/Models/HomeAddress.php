<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeAddress extends Model
{
    protected $fillable = [
        'number',
        'street_name',
        'landmark',
        'city',
        'local_government',
        'state',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
