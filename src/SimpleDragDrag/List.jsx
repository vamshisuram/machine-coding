import { useState, useRef } from 'react'
import './style.css'

const List = () => {
    const [items, setItems] = useState(['Apple', 'Banana', 'Cherry'])

    const dragItem = useRef(null)
    const dragOverItem = useRef(null)

    const onDragStart = (index) => {
        dragItem.current = index;
    }
    const onDragEnter = (index) => {
        if (dragOverItem.current !== index) {
            dragOverItem.current = index;
        }
    }

    const onDragOver = (e) => {
        e.preventDefault();
    }

    const onDragEnd = () => {
        const from = dragItem.current;
        const to = dragOverItem.current;
        dragItem.current = null;
        dragOverItem.current = null;

        if (from === null || to === null || from === to) {
            return;
        }

        // const copy = [...items]
        // // pick the removed item
        // // place it at draggedOverItem index

        // const [draggedItem] = copy.slice(from, 1);
        // copy.splice(to, 0, draggedItem);
        // setItems(copy)

        setItems((prev) => {
            const next = [...prev];
            const [draggedItem] = next.splice(from, 1);
            next.splice(to, 0, draggedItem);
            return next;
        })
        
    }

    return <ul>
        {items.map((item, i) => {
            return <li key={item}
                onDragOver={onDragOver}
                draggable
                onDragStart={() => onDragStart(i)} 
                onDragEnter={() => onDragEnter(i)} 
                onDragEnd={onDragEnd} 
            >{item}</li>
        })}
    </ul>
}

export const RenderList = () => {
    
    return <div className='list'>
        <List />
    </div>
}



