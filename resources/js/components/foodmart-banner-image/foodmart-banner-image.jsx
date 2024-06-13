import React from 'react';

import useImageLoaderHooks from '../custom-hooks/image-loader';

const FoodmartBannerImage = ({ image, imagePlaceholder }) => {
    const [loading, currentSrc] = useImageLoaderHooks({
        src: image,
        placeholder: imagePlaceholder,
    });

    return <img src={currentSrc} className={`banner_image${loading ? ' loading' : ''}`} alt="Lendha Banner" />;
};

export default FoodmartBannerImage;
