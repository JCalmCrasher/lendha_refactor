import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import Alert from '../../../../../components/alert/alert';
import Button from '../../../../../components/button/button';
import { isFileSizeValid, successStatusCode } from '../../../../../components/utils/helper';
import { closeAlert, setAlert } from '../../../../../store/components/componentsSlice';
import { getPaymentReceipts, postUploadPaymentReceipt } from '../../../../../store/user/userSlice';

/**
 * @param {number} amount
 * @param {number} loan_id
 *
 * handles the upload of payment receipt
 */
function ReceiptUploader({ amount, loan_id }) {
    const [file, setFile] = useState(null);

    const dispatch = useDispatch();

    const { isLoading, alert } = useSelector((state) => state.componentsSlice);

    const notification = alert;

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = () => {
        if (!isFileSizeValid(file))
            return dispatch(
                setAlert({
                    show: true,
                    type: 'error',
                    message: 'File size is too large',
                }),
            );

        const payload = new FormData();
        payload.append('loan_id', loan_id);
        payload.append('amount', amount);
        payload.append('document', file);

        dispatch(postUploadPaymentReceipt(payload)).then((res) => {
            if (res?.status === successStatusCode) {
                setFile(null);
            }

            dispatch(
                getPaymentReceipts({
                    id: loan_id,
                }),
            );
        });
    };

    return (
        <>
            {notification.show && (
                <Alert
                    className={notification.type}
                    textBeforeLink={notification.message}
                    close={notification.close}
                    closeAlert={() => dispatch(closeAlert())}
                />
            )}

            <div className="d-flex align-items-center">
                <label
                    className="mr-3"
                    style={{
                        cursor: 'pointer',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                    }}
                    onClick={() => document.getElementById('upload-receipt').click()}
                >
                    {file ? file.name : 'Choose a file'}
                </label>
                <input type="file" id="upload-receipt" style={{ display: 'none' }} onChange={handleFileChange} />
                <Button
                    className="button_component btn_blue d-flex align-items-center"
                    disabled={!file}
                    loading={isLoading}
                    onClick={handleFileUpload}
                    text={
                        <>
                            <i className="fa fa-upload" aria-hidden="true" />
                            <span className="pl-2">Upload payment receipt</span>
                        </>
                    }
                />
            </div>
        </>
    );
}

export default ReceiptUploader;
