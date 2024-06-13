<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessRegistration extends Model
{
    protected $fillable = [
        'cac_document',
        'business_registration_number',
    ];

    protected $hidden = ['business_id', 'created_at', 'updated_at'];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }
}
