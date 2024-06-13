<?php
namespace App\Services\OnboardingService\BankKYCService\NINValidationService;

use App\Models\User;

interface ININValidationService
{
    /**
     * NIN validation
     */
    public function ninValidation(string $nin, User $user);
}