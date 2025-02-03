import React from 'react';
import { useDrag } from 'react-dnd';

const DragItem = ({ id, name }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'item',
        item: { id, name },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '5px',
                margin: '5px',
                backgroundColor: 'lightblue',
            }}>
            {name}
        </div>
    );
};

export default DragItem;