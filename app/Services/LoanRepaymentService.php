<?php
namespace App\Services;

use App\Enums\RepaymentDurations;
use App\Models\LoanDetails;
use App\Models\LoanInterest;
use App\Models\LoanPayments;
use Carbon\Carbon;

class LoanRepaymentService {
	private $loan;

	public function __construct(LoanDetails $loan) {
		$this->loan = $loan;
	}

	public function createSchedule()
	{
		// using duration and moratorium, create loan repayment schedule
		// monthly, weekly, daily
		switch ($this->loan->repayment_duration) {
			case RepaymentDurations::DAILY:
				$this->createDailySchedule();
				break;
			case RepaymentDurations::WEEKLY:
				$this->createWeeklySchedule();
				break;
			case RepaymentDurations::MONTHLY:
				$this->createMonthlySchedule();
				break;
			default:
				break;
		}
	}

	private function createMonthlySchedule()
	{
		$duration = $this->loan->tenor;

		for ($term=1; $term <= $duration; $term++) { 
			$repayment = new LoanPayments();
			$repayment->intended_payment = $this->loan->instalment;
			$repayment->due_date = Carbon::parse($this->loan->approval_date)->addMonths($term);
            $this->loan->payments()->save($repayment);
		}
	}
	
	private function createWeeklySchedule()
	{
		$duration = $this->loan->duration;

		$tenure = ($duration * LoanInterest::WEEKLYLOANREPAYMENTDURATION) / 7;

		for ($week=1; $week <= $tenure; $week++) { 
			$repayment = new LoanPayments();
			$repayment->intended_payment = $this->loan->instalment;
			$repayment->due_date = Carbon::parse($this->loan->approval_date)->addWeeks($week);
            $this->loan->payments()->save($repayment);
		}
	}
	
	private function createDailySchedule()
	{
		$duration = $this->loan->tenor;
		$moratorium = intval($this->loan->loan_type->moratorium ?? 0);
		$startRepaymentDay = $moratorium + 1;
		$endRepaymentDay = $duration + $moratorium;

		for ($day=$startRepaymentDay; $day <= $endRepaymentDay; $day++) { 
			$repayment = new LoanPayments();
			$repayment->intended_payment = $this->loan->instalment;
			$repayment->due_date = Carbon::parse($this->loan->approval_date)->addDays($day);
            $this->loan->payments()->save($repayment);
		}
	}

}