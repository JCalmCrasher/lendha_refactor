<?php

namespace App\Http\Requests\OnboardingOfficer;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class ProxyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'user_id' => 'exists:users'
        ];
    }

    public function representedUser()
    {
        if ($this->has('user_id')) {
            return User::find($this->input('user_id'));
        }
        return null;
    }
}
