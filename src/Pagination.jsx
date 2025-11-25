import React, {useState, useCallback} from 'react';
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

const Button = React.memo(({label, onClick, type = 'page', isActive = false}) => {
    return <button 
                onClick={onClick} 
                aria-label={`page number ${label}`} 
                data-nametype={type}
                data-pagenum={label}
                style={{backgroundColor: isActive ? 'orange' : 'white'}}>
                {label}
            </button>
});

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
    const [currPage, setCurrPage] = useState(0);
    const totalPages = Math.ceil(totalRecords / pageSize);

    const handleClick = useCallback((evt) => {
        const data = evt.target.dataset;
        const buttonType = data.nametype;
        const pageNum = Number(data.pagenum);
        // const pageNum = getPageNum(buttonType, data, currPage, totalPages);
        // if (pageNum === currPage) return;
        setCurrPage(pageNum);
        onClick({
            pageNum,
            buttonType, 
            pageSize, 
            totalRecords
        })
    }, [onClick, pageSize, totalRecords]);

    const buttons = [];
    for (let i = 0; i < totalPages; i++) {
        buttons.push(<Button key={`page-${i}`} label={i} onClick={handleClick} type='page' isActive={currPage === i}/>)
    }
    return <div aria-label="pagination">
        {/* <Button type='prev' onClick={handleClick} label='prev' /> */}
        {buttons}
        {/* <Button type='next' onClick={handleClick} label='next'/> */}
    </div>
}

