<?php

namespace App\Providers;

use App\CustomFirebaseChannel\Firebase;
use App\CustomFirebaseChannel\FirebaseChannel;
use App\Gateways\Bank\Mono\Mono;
use App\Gateways\Bank\Mono\MonoMock;
use App\Gateways\Bank\ProvidusBankGateway;
use App\Gateways\Crc\Crc;
use App\Gateways\Crc\CrcMock;
use App\Gateways\KYC\IdentityPass;
use App\Gateways\KYC\IdentityPassMock;
use App\Gateways\OTP\Termii\TermiiSMS;
use App\Gateways\OTP\TermiiMock\TermiiSMSMock;
use App\Gateways\SMS\TermiiSMSGateway;
use App\Interfaces\Bank\IBank;
use App\Interfaces\Bank\IBankStatement;
use App\Interfaces\ICrcProvider;
use App\Interfaces\KYC\IBVNCheck;
use App\Interfaces\KYC\ICACCheck;
use App\Interfaces\SMS\ISMSProvider;
use App\Services\AccountResolutionService;
use App\Services\IAccountResolutionService;
use App\Services\LoanPaymentService\ILoanPaymentService;
use App\Services\LoanPaymentService\LoanPaymentService;
use App\Services\OnboardingService\BankKYCService\AccountDetailsService\AccountDetailsService;
use App\Services\OnboardingService\BankKYCService\AccountDetailsService\IAccountDetailsService;
use App\Services\OnboardingService\BankKYCService\BVNValidationService\BVNValidationService;
use App\Services\OnboardingService\BankKYCService\BVNValidationService\IBVNValidationService;
use App\Services\OnboardingService\BankKYCService\BVNValidationServiceMock\BVNValidationServiceMock;
use App\Services\OnboardingService\BankKYCService\NINValidationService\ININValidationService;
use App\Services\OnboardingService\BankKYCService\NINValidationService\NINValidationService;
use App\Services\OTPServices\IOTP;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind('App\Interfaces\IKycProvider', 'App\Services\HyperVergeService');
        $this->app->bind(IAccountResolutionService::class, AccountResolutionService::class);
        $this->app->bind(ININValidationService::class, NINValidationService::class);
        $this->app->bind(IBVNValidationService::class, BVNValidationService::class);
        $this->app->bind(IAccountDetailsService::class, AccountDetailsService::class);
        $this->app->bind(ISMSProvider::class, TermiiSMSGateway::class);
        $this->app->bind(IBank::class, ProvidusBankGateway::class);
        $this->app->bind(ILoanPaymentService::class, LoanPaymentService::class);

        if (!$this->app->environment('production')) {
            // Staging and Local
            $this->app->bind(IBVNCheck::class, IdentityPassMock::class);
            $this->app->bind(IOTP::class, TermiiSMSMock::class);
            $this->app->bind(ICACCheck::class, IdentityPassMock::class);
            $this->app->bind(IBankStatement::class, MonoMock::class);
            $this->app->bind(ICrcProvider::class, CrcMock::class);
        } else {
            // Production
            $this->app->bind(IBVNCheck::class, IdentityPass::class);
            $this->app->bind(IOTP::class, TermiiSMS::class);
            $this->app->bind(ICACCheck::class, IdentityPass::class);
            $this->app->bind(IBankStatement::class, Mono::class);
            $this->app->bind(ICrcProvider::class, Crc::class);
        }
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Notification::extend('firebase', function ($app) {
        //     return new FirebaseChannel(new Firebase());
        // });
    }
}
