<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class ReconcilliationResource extends JsonResource
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
            'user_id'=>$this->loan->user->id,
            'name'=>$this->loan->user->name,
            'loan_name'=>$this->loan->purpose,
            'loan_start_date'=>Carbon::parse($this->loan->approval_date)->format('d-m-Y'),
            'loan_end_date'=>Carbon::parse($this->due_date)->format('d-m-Y'),
            'principal'=>$this->instalment_principal,
            'outstanding_principal'=>$this->late_instalment_principal,
            'loan_balance'=>$this->loan_balance,
            'late_days'=>$this->late_days,
            'late_interest' => $this->late_interest,
            'penalty'=>$this->penalty,
            'officer_name'=>$this->loan->loan_officer,
            'officer_id'=>$this->loan->user->officer->id ?? null,
            'subadmin_name'=>$this->loan->subadmin->name ?? null,
            'subadmin_id'=>$this->loan->subadmin->id ?? null,
        ];
    }
}
