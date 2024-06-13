<?php

namespace App\Models;

use App\Enums\UserTransferStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserTransfer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'team_lead_id',
        'old_officer_id',
        'new_officer_id',
        'transfer_reason',
        'status',
        'denial_reason',
    ];

    protected $appends = ['user_name', 'old_officer_name', 'new_officer_name'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function oldOfficer()
    {
        return $this->belongsTo(User::class, 'old_officer_id', 'id');
    }

    public function newOfficer()
    {
        return $this->belongsTo(User::class, 'new_officer_id', 'id');
    }

    protected function status(): Attribute
    {
        return Attribute::make(
            get: fn($value) => match ($value) {
                UserTransferStatus::APPROVED => 'approved',
                UserTransferStatus::DENIED => 'denied',
                default => 'pending',
            }
        );
    }

    protected function oldOfficerName(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $this->oldOfficer()->first()->name
        );
    }

    protected function newOfficerName(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $this->newOfficer()->first()->name
        );
    }

    protected function userName(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $this->user()->first()->name
        );
    }
}
