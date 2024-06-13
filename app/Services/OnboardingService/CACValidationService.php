<?php

namespace App\Services\OnboardingService;

use App\Interfaces\KYC\ICACCheck;
use App\Models\User;
use App\Traits\NameResolutionTrait;
use Exception;
use Illuminate\Support\Facades\Log;

class CACValidationService
{
    use NameResolutionTrait;

    private $cacChecker;

    public function __construct(ICACCheck $cacChecker)
    {
        $this->cacChecker = $cacChecker;
    }

    public function cacValidation(string $rcNumber, string $companyName, string $companyType, User $user): bool
    {
        try {
            $cacDetails = $this->cacChecker->cacCheck($rcNumber, $companyName, $companyType);

            if ($cacDetails && $cacDetails->status === true) {
                $businessName = $cacDetails->data->company_name;
                $namesMatch = $this->checkNameMatch($businessName, $user?->business?->name, 2);

                if ($namesMatch) {
                    return true;
                }

                throw new Exception(
                    "Business name does not match.",
                    400
                );
            }

            throw new Exception(
                ($cacDetails && isset($cacDetails->message)) ? $cacDetails->message : "Business name validation failed.",
                400
            );
        } catch (Exception $e) {
            Log::error($e->getMessage());
            throw new Exception(
                $e->getMessage(),
                $e->getCode()
            );
        }
    }
}
