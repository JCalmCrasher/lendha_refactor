<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserDocuments extends Model
{
    protected $fillable = [
        'passport_photo', 'work_id', 'valid_id', 'residence_proof', 'user_id', 'valid_id_back'
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
