<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $fillable = [
        'name',
    ];

    protected $appends = [
        'officers'
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function getOfficersAttribute()
    {
        // return users whose type is either that of admin, subadmin or onboarding officer 
        return $this->users()->whereHas('type', function ($query) {
            $query->whereIn('type', [User::ADMIN_TYPE, User::SUB_ADMIN_TYPE, User::ONBOARDING_OFFICER_TYPE]);
        })->get();
    }
}
