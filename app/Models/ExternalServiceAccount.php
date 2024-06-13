<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExternalServiceAccount extends Model
{
    public const MONO = 'mono';

    protected $fillable = [
        'user_id',
        'name',
        'account_id'
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
