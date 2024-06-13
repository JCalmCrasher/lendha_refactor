import React from 'react';

import Pagination from '../pagination/pagination';

import './table.scss';

function Table({ headers, children, noTableData, pageCount, changeData, id = '' }) {
    return (
        <div className="table_container">
            <div className="table-responsive" style={{ maxHeight: '500px' }}>
                <table className="table" id={id}>
                    <thead>
                        <tr>
                            {headers.map((header, i) => (
                                <th key={i}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>{children}</tbody>
                </table>
            </div>
            {noTableData && <div className="no_records">No records to show</div>}
            {pageCount && <Pagination pageCount={pageCount} changeData={changeData} />}
        </div>
    );
}

export default Table;
