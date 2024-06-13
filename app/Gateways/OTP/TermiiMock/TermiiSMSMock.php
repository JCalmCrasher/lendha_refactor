<?php
namespace App\Gateways\OTP\TermiiMock;

use App\Traits\OTPTrait;
use Exception;

class TermiiSMSMock
{
    use OTPTrait;
    
    private $cacheLife;
    private $pinId;

    public function __construct()
    {
        $this->pinId = '123456';
        $this->cacheLife = config('otp.pin_expiry', 2) * 60;
    } 

    public function sendOTP(string $to): bool
    {
        try {
            if ($this->getOTPID($to)) {
                throw new Exception('Please wait for 2 minutes before attempting to resend OTP.', 400);
            }
            $this->setOTPID($to, $this->pinId);
            return true;
        } catch (Exception $e) {
            throw new Exception($e->getMessage() ?? 'Unable to send OTP at the moment, please try again in a few minutes', $e->getCode() ?? 500, $e);
        }
    }
    
    public function verifyOTP($to, $otp): bool
    {
        try{
            $saved_otpId = $this->getOTPID($to);

            if (
                $this->pinId === $saved_otpId &&
                $otp === '1122'
            ) {
                $this->deleteOTPID($to);
                return true;
            }

            return false;
        } catch (Exception $e) {
            throw new Exception('Unable to verify OTP!', 500, $e);
        }
    }
}