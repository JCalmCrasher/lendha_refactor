<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use phpDocumentor\Reflection\Types\This;

class CovidModel extends Model
{

    protected $fillable = [
         'loan_purpose', 'loan_amount', 'loan_term'
    ];
    public function user(){
        return $this->belongsTo(User::class);
    }
}
