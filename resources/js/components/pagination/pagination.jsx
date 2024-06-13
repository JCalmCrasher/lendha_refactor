import React from 'react';

import ReactPaginate from 'react-paginate';

import './pagination.scss';

const Pagination = ({ pageCount, changeData }) => (
    <ReactPaginate
        previousLabel="Previous"
        nextLabel="Next"
        breakLabel="..."
        breakClassName="break-me"
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        onPageChange={changeData}
        containerClassName="pagination"
        subContainerClassName="pages pagination"
        activeClassName="active"
    />
);

export default Pagination;
