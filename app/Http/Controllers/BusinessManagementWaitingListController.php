<?php

namespace App\Http\Controllers;

use App\Models\BusinessManagementWaitingList;
use Illuminate\Http\Request;

class BusinessManagementWaitingListController extends Controller
{
    /**
     * Store email address to database
     *
     * @return \Illuminate\Http\Response
     */
    public function store()
    {
        $this->validate(request(), [
            'email' => 'required|email|unique:business_management_waiting_lists',
        ]);

        BusinessManagementWaitingList::create(request(['email']));

        return response()->json([
            'data' => [],
            'message' => 'Email added to waiting list.'
        ]);
    }
}
