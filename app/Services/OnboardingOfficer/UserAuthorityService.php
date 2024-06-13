<?php
namespace App\Services\OnboardingOfficer;

use App\Models\LoanDetails;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;

class UserAuthorityService
{
    /**
     * Check if this officer can act on behalf of user
     * 
     * @param int $user
     * @return bool
     */
    public function canProxy(int $user_id)
    {
        try {
            $officer = Auth::user();
        $user = User::find($user_id);

        return $officer->id === $user->officer_id;
        } catch (Exception $e) {
            throw new Exception(
                "Error verifying authority.",
                401,
                $e
            );
        }
    }

    /**
     * Check if this officer can act on behalf of user using loans
     * 
     * @param int $loan_id
     * @return bool
     */
    public function canProxyLoan(int $loan_id)
    {
        $officer = Auth::user();
        $user = LoanDetails::find($loan_id)->user;

        return $officer->id === $user->officer_id;
    }
}