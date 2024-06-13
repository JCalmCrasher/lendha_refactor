<?php
namespace App\Services\OnboardingService\BankKYCService\NINValidationService;

use App\Models\BankDetails;
use App\Models\User;

class NINValidationService implements ININValidationService
{

    public function ninValidation(string $nin, User $user)
    {
        $check = BankDetails::where('nin', $nin)->first();

        return $check === null || $check->user_id === $user->id;
    }
}