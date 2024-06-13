<?php
namespace App\Traits;

trait NameResolutionTrait
{
    /**
     * Check that two names match
     * 
     * @param string $haystackName (The name we should check against)
     * @param string $needleName (The name we want to confirm)
     * @param string $match (The number of strings in the name that should match to return a true value)
     */
    public function checkNameMatch($haystackName, $needleName, $match = 2): bool
    {
        $mainName = strtolower($haystackName);

        $splitUserName = explode(" ", strtolower($needleName));

        $matches = null;

        foreach ($splitUserName as $name) {
            if ($name && strpos($mainName, $name) !== false) {
                $matches[] = $name;
            }
        }

        if (isset($matches) && (count($matches) === count($splitUserName) || count($matches) >= $match)) {
            return $mainName;
        }

        return false;
    }
}