<?php
namespace App\Interfaces\KYC;

interface ICACCheck
{
    public function cacCheck(string $rcNumber, string $companyName, string $companyType);
}
