<?php
namespace App\Interfaces;

interface IKycProvider
{
	/**
	 * Setup the kyc provider.
	 */
	public function setup();

	/**
	 * Provide authentication token
	 */

	public function generateToken(): string;

	/**
	 * Verify result
	 * 
	 * @param array $result
	 */

	public function verifyResult(array $result): bool;
}
