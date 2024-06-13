import React from 'react';

import useImageLoaderHooks from '../custom-hooks/image-loader';

const HomePageBannerImage = ({ image, imagePlaceholder }) => {
    const [loading, currentSrc] = useImageLoaderHooks({
        src: image,
        placeholder: imagePlaceholder,
    });

    return (
        <img
            src={currentSrc}
            className={`banner_image${loading ? ' loading' : ''}`}
            fetchpriority="high"
            alt="Lendha Banner"
        />
    );
};

export default HomePageBannerImage;
