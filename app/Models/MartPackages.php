<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MartPackages extends Model
{
    protected $fillable = ['name', 'price', 'description', 'duration'];
    
}