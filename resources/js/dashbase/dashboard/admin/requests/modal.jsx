import React from 'react';

import './requests.scss';

export default function RequestDateFilterModal({ id, title, children, onSearch }) {
    return (
        <div
            className="modal fade"
            id={id}
            tabIndex="-1"
            role="dialog"
            aria-labelledby={`${id}Label`}
            aria-hidden="true"
        >
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content bg-white request-modal">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`${id}ModalLabel`}>
                            {title}
                        </h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">{children}</div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">
                            Close
                        </button>
                        <button type="button" className="btn btn-primary" onClick={onSearch}>
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
