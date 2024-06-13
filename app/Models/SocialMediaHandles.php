<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SocialMediaHandles extends Model
{
    protected $fillable = [
        'facebook', 'instagram', 'linkedin', 'user_id'
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
