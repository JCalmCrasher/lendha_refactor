import React from 'react';

import './sign-in-left-div.scss';

function SignInLeftDiv({ theme }) {
    return (
        <div className={`sign_in_left_div ${theme}`}>
            <h1 className="text-left">Quick and easy access to loans for SMEs.</h1>
            {theme === 'dark' ? (
                <img
                    src="https://res.cloudinary.com/the-now-entity/image/upload/q_auto/v1609935008/Lendha/lendha_blue_text_pzbxp2.svg"
                    alt="Lendha Text"
                />
            ) : (
                <img
                    src="https://res.cloudinary.com/the-now-entity/image/upload/q_auto/v1609935009/Lendha/lendha_white_text_eefygc.svg"
                    alt="Lendha Text"
                />
            )}
        </div>
    );
}

export default SignInLeftDiv;
