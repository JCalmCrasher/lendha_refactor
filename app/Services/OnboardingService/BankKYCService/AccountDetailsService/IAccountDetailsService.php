<?php
namespace App\Services\OnboardingService\BankKYCService\AccountDetailsService;

use App\Models\User;

interface IAccountDetailsService
{
    /**
     * Account details validation
     */
    public function accountDetailsValidation(string $accountNumber, string $bank, User $user);
}