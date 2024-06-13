<?php
namespace App\Interfaces\KYC;

interface IBVNCheck
{
    public function bvnCheck($bvn, ?string $name= null);
}
