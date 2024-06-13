import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { URL } from '../../../../api';
import Alert from '../../../../components/alert/alert';
import Button from '../../../../components/button/button';
// import CreditOfficerCard from "../../../../components/credit-officer-card";
import AddressModal from '../../../../components/modal/address-modal';
import BankAccountModal from '../../../../components/modal/bank-account-modal';
import BusinessInfoModal from '../../../../components/modal/business-modal';
import BusinessRegStatusModal from '../../../../components/modal/business-reg-status-modal';
import DebitCardModal from '../../../../components/modal/debit-card-modal';
import DocumentModal from '../../../../components/modal/document-modal';
import GuarantorModal from '../../../../components/modal/guarantor-modal';
import SocialHandlesModal from '../../../../components/modal/social-handles-modal';
import UserAccountModal from '../../../../components/modal/user-account-modal';
import OverviewInfo from '../../../../components/overview-info/overview-info';
import Spinner from '../../../../components/spinner/spinner';
import Status from '../../../../components/status/status';
import SubSectionHeader from '../../../../components/sub-section-header/sub-section-header';
import { formatDateInWords, isNullish, statusStyling, successStatusCode } from '../../../../components/utils/helper';
import { closeAlert } from '../../../../store/components/componentsSlice';
import {
    getBankAccountName,
    getBanksList,
    getPaymentAccount,
    getUserDashboardDetails,
    postBusinessRegStatusInfo,
    postCheckCACValidity,
    postEditAddress,
    postEditBankAccount,
    postEditBusiness,
    postEditCard,
    postEditDocuments,
    postEditGuarantor,
    postEditNok,
    postEditSocialHandles,
    postUserEditAccount,
} from '../../../../store/user/userSlice';

import './profile.scss';

import CopyToClipboard from '../../../../components/copy-to-clipboard';
import CreditOfficerCard from '../../../../components/credit-officer-card';
import Loader from '../../../../components/loader/loader';
import NokModal from '../../../../components/modal/nok-modal';
import Table from '../../../../components/table/table';

export const REG_NUMBER_REGEX = /[A-Za-z]{2}\d{5,7}$/;

function UserProfilePage() {
    const dispatch = useDispatch();
    const { isFetching, isLoading, alert } = useSelector((state) => state.componentsSlice);
    const { user, userDashboardDetails, bankAccountList, bankAccountName, isBusinessRegistered, paymentAccount } =
        useSelector((state) => state.userSlice);
    const paymentAccountLength = Object.keys(paymentAccount);
    const paymentAccountNumber = paymentAccount?.account_number || 'N/A';

    const isSubmitting = isLoading;
    const notification = alert;

    const [userAccountModal, setUserAccountModal] = useState(false);
    const [guarantorModal, setGuarantorModal] = useState(false);
    const [nokModal, setNokModal] = useState(false);
    const [bankAccountModal, setBankAccountModal] = useState(false);
    const [businessInfoModal, setBusinessInfoModal] = useState(false);
    const [businessRegStatusModal, setBusinessRegStatusModal] = useState(false);
    const [documentModal, setDocumentModal] = useState({});
    const [debitCardModal, setDebitCardModal] = useState(false);
    const [socialHandlesModal, setSocialHandlesModal] = useState(false);
    const [addressModal, setAddressModal] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { isValid, errors },
        // errors,
        watch,
        reset,
    } = useForm({
        mode: 'onChange',
    });

    const {
        register: nokRegister,
        handleSubmit: handleNokSubmit,
        formState: { isValid: isNokValid, errors: nokErrors },
    } = useForm({
        mode: 'onChange',
    });

    useEffect(() => {
        dispatch(getBanksList());
        dispatch(getUserDashboardDetails());
        dispatch(getPaymentAccount());
    }, []);

    const newPasswordInput = watch('password', '');
    const submitChangePassword = (data) => {
        dispatch(postUserEditAccount(data)).then((res) => {
            if (res?.status === successStatusCode) {
                setUserAccountModal(false);
                dispatch(getUserDashboardDetails());
            }
        });
    };

    const submitBusinessInfo = (data) => {
        dispatch(postEditBusiness(data)).then((res) => {
            if (res?.status === successStatusCode) {
                setBusinessInfoModal(false);
                dispatch(getUserDashboardDetails());
            }
        });
    };

    const submitBusinessRegStatus = (data) => {
        const businessRegStatusData = new FormData();
        if (isBusinessRegistered) {
            businessRegStatusData.append('business_registration_number', data.businessRegNumber);
            businessRegStatusData.append('user_file', data.cac_doc[0]);

            dispatch(postBusinessRegStatusInfo(businessRegStatusData)).then((res) => {
                if (res?.status === successStatusCode) {
                    setBusinessRegStatusModal(false);
                    dispatch(getUserDashboardDetails());
                    reset();
                }
            });
        } else {
            setBusinessRegStatusModal(false);
        }
    };

    const checkCACValidity = (data) => {
        const company_type = data?.businessType;
        const rc_number = data?.businessRegNumber;
        const company_name = data?.businessName;

        const payload = {
            rc_number,
            company_type,
            company_name,
        };

        dispatch(postCheckCACValidity(payload)).then((res) => {
            if (res?.status === successStatusCode) {
                submitBusinessRegStatus(data);
            }
        });
    };

    const submitGuarantor = (data) => {
        const payload = new FormData();
        payload.append('name', data.name);
        payload.append('phone', data.phone);
        payload.append('address', data.address);
        payload.append('guarantors_face_photo', data.guarantors_face_photo[0]);
        payload.append('id_card', data.id_card[0]);
        payload.append('proof_of_residence', data.proof_of_residence[0]);
        payload.append('business_type', data.business_type);
        payload.append('business_address', data.business_address);
        payload.append('relationship', data.relationship);

        dispatch(postEditGuarantor(payload)).then((res) => {
            if (res?.status) {
                setGuarantorModal(false);
                dispatch(getUserDashboardDetails());
            }
        });
    };

    const submitNok = (payload) => {
        const data = {
            name: payload?.nokName,
            phone: payload?.nokPhone,
            email: payload?.nokEmail,
            address: payload?.nokAddress,
            relationship: payload?.nokRelationship,
        };
        dispatch(postEditNok(data)).then((res) => {
            if (res?.status) {
                setNokModal(false);
                dispatch(getUserDashboardDetails());
                reset();
            }
        });
    };

    const accountNumber = watch('account_number', '');
    const bankCode = watch('bank_code', '');
    useEffect(() => {
        if (bankCode !== '' && accountNumber.length === 10) {
            dispatch(getBankAccountName(bankCode, accountNumber));
        }
    }, [bankCode, accountNumber, dispatch]);

    const submitBankAccount = (data) => {
        const selectedBank = bankAccountList.filter((item) => item.value === bankCode);
        const bank = { bank: selectedBank[0].name };
        delete data.account_name;

        const bankAccountData = Object.assign(data, bank);
        dispatch(postEditBankAccount(bankAccountData)).then((res) => {
            if (res?.status === successStatusCode) {
                setBankAccountModal(false);
                dispatch(getUserDashboardDetails());
            }
        });
    };

    const getDocumentInputError = (name) => {
        switch (name) {
            case 'passport':
                return errors?.passport;
            case 'work_id':
                return errors?.work_id;
            case 'valid_id':
                return errors?.valid_id;
            case 'proof':
                return errors?.proof;
            default:
        }
    };
    const documentResThen = (res) => {
        if (res?.status === successStatusCode) {
            setDocumentModal({});
            dispatch(getUserDashboardDetails());
        }
    };
    const submitDocument = (data) => {
        switch (documentModal.name) {
            case 'passport_photo':
                return dispatch(
                    postEditDocuments({
                        file: data.passport_photo[0],
                        path: 'passport_photo',
                    }),
                ).then((res) => documentResThen(res));
            case 'work_id':
                return dispatch(
                    postEditDocuments({
                        file: data.work_id[0],
                        path: 'work_id',
                    }),
                ).then((res) => documentResThen(res));
            case 'valid_id':
                return dispatch(
                    postEditDocuments({
                        file: data.valid_id[0],
                        path: 'valid_id',
                    }),
                ).then((res) => documentResThen(res));
            case 'residence_proof':
                return dispatch(
                    postEditDocuments({
                        file: data.residence_proof[0],
                        path: 'residence_proof',
                    }),
                ).then((res) => documentResThen(res));
            default:
        }
    };

    const onPaymentSuccess = (data) => {
        const { status } = data;
        if (status === 'success') {
            const reference = { transaction_reference: data.reference };
            dispatch(postEditCard(reference)).then((res) => {
                if (res?.status === successStatusCode) {
                    setDebitCardModal(false);
                    dispatch(getUserDashboardDetails());
                }
            });
        }
    };
    const onPaymentClose = () => {
        console.log('closed');
    };
    const paystackConfig = {
        reference: new Date().getTime().toString(),
        email: user.email,
        amount: 10000,
        paystackkey: URL.paystack_key,
        embed: true,
        callback: (reference) => onPaymentSuccess(reference),
        close: onPaymentClose,
    };

    const submitSocialHandles = (data) => {
        dispatch(postEditSocialHandles(data)).then((res) => {
            if (res?.status === successStatusCode) {
                setSocialHandlesModal(false);
                dispatch(getUserDashboardDetails());
            }
        });
    };

    const submitAddress = (data) => {
        dispatch(postEditAddress(data)).then((res) => {
            if (res?.status === successStatusCode) {
                setAddressModal(false);
                dispatch(getUserDashboardDetails());
            }
        });
    };

    const hasAnActiveLoan = userDashboardDetails?.current_application?.status === 'approved';
    const isLoanPending = userDashboardDetails?.current_application?.status === 'pending';

    const isSectionComplete = (obj) => {
        if (obj === null || obj === undefined) return 'incomplete';

        if (typeof obj === 'object') {
            if (isNullish(obj)) return 'incomplete';
            return 'complete';
        }

        return 'incomplete';
    };

    const businessSectionComplete = (obj) => {
        if (obj === null || obj === undefined) return 'unregistered';

        if (typeof obj === 'object') {
            if (isNullish(obj)) return 'unregistered';
            return 'registered';
        }

        return 'unregistered';
    };

    const isDocumentsComplete = (documents) => {
        if (
            documents?.passport_photo &&
            // documents?.work_id &&
            documents?.valid_id &&
            documents?.residence_proof
        ) {
            return 'complete';
        }
        return 'incomplete';
    };
    const guarantor = userDashboardDetails?.user?.guarantor;
    const nextOfKin = userDashboardDetails?.user?.next_of_kin;
    const bank = userDashboardDetails?.user?.bank;
    const business = userDashboardDetails?.user?.business;
    const businessInfo = {
        name: business?.name,
        email: business?.email,
        category: business?.category,
        description: business?.description,
        street: business?.street,
        landmark: business?.landmark,
        city: business?.city,
        state: business?.state,
    };
    const busReg = business?.business_registration;
    const documents = userDashboardDetails?.user?.documents;
    const cards = userDashboardDetails?.user?.cards;
    const social_media_handles = userDashboardDetails?.user?.social_media_handles;
    const home_address = userDashboardDetails?.user?.home_address;
    const credit_officer = userDashboardDetails?.credit_officer;

    return (
        <>
            {isFetching && <Spinner />}

            <div className="section dashbase profile_page">
                {/* Account */}
                <div className="section_div">
                    <div className="flex_div">
                        <SubSectionHeader headText="Account" rule />
                        <Status type={statusStyling('complete')} text="complete" />
                        {!hasAnActiveLoan && (
                            <Button
                                text="Change password"
                                onClick={() => {
                                    setUserAccountModal(true);
                                    dispatch(closeAlert());
                                }}
                            />
                        )}
                    </div>
                    <div className="info_div">
                        <OverviewInfo headText={user.name} subTextSpan="Full name" />
                        <OverviewInfo headText={user.email} subTextSpan="Email address" />
                        <OverviewInfo headText={user.phone_number} subTextSpan="Phone number" />
                        <OverviewInfo headText={formatDateInWords(user.date_of_birth)} subTextSpan="Date of birth" />
                    </div>
                </div>

                {/* Business info */}
                <div className="section_div">
                    <div className="flex_div">
                        <SubSectionHeader headText="Business Information" rule />
                        <Status
                            type={statusStyling(isSectionComplete(businessInfo))}
                            text={isSectionComplete(businessInfo)}
                        />
                        {!hasAnActiveLoan && (
                            <Button
                                text="Edit"
                                onClick={() => {
                                    setBusinessInfoModal(true);
                                    dispatch(closeAlert());
                                }}
                            />
                        )}
                    </div>
                    <div className="info_div">
                        <OverviewInfo headText={business?.name || 'N/A'} subTextSpan="Business Name" />
                        <OverviewInfo headText={business?.email || 'N/A'} subTextSpan="Business email" />
                        <OverviewInfo headText={business?.category || 'N/A'} subTextSpan="Business category" />
                        <OverviewInfo headText={business?.description || 'N/A'} subTextSpan="Business description" />
                        <OverviewInfo headText={business?.street || 'N/A'} subTextSpan="Business street" />
                        <OverviewInfo headText={business?.landmark || 'N/A'} subTextSpan="Business landmark" />
                        <OverviewInfo headText={business?.city || 'N/A'} subTextSpan="Business city" />
                        <OverviewInfo headText={business?.state || 'N/A'} subTextSpan="Business state" />
                    </div>
                </div>

                {/* Business registration status */}
                <div className="section_div">
                    <div className="flex_div">
                        <SubSectionHeader headText="Business registration status" rule />
                        <Status
                            type={statusStyling(businessSectionComplete(busReg))}
                            text={businessSectionComplete(busReg)}
                        />
                        {!hasAnActiveLoan && (
                            <Button
                                text="Edit"
                                onClick={() => {
                                    setBusinessRegStatusModal(true);
                                    dispatch(closeAlert());
                                }}
                            />
                        )}
                    </div>
                    <div className="info_div">
                        <OverviewInfo
                            headText={business?.registration_status ? 'Yes' : 'No'}
                            subTextSpan="Registered?"
                        />
                        {business?.registration_status && (
                            <>
                                <OverviewInfo
                                    headText={busReg?.business_registration_number || 'N/A'}
                                    subTextSpan="Registration Number"
                                />

                                <OverviewInfo imageUrl={busReg?.cac_document} subTextSpan="CAC Document" />
                            </>
                        )}
                    </div>
                </div>

                {/* Guarantor */}
                <div className="section_div">
                    <div className="flex_div">
                        <SubSectionHeader headText="Guarantor" rule />
                        <Status
                            type={statusStyling(isSectionComplete(guarantor))}
                            text={isSectionComplete(guarantor)}
                        />
                        {!hasAnActiveLoan && (
                            <Button
                                text="Edit"
                                onClick={() => {
                                    setGuarantorModal(true);
                                    dispatch(closeAlert());
                                }}
                            />
                        )}
                    </div>
                    <div className="info_div">
                        <OverviewInfo headText={guarantor?.name} subTextSpan="Guarantor name" />
                        <OverviewInfo headText={guarantor?.phone} subTextSpan="Guarantor phone number" />
                        <OverviewInfo headText={guarantor?.address} subTextSpan="Guarantor address" />
                        <OverviewInfo headText={guarantor?.relationship} subTextSpan="Relationship with you" />
                        <OverviewInfo
                            headText={guarantor?.business_type || 'N/A'}
                            subTextSpan="Guarantor business type"
                        />
                        <OverviewInfo
                            headText={guarantor?.business_address || 'N/A'}
                            subTextSpan="Guarantor business address"
                        />
                        <OverviewInfo imageUrl={guarantor?.guarantors_face_photo} subTextSpan="Guarantor face photo" />
                        <OverviewInfo imageUrl={guarantor?.id_card} subTextSpan="Guarantor ID Card" />
                        <OverviewInfo
                            imageUrl={guarantor?.proof_of_residence}
                            subTextSpan="Guarantor proof of residence"
                        />
                    </div>
                </div>

                {/* Next of Kin */}
                <div className="section_div">
                    <div className="flex_div">
                        <SubSectionHeader headText="Next of Kin" rule />
                        <Status
                            type={statusStyling(isSectionComplete(nextOfKin))}
                            text={isSectionComplete(nextOfKin)}
                        />
                        {!hasAnActiveLoan && (
                            <Button
                                disabled={isLoanPending}
                                text="Edit"
                                onClick={() => {
                                    setNokModal(true);
                                    dispatch(closeAlert());
                                }}
                            />
                        )}
                    </div>
                    <div className="info_div">
                        <OverviewInfo headText={nextOfKin?.name} subTextSpan="Next of Kin name" />
                        <OverviewInfo headText={nextOfKin?.email} subTextSpan="Next of Kin email" />
                        <OverviewInfo headText={nextOfKin?.phone} subTextSpan="Next of Kin phone number" />
                        <OverviewInfo headText={nextOfKin?.relationship} subTextSpan="Relationship with you" />
                        <OverviewInfo headText={nextOfKin?.address || 'N/A'} subTextSpan="Next of Kin address" />
                    </div>
                </div>

                {/* Bank account */}
                <div className="section_div">
                    <div className="flex_div">
                        <SubSectionHeader headText="Bank account" rule />
                        <Status type={statusStyling(isSectionComplete(bank))} text={isSectionComplete(bank)} />
                        {!hasAnActiveLoan && (
                            <Button
                                text="Edit"
                                onClick={() => {
                                    setBankAccountModal(true);
                                    dispatch(closeAlert());
                                }}
                            />
                        )}
                    </div>
                    <div className="info_div">
                        <OverviewInfo headText={bank?.bvn} subTextSpan="BVN" />
                        <OverviewInfo headText={bank?.nin} subTextSpan="NIN" />
                        <OverviewInfo headText={bank?.account_name} subTextSpan="Account name" />
                        <OverviewInfo headText={bank?.account_number} subTextSpan="Account number" />
                        <OverviewInfo headText={bank?.bank_name} subTextSpan="Bank name" />
                    </div>
                </div>

                {/* Documents */}
                <div className="section_div">
                    <div className="flex_div">
                        <SubSectionHeader headText="Documents" rule />
                        <Status
                            type={statusStyling(isDocumentsComplete(documents))}
                            text={isDocumentsComplete(documents)}
                        />
                    </div>
                    <div className="info_div image_info_div">
                        <OverviewInfo imageUrl={documents?.passport_photo} subTextSpan="Passport photograph">
                            {!hasAnActiveLoan && (
                                <Button
                                    text="Edit"
                                    onClick={() => {
                                        setDocumentModal({
                                            open: true,
                                            label: 'Passport photograph',
                                            name: 'passport_photo',
                                        });
                                        dispatch(closeAlert());
                                    }}
                                />
                            )}
                        </OverviewInfo>
                        <OverviewInfo imageUrl={documents?.valid_id} subTextSpan="Valid ID">
                            {!hasAnActiveLoan && (
                                <Button
                                    text="Edit"
                                    onClick={() => {
                                        setDocumentModal({
                                            open: true,
                                            label: 'Valid ID',
                                            name: 'valid_id',
                                        });
                                        dispatch(closeAlert());
                                    }}
                                />
                            )}
                        </OverviewInfo>
                        <OverviewInfo imageUrl={documents?.residence_proof} subTextSpan="Proof of residence">
                            {!hasAnActiveLoan && (
                                <Button
                                    text="Edit"
                                    onClick={() => {
                                        setDocumentModal({
                                            open: true,
                                            label: 'Proof of residence',
                                            name: 'residence_proof',
                                        });
                                        dispatch(closeAlert());
                                    }}
                                />
                            )}
                        </OverviewInfo>
                    </div>
                </div>

                {/* Debit card */}
                {/* <div className="section_div">
                    <div className="flex_div">
                        <SubSectionHeader headText="Debit card" rule />
                        <Status
                            type={statusStyling(isSectionComplete(cards))}
                            text={isSectionComplete(cards)}
                        />
                        {!hasAnActiveLoan && (
                            <Button
                                text="Edit"
                                onClick={() => {
                                    setDebitCardModal(true);
                                    dispatch(closeAlert());
                                }}
                            />
                        )}
                    </div>
                    <div className="info_div">
                        <OverviewInfo
                            headText={cards?.card_number}
                            subTextSpan="Card number"
                        />
                        <OverviewInfo
                            headText={cards?.card_expiry}
                            subTextSpan="Card expiry"
                        />
                        <OverviewInfo headText={cards?.cvv} subTextSpan="CVV" />
                    </div>
                </div> */}

                {/* Social handles */}
                <div className="section_div">
                    <div className="flex_div">
                        <SubSectionHeader headText="Social handles" rule />
                        <Status
                            type={statusStyling(isSectionComplete(social_media_handles))}
                            text={isSectionComplete(social_media_handles)}
                        />
                        {!hasAnActiveLoan && (
                            <Button
                                text="Edit"
                                onClick={() => {
                                    setSocialHandlesModal(true);
                                    dispatch(closeAlert());
                                }}
                            />
                        )}
                    </div>
                    <div className="info_div">
                        <OverviewInfo headText={social_media_handles?.facebook} subTextSpan="Facebook" />
                        <OverviewInfo headText={social_media_handles?.instagram} subTextSpan="Instagram" />
                        <OverviewInfo headText={social_media_handles?.linkedin} subTextSpan="LinkedIn" />
                    </div>
                </div>

                {/* Address */}
                <div className="section_div">
                    <div className="flex_div">
                        <SubSectionHeader headText="Home address" rule />
                        <Status
                            type={statusStyling(isSectionComplete(home_address))}
                            text={isSectionComplete(home_address)}
                        />
                        {!hasAnActiveLoan && (
                            <Button
                                text="Edit"
                                onClick={() => {
                                    setAddressModal(true);
                                    dispatch(closeAlert());
                                }}
                            />
                        )}
                    </div>
                    <div className="info_div">
                        <OverviewInfo headText={home_address?.number} subTextSpan="House number" />
                        <OverviewInfo headText={home_address?.street_name} subTextSpan="Street name" />
                        <OverviewInfo headText={home_address?.landmark} subTextSpan="Closest landmark/bustop" />
                        <OverviewInfo headText={home_address?.city} subTextSpan="City" />
                        <OverviewInfo headText={home_address?.local_government} subTextSpan="Local government area" />
                        <OverviewInfo headText={home_address?.state} subTextSpan="State" />
                    </div>
                </div>

                {/* Credit Officer */}
                <div className="section_div">
                    <SubSectionHeader headText="Credit Officer" rule />
                    <CreditOfficerCard email={credit_officer?.email || 'N/A'} name={credit_officer?.name || 'N/A'} />
                </div>

                {/* Payment Account */}
                {hasAnActiveLoan && (
                    <div className="section_div">
                        <SubSectionHeader headText="Payment account" rule />
                        <Table
                            headers={['Account name', 'Account number', 'Bank name', 'Account balance']}
                            id="payment-history"
                            noTableData={paymentAccountLength.length === 0}
                        >
                            {isFetching ? (
                                <tr>
                                    <td>
                                        <Loader color="blue" />
                                    </td>
                                </tr>
                            ) : (
                                paymentAccountLength.length >= 1 && (
                                    <tr>
                                        <td>{paymentAccount?.account_name || 'N/A'}</td>
                                        <td style={{ fontFamily: 'Enriqueta' }}>
                                            <div className="d-flex">
                                                <span>{paymentAccountNumber}</span>
                                                <CopyToClipboard text={paymentAccountNumber} />
                                            </div>
                                        </td>
                                        <td>{paymentAccount?.bank_name || 'N/A'}</td>
                                        <td>N/A</td>
                                    </tr>
                                )
                            )}
                        </Table>
                    </div>
                )}
            </div>

            {/* Other components */}
            {notification.show && (
                <Alert
                    className={notification.type}
                    textBeforeLink={notification.message || 'Succesful'}
                    close={notification.close}
                    closeAlert={() => dispatch(closeAlert())}
                />
            )}

            {userAccountModal && (
                <UserAccountModal
                    isOpen={userAccountModal}
                    closeModal={() => {
                        setUserAccountModal(false);
                    }}
                    passwordRef={register('old_password', {
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Password must be more than 6 characters',
                        },
                    })}
                    newPasswordRef={register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Password must be more than 6 characters',
                        },
                    })}
                    confirmPasswordRef={register('password_confirmation', {
                        required: 'Password confirmation is required',
                        minLength: {
                            value: 6,
                            message: 'Password must be more than 6 characters',
                        },
                        validate: (value) => value === newPasswordInput || 'The passwords do not match',
                    })}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit(submitChangePassword)}
                    disabled={!isValid}
                />
            )}

            {businessInfoModal && (
                <BusinessInfoModal
                    isOpen={businessInfoModal}
                    closeModal={() => {
                        setBusinessInfoModal(false);
                    }}
                    businessNameRef={register('business_name', {
                        required: 'Business name is required',
                        minLength: {
                            value: 3,
                            message: 'Invalid Business name',
                        },
                    })}
                    categoryRef={register('category', {
                        required: 'Business category is required',
                        minLength: {
                            value: 3,
                            message: 'Invalid Business category',
                        },
                    })}
                    emailRef={register('email', {
                        required: 'Email is required',
                        minLength: {
                            value: 3,
                            message: 'Invalid Email',
                        },
                    })}
                    descriptionRef={register('description', {
                        required: 'Description is required',
                        minLength: {
                            value: 3,
                            message: 'Invalid Description',
                        },
                    })}
                    addressNumberRef={register('address_number', {
                        required: 'This field is required',
                    })}
                    landmarkRef={register('landmark', {
                        required: 'Landmark is required',
                    })}
                    streetRef={register('street', {
                        required: 'Street is required',
                    })}
                    cityRef={register('city', {
                        required: 'City is required',
                    })}
                    stateRef={register('state', {
                        required: 'State is required',
                    })}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit(submitBusinessInfo)}
                />
            )}

            {/* Business Reg Status */}
            {businessRegStatusModal && (
                <BusinessRegStatusModal
                    isOpen={businessRegStatusModal}
                    closeModal={() => {
                        setBusinessRegStatusModal(false);
                    }}
                    businessNameRef={register('businessName', {
                        required: 'Business Name is required',
                        minLength: {
                            value: 3,
                            message: 'Invalid Business Name',
                        },
                    })}
                    businessTypeRef={register('businessType', {
                        required: 'Business Type is required',
                        minLength: {
                            value: 2,
                            message: 'Invalid Business Type',
                        },
                    })}
                    businessRegNumberRef={register('businessRegNumber', {
                        required: 'Registration Number is required',
                        // pattern: {
                        //     value: REG_NUMBER_REGEX,
                        //     message: 'Invalid Registration Number',
                        // },
                        minLength: {
                            value: 6,
                            message: 'Invalid Registration Number',
                        },
                    })}
                    regStatusRef={register('regStatus')}
                    cacRef={register('cac_doc', {
                        required: 'This field is required',
                        validate: (value) =>
                            value[0].size / 1024 < 1000 ||
                            'File size is more than 1MB, please reduce the size and re-upload',
                    })}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit(checkCACValidity)}
                />
            )}

            {guarantorModal && (
                <GuarantorModal
                    isOpen={guarantorModal}
                    closeModal={() => {
                        setGuarantorModal(false);
                    }}
                    nameRef={register('name', {
                        required: 'This field is required',
                    })}
                    phoneNumberRef={register('phone', {
                        required: 'Phone number is required',
                        minLength: {
                            value: 11,
                            message: 'Invalid phone number',
                        },
                    })}
                    addressRef={register('address', {
                        required: 'This field is required',
                    })}
                    businessAddressRef={register('business_address', {
                        required: 'This field is required',
                    })}
                    businessTypeRef={register('business_type', {
                        required: 'This field is required',
                    })}
                    guarantorFacePhoto={register('guarantors_face_photo', {
                        required: 'This field is required',
                        validate: (value) =>
                            value[0].size / 1024 < 1000 ||
                            'File size is more than 1MB, please reduce the size and re-upload',
                    })}
                    guarantorIdCard={register('id_card', {
                        required: 'This field is required',
                        validate: (value) =>
                            value[0].size / 1024 < 1000 ||
                            'File size is more than 1MB, please reduce the size and re-upload',
                    })}
                    relationshipRef={register('relationship', {
                        required: 'This field is required',
                    })}
                    guarantorProofOfResidence={register('proof_of_residence', {
                        required: 'This field is required',
                        validate: (value) =>
                            value[0].size / 1024 < 1000 ||
                            'File size is more than 1MB, please reduce the size and re-upload',
                    })}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit(submitGuarantor)}
                    disabled={!isValid}
                />
            )}

            {nokModal && (
                <NokModal
                    isOpen={nokModal}
                    closeModal={() => {
                        setNokModal(false);
                        reset();
                    }}
                    nameRef={nokRegister('nokName', {
                        required: 'This field is required',
                    })}
                    phoneNumberRef={nokRegister('nokPhone', {
                        required: 'Phone number is required',
                        minLength: {
                            value: 11,
                            message: 'Invalid phone number',
                        },
                    })}
                    emailRef={nokRegister('nokEmail', {
                        required: 'This field is required',
                    })}
                    addressRef={nokRegister('nokAddress', {
                        required: 'This field is required',
                    })}
                    relationshipRef={nokRegister('nokRelationship', {
                        required: 'This field is required',
                    })}
                    errors={nokErrors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleNokSubmit(submitNok)}
                    disabled={!isNokValid}
                />
            )}

            {bankAccountModal && (
                <BankAccountModal
                    isOpen={bankAccountModal}
                    closeModal={() => {
                        setBankAccountModal(false);
                    }}
                    bankAccountList={bankAccountList}
                    accountName={bankAccountName}
                    bvnRef={register('bvn', {
                        required: 'BVN is required',
                        minLength: {
                            value: 11,
                            message: 'Invalid BVN',
                        },
                    })}
                    ninRef={register('nin', {
                        required: 'NIN is required',
                        minLength: {
                            value: 11,
                            message: 'Invalid NIN',
                        },
                    })}
                    selectRef={register('bank_code', {
                        required: 'This field is required',
                    })}
                    accountNumberRef={register('account_number', {
                        required: 'Account number is required',
                        minLength: {
                            value: 10,
                            message: 'Invalid Account number',
                        },
                    })}
                    // accountNameRef={register('account_name', {
                    //     required: 'Account name is required',
                    // })}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit(submitBankAccount)}
                />
            )}

            {documentModal.open && (
                <DocumentModal
                    isOpen={documentModal.open}
                    closeModal={() => {
                        setDocumentModal({});
                    }}
                    label={documentModal.label}
                    name={documentModal.name}
                    inputRef={register(documentModal.name, {
                        required: 'This field is required',
                    })}
                    errors={getDocumentInputError(documentModal.name)}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit(submitDocument)}
                    disabled={!isValid}
                />
            )}

            {debitCardModal && (
                <DebitCardModal
                    isOpen={debitCardModal}
                    closeModal={() => {
                        setDebitCardModal(false);
                    }}
                    config={paystackConfig}
                />
            )}

            {socialHandlesModal && (
                <SocialHandlesModal
                    isOpen={socialHandlesModal}
                    closeModal={() => {
                        setSocialHandlesModal(false);
                    }}
                    facebookRef={register('facebook', {
                        required: 'This field is required',
                    })}
                    instagramRef={register('instagram', {
                        required: 'This field is required',
                    })}
                    linkedInRef={register('linkedin', {
                        required: 'This field is required',
                    })}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit(submitSocialHandles)}
                    disabled={!isValid}
                />
            )}

            {addressModal && (
                <AddressModal
                    isOpen={addressModal}
                    closeModal={() => {
                        setAddressModal(false);
                    }}
                    numberRef={register('number', {
                        required: 'This field is required',
                    })}
                    street_nameRef={register('street_name', {
                        required: 'This field is required',
                    })}
                    landmarkRef={register('landmark', {
                        required: 'This field is required',
                    })}
                    cityRef={register('city', {
                        required: 'This field is required',
                    })}
                    local_governmentRef={register('local_government', {
                        required: 'This field is required',
                    })}
                    stateRef={register('state', {
                        required: 'This field is required',
                    })}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit(submitAddress)}
                    disabled={!isValid}
                />
            )}
        </>
    );
}

export default UserProfilePage;
