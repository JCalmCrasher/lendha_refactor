<?php

namespace App\Http\Controllers;

use App\Services\OnboardingService\CACValidationService;
use Illuminate\Http\Request;
use App\Models\BankDetails;
use App\Models\EmploymentDetails;
use App\Models\Guarantor;
use App\Models\UserDocuments;
use App\Models\SocialMediaHandles;
use App\Models\HomeAddress;
use App\Services\OnboardingService\BankKYCService\BankKYCService;
use Exception;
use Illuminate\Support\Facades\Auth;

class OnboardingController extends Controller
{
    // step 1
    public function bank(Request $request, BankKYCService $bankKYCService)
    {
        $request->validate([
            'bvn' => 'required|digits:11',
            'nin' => 'required|digits:11',
            'account_number' => 'required|digits:10',
            'bank' => 'required|string',
            'bank_code' => 'required|numeric'
        ]);

        $user = Auth::user();

        try {
            $validate = $bankKYCService->bankKycValidation(
                $request->nin,
                $request->account_number,
                $request->bank_code,
                $request->bvn,
                $user
            );
        } catch (Exception $e) {
            return response()->json([
                "data" => [
                    'step' => $user->onboarding_status
                ],
                "message" => $e->getMessage(),
                "status" => false
            ], $e->getCode());
        }

        if ($validate) {
            BankDetails::updateOrCreate(
                ['user_id' => $user->id],
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
                "data" => [
                    'step' => $user->onboarding_status
                ],
                "message" => "Bank details validated successfully"
            ]);
        }

        return response()->json([
            "data" => [
                'step' => $user->onboarding_status
            ],
            "message" => "Bank details validation failed"
        ], 400);
    }

    // step 2
    public function employment(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'site' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|numeric',
            'resumption_date' => 'required|date'
        ]);
        $employment = EmploymentDetails::updateOrCreate(
            ['user_id' => $user->id],
            [
                'name' => $request->name,
                'email' => $request->email,
                'site' => $request->site,
                'address' => $request->address,
                'phone' => $request->phone,
                'resumption_date' => $request->resumption_date,
                'user_id' => $user->id
            ]
        );
        return response()->json([
            'step' => $user->onboarding_status,
            "data" => $employment,
            "message" => "success"
        ]);
    }

    // step 3
    public function documents_upload_passport_photo(Request $request)
    {
        $user = Auth::user();
        $request->validate([
            'user_file' => 'required|file'
        ]);
        $file = $request->file('user_file');
        $destinationPath = 'uploads/'.Auth::user()->id;
        $file->move($destinationPath,$file->getClientOriginalName());
        $file_location = $destinationPath.'/'.$file->getClientOriginalName();
        $document = UserDocuments::updateOrCreate(
            ['user_id' => $user->id],
            [
                'passport_photo' => $file_location
            ]
        );
        return response()->json([
            'step' => $user->onboarding_status,
            "data" => $file_location,
            "message" => "success"
        ]);
    }

    public function documents_upload_work_id(Request $request)
    {
        $user = Auth::user();
        $request->validate([
            'user_file' => 'required|file'
        ]);
        $file = $request->file('user_file');
        $destinationPath = 'uploads/'.Auth::user()->id;
        $file->move($destinationPath,$file->getClientOriginalName());
        $file_location = $destinationPath.'/'.$file->getClientOriginalName();
        $document = UserDocuments::updateOrCreate(
            ['user_id' => $user->id],
            [
                'work_id' => $file_location
            ]
        );
        return response()->json([
            'step' => $user->onboarding_status,
            "data" => $file_location,
            "message" => "success"
        ]);
    }

    public function documents_upload_valid_id(Request $request)
    {
        $user = Auth::user();
        $request->validate([
            'user_file' => 'required|file'
        ]);
        $file = $request->file('user_file');
        $destinationPath = 'uploads/'.Auth::user()->id;
        $file->move($destinationPath,$file->getClientOriginalName());
        $file_location = $destinationPath.'/'.$file->getClientOriginalName();
        $document = UserDocuments::updateOrCreate(
            ['user_id' => $user->id],
            [
                'valid_id' => $file_location
            ]
        );
        return response()->json([
            'step' => $user->onboarding_status,
            "data" => $file_location,
            "message" => "success"
        ]);
    }

    public function documents_upload_residence_proof(Request $request)
    {
        $user = Auth::user();
        $request->validate([
            'user_file' => 'required|file'
        ]);
        $file = $request->file('user_file');
        $destinationPath = 'uploads/'.Auth::user()->id;
        $file->move($destinationPath,$file->getClientOriginalName());
        $file_location = $destinationPath.'/'.$file->getClientOriginalName();
        $document = UserDocuments::updateOrCreate(
            ['user_id' => $user->id],
            [
                'residence_proof' => $file_location
            ]
        );
        return response()->json([
            'step' => $user->onboarding_status,
            "data" => $file_location,
            "message" => "success"
        ]);
    }

    public function business_registration(Request $request)
    {
        $request->validate([
            'user_file' => 'required|file',
            'business_registration_number' => 'required|string',
        ]);

        $user = Auth::user();

        $file = $request->file('user_file');

        $destinationPath = 'uploads/'.Auth::user()->id;
        $fileNewName = 'cac_document.'.$file->getClientOriginalExtension();

        $file->move($destinationPath, $fileNewName);
        $file_location = $destinationPath.'/'.$fileNewName;

        $user->business->business_registration()->updateOrCreate([
            'business_id' => $user->business->id
        ],[
            'business_registration_number' => $request->business_registration_number,
            'cac_document' => $file_location
        ]);

        return response()->json([
            'step' => $user->onboarding_status,
            "data" => $file_location,
            "message" => "success"
        ]);
    }

    // step 4
    public function guarantor(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'phone' => 'required|numeric',
            'address' => 'required|string',
            'relationship' => 'required|string',
            'business_type' => 'required|string',
            'business_address' => 'required|string',
            'guarantors_face_photo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'id_card' => 'required|file|mimes:pdf,png,jpeg,jpg|max:2048',
            'proof_of_residence' => 'required|file|mimes:pdf,png,jpeg,jpg|max:2048',
        ]);

        $user = Auth::user();

        $this->authorize('create', [Guarantor::class, $user]);

        $guarantors_face_file = $request->file('guarantors_face_photo');
        $guarantors_face_photo = $guarantors_face_file->move('uploads/'.$user->id, $guarantors_face_file->getClientOriginalName())->getPathName();

        $id_card_file = $request->file('id_card');
        $id_card = $id_card_file->move('uploads/'.$user->id, $id_card_file->getClientOriginalName())->getPathName();

        $proof_of_residence_file = $request->file('proof_of_residence');
        $proof_of_residence = $proof_of_residence_file->move('uploads/'.$user->id, $proof_of_residence_file->getClientOriginalName())->getPathName();

        $kin = Guarantor::updateOrCreate(
            ['user_id' => $user->id],
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
                'user_id' => $user->id
            ]
        );

        return response()->json([
            'step' => $user->onboarding_status,
            'data' => $kin,
            'message' => ''
        ]);
    }

    // step 5
    public function social_media_handles(Request $request)
    {
        $request->validate([
            'facebook' => 'required|string',
            'linkedin' => 'string',
            'instagram' => 'required|string'
        ]);

        $user = Auth::user();

        $social = SocialMediaHandles::updateOrCreate(
            ['user_id' => $user->id],
            [
                'facebook' => $request->facebook,
                'linkedin' => $request->linkedin ? $request->linkedin : '',
                'instagram' => $request->instagram,
                'user_id' => $user->id
            ]
        );

        return response()->json([
            'step' => $user->onboarding_status,
            'data' => $social,
            'message' => ''
        ]);
    }

    // step 6
    public function home_address(Request $request)
    {
        $request->validate([
            'number' => 'required|string',
            'street_name' => 'required|string',
            'landmark' => 'required|string',
            'city' => 'required|string',
            'local_government' => 'required|string',
            'state' => 'required|string'
        ]);

        $user = Auth::user();

        $home_address = HomeAddress::updateOrCreate(
            ['user_id' => $user->id],
            [
                'number' => $request->number,
                'street_name' => $request->street_name,
                'landmark' => $request->landmark,
                'city' => $request->city,
                'local_government' => $request->local_government,
                'state' => $request->state,
                'user_id' => $user->id
            ]
        );

        return response()->json([
            'step' => $user->onboarding_status,
            'data' => $home_address,
            'message' => ''
        ]);
    }

    // not a step in the onboarding process but is needed for loan application
    // public function card(Request $request)
    // {
    //     $request->validate([
    //         'transaction_reference' => 'required'
    //     ]);

    //     $user = Auth::user();

    //     //verify transaction
    //     $key = Config::get('paystack.lendhakey');
    //     $http_response = ExternalApiCalls::send(
    //         'GET',
    //         'https://api.paystack.co/transaction/verify/'.$request->transaction_reference,
    //         [
    //             'Authorization' => 'Bearer '.$key,
    //             'Accept' => 'application/json'
    //         ]
    //     );

    //     if ($http_response['message'] == "success") {
    //         $json_data = json_decode($http_response['data']);
    //         $json_data = $json_data->data;
    //         if ($json_data->status == 'success') {
    //             if ($json_data->authorization->reusable) {
    //                 //save payment credentials for chargebacks
    //                 PaymentCredentials::updateOrCreate(
    //                     ['user_id' => $user->id],
    //                     [
    //                         'payment_signature' => $json_data->authorization->signature,
    //                         'authorization_code' => $json_data->authorization->authorization_code,
    //                         'payment_email' => $json_data->customer->email,
    //                         'user_id' => $user->id,
    //                         'api_key' => 'lendha'
    //                     ]
    //                 );
    //                 //save card details
    //                 $card = DebitCards::updateOrCreate(
    //                     ['user_id' => $user->id],
    //                     [
    //                         'card_number' => $json_data->authorization->bin.'******'.$json_data->authorization->last4,
    //                         'card_expiry' => $json_data->authorization->exp_month.'/'.$json_data->authorization->exp_year,
    //                         'cvv' => '***',
    //                         'user_id' => $user->id
    //                     ]
    //                 );
    //                 return response()->json([
    //                     'step' => $user->onboarding_status,
    //                     "data" => $card,
    //                     "message" => "success"
    //                 ]);
    //             }
    //             return response()->json([
    //                 "data" => [],
    //                 "message" => "Not able to perform chargeback"
    //             ], 400);
    //         }
    //         return response()->json([
    //             "data" => [],
    //             "message" => "Payment failed"
    //         ], 400);
    //     }
    //     return response()->json([
    //         "data" => [],
    //         "message" => "Error verifying user"
    //     ], 400);
    // }

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
            'business_pictures' => 'array|min:3',
            'business_pictures.*' => 'image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $user = Auth::user();

        $paths = [];

        if ($request->hasFile('business_pictures')) {
            foreach ($request->file('business_pictures') as $file) {
                $path = $file->move('uploads/'.$user->id.'/business_pictures', $file->getClientOriginalName())->getPathName();
                $paths[] = $path;
            }
        }

        $business = $user->business()->updateOrCreate(
            ['user_id' => $user->id],
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
            'data' => $business,
            'message' => ''
        ]);
    }

    public function validateCac(Request $request, CACValidationService $cacValidationService)
    {
        $request->validate([
            'rc_number' => 'required|string',
            'company_name' => 'required|string',
            'company_type' => 'required|string',
        ]);

        $user = Auth::user();

        try {
            $isValidCac = $cacValidationService->cacValidation(
                $request->rc_number,
                $request->company_name,
                $request->company_type,
                $user
            );
        } catch (Exception $e) {
            return response()->json([
                "data" => [
                    'step' => $user->onboarding_status
                ],
                "message" => $e->getMessage(),
                "status" => false
            ], $e->getCode());
        }

        if ($isValidCac) {
            return response()->json([
                "data" => [
                    'step' => $user->onboarding_status
                ],
                "message" => "Business name validated successfully"
            ]);
        }

        return response()->json([
            "data" => [
                'step' => $user->onboarding_status
            ],
            "message" => "Business name validation failed"
        ], 400);
    }
}
