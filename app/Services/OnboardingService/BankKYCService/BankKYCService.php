<?php
namespace App\Services\OnboardingService\BankKYCService;

use App\Services\OnboardingService\BankKYCService\AccountDetailsService\IAccountDetailsService;
use App\Services\OnboardingService\BankKYCService\BVNValidationService\IBVNValidationService;
use App\Services\OnboardingService\BankKYCService\NINValidationService\ININValidationService;
use App\Models\User;
use Exception;

class BankKYCService
{
    /**
     * @var ININValidationService
     */
    private $ninValidationService;

    /**
     * @var IAccountDetailsService
     */
    private $accountDetailsService;

    /**
     * @var IBVNValidationService
     */
    private $bvnValidationService;

    public function __construct(
        ININValidationService $ninValidationService,
        IAccountDetailsService $accountDetailsService,
        IBVNValidationService $bvnValidationService
    ) {
        $this->ninValidationService = $ninValidationService;
        $this->accountDetailsService = $accountDetailsService;
        $this->bvnValidationService = $bvnValidationService;
    }

    /**
     * Bank KYC validation
     */
    public function bankKycValidation(string $nin, string $accountNumber, string $bank, string $bvn, User $user)
    {
        $ninValidation = $this->ninValidationService->ninValidation($nin, $user);
        $accountDetailsValidation = $this->accountDetailsService->accountDetailsValidation($accountNumber, $bank, $user);
        $bvnValidation = $this->bvnValidationService->bvnValidation($bvn, $user);

        if (!$ninValidation) {
            throw new Exception(
                "NIN validation failed.",
                400
            );
        }

        if (!$accountDetailsValidation) {
            throw new Exception(
                "Account details validation failed.",
                400
            );
        }

        if (!$bvnValidation) {
            throw new Exception(
                "BVN validation failed.",
                400
            );
        }

        if ($accountDetailsValidation) {
            return $accountDetailsValidation;
        }

        return false;
    }

    public function getBvnDetails(string $bvn)
    {
        return $this->bvnValidationService->getBvnDetails($bvn);
    }
}
