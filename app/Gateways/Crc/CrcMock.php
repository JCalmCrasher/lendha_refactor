<?php

namespace App\Gateways\Crc;

use Exception;
use Illuminate\Support\Facades\Http;

class CrcMock extends Crc
{
    /**
     * @throws Exception
     */
    public function crcCheck(string|int $bvn, string $name)
    {
        $url = $this->baseUrl . "/JsonLiveRequest/JsonService.svc/CIRRequest/ProcessRequestJson";

        if (preg_match('/^5\d{9}5$/', $bvn)) {
            Http::fake([
                $url => Http::response([
                    "ConsumerHitResponse" => [
                        "BODY" => [
                            "AddressHistory" => null,
                            "Amount_OD_BucketCURR1" => null,
                            "CONSUMER_RELATION" => null,
                            "CREDIT_MICRO_SUMMARY" => null,
                            "CREDIT_NANO_SUMMARY" => null,
                            "CREDIT_SCORE_DETAILS" => [
                                "CREDIT_SCORE_SUMMARY" => [
                                    "CREDIT_RATING" => "GOOD",
                                    "CREDIT_SCORE" => 722,
                                    "REASON_CODE1" => "Applicant is young relative to the other applicants scored.",
                                    "REASON_CODE2" => "Lack of recent revolving/charge account information on the credit report.",
                                    "REASON_CODE3" => "Time since most recent account opening on the credit report is too short relative to the other applicants scored.",
                                    "REASON_CODE4" => "The length of time accounts have been established on the credit report is short relative to the other applicants scored."
                                ]
                            ],
                            "ClassificationInsType" => [
                                [
                                    "AMOUNT_OVERDUE" => "0",
                                    "APPROVED_CREDIT_SANCTIONED" => "11,426,551",
                                    "CURRENCY" => "NGN",
                                    "ClassificationInsType" => null,
                                    "INSTITUTION_TYPE" => "Micro Lenders",
                                    "LEGAL_FLAG" => null,
                                    "NO_OF_ACCOUNTS" => "3",
                                    "OUSTANDING_BALANCE" => "1,260,995"
                                ]
                            ],
                            "ClassificationProdType" => [
                                [
                                    "AMOUNT_OVERDUE" => "0",
                                    "CURRENCY" => "NGN",
                                    "ClassificationProdType" => null,
                                    "NO_ACC_LAST_SIX_MON" => "0",
                                    "NO_OF_ACCOUNTS" => "3",
                                    "PRODUCT_TYPE" => "Others",
                                    "RECENT_OVERDUE_DATE" => null,
                                    "SANCTIONED_AMOUNT" => "11,426,551",
                                    "TOTAL_OUTSTANDING_BALANCE" => "1,260,995"
                                ]
                            ],
                            "ClosedAccounts" => null,
                            "ConsCommDetails" => [
                                "ConsCommDetails_ID" => [
                                    [
                                        "EXPIRY_DATE" => null,
                                        "IDENTIFIERNUMBER" => "22216413924",
                                        "IDENTIFIER_NUMBER" => "22216413924",
                                        "ID_TYPE" => "Bank Verification Number"
                                    ],
                                    [
                                        "EXPIRY_DATE" => null,
                                        "IDENTIFIERNUMBER" => "A05115322",
                                        "IDENTIFIER_NUMBER" => "A05115322",
                                        "ID_TYPE" => "Passport Authority"
                                    ]
                                ],
                                "ConsCommDetails_Subject" => [
                                    "ADDRESS" => "     NG    NIGERIA ",
                                    "APPLICATIONVIABILITYSCORE" => "NA",
                                    "DATE_OF_BIRTH" => "05-Dec-1988",
                                    "DATE_OF_BIRTH_M" => "1988-12-05",
                                    "GENDER" => "Female",
                                    "NAME" => $name,
                                    "NATIONALITY" => "Nigeria",
                                    "PHONE_NO1" => "09093934589",
                                    "PHONE_NO2" => "09087061075"
                                ],
                            ],
                            "ConsumerMergerDetails" => null,
                            "ContactHistory" => null,
                            "CreditDisputeDetails" => null,
                            "CreditFacilityHistory24" => null,
                            "CreditProfileOverview" => null,
                            "CreditProfileSummaryCURR1" => null,
                            "CreditProfileSummaryCURR2" => null,
                            "CreditProfileSummaryCURR3" => null,
                            "CreditProfileSummaryCURR4" => null,
                            "CreditProfileSummaryCURR5" => null,
                            "DMMDisputeSection" => null,
                            "DODishonoredChequeDetails" => null,
                            "DOJointHolderDetails" => null,
                            "DOLitigationDetails" => null,
                            "DisclaimerDetails" => [],
                            "EmploymentHistory" => null,
                            "GuaranteedLoanDetails" => null,
                            "InquiryHistoryDetails" => [
                                [
                                    "FACILITY_TYPE" => "Overdraft",
                                    "INQUIRY_DATE" => "19-May-2023",
                                    "INSTITUTION_TYPE" => "Micro Lenders",
                                    "SNO" => "1"
                                ],
                                [
                                    "FACILITY_TYPE" => "Overdraft",
                                    "INQUIRY_DATE" => "19-May-2023",
                                    "INSTITUTION_TYPE" => "Micro Lenders",
                                    "SNO" => "2"
                                ],
                                [
                                    "FACILITY_TYPE" => "Overdraft",
                                    "INQUIRY_DATE" => "19-May-2023",
                                    "INSTITUTION_TYPE" => "Other Organizations",
                                    "SNO" => "3"
                                ],
                                [
                                    "FACILITY_TYPE" => "Overdraft",
                                    "INQUIRY_DATE" => "19-May-2023",
                                    "INSTITUTION_TYPE" => "Other Organizations",
                                    "SNO" => "4"
                                ],
                                [
                                    "FACILITY_TYPE" => "Overdraft",
                                    "INQUIRY_DATE" => "19-May-2023",
                                    "INSTITUTION_TYPE" => "Other Organizations",
                                    "SNO" => "5"
                                ],
                                [
                                    "FACILITY_TYPE" => "Overdraft",
                                    "INQUIRY_DATE" => "19-May-2023",
                                    "INSTITUTION_TYPE" => "Other Organizations",
                                    "SNO" => "6"
                                ],
                                [
                                    "FACILITY_TYPE" => "Overdraft",
                                    "INQUIRY_DATE" => "18-May-2023",
                                    "INSTITUTION_TYPE" => "Micro Lenders",
                                    "SNO" => "7"
                                ],
                                [
                                    "FACILITY_TYPE" => "Overdraft",
                                    "INQUIRY_DATE" => "17-May-2023",
                                    "INSTITUTION_TYPE" => "Micro Lenders",
                                    "SNO" => "8"
                                ],
                                [
                                    "FACILITY_TYPE" => "Personal Loan",
                                    "INQUIRY_DATE" => "23-Aug-2021",
                                    "INSTITUTION_TYPE" => "Commercial Banks",
                                    "SNO" => "9"
                                ],
                                [
                                    "FACILITY_TYPE" => "Personal Loan",
                                    "INQUIRY_DATE" => "16-Jul-2021",
                                    "INSTITUTION_TYPE" => "Commercial Banks",
                                    "SNO" => "10"
                                ]
                            ],
                            "Inquiry_Product" => [
                                [
                                    "BANK" => "0",
                                    "MICRO" => "4",
                                    "MORTGAGE" => "0",
                                    "NBFC" => "0",
                                    "OTHER" => "4",
                                    "PRODUCT_TYPE" => "Overdraft",
                                    "TOTAL" => "8"
                                ],
                                [
                                    "BANK" => "0",
                                    "MICRO" => "4",
                                    "MORTGAGE" => "0",
                                    "NBFC" => "0",
                                    "OTHER" => "4",
                                    "PRODUCT_TYPE" => "Total",
                                    "TOTAL" => "8"
                                ]
                            ],
                            "LegendDetails" => [],
                            "MFCREDIT_MICRO_SUMMARY" => null,
                            "MFCREDIT_NANO_SUMMARY" => null,
                            "MGCREDIT_MICRO_SUMMARY" => null,
                            "MGCREDIT_NANO_SUMMARY" => null,
                            "MIC_CONSUMER_PROFILE" => null,
                            "NANO_CONSUMER_PROFILE" => null,
                            "RelatedToDetails" => null,
                            "ReportDetail" => [
                                "ReportDetailBVN" => null
                            ],
                            "ReportDetailAcc" => [
                                "ReportDetailAcc" => null
                            ],
                            "ReportDetailBVN" => [
                                "ReportDetailBVN" => [
                                    "BVN_NUMBER" => $bvn,
                                    "CIR_NUMBER" => "W-0076898061/2023",
                                    "DATE_OF_BIRTH" => null,
                                    "DATE_OF_BIRTH_M" => null,
                                    "GENDER" => null,
                                    "INSTITUTION_NAME" => "CRC CREDIT BUREAU LIMITED - BATCH PRODUCTS",
                                    "NAME" => null,
                                    "REPORT_ORDER_DATE" => "20-May-2023",
                                    "REPORT_ORDER_DATE_M" => null,
                                    "SEARCH_CONFIDENCE_SCORE" => "100%"
                                ]
                            ],
                            "ReportDetailMob" => [
                                "ReportDetailMob" => null
                            ],
                            "ReportDetailsSIR" => [],
                            "SecurityDetails" => null,
                            "SummaryOfPerformance" => null,
                        ],
                        "HEADER" => [
                            "REPORTHEADER" => [
                                "MAILTO" => "support@crccreditbureau.com",
                                "PRODUCTNAME" => "Consumer Basic Premium Report",
                                "REASON" => [],
                                "REPORTDATE" => "20/May/2023",
                                "REPORTORDERNUMBER" => "W-0076898061/2023",
                                "USERID" => "xxxxxxxxxxxx"
                            ],
                            "RESPONSETYPE" => [
                                "CODE" => "1",
                                "DESCRIPTION" => "Response DataPacket",
                            ],
                            "SEARCHCRITERIA" => [
                                "BRANCHCODE" => null,
                                "BVN_NO" => $bvn,
                                "CFACCOUNTNUMBER" => null,
                                "DATEOFBIRTH" => null,
                                "GENDER" => null,
                                "NAME" => null,
                                "TELEPHONE_NO" => null
                            ],
                            "SEARCHRESULTLIST" => [
                                "SEARCHRESULTITEM" => [
                                    "ADDRESSES" => [],
                                    "BUREAUID" => "1112019002271559",
                                    "CONFIDENCESCORE" => "100",
                                    "IDENTIFIERS" => [],
                                    "NAME" => $name,
                                    "SURROGATES" => []
                                ]
                            ],
                        ],
                        "REQUESTID" => "1"
                    ]
                ], 200)
            ]);

            return parent::crcCheck($bvn, $name);
        }

        Http::fake([
            $url => Http::response([
                "ConsumerNoHitResponse" => [
                    "BODY" => [
                        "NOHIT" => [
                            "DATAPACKET" => [
                                "ConsDisclaimer" => null,
                                "NoHit_CONSUMER_PROFILE" => null,
                                "NoHit_SUBJECT_DETAILS" => null
                            ]
                        ]
                    ],
                    "HEADER" => [
                        "RESPONSETYPE" => [
                            "CODE" => "2",
                            "DESCRIPTION" => "Response NoHit"
                        ]
                    ],
                    "REQUESTID" => "1"
                ]
            ], 200)
        ]);

        return parent::crcCheck($bvn, $name);
    }
}
