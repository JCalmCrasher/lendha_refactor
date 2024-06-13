import { useEffect, useState } from 'react';

const useImageLoaderHooks = ({ src, placeholder }) => {
    const [loading, setLoading] = useState(true);
    const [currentSrc, updateSrc] = useState(placeholder);

    useEffect(() => {
        // start loading original image
        const imageToLoad = new Image();
        imageToLoad.src = src;
        imageToLoad.onload = () => {
            // When image is loaded replace the src and set loading to false
            setLoading(false);
            updateSrc(src);
        };
    }, [src]);

    return [loading, currentSrc];
};

export default useImageLoaderHooks;
