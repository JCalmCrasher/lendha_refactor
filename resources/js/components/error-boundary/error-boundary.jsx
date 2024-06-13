import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasErrored: false,
        };
    }

    static getDerivedStateFromError(error) {
        // process the error
        return { hasErrored: true };
    }

    componentDidCatch(error, info) {
        console.log(error, info);
    }

    render() {
        if (this.state.hasErrored) {
            return (
                <div className="error_image_overlay">
                    <div
                        className="error_image_container"
                        style={{
                            backgroundImage: 'url("https://i.imgur.com/yW2W9SC.png")',
                        }}
                    ></div>
                    <div className="error_image_text">Sorry this page is broken</div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
