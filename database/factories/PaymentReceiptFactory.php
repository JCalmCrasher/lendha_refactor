<?php

namespace Database\Factories;

use App\Models\LoanDetails;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PaymentReceipt>
 */
class PaymentReceiptFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'document' => fake()->file('/tmp', 'uploads/payment_receipts', false),
            'amount' => fake()->randomNumber(5),
            'loan_id' => LoanDetails::factory(),
        ];
    }
}
