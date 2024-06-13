export const input = {
    components: {
        Input: {
            baseStyle: {},
            variants: {
                outline: {
                    field: {
                        background: 'white',
                        border: '1px solid',
                        borderColor: 'gray.100',
                        borderRadius: '6px',
                        fontSize: '14px',
                        _focusVisible: {
                            zIndex: 1,
                            borderColor: 'gray.200',
                            boxShadow: 'none',
                        },
                        _invalid: {
                            borderColor: 'error',
                            boxShadow: 'none',
                        },
                        _hover: {
                            borderColor: 'gray.300',
                        },
                        _disabled: {
                            bgColor: '#eeeeee',
                            color: 'gray.300',
                            borderColor: '#eeeeee',
                            opacity: 1,
                        },
                        ':read-only': {
                            // opacity: 0.5,
                            // bgColor: '#f0f0f0',
                            // borderColor: '#f0f0f0'
                            bgColor: '#eeeeee',
                            borderColor: '#eeeeee',
                        },
                    },
                },
                flushed: {
                    field: {
                        borderBottom: '1px solid',
                        borderColor: 'black.800',
                        _focusVisible: {
                            borderColor: 'black.DEFAULT',
                            boxShadow: 'none',
                        },
                    },
                },
            },
            defaultProps: {
                variant: 'outline',
                size: 'md',
            },
        },
    },
};
