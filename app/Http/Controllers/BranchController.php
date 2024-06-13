<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\LoanPayments;
use App\Models\User;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json([
            'data' => Branch::all(),
            'message' => 'Branches retrieved successfully.',
            'status' => true
        ]);
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
            'name' => 'required',
        ]);

        $branch = Branch::create([
            'name' => $request->name,
        ]);

        return response()->json([
            'data' => $branch,
            'message' => 'Branch created successfully.',
            'status' => true
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Branch  $branch
     * @return \Illuminate\Http\Response
     */
    public function show(Branch $branch)
    {
        return response()->json([
            'data' => $branch,
            'message' => 'Branch retrieved successfully.',
            'status' => true
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Branch  $branch
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Branch $branch)
    {
        $request->validate([
            'name' => 'required',
        ]);

        $branch->update([
            'name' => $request->name,
        ]);

        return response()->json([
            'data' => $branch,
            'message' => 'Branch updated successfully.',
            'status' => true
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Branch  $branch
     * @return \Illuminate\Http\Response
     */
    public function destroy(Branch $branch)
    {
        $branch->delete();

        return response()->json([
            'data' => $branch,
            'message' => 'Branch deleted successfully.',
            'status' => true
        ]);
    }

    public function getOfficerByBranch(Branch $branch, User $user)
    {
        $user = $branch->users()->findOrFail($user->id);

        $user->load('onboardedUsers');

        $user->performance = $this->getOfficerLoanPerformance($user);

        return response()->json([
            'data' => $user,
            'message' => 'Officer retrieved successfully.',
            'status' => true
        ]);
    }

    private function getOfficerLoanPerformance(User $user)
    {
        $query = LoanPayments::leftJoin('loan_details', 'loan_details.id', '=', 'loan_payments.loan_details_id')
            ->leftJoin('users as clients', 'clients.id', '=', 'loan_details.user_id')
            ->leftJoin('users as officers', 'officers.id', '=', 'clients.officer_id')
            ->where('clients.officer_id', $user->id)
            ->groupBy('clients.id', 'clients.name', 'officers.name', 'loan_details.id')
            ->selectRaw('clients.id, clients.name as client, officers.name as officer,
            sum(loan_payments.intended_payment) as amount_disbursed, sum(loan_payments.user_payment) as due_payment_paid');

        return $query->get()->map(function ($loanPayment) {
            return [
                'id' => $loanPayment->id,
                'client' => $loanPayment->client,
                'officer' => $loanPayment->officer,
                'amount_disbursed' => $loanPayment->amount_disbursed,
                'due_payment_paid' => $loanPayment->due_payment_paid,
            ];
        });
    }

    public function getOnboardingOfficers(Branch $branch)
    {
        $users = $branch->users()
            ->join('user_types', 'users.user_type_id', '=', 'user_types.id')
            ->select('users.*')
            ->where('user_types.type', '=', User::ONBOARDING_OFFICER_TYPE)
            ->get();

        return response()->json([
            'data' => $users,
            'message' => 'Officers retrieved successfully.',
            'status' => true
        ]);
    }
}
