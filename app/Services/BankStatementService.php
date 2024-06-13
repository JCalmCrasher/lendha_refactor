<?php

namespace App\Services;

use App\Interfaces\Bank\IBankStatement;
use App\Models\User;
use App\Traits\NameResolutionTrait;
use Exception;
use Illuminate\Support\Facades\Log;

class BankStatementService
{
    use NameResolutionTrait;

    public function __construct(private readonly IBankStatement $bankStatement)
    {
    }

    public function getBankStatement(User $user, string $code): array
    {
        try {
            $accountId = $this->bankStatement->getAuthId($code);
            $accountInfo = $this->bankStatement->getAccountInfo($accountId, $user->name);

            if (!$accountInfo) {
                throw new Exception('No account information found for the given code.');
            }

            $accountName = $accountInfo['name'];
            $namesMatch = $this->checkNameMatch($accountName, $user->name);

            if (!$namesMatch) {
                $previous = new Exception($accountName);
                throw new Exception('Account names do not match', previous: $previous);
            }

            $bankStatement = $this->bankStatement->getBankStatement($accountId);

            return [
                'account_id' => $accountId,
                'bank_statement' => $bankStatement
            ];
        } catch (Exception $e) {
            Log::error($e->getMessage());
            throw new Exception(
                $e->getMessage(),
                $e->getCode(),
                $e->getPrevious()
            );
        }
    }
}
