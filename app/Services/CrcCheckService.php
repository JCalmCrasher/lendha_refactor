<?php

namespace App\Services;

use App\Interfaces\ICrcProvider;
use App\Models\User;
use App\Traits\NameResolutionTrait;
use Exception;
use Illuminate\Support\Facades\Log;

class CrcCheckService
{
    use NameResolutionTrait;

    public function __construct(private readonly ICrcProvider $crcProvider)
    {
    }

    public function crcCheck(User $user, string|int $bvn): array
    {
        try {
            $crcCheck = $this->crcProvider->crcCheck($bvn, $user->name);

            if (isset($crcCheck['ConsumerHitResponse'])) {
                $nameOnBvn = $crcCheck['ConsumerHitResponse']['BODY']['ConsCommDetails']['ConsCommDetails_Subject']['NAME'];
                $namesMatch = $this->checkNameMatch($nameOnBvn, $user->name);

                if (!$namesMatch) {
                    $previous = new Exception($nameOnBvn);
                    throw new Exception('BVN name does not match on CRC check', previous: $previous);
                }

                return $crcCheck;
            }

            if (isset($crcCheck['ConsumerSearchResultResponse'])) {
                throw new Exception('Multi hits found for the given bvn.');
            }

            throw new Exception('No crc check found for the given bvn.');

        } catch (Exception $e) {
            Log::error($e->getMessage());
            throw new Exception(
                $e->getMessage(),
                $e->getCode(),
                $e->getPrevious()
            );
        }
    }
}
