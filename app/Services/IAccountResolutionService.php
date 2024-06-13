<?php
namespace App\Services;

interface IAccountResolutionService {
    public function bank_list(): ApiResponse;
    
    public function resolve($account_number, $bank): ApiResponse;
}