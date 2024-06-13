<?php

namespace App\Http\Requests\OnboardingOfficer;


class LoanApplicationRequest extends ProxyRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'loan_amount' => 'required|numeric',
            'loan_interest_id' => 'required|numeric|exists:loan_interests,id',
            'user_id' => 'required|exists:users,id',
            'loan_term' => 'numeric',
            'merchant' => 'alpha_num'
        ];
    }
}
