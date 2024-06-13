<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'date_of_birth' => $this->date_of_birth,
            'user_type_id' => $this->user_type_id,
            'type' => $this->type,
            'user_branch' => $this->user_branch,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
