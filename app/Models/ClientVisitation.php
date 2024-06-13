<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientVisitation extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'employment_type',
        'business_name',
        'business_address',
        'business_image',
        'business_description',
        'business_directions',
        'business_visitation_date',
        'residence_state',
        'residence_address',
        'residence_outside_image',
        'residence_utility_bill_image',
        'residence_directions',
        'residence_inside_image',
        'residence_visitation_date',
    ];
}
