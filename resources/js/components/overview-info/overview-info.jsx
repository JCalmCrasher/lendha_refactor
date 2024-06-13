/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect } from 'react';

import { checkFileExtension } from '../utils/helper';

import './overview-info.scss';

import AvatarPlaceholder from '../../assets/images/avatar-placeholder.png';

function OverviewInfo({
    headText,
    headTextSpan,
    currentProgress,
    totalProgress,
    imageUrl,
    shouldImageFallback = false,
    imageWidth = 'auto',
    imageHeight = 'auto',
    subText,
    subTextSpan,
    children,
    sx = {},
}) {
    const srcUrl = `${location.origin}/${imageUrl}`;
    const [isPDF, setIsPDF] = React.useState(false);
    const progressbar = (100 * currentProgress) / totalProgress;

    useEffect(() => {
        if (checkFileExtension(srcUrl, ['pdf'])) {
            setIsPDF(true);
        }
    }, [srcUrl]);

    return (
        <div className="overview_info" style={{ ...sx }}>
            <h6 className="head_text">
                {headText}
                <span>{headTextSpan}</span>
            </h6>
            {imageUrl &&
                (isPDF ? (
                    <iframe src={srcUrl} width="100%" height="150px" title="pdf" frameBorder="0" allowFullScreen />
                ) : (
                    <img
                        src={imageUrl ? srcUrl : AvatarPlaceholder}
                        alt="N/A"
                        style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                        }}
                        //   onError={(e) => {
                        //         e.target.onerror = null;
                        //         e.target.src = AvatarPlaceholder;
                        //         console.log({e})
                        //     }}
                    />
                ))}
            {shouldImageFallback && !imageUrl && (
                <img
                    src={AvatarPlaceholder}
                    alt={headText || 'N/A'}
                    style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover',
                    }}
                />
            )}
            {currentProgress >= 0 && (
                <div className="progress">
                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                            width: currentProgress === totalProgress ? '100%' : `${progressbar}%`,
                        }}
                        aria-valuenow={progressbar}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    />
                </div>
            )}
            <p className="sub_text">
                {subText}
                <span>{subTextSpan}</span>
            </p>
            {children}
        </div>
    );
}

export default OverviewInfo;

export function OverviewInfoVideo({ headText, headTextSpan, videoUrl, subText, subTextSpan, sx = {} }) {
    const srcUrl = `${location.origin}/${videoUrl}`;

    return (
        <>
            <div className="overview_info" style={{ ...sx }}>
                <h6 className="head_text">
                    {headText}
                    <span>{headTextSpan}</span>
                </h6>
                <video
                    src={srcUrl}
                    poster={AvatarPlaceholder}
                    controls
                    style={{
                        height: '150px',
                        width: '100%',
                    }}
                >
                    <source src={srcUrl} type="video/mp4" />
                    <a href={srcUrl}>Your browser does not support the video tag. Click here to view the video.</a>
                </video>
                <p className="sub_text">
                    {subText}
                    <span>{subTextSpan}</span>
                </p>
            </div>
        </>
    );
}
