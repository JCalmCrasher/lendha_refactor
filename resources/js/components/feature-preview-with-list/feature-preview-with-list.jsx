import React, { useRef } from 'react';

import { Link } from 'react-router-dom';
import Slider from 'react-slick';

import useImageLoaderHooks from '../custom-hooks/image-loader';
import SubSectionHeader from '../sub-section-header/sub-section-header';

import './feature-preview-with-list.scss';
import '../../assets/scss/carousel.scss';

const FeaturePreviewWithList = ({
    image,
    images,
    imagePlaceholder,
    imagePosition,
    headText,
    subText,
    additionalText,
    features,
    link_to,
    btn_className,
    linkText,
}) => {
    const [loading, currentSrc] = useImageLoaderHooks({
        src: image,
        placeholder: imagePlaceholder,
    });

    const settings = {
        fade: true,
        infinite: true,
        arrows: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    const carouselRef = useRef();

    return (
        <div className={`feature_preview_with_list ${imagePosition}`}>
            {image && (
                <img
                    src={currentSrc}
                    className={`feature_preview_image${loading ? ' loading' : ''}`}
                    alt="Lendha feature"
                    fetchpriority="low"
                />
            )}
            {images && (
                <div className="slider-testimonial">
                    <Slider ref={carouselRef} {...settings}>
                        {images.map((item, i) => (
                            <div key={i}>
                                <img src={item} className="feature_preview_image slider-img" alt="Lendha feature" />
                            </div>
                        ))}
                    </Slider>
                    {/* <CarouselControlsArrows
            onNext={handleNext}
            onPrevious={handlePrevious}
          /> */}
                </div>
            )}
            <div className="feature_preview_info">
                <SubSectionHeader headText={headText} rule />
                {subText && <p className="feature_preview_text">{subText}</p>}
                {additionalText && additionalText}
                {features.length >= 1 && (
                    <div className="feature_preview_list">
                        {features.map((list, i) => (
                            <div key={i} className="list">
                                <img
                                    src="https://res.cloudinary.com/the-now-entity/image/upload/v1609935009/Lendha/check_box_qt0fpn.svg"
                                    alt="Listing"
                                />
                                <p>{list}</p>
                            </div>
                        ))}
                    </div>
                )}

                {linkText && (
                    <Link to={link_to} className={`link ${btn_className}`}>
                        {linkText}
                    </Link>
                )}
            </div>
        </div>
    );
};

export default FeaturePreviewWithList;
