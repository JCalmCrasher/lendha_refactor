<?php
namespace App\Services\OnboardingService\BankKYCService\BVNValidationService;

use App\Models\User;

interface IBVNValidationService
{
    /**
     * BVN validation
     */
    public function bvnValidation(string $bvn, User $user);

    public function getBvnDetails(string $bvn);
}
