import React from 'react';

import { heroPlaceholder } from '../../assets/images';
import useImageLoaderHooks from '../custom-hooks/image-loader';

import './hero-image.scss';

const HeroImage = () => {
    const [loading, currentSrc] = useImageLoaderHooks({
        src: 'https://res.cloudinary.com/thelendha/image/upload/v1654601620/upload/hero_image_fi1yhw.png',
        placeholder: heroPlaceholder,
    });

    return <img className={`hero_image${loading ? ' loading' : ''}`} src={currentSrc} alt="Lendha hero" />;
};

export default HeroImage;
