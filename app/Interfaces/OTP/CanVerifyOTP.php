<?php
namespace App\Interfaces\OTP;


interface CanVerifyOTP
{
    public function verifyOTP(string $otp): bool;
}