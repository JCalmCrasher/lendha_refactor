<?php
namespace App\Enums;

class LoanStatus extends EnumsAbstract
{
	const APPROVED = 'approved';
	const DENIED = 'denied';
	const PENDING = 'pending';
	const COMPLETED = 'completed';
}
