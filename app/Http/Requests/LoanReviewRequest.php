<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoanReviewRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'id' => 'required|numeric|exists:loan_details,id',
            'status' => 'required|boolean',
            'team_lead_denial_reason' => 'required_if:status,false,0|string',
        ];
    }

    public function messages(): array
    {
        return [
            'team_lead_denial_reason.required_if' => 'The :attribute field is required when status is "false".',
        ];
    }
}
