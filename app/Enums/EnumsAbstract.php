<?php
namespace App\Enums;

abstract class EnumsAbstract
{
  	public static function getAll():array
	{
		$class = new \ReflectionClass(get_called_class());
		return $class->getConstants();
	}

	public static function getAllAsArray()
    {
        return array_values(static::getAll());
    }
}