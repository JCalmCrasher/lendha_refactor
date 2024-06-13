<?php
namespace App\Services\OnboardingService\BankKYCService\BVNValidationService;

use App\Models\BankDetails;
use App\Interfaces\KYC\IBVNCheck;
use App\Traits\NameResolutionTrait;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;

class BVNValidationService implements IBVNValidationService
{
    use NameResolutionTrait;

    private $bvnChecker;

    public function __construct(IBVNCheck $bvnChecker) {
        $this->bvnChecker = $bvnChecker;
    }

    public function bvnValidation(string $bvn, User $user)
    {
        try {
            $bvnDetails = $this->bvnChecker->bvnCheck($bvn, $user->name);

            if ($bvnDetails && $bvnDetails->status === true) {
                $bvnName = $bvnDetails->data->firstName . ' ' . ($bvnDetails->data->middleName ?? '') . ' ' . $bvnDetails->data->lastName;
                $namesMatch = $this->checkNameMatch($bvnName, $user->name, 2);

                if ($namesMatch) {
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