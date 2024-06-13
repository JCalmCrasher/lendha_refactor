<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class NextOfKinPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->isAdmin();
    }

    public function viewAnyBranch(User $user)
    {
        return $user->isTeamLead() || $user->isAdmin();
    }

    public function onboardingViewAny(User $user)
    {
        return ($user->isOnboardingOfficer());
    }

    public function onboardingCreate(User $user, User $onboardedUser)
    {
        return ($user->isOnboardingOfficer() || $user->isTeamLead()) && !$onboardedUser->hasActiveLoan();
    }

    public function view(User $user, User $nextOfKin)
    {
        return $user->isAdmin() || $user->id === $nextOfKin->user_id || ($user->isTeamLead() && $user->branch_id === $nextOfKin->user->branch_id) || ($user->isOnboardingOfficer() && $user->id === $nextOfKin->user->officer_id);
    }

    public function delete(User $user, User $nextOfKin)
    {
        return $user->isAdmin() || $user->id === $nextOfKin->user_id || ($user->isTeamLead() && $user->branch_id === $nextOfKin->user->branch_id) || ($user->isOnboardingOfficer() && $user->id === $nextOfKin->user->officer_id);
    }

    public function create(User $user)
    {
        return !$user->hasActiveLoan();
    }
}
