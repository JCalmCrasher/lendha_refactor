<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class GuarantorPolicy
{
    use HandlesAuthorization;

    public function create(User $user)
    {
        return !$user->hasActiveLoan();
    }

    public function onboardingCreate(User $user, User $onboardedUser)
    {
        return ($user->isOnboardingOfficer() || $user->isTeamLead()) && !$onboardedUser->hasActiveLoan();
    }
}
