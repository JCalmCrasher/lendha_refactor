<?php
namespace App\Interfaces\Bank;

use App\Models\User;

interface IBank
{
    public function createReservedAccount(User $user): ?array;
}