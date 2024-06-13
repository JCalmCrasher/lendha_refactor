import { useEffect, useState } from 'react';

export const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const height = window.addEventListener('resize', () => {
            setWindowWidth(window.innerWidth);
        });

        return () => window.removeEventListener('resize', height);
    }, []);

    return [windowWidth];
};
