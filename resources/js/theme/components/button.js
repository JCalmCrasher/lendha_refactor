export const button = {
    components: {
        Button: {
            baseStyle: {
                textTransform: 'capitalize',
                borderRadius: '5px',
                border: '1px',
                fontFamily: 'Poppins',
            },

            sizes: {
                sm: {
                    fontSize: '14px',
                    fontWeight: 600,
                    px: '16px',
                    py: 3,
                },
                md: {
                    fontSize: '14px',
                    fontWeight: 600,
                    px: '16px',
                    py: 3,
                },
            },

            variants: {
                outline: {
                    borderColor: 'gray.100',
                    ':disabled': {
                        bgColor: 'transparent',
                        color: 'gray.100',
                        border: '1px solid',
                        borderColor: 'gray.100',
                    },
                    ':hover': {
                        bg: 'gray.300',
                        color: 'white',
                        borderColor: 'transparent',
                    },
                },
                primary: {
                    bg: 'primary',
                    borderColor: 'transparent',
                    color: 'white',
                    ':hover': {
                        bg: 'darkblue.800',
                    },
                    ':active': {
                        bg: 'darkblue.900',
                    },
                    ':disabled': {
                        bg: 'gray.100',
                    },
                },
                'error-outline': {
                    bg: 'white',
                    borderColor: 'error',
                    color: 'error',
                    ':hover': {
                        bg: 'error',
                        color: 'white',
                    },
                    ':active': {
                        bg: 'white',
                        borderColor: 'error',
                        color: 'error',
                        // outline: '1px solid erro'
                    },
                    ':disabled': {
                        bg: 'gray.100',
                    },
                },
                error: {
                    bg: 'error',
                    borderColor: 'error',
                    color: 'white',
                    ':hover': {
                        bg: 'error',
                        color: 'white',
                    },
                    ':active': {
                        bg: 'white',
                        borderColor: 'error',
                        color: 'error',
                        // outline: '1px solid erro'
                    },
                    ':disabled': {
                        bg: 'gray.100',
                    },
                },
                'warning-outline': {
                    bg: 'white',
                    borderColor: 'error',
                    color: 'error',
                    ':hover': {
                        bg: 'error',
                        color: 'white',
                    },
                    ':active': {
                        bg: 'white',
                        borderColor: 'error',
                        color: 'error',
                        // outline: '1px solid erro'
                    },
                    ':disabled': {
                        bg: 'gray.100',
                    },
                },
                white: {
                    bg: 'white',
                    color: 'darkblue.DEFAULT',
                    border: 'none',
                    ':hover': {
                        color: 'darkblue.800',
                    },
                    ':active': {
                        bg: 'white',
                    },
                    ':disabled': {
                        bg: 'white',
                        color: 'gray.100',
                        borderColor: 'gray.100',
                    },
                },
                secondary: {
                    bg: 'white',
                    color: 'black.DEFAULT',
                    borderColor: 'gray.100',
                    ':hover': {
                        bg: 'gray.300',
                        color: 'white',
                        borderColor: 'transparent',
                    },
                    ':active': {
                        color: 'white',
                        bg: 'black.600',
                        borderColor: 'transparent',
                    },
                    ':disabled': {
                        bg: 'white',
                        color: 'gray.100',
                        borderColor: 'gray.100',
                    },
                    ':focus': {
                        color: 'white',
                        bg: 'gray.300',
                    },
                },
                unstyled: {
                    bg: 'transparent',
                    color: 'black.DEFAULT',
                    border: 'none',
                    // height: 'auto'
                },
                rounded: {
                    bg: 'primary',
                    borderColor: 'transparent',
                    borderRadius: '28px',
                    h: '56px',
                    color: 'white',
                    ':hover': {
                        bg: 'darkblue.800',
                    },
                    ':active': {
                        bg: 'darkblue.900',
                    },
                    ':disabled': {
                        bg: 'gray.100',
                    },
                },
            },

            defaultProps: {
                size: 'md',
                variant: 'primary',
            },
        },
    },
};
