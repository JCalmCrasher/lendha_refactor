export const globalStyles = {
    colors: {
        primary: '#1A1F4C',
        error: '#F05757',
        white: '#FFFFFF',
        darkblue: {
            DEFAULT: '#1A1F4C',
            100: '#1A1F4C1A',
            200: '#1A1F4C33',
            400: '#1A1F4C66',
            600: '#1A1F4C99',
            800: '#1A1F4CCC',
            900: '#1A1F4CFF',

            'opacity-3': '#f8f8fa',
        },
        yellow: {
            DEFAULT: '#FFCE70',
            100: '#FFCE701A',
            200: '#FFCE7033',
            400: '#FFCE7066',
            600: '#FFCE7099',
            800: '#FFCE70CC',
        },
        black: {
            DEFAULT: '#1A1A1A',
            100: '#1A1A1A1A',
            200: '#1A1A1A33',
            400: '#1A1A1A66',
            600: '#1A1A1A99',
            800: '#1A1A1ACC',
        },
        gray: {
            100: '#C5C5C5',
            200: '#9B9B9B',
            300: '#5F5F5F',
            400: '#BDBDBD',
        },
    },
    styles: {
        global: () => ({
            heading: {
                fontFamily: '"Poppins", system-ui, sans-serif',
            },
            body: {
                background: { base: 'white', md: '#f8f8fa' },
                fontFamily: 'Nunito, system-ui, sans-serif',
                color: 'black.DEFAULT',
            },
            '*::placeholder': {
                color: 'black.600',
            },
            html: {
                fontFamily: 'Nunito, system-ui, sans-serif',
            },
        }),
    },
};

export const { colors } = globalStyles;
export const darkblueColors = globalStyles.colors.darkblue;
