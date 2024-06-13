<?php
namespace App\Traits;

use App\Utilities\RandomNumberUtility;
use Illuminate\Support\Facades\Cache;

trait OTPTrait
{
    /**
     * Generate a random OTP
     *
     * @return string
     */
    private function generateRandomOTP(): string
    {
        return RandomNumberUtility::generate_numeric(config('otp.pin_length', 6));
    }

    /**
     * Save the OTP
     *
     * @param string $otp
     * @param string $recipient
     * @param string $expiration
     * @return void
     */
    private function saveOTP(string $otp, string $recipient, string $expiration): void
    {
        Cache::put($this->getOTPKey($otp, $recipient), $otp, $expiration);
    }

    /**
     * Get the OTP
     *
     * @param string $otp
     * @param string $recipient
     * @return string|null
     */
    private function getOTP(string $otp, string $recipient): ?string
    {
        return Cache::get($this->getOTPKey($otp, $recipient));
    }

    /**
     * Delete the OTP
     *
     * @param string $otp
     * @return void
     */
    private function deleteOTP(string $otp): void
    {
        Cache::forget($this->getOTPKey($otp));
    }

    private function setOTPID(string $to, string $otp_id)
    {
        Cache::add("OTP ID: $to", $otp_id, $this->cacheLife);
    }

    private function getOTPID($to): string
    {
        return Cache::get("OTP ID: $to", '');
    }

    private function deleteOTPID($to)
    {
        Cache::delete("OTP ID: $to");
    }

    /**
     * Get the OTP key
     *
     * @param string $otp
     * @param string $recipient
     * @return string
     */
    private function getOTPKey(string $otp, string $recipient = ''): string
    {
        return "otp:{$otp}:{$recipient}";
    }
}