import React, {useState, useCallback} from 'react';

const data = {
    totalRecords: 74,
    pageSize: 5,
    onClick: ({ pageNum, buttonType, pageSize, totalRecords }) => console.log({ pageNum, buttonType, pageSize, totalRecords })
};

/**

Requirements ===============
- List of pages (buttons)
- x number of max buttons
- x/2 front, x/2 last, in middle ... 
- prev, next
- 5 - 10 of 95 records
- input box - set page


Scope ===============
- List of pages (buttons)
- prev, next


HLD ===============
Pagination.jsx
Button.jsx

LLD ===============

Pagination.jsx
- total records
- current page = 0
- page size = 5
- callback on set page // analytics, async fetch records etc.
    - page no., button type ('page', 'next', 'prev'), page size, total - any auxiliary reqs. 

Button.jsx
- page no.
- onClick (parent callback)

 */

const Button = React.memo(({label, type = 'page', isActive = false}) => {
    return <button 
                aria-label={`page number ${label}`} 
                data-nametype={type}
                data-pagenum={label}
                style={{backgroundColor: isActive ? 'orange' : 'white'}}>
                {label}
            </button>
}, (prev, next) => prev.isActive === next.isActive);

const getPageNum = (buttonType, data, currPage, totalPages) => {
    let pageNum;
    if (buttonType === 'next') {
        if (currPage !== totalPages - 1) {
            pageNum = currPage + 1;
        }
    } else if (buttonType === 'prev') {
        if (currPage !== 0) {
            pageNum = currPage - 1;
        }
    } else {
        pageNum = Number(data.pagenum);
    }
    return pageNum;
}

export const Pagination = ({ pageSize, totalRecords, onClick }) => {
    const [currPage, setCurrPage] = useState(0);   // currPage * pageSize + 1, (currPage + 1) * pageSize
    const totalPages = Math.ceil(totalRecords / pageSize);

    const handleClick = (evt) => {
        const data = evt.target.dataset;
        const buttonType = data.nametype;
        const pageNum = getPageNum(buttonType, data, currPage, totalPages);
        if (pageNum === currPage) return;
        setCurrPage(pageNum);
        onClick({
            pageNum,
            buttonType, 
            pageSize, 
            totalRecords
        })
    };

    const buttons = [];

    // max 6 .. first 3, last 3, ...
    // less than 6, all pages


    for (let i = 0; i < totalPages; i++) {
        buttons.push(<Button key={`page-${i}`} label={i} type='page' isActive={currPage === i}/>)
    }
    return <div aria-label="pagination" onClick={handleClick}>
        <div>
            {/* <Button type='prev' onClick={handleClick} label='prev' /> */}
            {buttons}
            {/* <Button type='next' onClick={handleClick} label='next'/> */}
        </div>
        
        <div>
            {currPage * pageSize + 1} - {(currPage + 1) * pageSize} of {totalRecords}
        </div>

    </div>
}


export const PaginationEmbed = () => {
    return <Pagination {...data} />;
}
