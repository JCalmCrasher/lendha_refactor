<?php

namespace App\Models;

use App\Interfaces\OTP\CanSendOTP;
use App\Interfaces\OTP\CanVerifyOTP;
use Laravel\Passport\HasApiTokens;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Notifications\VerifyApiEmail;
use App\Services\OTPServices\IOTP;
use Carbon\Carbon;
use DB;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable implements CanSendOTP, CanVerifyOTP, CanResetPassword
{
    use HasApiTokens, Notifiable, HasFactory;
    const ADMIN_TYPE = 'admin';
    const DEFAULT_TYPE = 'default';
    const MERCHANT_TYPE = 'merchant';
    const SUB_ADMIN_TYPE = 'subadmin';
    const ONBOARDING_OFFICER_TYPE = 'onboarding_officer';
    const TEAM_LEAD_TYPE = 'team_lead';
    const FINANCE_TYPE = 'finance';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'phone_number', 'date_of_birth', 'user_type_id', 'state_of_residence', 'gender', 'address', 'password', 'firebase_web_device_key', 'password_changed_at', 'branch_id', 'officer_id', 'terms_accepted', 'marital_status'
    ];

    protected $appends = ['employment_status', 'profile_status', 'onboarding_status', 'type', 'user_branch'];

    protected $with = ['bank', 'cards', 'employment', 'home_address', 'social_media_handles', 'guarantor', 'next_of_kin', 'documents', 'business', 'loans', 'account'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'email_verified_at', 'payment_credentials', 'firebase_web_device_key', 'password_changed_at', 'loans'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function business()
    {
        return $this->hasOne(Business::class);
    }

    public function business_assessment()
    {
        return $this->hasMany(BusinessAssessment::class);
    }

    public function bank()
    {
        return $this->hasOne('App\Models\BankDetails');
    }

    public function cards()
    {
        return $this->hasOne('App\Models\DebitCards');
    }

    public function documents()
    {
        return $this->hasOne('App\Models\UserDocuments');
    }

    public function employment()
    {
        return $this->hasOne('App\Models\EmploymentDetails');
    }

    public function investments()
    {
        return $this->hasMany('App\Models\Investors');
    }

    public function loans()
    {
        return $this->hasMany('App\Models\LoanDetails');
    }

    public function referral_channel()
    {
        return $this->belongsTo(ReferralChannel::class);
    }

    public function type()
    {
        return $this->belongsTo('App\Models\UserType', 'user_type_id', 'id');
    }

    public function covid19()
    {
        return $this->hasMany('App\Models\CovidModel');
    }

    public function account()
    {
        return $this->hasOne(UserAccount::class);
    }

    public function account_payment_logs()
    {
        // has payment logs through account
        return $this->hasManyThrough(UserAccountPaymentLog::class, UserAccount::class);
    }

    public function getTypeAttribute()
    {
        return $this->type()->first() ? $this->type()->first()->type : 'default';
    }

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = $value;
        $this->attributes['password_changed_at'] = Carbon::now();
    }

    public function social_media_handles()
    {
        return $this->hasOne('App\Models\SocialMediaHandles');
    }

    public function guarantor()
    {
        return $this->hasOne('App\Models\Guarantor');
    }

    public function next_of_kin()
    {
        return $this->hasOne(NextOfKin::class);
    }

    public function home_address()
    {
        return $this->hasOne('App\Models\HomeAddress');
    }

    public function payment_credentials()
    {
        return $this->hasOne('App\Models\PaymentCredentials');
    }

    public function branch()
    {
        return $this->belongsTo('App\Models\Branch');
    }

    public function officer()
    {
        return $this->belongsTo('App\Models\User', 'officer_id', 'id');
    }

    public function onboardedUsers()
    {
        return $this->hasMany('App\Models\User', 'officer_id', 'id');
    }

    public function userTransfers()
    {
        return $this->hasMany(UserTransfer::class);
    }

    public function externalServiceAccounts()
    {
        return $this->hasMany('App\Models\ExternalServiceAccount');
    }

    public function delete()
    {
        $loans = $this->loans;

        foreach ($loans as $loan) {
            $loan->paymentReceipts()->delete();
        }

        $this->loans()->delete();

        $this->bank()->delete();
        $this->cards()->delete();
        $this->documents()->delete();
        $this->employment()->delete();
        $this->payment_credentials()->delete();
        $this->social_media_handles()->delete();
        $this->guarantor()->delete();
        $this->home_address()->delete();
        $this->business()->delete();
        $this->business_assessment()->delete();

        return parent::delete();
    }

    public function getUserBranchAttribute()
    {
        return $this->branch()->first()->name ?? 'Head Office';
    }

    public function getEmploymentStatusAttribute()
    {
        if (count($this->employment()->get())) {
            return 'employed';
        } else {
            return 'unemployed';
        }
    }

    public function getProfileStatusAttribute()
    {
        if (
            $this->bank &&
            $this->documents &&
            // $this->social_media_handles &&
            $this->guarantor &&
            $this->home_address &&
            $this->business
        ) {
            return 'complete';
        } else {
            return 'incomplete';
        }
    }

    public function scopeWithProfileStatus($query, $status = null)
    {
        if ($status !== null && $status === 'complete') {
            return $query->whereHas('bank')
                ->whereHas('documents')
                ->whereHas('guarantor')
                ->whereHas('home_address')
                ->whereHas('business');
        } else if ($status !== null && $status === 'incomplete') {
            return $query->whereDoesntHave('bank')
                ->orWhereDoesntHave('documents')
                ->orWhereDoesntHave('guarantor')
                ->orWhereDoesntHave('home_address')
                ->orWhereDoesntHave('business');
        }

        return $query;
    }

    public function getOnboardingStatusAttribute()
    {
        if (!$this->phone_verified) {
            return 3;
        }
        if (!$this->home_address()->exists()) {
            return 4;
        }
        if (!$this->business()->exists()) {
            return 5;
        }
        if (!$this->bank()->exists()) {
            return 6;
        }
        if ($this->bank()->exists()) {
            if (!$this->bank->account_number || !$this->bank->account_name || !$this->bank->bank_name) {
                return 6;
            }
        }
        if (!$this->documents) {
            return 7;
        }
        if ($this->documents) {
            if (!$this->documents->passport_photo || !$this->documents->valid_id || !$this->documents->residence_proof) {
                return 7;
            }
        }
        if (!$this->next_of_kin()->exists()) {
            return 8;
        }

        return 9;
    }

    public function isAdmin()    {
        return $this->type === self::ADMIN_TYPE;
    }

    public function isSubAdmin()    {
        return $this->type === self::SUB_ADMIN_TYPE;
    }

    public function isOnboardingOfficer()    {
        return $this->type === self::ONBOARDING_OFFICER_TYPE;
    }

    public function isTeamLead()    {
        return $this->type === self::TEAM_LEAD_TYPE;
    }

    public function isMerchant()    {
        return $this->type === self::MERCHANT_TYPE;
    }

    public function isFinance()    {
        return $this->type === self::FINANCE_TYPE;
    }

    public function sendApiEmailVerificationNotification()
    {
        $this->notify(new VerifyApiEmail); // my notification
    }

    // { OTP functionality
    public function sendOTP()
    {
        if ($this->attributes['phone_number']) {
            app(IOTP::class)->sendOTP($this->attributes['phone_number']);
        }
    }

    public function verifyOTP(string $otp): bool
    {
        if ($this->attributes['phone_number']) {
            return app(IOTP::class)->verifyOTP($this->attributes['phone_number'], $otp);
        }

        return false;
    }
    // }

    public function hasActiveLoan(): bool
    {
        $currentLoan = $this->loans->last();

        return $currentLoan && ($currentLoan->status === 'approved' || $currentLoan->status === 'pending');
    }
}
