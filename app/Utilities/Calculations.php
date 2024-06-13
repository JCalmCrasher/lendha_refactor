<?php

namespace App\Utilities;

use App\Models\LoanInterest;

class Calculations
{
    public static function compound_interest(float $principal, float $rate = (97/100), int $months)
    {
        $calcinterest = round($principal + (($rate * $months)/100) * $principal)*100/100;
        $installment = round($calcinterest / $months)*100/100;
        return [
            "installment" => $installment,
            "monthly" => $installment,
            "total" => $calcinterest
        ];
    }

    public static function interest_rate(String $purpose)
    {
        $loan_interest = LoanInterest::where('purpose', $purpose)->first();

        if ($loan_interest) {
            return intval($loan_interest->interest);
        }
        return 8;
    }

    public static function calculateDifference($currentValue, $previousValue): int|float
    {
        if (abs($previousValue) < 0.001) {
            return 0;
        }

        return ($currentValue - $previousValue) / $previousValue * 100;
    }
}
