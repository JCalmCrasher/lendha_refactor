<?php
namespace App\Services\OTPServices;

interface IOTP
{
    /**
     * Send OTP to selected channel (email or phone)
     * 
     * @param string $to
     */
    public function sendOTP(string $to): bool;

    /**
     * Verify OTP
     * 
     * @param string $to
     * @param string $otp
     * @param string $otp_id
     */
    public function verifyOTP(string $to, string $otp): bool;
}