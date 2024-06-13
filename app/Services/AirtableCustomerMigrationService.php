<?php

namespace App\Services;

use App\Gateways\Airtable\Airtable;
use App\Jobs\AirtableCustomerMigrationJob;
use App\Models\User;
use App\Traits\NameResolutionTrait;
use Carbon\Carbon;
use Exception;
use GuzzleHttp\Exception\GuzzleException;
use JsonMachine\Items;
use JsonMachine\JsonDecoder\ExtJsonDecoder;

class AirtableCustomerMigrationService
{
    use NameResolutionTrait;

    public const CHUNK_SIZE = 100;

    public function __construct(private readonly Airtable $airtable)
    {
    }

    /**
     * @throws Exception
     */
    public function fetchUserRecords($offset = null): ?array
    {
        try {
            $jsonStream = $this->airtable->fetchUserRecords($offset, self::CHUNK_SIZE);

            $offset = Items::fromStream($jsonStream, ['pointer' => '/offset']) ?? null;

            $users = Items::fromStream($jsonStream, [
                'pointer' => '/records',
                'decoder' => new ExtJsonDecoder(true)
            ]);

            $batchedUsers = [];

            foreach ($users as $userData) {
                $user = $this->mapUserData($userData);

                $batchedUsers[] = $user;

                if (count($batchedUsers) >= self::CHUNK_SIZE) {
                    AirtableCustomerMigrationJob::dispatch($batchedUsers);

                    $batchedUsers = [];
                    if ($offset) {
                        return $this->fetchUserRecords($offset);
                    }
                }
            }

            AirtableCustomerMigrationJob::dispatch($batchedUsers);

        } catch (Exception|GuzzleException $e) {
            throw new Exception('Unable to start user migration, please try again in a few minutes', 500, $e);
        }

        return null;
    }

    private function mapUserData(array $userData): array
    {
        $user = [];

        $airtableId = $userData['id'];

        $user['name'] = $userData['fields']['Surname'] . $userData['fields']['Name'];
        $user['bvn'] = $userData['fields']['BVN'];
        $user['phone_number'] = $userData['fields']['PHONE NUMBER'];
        $user['date_of_birth'] = $userData['fields']['DATE OF BIRTH'];
        $user['email'] = $userData['fields']['EMAIL ADDRESS'];
        $user['gender'] = $userData['fields']['GENDER'];
        $user['address'] = $userData['fields']['HOME ADDRESS'];
        $user['marital_status'] = $userData['fields']['MARITAL STATUS'];

        $user['officer_id'] = $this->getOfficerId($userData['fields']['LOAN OFFICER']);

        $user['business']['name'] = $userData['fields']['BUSINESS NAME'];
        $user['business']['description'] = $userData['fields']['NATURE OF BUSINESS'];
        $user['business']['business_age'] = $userData['fields']['LENGTH OF TIME IN BUSINESS'];

        $businessAddress = explode(' ', $userData['fields']['BUSINESS ADDRESS']);

        $user['business']['address_number'] = $businessAddress[0] ?? null;
        $user['business']['street'] = $businessAddress[1] . ' ' . $businessAddress[2] ?? null;
        $user['business']['city'] = $businessAddress[3] ?? null;
        $user['business']['state'] = $businessAddress[4] ?? null;
        $user['business']['business_pictures'][] = $userData['fields']['TAKE A PICTURE OF THE SHOP (OUTSIDE)'];
        $user['business']['business_pictures'][] = $userData['fields']['TAKE A PICTURE OF THE STOCK ( INSIDE THE SHOP)'];
        $user['business']['shop_receipt'] = $userData['fields']['Upload Shop receipt'];

        $user['next_of_kin']['name'] = $userData['fields']['NEXT OF KIN NAME'];
        $user['next_of_kin']['phone'] = $userData['fields']['PHONE NUMBER OF NEXT OF KIN'];
        $user['next_of_kin']['relationship'] = $userData['fields']['RELATIONSHIP WITH NEXT OF KIN'];
        $user['next_of_kin']['address'] = $userData['fields']['ADDRESS OF NEXT OF KIN'];

        $user['guarantor']['name'] = $userData['fields']['GUARANTOR FULL NAME'];
        $user['guarantor']['address'] = $userData['fields']['GUARANTOR\'S RESIDENTIAL ADDRESS'];
        $user['guarantor']['business_address'] = $userData['fields']['GUARANTOR\'S BUSINESS ADDRESS'];
        $user['guarantor']['business_type'] = $userData['fields']['GUARANTOR\'S NATURE OF BUSINESS'];
        $user['guarantor']['phone'] = $userData['fields']['GUARANTOR\'S PHONE NUMBER'];
        $user['guarantor']['guarantors_face_photo'] = $userData['fields']['GUARANTOR PHOTO'];
        $user['guarantor']['id_card'] = $userData['fields']['GUARANTOR ID CARD'];
        $user['guarantor']['relationship'] = $userData['fields']['RELATIONSHIP WITH GUARANTOR'];

        $user['guarantor']['video'] = $userData['fields']['Upload an video of the Guarantor accepting to be the client\'s Guarantor'];
        $user['guarantor']['proof_of_residence'] = $userData['fields']['TAKE A PICTURE OF THE GUARANTOR\'S SHOP (With the guarantor)'];

        $user['loan']['application_id'] = md5(now() . $user['email']);
        $user['loan']['request_date'] = Carbon::parse($userData['createdTime'])->format('Y-m-d g:i:s');
        $user['loan']['purpose'] = 'SME Beta';
        $user['loan']['amount'] = $userData['fields']['LOAN AMOUNT REQUESTED'];
        $user['loan']['duration'] = $userData['fields']['TENOR (In Weeks)'];
        $user['loan']['loan_reason'] = $userData['fields']['REASON FOR LOAN'];
        $user['loan']['status'] = $userData['fields']['Application Status'] ?? 'pending';

        $user['account']['account_number'] = $userData['fields']['BANK ACCOUNT NUMBER'];
        $user['account']['bank_name'] = $userData['fields']['BANK NAME'];
        $user['account']['account_name'] = $userData['fields']['BANK ACCOUNT NAME'];

        $user['document']['passport_photo'] = $userData['fields']['CLIENT PASSPORT PHOTOGRAPH'];
        $user['document']['valid_id'] = $userData['fields']['CLIENT ID CARD (FRONT)'];
        $user['document']['valid_id_back'] = $userData['fields']['CLIENT ID CARD (BACK)'];
        $user['document']['residence_proof'] = $userData['fields']['Upload Utility bill of home'];

        $user['business_assessment']['sales'] = $userData['fields']['Average Daily sales?'];
        $user['business_assessment']['cost_of_sales'] = $userData['fields']['What is the cost of sales?'];
        $user['business_assessment']['gross_profit'] = $userData['fields']['What is the gross profit?'];
        $user['business_assessment']['operational_expenses'] = $userData['fields']['What is the business expense?'];
        $user['business_assessment']['repayment_capacity'] = $userData['fields']['Repayment capacity?'];
        $user['business_assessment']['family_and_other_expenses'] = $userData['fields']['Family Expense?'];
        $user['business_assessment']['daily_sales'] = $userData['fields']['What is the daily sales?'];

        $user['business_registration']['cac_document'] = $userData['fields']['Upload CAC Document of the Business'];

        return ['data' => $user, 'airtable_id' => $airtableId];
    }

    private function getOfficerId(string $officerName)
    {
        return User::query()->whereHas('type', function ($query) {
            $query->where('type', User::ONBOARDING_OFFICER_TYPE);
        })->lazy()->filter(function ($user) use ($officerName) {
            return $this->checkNameMatch($officerName, $user->name);
        })->value('id');
    }
}
