import React from 'react';

import './loader.scss';

function Loader({ color }) {
    return (
        <>
            {color === 'blue' ? (
                <img
                    src="https://res.cloudinary.com/the-now-entity/image/upload/q_auto/v1611569512/Lendha/blue_loader_nv4s81.svg"
                    className="loader_img"
                    alt="Loader"
                />
            ) : (
                <img
                    src="https://res.cloudinary.com/the-now-entity/image/upload/q_auto/v1609939237/Lendha/button_loader_kosom0.svg"
                    className="loader_img"
                    alt="Loader"
                />
            )}
        </>
    );
}

export default Loader;
