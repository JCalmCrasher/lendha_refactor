<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

class CollectionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        if ($this->loan) {
            return [
                'name' => $this->loan->user->name ?? "Not Available",
                'email' => $this->loan->user->email ?? "Not Available",
                'phone_number' => $this->loan->user->phone_number ?? "Not Available",
                'loan_id' => $this->loan->id,
                'loan_name'=>$this->loan->purpose,
                'approved_amount' => $this->loan->approved_amount,
                'application_amount' => $this->loan->amount,
                'approval_date' => $this->loan->approval_date,
                'due_date' =>Carbon::parse($this->due_date)->format('d-m-Y'),
                'intended_payment' => $this->intended_payment,
                'penalty' => $this->penalty,
                'payment_status' => $this->status,
                'branch_name' => $this->loan->user->branch->name ?? null,
                'branch_id' => $this->loan->user->branch->id ?? null,
                'officer_name' => $this->loan->loan_officer,
                'officer_id' => $this->loan->user->officer->id ?? null,
                'subadmin_name' => $this->loan->subadmin->name ?? null,
                'subadmin_id' => $this->loan->subadmin->id ?? null,
            ];
        }
    }
}
