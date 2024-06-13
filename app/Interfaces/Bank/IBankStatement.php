<?php

namespace App\Interfaces\Bank;

use App\Models\User;

interface IBankStatement
{
    public function getBankStatement(string $accountId): mixed;

    public function getAccountInfo(string $accountId, string $name): ?array;

    public function getAuthId(string $code): ?string;

    public function getJobStatus(string $accountId, string $jobId): ?array;
}
