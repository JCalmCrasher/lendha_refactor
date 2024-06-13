<?php

namespace App\Utilities;

use App\Models\LoanInterest;

class NumberFormatter
{
    public static function format_percentage(float|int $percentage): string
    {
        $sign = $percentage > 0 ? '+' : '';

        return $sign . number_format($percentage, 2) . '%';
    }

    public static function format_amount(float|int $amount): string
    {
        return number_format($amount, 2, thousands_separator: '');
    }
}
