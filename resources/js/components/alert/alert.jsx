import React from 'react';

import { Link } from 'react-router-dom';

// import { bounceInUp } from "react-animations";
// import Radium, { StyleRoot } from "radium";

import './alert.scss';

function Alert({ className, textBeforeLink, linkText, linkTo, textAfterLink, close, closeAlert }) {
    // const styles = {
    //     bounceInUp: {
    //         animation: "x .6s",
    //         animationName: Radium.keyframes(bounceInUp, "bounceInUp"),
    //     },
    // };

    return (
        // <StyleRoot>
        <div
            className={`alert_container ${className}`}
            // style={styles.bounceInUp}
        >
            <div className="alert">
                <p>
                    {textBeforeLink}
                    {linkTo && <Link to={linkTo}>{linkText}</Link>}
                    {textAfterLink}.
                </p>
            </div>
            {close && (
                <div className="close_div" onClick={closeAlert}>
                    <img
                        className="close"
                        src="https://res.cloudinary.com/the-now-entity/image/upload/q_auto/v1610444093/Lendha/x_icon_ihn2xz.svg"
                        alt="close"
                    />
                </div>
            )}
        </div>
        // </StyleRoot>
    );
}

export default Alert;
