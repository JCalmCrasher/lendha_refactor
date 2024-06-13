<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guarantor extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'address',
        'relationship',
        'business_type',
        'business_address',
        'guarantors_face_photo',
        'id_card',
        'proof_of_residence',
        'video',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
