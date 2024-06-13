<?php

namespace App\Policies;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function viewUsersByBranch(User $user, Branch $branch)
    {
        return ($user->isTeamLead() && $user->branch_id === $branch->id) || $user->isAdmin();
    }

    public function viewUserByBranch(User $user, User $loan_user)
    {
        return ($user->isTeamLead() && $user->branch_id === $loan_user->branch_id) || $user->isAdmin();
    }
}
