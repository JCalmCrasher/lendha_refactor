<?php
namespace App\Utilities;

class PhoneNumberUtility {
    public static function internationalize(string $phone_number): string
    {
        if ($phone_number[0] == '0') {
            return substr_replace($phone_number, '+234', 0, 1);
        }

        return $phone_number;
    }
}