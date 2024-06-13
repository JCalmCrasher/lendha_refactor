<?php

namespace App\Http\Controllers;

use App\Models\ClientVisitation;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ClientVisitationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json([
            'data' => ClientVisitation::all(),
            'message' => 'success'
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email',
            'phone_number' => 'required',
            'employment_type' => 'required|in:business owner,employed',
            'business_name' => 'required|string',
            'business_address' => 'required|string',
            'business_image' => 'required|file',
            'business_description' => 'required|string',
            'business_directions' => 'required|string',
            'business_visitation_date' => 'required|date',
            'residence_state' => 'required|string',
            'residence_address' => 'required|string',
            'residence_outside_image' => 'required|file',
            'residence_utility_bill_image' => 'required|file',
            'residence_directions' => 'required|string',
            'residence_inside_image' => 'required|file',
            'residence_visitation_date' => 'required|date',
        ]);

        $business_image = $request->file('business_image');
        $business_image_location = "uploads/client_visitation/".$business_image->getClientOriginalName();
        $business_image->move($business_image_location);

        $residence_outside_image = $request->file('residence_outside_image');
        $residence_outside_image_location = "uploads/client_visitation/".$residence_outside_image->getClientOriginalName();
        $residence_outside_image->move($residence_outside_image_location);

        $residence_utility_bill_image = $request->file('residence_utility_bill_image');
        $residence_utility_bill_image_location = "uploads/client_visitation/".$residence_utility_bill_image->getClientOriginalName();
        $residence_utility_bill_image->move($residence_utility_bill_image_location);

        $residence_inside_image = $request->file('residence_inside_image');
        $residence_inside_image_location = "uploads/client_visitation/".$residence_inside_image->getClientOriginalName();
        $residence_inside_image->move($residence_inside_image_location);


        $clientVisitation = new ClientVisitation([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'employment_type' => $request->employment_type,
            'business_name' => $request->business_name,
            'business_address' => $request->business_address,
            'business_image' => $business_image_location,
            'business_description' => $request->business_description,
            'business_directions' => $request->business_directions,
            'business_visitation_date' => Carbon::parse($request->business_visitation_date)->format('Y-m-d'),
            'residence_state' => $request->residence_state,
            'residence_address' => $request->residence_address,
            'residence_outside_image' => $residence_outside_image_location,
            'residence_utility_bill_image' => $residence_utility_bill_image_location,
            'residence_directions' => $request->residence_directions,
            'residence_inside_image' => $residence_inside_image_location,
            'residence_visitation_date' => Carbon::parse($request->residence_visitation_date)->format('Y-m-d'),
        ]);

        $saved = $clientVisitation->save();

        if ($saved) {
            return response()->json([
                'data' => [],
                'message' => 'success'
            ]);
        }
        return response()->json([
            'data' => [],
            'message' => 'could not save data'
        ], 500);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ClientVisitation  $clientVisitation
     * @return \Illuminate\Http\Response
     */
    public function show(ClientVisitation $clientVisitation)
    {
        return response()->json([
            'data' => $clientVisitation,
            'message' => 'success'
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ClientVisitation  $clientVisitation
     * @return \Illuminate\Http\Response
     */
    public function edit(ClientVisitation $clientVisitation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ClientVisitation  $clientVisitation
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ClientVisitation $clientVisitation)
    {
        $update_cv = $clientVisitation->update($request->all());
        
        if ($update_cv) {
            return response()->json([
                'data' => $clientVisitation,
                'message' => 'success'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ClientVisitation  $clientVisitation
     * @return \Illuminate\Http\Response
     */
    public function destroy(ClientVisitation $clientVisitation)
    {
        $clientVisitation->delete();
        return response()->json([
            'data' => [],
            'message' => 'success'
        ]);
    }
}
