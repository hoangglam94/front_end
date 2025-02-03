// DropZone.js

import React from 'react';
import { useDrop } from 'react-dnd';

const DropZone = ({ onDrop }) => {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: 'item',
        drop: (item) => onDrop(item),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),

        }),
    }));

    return (
        <div
            ref={drop}
            style={{
                border: `1px dashed ${isOver ? 'green' : 'black'}`,
                padding: '10px',
            }}>
            {canDrop ? 'Release to drop' : 'Drag an item here'}        
            </div>
    );
};

export default DropZone;