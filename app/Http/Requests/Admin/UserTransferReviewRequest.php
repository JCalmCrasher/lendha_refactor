<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserTransferStatus;
use Illuminate\Foundation\Http\FormRequest;

class UserTransferReviewRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        $statusList = array_diff(UserTransferStatus::getAllAsArray(), [UserTransferStatus::PENDING]);

        return [
            'status' => 'required|in:' . implode(',', $statusList),
            'denial_reason' => 'required_if:status,' . UserTransferStatus::DENIED . '|string',
        ];
    }
}
