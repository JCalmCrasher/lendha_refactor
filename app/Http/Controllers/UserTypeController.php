<?php

namespace App\Http\Controllers;

use App\Models\UserType;

class UserTypeController extends Controller
{
   public function __invoke()
   {
       return UserType::whereIn('type', ['team_lead', 'onboarding_officer', 'merchant', 'finance'])->select(['id', 'type'])->get();
   }
}
