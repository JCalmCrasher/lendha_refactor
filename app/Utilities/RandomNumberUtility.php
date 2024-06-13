<?php
namespace App\Utilities;

class RandomNumberUtility
{
    public static function generate_numeric($length): string
    {
        $str_result = '01234567890123456789';

        return substr(
            str_shuffle($str_result),
            0,
            $length
        );
    }

    public static function generate_alphanumeric($length): string
    {
        $str_result = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        return substr(
            str_shuffle($str_result),
            0,
            $length
        );
    }
}