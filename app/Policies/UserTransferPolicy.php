<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserTransferPolicy
{
    use HandlesAuthorization;

    public function create(User $user, User $loanUser, User $newOfficer)
    {
        return ($user->isTeamLead() && $user->branch_id === $loanUser->branch_id && $user->branch_id === $newOfficer->branch_id)
            || ($user->isAdmin() && $user->branch_id === $newOfficer->branch_id);
    }
}
