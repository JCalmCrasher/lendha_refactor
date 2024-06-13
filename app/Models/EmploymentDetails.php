<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmploymentDetails extends Model
{
    protected $fillable = [
        'name', 'email', 'site', 'address', 'phone', 'resumption_date', 'user_id'
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
