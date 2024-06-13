import React, { useEffect, useState } from 'react';

import './bank-statement.scss';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import Button from '../../../../components/button/button';
import Loader from '../../../../components/loader/loader';
import Table from '../../../../components/table/table';
import { formatAmount } from '../../../../components/utils/helper';
import { getLoanDetails } from '../../../../store/loan/loanSlice';

function AdminRequestBankStatement() {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageChangeTracker, setCurrentPageChangeTracker] = useState(0);

    const { isFetching } = useSelector((state) => state.componentsSlice);

    const { loan_id } = useParams();

    const { adminLoanDetails } = useSelector((state) => state.loanSlice);
    const bankStatements = adminLoanDetails?.loan_details?.bank_statement?.data;

    const bankAccount = adminLoanDetails?.bank_account;
    const bankName = bankAccount?.bank_name;
    const accountNumber = bankAccount?.account_number;
    const accountName = bankAccount?.account_name;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getLoanDetails(loan_id));
    }, []);

    const changeData = (data) => {
        window.scroll(0, 0);

        const offset = data.selected;
        const pageWithOffset = offset + 1;
        setCurrentPage(pageWithOffset);
        setCurrentPageChangeTracker(pageWithOffset);
    };

    return (
        <div className="admin_bank_statements_page">
            <div className="requests_div">
                <div className="d-flex jc">
                    <h2 className="d-flex align-items-center" style={{ gap: '8px' }}>
                        <span
                            style={{
                                fontSize: '20px',
                                cursor: 'pointer',
                            }}
                            onClick={() => window.history.back()}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </span>
                        Bank Statement
                    </h2>
                    <Button
                        disabled
                        text={
                            <>
                                Download{' '}
                                <svg
                                    width="25"
                                    height="24"
                                    viewBox="0 0 25 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M1.77734 14.5C1.77734 12.1716 3.00163 10.1291 4.8416 8.9812C5.34203 5.044 8.7042 2 12.7773 2C16.8504 2 20.2126 5.044 20.713 8.9812C22.553 10.1291 23.7773 12.1716 23.7773 14.5C23.7773 17.9216 21.1335 20.7257 17.7773 20.9811L7.77734 21C4.42112 20.7257 1.77734 17.9216 1.77734 14.5ZM17.6256 18.9868C19.959 18.8093 21.7773 16.8561 21.7773 14.5C21.7773 12.927 20.9657 11.4962 19.6544 10.6781L18.8487 10.1754L18.729 9.23338C18.3508 6.25803 15.8061 4 12.7773 4C9.7485 4 7.20381 6.25803 6.82564 9.23338L6.7059 10.1754L5.90022 10.6781C4.5889 11.4962 3.77734 12.927 3.77734 14.5C3.77734 16.8561 5.59567 18.8093 7.92904 18.9868L8.10234 19H17.4523L17.6256 18.9868ZM13.7773 12H16.7773L12.7773 17L8.77734 12H11.7773V8H13.7773V12Z"
                                        fill="white"
                                    />
                                </svg>
                            </>
                        }
                    />
                </div>
                <div style={{ marginTop: '30px' }}>
                    <div className="d-flex jc">
                        <p>
                            <span>Bank name: </span>
                            <span className="font-weight-bold">{bankName}</span>
                        </p>
                        <p>
                            <span>Statement type: </span>
                            <span className="font-weight-bold">MONO</span>
                        </p>
                    </div>
                    <div className="d-flex jc">
                        <p>
                            <span>Account name: </span>
                            <span className="font-weight-bold">{accountName || 'N/A'}</span>
                        </p>
                        {/* <p>
                            <span>Statement Period: </span>
                            <span className="font-weight-bold">20th June 2018 - 7th July 2022</span>
                        </p> */}
                    </div>
                    <div className="d-flex jc">
                        <p>
                            <span>Account type: </span>
                            <span className="font-weight-bold">Savings</span>
                        </p>
                    </div>
                    <div className="d-flex jc">
                        <p>
                            <span>Account number: </span>
                            <span className="font-weight-bold">{accountNumber}</span>
                        </p>
                    </div>
                </div>
                <div className="d-flex jc" style={{ gap: '22px' }}>
                    <Stat
                        icon={
                            <svg
                                width="33"
                                height="34"
                                viewBox="0 0 33 34"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect
                                    opacity="0.1"
                                    x="0.0898438"
                                    y="0.335938"
                                    width="32.8398"
                                    height="32.8398"
                                    rx="5"
                                    fill="#1A1F4C"
                                />
                                <g clipPath="url(#clip0_4_2)">
                                    <path
                                        d="M16.5078 26.7578C10.9848 26.7578 6.50781 22.2808 6.50781 16.7578C6.50781 11.2348 10.9848 6.75781 16.5078 6.75781C22.0308 6.75781 26.5078 11.2348 26.5078 16.7578C26.5078 22.2808 22.0308 26.7578 16.5078 26.7578ZM13.0078 18.7578V20.7578H15.5078V22.7578H17.5078V20.7578H18.5078C19.1709 20.7578 19.8067 20.4944 20.2756 20.0256C20.7444 19.5567 21.0078 18.9209 21.0078 18.2578C21.0078 17.5948 20.7444 16.9589 20.2756 16.49C19.8067 16.0212 19.1709 15.7578 18.5078 15.7578H14.5078C14.3752 15.7578 14.248 15.7051 14.1543 15.6114C14.0605 15.5176 14.0078 15.3904 14.0078 15.2578C14.0078 15.1252 14.0605 14.998 14.1543 14.9043C14.248 14.8105 14.3752 14.7578 14.5078 14.7578H20.0078V12.7578H17.5078V10.7578H15.5078V12.7578H14.5078C13.8448 12.7578 13.2089 13.0212 12.74 13.49C12.2712 13.9589 12.0078 14.5948 12.0078 15.2578C12.0078 15.9209 12.2712 16.5567 12.74 17.0256C13.2089 17.4944 13.8448 17.7578 14.5078 17.7578H18.5078C18.6404 17.7578 18.7676 17.8105 18.8614 17.9043C18.9551 17.998 19.0078 18.1252 19.0078 18.2578C19.0078 18.3904 18.9551 18.5176 18.8614 18.6114C18.7676 18.7051 18.6404 18.7578 18.5078 18.7578H13.0078Z"
                                        fill="#1A1F4C"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_4_2">
                                        <rect
                                            width="24"
                                            height="24"
                                            fill="white"
                                            transform="translate(4.50781 4.75781)"
                                        />
                                    </clipPath>
                                </defs>
                            </svg>
                        }
                        value="Available balance"
                        period="₦0"
                    />
                    <Stat
                        icon={
                            <svg
                                width="33"
                                height="34"
                                viewBox="0 0 33 34"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect
                                    opacity="0.1"
                                    x="0.0898438"
                                    y="0.335938"
                                    width="32.8398"
                                    height="32.8398"
                                    rx="5"
                                    fill="#1A1F4C"
                                />
                                <g clipPath="url(#clip0_4_2)">
                                    <path
                                        d="M16.5078 26.7578C10.9848 26.7578 6.50781 22.2808 6.50781 16.7578C6.50781 11.2348 10.9848 6.75781 16.5078 6.75781C22.0308 6.75781 26.5078 11.2348 26.5078 16.7578C26.5078 22.2808 22.0308 26.7578 16.5078 26.7578ZM13.0078 18.7578V20.7578H15.5078V22.7578H17.5078V20.7578H18.5078C19.1709 20.7578 19.8067 20.4944 20.2756 20.0256C20.7444 19.5567 21.0078 18.9209 21.0078 18.2578C21.0078 17.5948 20.7444 16.9589 20.2756 16.49C19.8067 16.0212 19.1709 15.7578 18.5078 15.7578H14.5078C14.3752 15.7578 14.248 15.7051 14.1543 15.6114C14.0605 15.5176 14.0078 15.3904 14.0078 15.2578C14.0078 15.1252 14.0605 14.998 14.1543 14.9043C14.248 14.8105 14.3752 14.7578 14.5078 14.7578H20.0078V12.7578H17.5078V10.7578H15.5078V12.7578H14.5078C13.8448 12.7578 13.2089 13.0212 12.74 13.49C12.2712 13.9589 12.0078 14.5948 12.0078 15.2578C12.0078 15.9209 12.2712 16.5567 12.74 17.0256C13.2089 17.4944 13.8448 17.7578 14.5078 17.7578H18.5078C18.6404 17.7578 18.7676 17.8105 18.8614 17.9043C18.9551 17.998 19.0078 18.1252 19.0078 18.2578C19.0078 18.3904 18.9551 18.5176 18.8614 18.6114C18.7676 18.7051 18.6404 18.7578 18.5078 18.7578H13.0078Z"
                                        fill="#1A1F4C"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_4_2">
                                        <rect
                                            width="24"
                                            height="24"
                                            fill="white"
                                            transform="translate(4.50781 4.75781)"
                                        />
                                    </clipPath>
                                </defs>
                            </svg>
                        }
                        value="Opening Balance"
                        period="₦0"
                    />
                    <Stat
                        icon={
                            <svg
                                width="34"
                                height="34"
                                viewBox="0 0 34 34"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect
                                    opacity="0.1"
                                    x="0.601562"
                                    y="0.804688"
                                    width="32.8398"
                                    height="32.8398"
                                    rx="5"
                                    fill="#1A1F4C"
                                />
                                <path
                                    d="M27.9623 20.0514C28.5117 20.2345 28.517 20.5303 27.9517 20.7187L7.86154 27.4151C7.30474 27.6003 6.98581 27.2888 7.14159 26.7436L12.8822 6.65442C13.0401 6.09762 13.3612 6.07867 13.5969 6.60706L17.3798 15.1202L11.0645 23.5406L19.485 17.2253L27.9623 20.0514Z"
                                    fill="#1A1F4C"
                                />
                            </svg>
                        }
                        value="Total Inflow"
                        period="₦2,234.00"
                    />
                    <Stat
                        icon={
                            <svg
                                width="34"
                                height="34"
                                viewBox="0 0 34 34"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect
                                    opacity="0.1"
                                    x="0.695312"
                                    y="0.804688"
                                    width="32.8398"
                                    height="32.8398"
                                    rx="5"
                                    fill="#F05757"
                                />
                                <g clipPath="url(#clip0_16761_3413)">
                                    <path
                                        d="M6.53383 14.3978C5.98439 14.2147 5.97913 13.9189 6.54436 13.7305L26.6346 7.03412C27.1914 6.84887 27.5103 7.16043 27.3545 7.70565L21.6138 27.7948C21.456 28.3516 21.1349 28.3705 20.8992 27.8422L17.1163 19.3291L23.4316 10.9086L15.0111 17.2239L6.53383 14.3978Z"
                                        fill="#F05757"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_16761_3413">
                                        <rect
                                            width="25.2614"
                                            height="25.2614"
                                            fill="white"
                                            transform="translate(4.48438 4.59375)"
                                        />
                                    </clipPath>
                                </defs>
                            </svg>
                        }
                        value="Total Outflow"
                        period="₦1,234.00"
                    />
                </div>

                <div style={{ marginTop: '40px' }}>
                    <div className="d-flex">
                        <h4 style={{ fontWeight: 700 }}>ALL TRANSACTION</h4>
                        {/* <FormInput
                            type="text"
                            placeholder="Search"
                            icon={
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 22 22"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0976 20.6834 22.0976 20.2929 21.7071L16.2929 17.7071C15.9024 17.3166 15.9024 16.6834 16.2929 16.2929C16.6834 15.9024 17.3166 15.9024 17.7071 16.2929L21.7071 20.2929ZM15 9C15 13.9706 10.9706 18 6 18C1.02944 18 0.00012207 17.9706 0.00012207 17C0.00012207 16.4477 0.447745 16 1 16C1.55225 16 2 16.4477 2 17C2 17.5523 1.55225 18 1 18C1 18 5 18 6 18C10.4183 18 14 14.4183 14 10C14 9.44772 14.4477 9 15 9Z"
                                        fill="#1A1F4C"
                                    />
                                </svg>
                            }
                        /> */}
                    </div>

                    <Table
                        headers={['*', 'Date', 'Debit', 'Credit', 'Balance', 'Narration']}
                        id="admin-bank-statements-table"
                        noTableData={bankStatements && Object.values(bankStatements || []).length === 0}
                        changeData={changeData}
                    >
                        {isFetching ? (
                            <tr>
                                <td>
                                    <Loader color="blue" />
                                </td>
                            </tr>
                        ) : (
                            <>
                                {bankStatements &&
                                    Object.values(bankStatements || []).map((statement, i) => (
                                        <tr>
                                            <td>{i + 1}</td>
                                            <td>{statement?.date || 'N/A'}</td>
                                            <td>
                                                {statement?.type === 'debit' ? formatAmount(statement?.amount) : ''}
                                            </td>
                                            <td>
                                                {statement?.type === 'credit' ? formatAmount(statement?.amount) : ''}
                                            </td>
                                            <td>{formatAmount(statement?.balance)}</td>
                                            <td style={{ width: '300px' }}>{statement?.narration || 'N/A'}</td>
                                        </tr>
                                    ))}
                            </>
                        )}
                    </Table>
                </div>
            </div>
        </div>
    );
}

export default AdminRequestBankStatement;

function Stat({ icon, title, value, period }) {
    return (
        <>
            <div
                className="stat"
                style={{ border: '1px solid #C5C5C5', borderRadius: '10px', padding: '14px 24px', width: '100%' }}
            >
                {icon}
                <div className="d-flex flex-column" style={{ marginTop: '8px', marginBottom: '10px' }}>
                    <div className="d-flex align-items-center" style={{ gap: '24px' }}>
                        <h4>{title}</h4>
                    </div>
                    <span>{value}</span>
                </div>
                <h3>{period}</h3>
            </div>
        </>
    );
}
