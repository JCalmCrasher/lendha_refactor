<?php
namespace App\Interfaces\SMS;

interface ISMSProvider
{
    /**
     * Send SMS
     * 
     * @param string $to
     * @param string $message
     */
    public function sendSMS(string $to, string $message): bool;
}