<?php
namespace App\Services;

class ApiResponse {
    private $status;
    private $message;
    private $data;

    public function __construct($status, $message, $data) {
        $this->status = $status;
        $this->message = $message;
        $this->data = $data;
    }

    public function getStatus()
    {
        return $this->status;
    }

    public function getMessage()
    {
        return $this->message;
    }

    public function getData()
    {
        return $this->data;
    }
}