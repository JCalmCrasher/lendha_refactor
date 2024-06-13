<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    protected $fillable = [
        'name',
        'email',
        'category',
        'description',
        'address_number',
        'street',
        'city',
        'state',
        'landmark',
        'business_pictures',
        'business_age',
        'shop_receipt'
    ];

    protected $appends = ['registration_status'];

    protected $casts = [
        'business_pictures' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function business_registration()
    {
        return $this->hasOne(BusinessRegistration::class, 'business_id', 'id');
    }

    public function getRegistrationStatusAttribute()
    {
        if ($this->business_registration) {
            return true;
        } else {
            return false;
        }
    }

    public static function boot() {
        parent::boot();

        static::deleting(function($business) { // before delete() method call this
            $business->business_registration()->delete();
        });
    }
}
