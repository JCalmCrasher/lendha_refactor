<?php
namespace App\Services\LoanPaymentService;

use App\Models\LoanDetails;

interface ILoanPaymentService
{
    public function makePayment(LoanDetails $loan, $amount);
}