<?php

namespace App\Interfaces;

interface ICrcProvider
{
    public function crcCheck(string|int $bvn, string $name);
}
