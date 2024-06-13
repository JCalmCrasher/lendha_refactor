<?php

namespace App\Policies;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class LoanPolicy
{
    use HandlesAuthorization;

    public function viewLoansByBranch(User $user, Branch $branch)
    {
        return ($user->isTeamLead() && $user->branch_id === $branch->id) || $user->isAdmin();
    }

    public function viewLoanDetailByBranch(User $user, User $loan_user)
    {
        return ($user->isTeamLead() && $user->branch_id === $loan_user->branch_id) || $user->isAdmin();
    }

    public function reviewLoans(User $user, User $loan_user)
    {
        return ($user->isTeamLead() && $user->branch_id === $loan_user->branch_id) || $user->isAdmin();
    }
}
