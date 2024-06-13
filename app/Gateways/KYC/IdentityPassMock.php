<?php

namespace App\Gateways\KYC;

use App\Interfaces\KYC\IBVNCheck;
use App\Interfaces\KYC\ICACCheck;
use GuzzleHttp\Psr7\Response;

class IdentityPassMock extends IdentityPass implements IBVNCheck, ICACCheck
{
    public function bvnCheck($bvn, ?string $name = null)
    {
        $splitUserName = explode(" ", strtolower($name));

        if (preg_match('/^5\d{9}5$/', $bvn)) {
            $response = new Response(200, $this->headers, json_encode([
                "status" => true,
                "detail" => "Verification Successfull",
                "response_code" => "00",
                "data" => [
                    "bvn" => $bvn,
                    "firstName" => $splitUserName[0] ?: 'Test',
                    "middleName" => '',
                    "lastName" => $splitUserName[1] ?? 'Test',
                    "dateOfBirth" => "02-Sep-1980",
                    "registrationDate" => "02-Feb-2009",
                    "enrollmentBank" => "070",
                    "enrollmentBranch" => "Surulere",
                    "email" => "test@lendha.com",
                    "gender" => "Male",
                    "levelOfAccount" => "Level 2 - Medium Level Accounts",
                    "lgaOfOrigin" => "Surulere",
                    "lgaOfResidence" => "Surulere",
                    "maritalStatus" => "Married",
                    "nin" => "12345678901",
                    "nameOnCard" => "Test Test Test",
                    "nationality" => "Nigeria",
                    "phoneNumber1" => "08012345678",
                    "phoneNumber2" => "",
                    "residentialAddress" => "string",
                    "stateOfOrigin" => "Lagos",
                    "stateOfResidence" => "Lagos",
                    "title" => "Mr",
                    "watchListed" => "NO",
                    "base64Image" => "base64_string"
                ]
            ]));
        } else {
            $response = new Response(400, $this->headers, json_encode([
                "status" => false,
                "detail" => "Verification failed",
                "message" => "BVN not found"
            ]));
        }

        return json_decode($response->getBody()->getContents(), false);
    }

    public function cacCheck(string $rcNumber, string $companyName, string $companyType)
    {
        if (preg_match('/^5\d{4}5$/', $rcNumber)) {
            $response = new Response(200, $this->headers, json_encode([
                "status" => true,
                "detail" => "Verification Successfull",
                "response_code" => "00",
                "data" => [
                    "rc_number" => $rcNumber,
                    "company_name" => $companyName,
                    "state" => "DELTA State",
                    "company_address" => "10 lekki phase 12, Ousn state",
                    "company_status" => "Active",
                    "city" => "Akure",
                    "branchAddress" => "lekki phase 10, Osun state",
                    "lga" => "Birnin Kudu",
                    "registrationDate" => "1986-06-04T00:00:00Z",
                    "directors" => [
                        0 => [
                            "surname" => "Test",
                            "firstname" => "Test",
                            "otherName" => "",
                            "email" => "test@test.com",
                            "phoneNumber" => "080000000000",
                            "gender" => "Male",
                            "formerNationality" => "",
                            "city" => "Lagos",
                            "occupation" => "Trader",
                            "formerName" => "",
                            "corporationName" => "",
                            "rcNumber" => "092932",
                            "state" => "Lagos",
                            "accreditationnumber" => "00000000000",
                            "formType" => "National Identification Number",
                            "numSharesAlloted" => "",
                            "typeOfShares" => "",
                            "dateOfBirth" => "",
                            "dateOfAppointment" => "",
                            "status" => "ACTIVE",
                            "formerSurname" => "",
                            "formerFirstName" => "",
                            "formerOtherName" => "",
                            "identityNumber" => "",
                            "otherDirectorshipDetails" => "",
                            "affiliateTypeFk" => [
                                "name" => "",
                                "description" => "",
                            ],
                            "countryFk" => [
                                "name" => "",
                                "code" => "",
                            ],
                            "lga" => "",
                            "isCorporate" => false,
                            "nationality" => "Nigerian",
                            "address" => "Test address",
                            "streetNumber" => "Test Street",
                            "isChairman" => "Yes",
                            "isDesignated" => "",
                            "postcode" => "",
                            "formerNameType" => "",
                            "affiliatesResidentialAddress" => [
                                "country" => "NIGERIA",
                                "state" => "",
                                "lga" => "",
                                "city" => "",
                                "address" => "",
                                "streetNumber" => "",
                                "postcode" => "",
                                "hideResidentialAddress" => false,
                                "affiliateType" => "",
                            ],
                            "affiliatesPscInformation" => "",
                            "isPublicUser" => "",
                        ],
                    ],
                    "searchScore" => "0",
                    "email_address" => "test@test.com",
                    "company_type" => $companyType,
                ],
            ]));
        } else {
            $response = new Response(400, $this->headers, json_encode([
                "status" => false,
                "detail" => "Verification failed",
                "message" => "Record not found"
            ]));
        }

        return json_decode($response->getBody()->getContents(), false);
    }

}
