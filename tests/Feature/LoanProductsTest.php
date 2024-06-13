<?php

namespace Tests\Feature;

use App\Enums\RepaymentDurations;
use Illuminate\Foundation\Testing\RefreshDatabase;
use LoanInterestSeeder;
use Tests\TestCase;
use UserTypesSeeder;
use UserWithoutLoanSeeder;
use UserWithPrivilegesSeeder;

class LoanProductsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            LoanInterestSeeder::class,
            UserWithoutLoanSeeder::class,
            UserTypesSeeder::class,
            UserWithPrivilegesSeeder::class
        ]);
    }
    
    /**
     * Loan interests contains the interest rate for the weekly, daily and monthly products.
     *
     * @return void
     */
    public function testLoanInterestProducts()
    {
        $response = $this->get('/api/loan_interests');

        $response->assertStatus(200);
        $response->assertJson([
            "data" => [
                [
                    'purpose' => "Retail Merchants",
                    'interest' => "7",
                    'minimum_amount' => "50000.0",
                    'maximum_amount' =>  "2000000.0",
                    'moratorium' => "0",
                    'repayment_duration' => RepaymentDurations::MONTHLY
                ],
                [
                    'purpose' => "Wholesalers",
                    'interest' => "6",
                    'minimum_amount' => "300000.0",
                    'maximum_amount' => "10000000.0",
                    'moratorium' => "0",
                    'repayment_duration' => RepaymentDurations::MONTHLY
                ],
                [
                    'purpose' => "SMEs",
                    'interest' => "5",
                    'minimum_amount' => "300000.0",
                    'maximum_amount' => "20000000.0",
                    'moratorium' => "0",
                    'repayment_duration' => RepaymentDurations::MONTHLY
                ],
                [
                    'purpose' => "Weekly Float",
                    'interest' => "5",
                    'minimum_amount' => "50000.0",
                    'maximum_amount' => "5000000.0",
                    'moratorium' => "0",
                    'repayment_duration' => RepaymentDurations::WEEKLY
                ],
                [
                    'purpose' => "Daily Float",
                    'interest' => "5",
                    'minimum_amount' => "50000.0",
                    'maximum_amount' => "5000000.0",
                    'moratorium' => "7",
                    'repayment_duration' => RepaymentDurations::DAILY
                ]
            ],
            "message" => "success"
        ]);
    }
}
