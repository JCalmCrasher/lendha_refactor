<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LoanDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'application_id' => $this->application_id,
            'amount' => $this->amount,
            'approved_amount' => $this->approved_amount,
            'request_date' => $this->request_date,
            'approval_date' => $this->approval_date,
            'purpose' => $this->purpose,
            'duration' =>$this->duration,
            'status' => $this->status,
            'team_lead_approval' => $this->team_lead_approval,
            'team_lead_denial_reason' => $this->team_lead_denial_reason,
            'user_id' => $this->user_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'loan_interest_id' => $this->loan_interest_id,
            'open_duration' => $this->open_duration,
            'monthly_payment' => $this->monthly_payment,
            'total_expected_payment' => $this->total_expected_payment,
            'loan_denial_reason' => $this->loan_denial_reason,
            'loan_end_date' => $this->loan_end_date,
            'loan_officer' => $this->loan_officer,
            'name' => $this->user->name
        ];
    }
}
