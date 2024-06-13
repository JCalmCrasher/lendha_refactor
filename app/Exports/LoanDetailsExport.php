<?php

namespace App\Exports;

use App\Models\LoanDetails;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;

class LoanDetailsExport implements FromCollection
{
    protected $loanDetails;

    public function  __construct(Collection $loanDetails)
    {
        $this->loanDetails = $loanDetails;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return $this->loanDetails;
    }
}
