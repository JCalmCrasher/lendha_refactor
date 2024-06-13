<?php

namespace App\Gateways\OTP\Termii;

use App\Services\OTPServices\IOTP;
use App\Traits\OTPTrait;
use App\Utilities\PhoneNumberUtility;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TermiiSMS implements IOTP
{
    use OTPTrait;

    private $token;
    private $sid;
    private $baseUrl;
    private $appName;
    private $cacheLife;

    public function __construct()
    {
        $this->token = config('termii.token', '');
        $this->sid = config('termii.sid');
        $this->baseUrl = config('termii.url');
        $this->appName = env('APP_NAME', 'Lendha');
        $this->cacheLife = config('otp.pin_expiry', 2) * 60;
    }

    public function sendOTP(string $to): bool
    {
        try {
            if ($this->getOTPID($to)) {
                throw new Exception('Please wait for 2 minutes before attempting to resend OTP.', 400);
            }

            $url = $this->baseUrl.'/sms/otp/send';
            $payload = $this->preparePayload($to);

            $response = Http::acceptJson()->post($url, $payload)->body();

            Log::info(json_encode($response, JSON_THROW_ON_ERROR));

            $response = json_decode($response, false, 512, JSON_THROW_ON_ERROR);

            if ($response && $response->pinId) {
                $this->setOTPID($to, $response->pinId);
                return true;
            }

            return false;
        } catch (Exception $e) {
            throw new Exception($e->getMessage() ?? 'Unable to send OTP at the moment, please try again in a few minutes', $e->getCode() ?? 500, $e);
        }

    }

    public function verifyOTP($to, $otp): bool
    {

        try{
            $url = $this->baseUrl.'/sms/otp/verify';
            $payload = $this->getVerifyOTPPayload($to, $otp);

            $response = $this->post($url, $payload);
            Log::info(json_encode($response));

            if ($response && isset($response->pinId) && isset($response->msisdn) && isset($response->verified)) {
                $saved_otpId = $this->getOTPID($to);

                if (
                    $response->pinId === $saved_otpId &&
                    $response->msisdn === PhoneNumberUtility::internationalize($to) &&
                    ($response->verified === true || $response->verified === 'true')
                ) {
                    $this->deleteOTPID($to);
                    return true;
                }
            }

            return false;
        } catch (Exception $e) {
            throw new Exception('Unable to verify OTP!', 500, $e);
        }

    }

    private function getVerifyOTPPayload(string  $to, string $otp): array
    {
        $payload = [
            "api_key" => $this->token,
            "pin_id" => $this->getOTPId($to),
            "pin" => $otp,
        ];

        return $payload;
    }

    private function preparePayload(string $to)
    {
        $recipient = PhoneNumberUtility::internationalize($to);

        return [
            "api_key" => $this->token,
            "to" => $recipient,
            "from" => $this->sid,
            "message_type" => config('otp.pin_type'),
            "pin_length" => config('otp.pin_length'),
            "pin_attempts" => config('otp.pin_attempts'),
            "pin_time_to_live" => config('otp.pin_expiry'),
            "pin_type" => config('otp.pin_type'),
            "channel" => "dnd",
            "pin_placeholder" => "< 1234 >",
            "message_text" => "Your $this->appName confirmation code is < 1234 >. It expires in ".config('otp.pin_expiry', 2)." minutes.",
        ];
    }
}
