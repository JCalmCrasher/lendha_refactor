<?php
namespace App\Services\OnboardingService\BankKYCService\AccountDetailsService;

use App\Services\ApiResponse;
use App\Services\IAccountResolutionService;
use App\Traits\NameResolutionTrait;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;

class AccountDetailsService implements IAccountDetailsService
{
    use NameResolutionTrait;
    
    private $accountResolver;

    public function __construct(IAccountResolutionService $accountResolver) {
        $this->accountResolver = $accountResolver;
    }
    
    /**
     * Account details validation
     */
    public function accountDetailsValidation(string $accountNumber, string $bank, User $user)
    {
        try {
            $accountResolution = $this->accountResolver->resolve($accountNumber, $bank);

            if ($accountResolution->getStatus() === true) {
                $accountResolverName = $accountResolution->getData()->account_name;

                $namesMatch = $this->checkNameMatch($accountResolverName, $user->name, 2);

                if ($namesMatch) {
                    return $accountResolverName;
                }

                return false;
            }

            return false;
        } catch (Exception $e) {
            Log::error($e->getMessage());

            throw new Exception(
                "Could not resolve account name.",
                400,
                $e
            );
        }
    }
}