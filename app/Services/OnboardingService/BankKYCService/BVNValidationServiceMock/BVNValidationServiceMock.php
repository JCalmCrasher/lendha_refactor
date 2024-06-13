<?php
namespace App\Services\OnboardingService\BankKYCService\BVNValidationServiceMock;

use App\Models\BankDetails;
use App\Interfaces\KYC\IBVNCheck;
use App\Services\OnboardingService\BankKYCService\BVNValidationService\IBVNValidationService;
use App\Traits\NameResolutionTrait;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;

class BVNValidationServiceMock implements IBVNValidationService
{
    use NameResolutionTrait;

    private $bvnChecker;

    public function __construct(IBVNCheck $bvnChecker) {
        $this->bvnChecker = $bvnChecker;
    }

    public function bvnValidation(string $bvn, User $user)
    {
        try {
            $bvnDetails = $this->bvnChecker->bvnCheck($bvn);

            if ($bvnDetails && $bvnDetails->status === true) {
                $bvnName = $bvnDetails->data->firstName . ' ' . ($bvnDetails->data->middleName ?? '') . ' ' . $bvnDetails->data->lastName;
                $namesMatch = $this->checkNameMatch($bvnName, 'Test Test', 2);

                if ($namesMatch && $user->name) {
                    return true;
                }

                throw new Exception(
                    "BVN name does not match user name.",
                    400
                );
            }

            throw new Exception(
                ($bvnDetails && isset($bvnDetails->message)) ? $bvnDetails->message : "BVN validation failed.",
                400
            );
        } catch (Exception $e) {
            Log::error($e->getMessage());
            throw new Exception(
                $e->getMessage(),
                $e->getCode()
            );
        }
        return false;
    }

    public function getBvnDetails(string $bvn): array
    {
        $bvnDetails = $this->bvnChecker->bvnCheck($bvn);

        return collect((array)$bvnDetails->data)->only([
            'bvn', 'firstName', 'middleName', 'lastName', 'dateOfBirth',
            'nin', 'phoneNumber1', 'phoneNumber2'])->toArray();

    }
}
