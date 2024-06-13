<?php

namespace App\Http\Controllers;

use App\Enums\UserTransferStatus;
use App\Http\Requests\Admin\UserTransferReviewRequest;
use App\Http\Requests\TeamLead\UserTransferRequest;
use App\Models\User;
use App\Models\UserTransfer;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class UserTransferController extends Controller
{
    /**
     * @throws AuthorizationException
     */
    public function requestCustomerTransfer(UserTransferRequest $request, User $user): JsonResponse
    {
        $this->authorize('create', [UserTransfer::class, $user, User::findOrFail($request->input('new_officer_id'))]);

        $userId = $user->id;
        $teamLeadId = auth()->user()->id;

        if ($this->isTransferPending($userId, $request->input('old_officer_id'), $request->input('new_officer_id'))) {
            return response()->json([
                'status' => false,
                'message' => 'A pending transfer already exists for this customer and officer'
            ], Response::HTTP_BAD_REQUEST);
        }

        $userTransfer = UserTransfer::create($request->validated() + ['user_id' => $userId, 'team_lead_id' => $teamLeadId]);

        activity()->causedBy(Auth::user())->performedOn($userTransfer)->log('Customer transfer request created');

        return response()->json([
            'status' => true,
            'data' => $userTransfer,
            'message' => 'Customer transfer request successful'
        ]);

    }

    private function isTransferPending(int $userId, int $oldOfficerId, int $newOfficerId): bool
    {
        return UserTransfer::where('user_id', $userId)
            ->where('old_officer_id', $oldOfficerId)
            ->where('new_officer_id', $newOfficerId)
            ->where('status', UserTransferStatus::PENDING)
            ->exists();
    }

    public function getCustomerTransfers(): JsonResponse
    {
        $userTransfers = UserTransfer::paginate(50);

        if (!$userTransfers) {
            return response()->json([
                'status' => false,
                'data' => [],
                'message' => 'No customer transfer request found'
            ]);
        }

        return response()->json([
            'status' => true,
            'data' => $userTransfers,
            'message' => 'Customer transfer request retrieved successfully'
        ]);
    }

    public function reviewCustomerTransfer(UserTransferReviewRequest $request, UserTransfer $userTransfer): JsonResponse
    {
        $status = $request->input('status');

        if ($status === UserTransferStatus::DENIED) {
            $userTransfer->update([
                'status' => UserTransferStatus::DENIED,
                'denial_reason' => $request->input('denial_reason'),
            ]);

            activity()->causedBy(Auth::user())->performedOn($userTransfer)->log('Customer transfer request denied');

            return response()->json([
                'status' => true,
                'data' => $userTransfer,
                'message' => 'Customer transfer request denied'
            ]);
        }

        DB::transaction(function () use ($userTransfer) {
            $userTransfer->update(['status' => UserTransferStatus::APPROVED]);
            $userTransfer->user()->update(['officer_id' => $userTransfer->new_officer_id]);

            activity()->causedBy(Auth::user())->performedOn($userTransfer)->log('Customer transfer request approved');
        });

        return response()->json([
            'status' => true,
            'data' => $userTransfer,
            'message' => 'Customer transfer request approved'
        ]);
    }

    public function getCustomerTransfer(UserTransfer $userTransfer): JsonResponse
    {
        return response()->json([
            'status' => true,
            'data' => $userTransfer,
            'message' => 'Customer transfer request retrieved successfully'
        ]);
    }
}
