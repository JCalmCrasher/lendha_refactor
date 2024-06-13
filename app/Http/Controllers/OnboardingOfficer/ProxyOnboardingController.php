<?php

namespace App\Http\Controllers\OnboardingOfficer;

use App\Http\Controllers\Controller;
use App\Models\Guarantor;
use App\Services\OnboardingService\BankKYCService\BankKYCService;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;

class ProxyOnboardingController extends Controller
{
    public function otp_verification(Request $request)
    {
        $request->validate([
            'otp' => 'required|numeric',
            'user_id' => 'required|numeric|exists:users,id'
        ]);

        $user = User::find($request->user_id);

        try {
            $verified = $user->verifyOTP($request->otp);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }


        if ($verified) {
            $user->phone_verified = true;
            $user->save();

            return response()->json([
                'step' => $user->onboarding_status,
                'message' => 'OTP verified successfully'
            ], 200);
        } else {
            return response()->json([
                'message' => 'OTP verification failed'
            ], 400);
        }
    }

    public function resend_otp(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required|numeric|exists:users,id'
            ]);

            $user = User::find($request->user_id);

            $user->sendOTP();

            return response()->json([
                "message" => "OTP sent"
            ]);
        } catch (Exception $e) {
            return response()->json([
                "message" => $e->getMessage()
            ], $e->getCode() ?? 500);
        }


    }

    public function bank(Request $request, BankKYCService $bankKYCService)
    {
        $request->validate([
            'account_number' => 'required|digits:10',
            'bank' => 'required|string',
            'bank_code' => 'required|numeric',
            'user_id' => 'required|numeric|exists:users,id'
        ]);

        $user = User::find($request->user_id);

        try {
            $validate = $bankKYCService->bankKycValidation(
                $user->bank->nin,
                $request->account_number,
                $request->bank_code,
                $user->bank->bvn,
                $user
            );
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], $e->getCode() ?? 500);
        }

        if ($validate) {
            $user->bank()->updateOrCreate(
                ['user_id' => $request->user_id],
                [
                    'bvn' => $request->bvn,
                    'nin' => $request->nin,
                    'account_name' => $validate,
                    'account_number' => $request->account_number,
                    'bank_name' => $request->bank,
                    'user_id' => $user->id
                ]
            );

            return response()->json([
                'step' => $user->onboarding_status,
                'message' => 'Bank details validated successfully'
            ], 200);
        } else {
            return response()->json([
                'message' => 'Bank details validation failed'
            ], 400);
        }
    }

    public function employment(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'site' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|numeric',
            'resumption_date' => 'required|date',
            'user_id' => 'required|numeric|exists:users,id'
        ]);

        $user = User::find($request->user_id);

        $user->employment()->firstOrCreate([
            'name' => $request->name,
            'email' => $request->email,
            'site' => $request->site,
            'address' => $request->address,
            'phone' => $request->phone,
            'resumption_date' => $request->resumption_date
        ]);

        return response()->json([
            'step' => $user->onboarding_status,
            'message' => 'Employment details saved successfully'
        ], 200);
    }

    public function documents_upload_passport_photo(Request $request)
    {
        $request->validate([
            'passport_photo' => 'required|image',
            'user_id' => 'required|numeric|exists:users,id'
        ]);

        $user = User::find($request->user_id);

        $file = $request->file('passport_photo');
        $passport_photo = $file->move('uploads/'.$request->user_id, $file->getClientOriginalName())->getPathName();
        // $passport_photo = $request->file('passport_photo')->store('uploads/'.$request->user_id.'/passport_photos');

        $user->documents()->updateOrCreate(
            ['user_id' => $request->user_id],
            [
                'passport_photo' => $passport_photo,
            ]
        );

        return response()->json([
            'step' => $user->onboarding_status,
            'message' => 'Passport photo uploaded successfully'
        ], 200);
    }

    public function documents_upload_work_id(Request $request)
    {
        $request->validate([
            'work_id' => 'required|image',
            'user_id' => 'required|numeric|exists:users,id'
        ]);

        $user = User::find($request->user_id);

        $file = $request->file('work_id');
        $work_id = $file->move('uploads/'.$request->user_id, $file->getClientOriginalName())->getPathName();

        $user->documents()->updateOrCreate(
            ['user_id' => $request->user_id],
            [
                'work_id' => $work_id,
            ]
        );

        return response()->json([
            'step' => $user->onboarding_status,
            'message' => 'Work ID uploaded successfully'
        ], 200);
    }

    public function documents_upload_valid_id(Request $request)
    {
        $request->validate([
            'valid_id' => 'required|image',
            'user_id' => 'required|numeric|exists:users,id'
        ]);

        $user = User::find($request->user_id);

        $file = $request->file('valid_id');
        $valid_id = $file->move('uploads/'.$request->user_id, $file->getClientOriginalName())->getPathName();

        $user->documents()->updateOrCreate(
            ['user_id' => $request->user_id],
            [
                'valid_id' => $valid_id
            ]
        );

        return response()->json([
            'step' => $user->onboarding_status,
            'message' => 'Valid ID uploaded successfully'
        ], 200);
    }

    public function documents_upload_residence_proof(Request $request)
    {
        $request->validate([
            'residence_proof' => 'required|image',
            'user_id' => 'required|numeric|exists:users,id'
        ]);

        $user = User::find($request->user_id);

        $file = $request->file('residence_proof');
        $residence_proof = $file->move('uploads/'.$request->user_id, $file->getClientOriginalName())->getPathName();

        $user->documents()->updateOrCreate(
            ['user_id' => $request->user_id],
            [
                'residence_proof' => $residence_proof
            ]
        );

        return response()->json([
            'step' => $user->onboarding_status,
            'message' => 'Residence proof uploaded successfully'
        ], 200);
    }

    public function business_proof_registration(Request $request)
    {
        $request->validate([
            'cac_document' => 'required|image',
            'business_registration_number' => 'required|string',
            'user_id' => 'required|numeric|exists:users,id'
        ]);

        $user = User::find($request->user_id);

        $file = $request->file('cac_document');
        $cac_document = $file->move('uploads/'.$request->user_id, $file->getClientOriginalName())->getPathName();

        $user->business->business_registration()->updateOrCreate([
            'business_registration_number' => $request->business_registration_number,
            'cac_document' => $cac_document
        ]);

        return response()->json([
            'step' => $user->onboarding_status,
            'message' => 'Business proof uploaded successfully'
        ], 200);
    }

    public function guarantor(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'phone' => 'required|numeric',
            'address' => 'required|string',
            'relationship' => 'required|string',
            'business_type' => 'required|string',
            'business_address' => 'required|string',
            'guarantors_face_photo' => 'required|image|mimes:jpeg,png,jpg',
            'id_card' => 'required|file|mimes:pdf,png,jpeg,jpg',
            'proof_of_residence' => 'required|file|mimes:pdf,png,jpeg,jpg',
            'user_id' => 'required|numeric|exists:users,id',
        ]);

        $this->authorize('onboardingCreate', [Guarantor::class, User::find($request->user_id), $request->user()->id, $request->user()->type]);

        $user = User::find($request->user_id);

        $guarantors_face_file = $request->file('guarantors_face_photo');
        $guarantors_face_photo = $guarantors_face_file->move('uploads/'.$request->user_id, $guarantors_face_file->getClientOriginalName())->getPathName();

        $id_card_file = $request->file('id_card');
        $id_card = $id_card_file->move('uploads/'.$request->user_id, $id_card_file->getClientOriginalName())->getPathName();

        $proof_of_residence_file = $request->file('proof_of_residence');
        $proof_of_residence = $proof_of_residence_file->move('uploads/'.$request->user_id, $proof_of_residence_file->getClientOriginalName())->getPathName();

        $user->guarantor()->updateOrCreate(
            ['user_id' => $request->user_id],
            [
                'name' => $request->name,
                'phone' => $request->phone,
                'address' => $request->address,
                'relationship' => $request->relationship,
                'business_type' => $request->business_type,
                'business_address' => $request->business_address,
                'guarantors_face_photo' => $guarantors_face_photo,
                'id_card' => $id_card,
                'proof_of_residence' => $proof_of_residence,
            ]
        );

        return response()->json([
            'step' => $user->onboarding_status,
            'message' => 'Guarantor details validated successfully'
        ], 200);
    }

    public function social_media_handles(Request $request)
    {
        $request->validate([
            'facebook' => 'required|string',
            'linkedin' => 'string',
            'instagram' => 'required|string',
            'user_id' => 'required|numeric|exists:users,id'
        ]);

        $user = User::find($request->user_id);

        $user->social_media_handles()->updateOrCreate(
            ['user_id' => $request->user_id],
            [
            'facebook' => $request->facebook,
            'linkedin' => $request->linkedin,
            'instagram' => $request->instagram
        ]);

        return response()->json([
            'step' => $user->onboarding_status,
            'message' => 'Social media handles validated successfully'
        ], 200);
    }

    public function home_address(Request $request)
    {
        $request->validate([
            'number' => 'required|string',
            'street_name' => 'required|string',
            'landmark' => 'required|string',
            'city' => 'required|string',
            'local_government' => 'required|string',
            'state' => 'required|string',
            'user_id' => 'required|numeric|exists:users,id'
        ]);

        $user = User::find($request->user_id);

        $user->home_address()->updateOrCreate(
            ['user_id' => $request->user_id],
            [
            'number' => $request->number,
            'street_name' => $request->street_name,
            'landmark' => $request->landmark,
            'city' => $request->city,
            'local_government' => $request->local_government,
            'state' => $request->state
        ]);

        return response()->json([
            'step' => $user->onboarding_status,
            'message' => 'Home address validated successfully'
        ], 200);
    }

    public function business(Request $request)
    {
        $request->validate([
            'business_name' => 'required|string',
            'email' => 'email',
            'description' => 'string',
            'category' => 'string',
            'address_number' => 'string',
            'street' => 'string',
            'city' => 'string',
            'state' => 'string',
            'landmark' => 'string',
            'user_id' => 'required|numeric|exists:users,id',
            'business_pictures' => 'required|array|min:3',
            'business_pictures.*' => 'image|mimes:jpg,jpeg,png|max:4096',
        ]);

        $user = User::find($request->user_id);

        $paths = [];

        if ($request->hasFile('business_pictures')) {
            foreach ($request->file('business_pictures') as $file) {
                // $path = $file->store('uploads/'.$request->user_id.'/business_pictures');
                $path = $file->move('uploads/'.$request->user_id.'/business_pictures', $file->getClientOriginalName())->getPathName();
                $paths[] = $path;
            }
        }

        $user->business()->updateOrCreate(
            ['user_id' => $request->user_id],
            [
                'name' => $request->business_name,
                'email' => $request->email,
                'description' => $request->description,
                'category' => $request->category,
                'address_number' => $request->address_number,
                'street' => $request->street,
                'city' => $request->city,
                'state' => $request->state,
                'landmark' => $request->landmark,
                'business_pictures' => $paths
            ]
        );

        return response()->json([
            'step' => $user->onboarding_status,
            'message' => 'Business details validated successfully'
        ], 200);
    }

    public function validateBvn(Request $request, BankKYCService $bankKYCService)
    {
        $request->validate([
            'bvn' => 'required|digits:11'
        ]);

        $bvnDetails = $bankKYCService->getBvnDetails($request->bvn);

        return response()->json([
            'data' => $bvnDetails,
            'message' => 'BVN details retrieved successfully'
        ], 200);
    }
}
