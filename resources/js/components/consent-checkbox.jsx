import React from 'react';

import { Link } from 'react-router-dom';

const ConsentCheckbox = ({ isChecked = false, setIsChecked }) => {
    return (
        <div className="form-check">
            <input
                className="form-check-input"
                type="checkbox"
                name="termsConditions"
                id="terms-conditions"
                checked={isChecked}
                onChange={setIsChecked}
            />
            <label className="form-check-label" htmlFor="terms-conditions">
                <p>
                    I have read and agree to <Link to="/terms">Lendha&apos;s Terms and Conditions</Link> and{' '}
                    <Link to="/privacy">Privacy Policy</Link>
                </p>
            </label>
        </div>
    );
};

export default ConsentCheckbox;
