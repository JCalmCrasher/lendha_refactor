<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AddUserRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users,email',
            'phone_number' => 'required|digits_between:11,14|unique:users,phone_number',
            'date_of_birth' => 'required|date_format:Y-m-d',
            'user_type_id' => ['required', Rule::exists('user_types', 'id')->whereNotIn('id', [1, 2, 3])],
            'branch_id' => 'required|numeric|exists:branches,id'
        ];
    }
}
