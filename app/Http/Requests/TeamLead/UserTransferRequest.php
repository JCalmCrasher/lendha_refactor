<?php

namespace App\Http\Requests\TeamLead;

use Illuminate\Foundation\Http\FormRequest;

class UserTransferRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'old_officer_id' => 'required|numeric|exists:users,id',
            'new_officer_id' => 'required|numeric|exists:users,id|different:old_officer_id',
            'transfer_reason' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'reason.required_if' => 'The :attribute field is required when status is "false".',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'old_officer_id' => $this->user->officer_id,
            'new_officer_id' => (int)$this->new_officer_id
        ]);
    }
}
