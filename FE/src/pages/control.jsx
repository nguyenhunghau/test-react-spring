import React, { useState, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from './ItemTypes';

import styles from './builder.module.css'
import { useSelector, useDispatch } from 'react-redux';

const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
}
export const Control = ({ id, idLayout, index, removeControl, moveControl, findControl, control }) => {
    
    const [valueControl, setValueControl] = useState(control.text);
    const ref = useRef(null);
    let content = {};
    const dispatch = useDispatch();

    const focus = (event, id) => {
        // save current value
        content[id] = { before: event.target.value };
    }

    const blur = (event, id) => {
        //Check current value and before, if difference, call dispatch to modify
        content[id] = { after: event.target.value };
        if (event.target.value != content[id].before) {
            dispatch({ type: 'MODIFY', id: id, text: event.target.value, oldText: content[id].before });
        }
    }

    const changeText = (event) => {
        // control.text = event.target.value;
        setValueControl(event.target.value);
    }

    const createControlHtml = () => {
        switch (control.type) {
            case ItemTypes.BUTTON:
                return <input type="button" value="button" />
            case ItemTypes.LINK:
                return <a href="#">link</a>
            case ItemTypes.CHECKBOX:
                return <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                    <label class="form-check-label" for="defaultCheck1">
                        Default checkbox
                </label>
                </div>
            case ItemTypes.TEXTBOX:
                return <input type="text" className={`form-control ${styles.textbox}`} />
            case ItemTypes.TEXTAREA:
                return <textarea className={'form-control'} value={valueControl} onChange={event => changeText(event)}></textarea>
            case ItemTypes.PHARAPH:
                return <textarea onFocus={(event) => focus(event, control.id)} onBlur={(event) => blur(event, control.id)} className={'form-control'}></textarea>
            default:
                return '';
        }
    }

    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.CONTROL, id, idLayout, index, control },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (data, monitor) => {
            if (!monitor.getItem()) return;
            if (!monitor.didDrop()) return;
            const { id: droppedId, index: originalIndex } = monitor.getItem();
            const dropResult = monitor.getDropResult();
            if (dropResult && dropResult.idContainer !== monitor.getItem().idLayout) {
                removeControl(monitor.getItem().index);
            }
        },
    })
    const [, drop] = useDrop({
        accept: ItemTypes.CONTROL,
        canDrop: () => false,
        hover(props, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = monitor.getItem().index;
            const hoverIndex = index;
            const draggedId = props.id;
            if (dragIndex === index) {
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect()
            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            // Determine mouse position
            const clientOffset = monitor.getClientOffset()
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }
            // Time to actually perform the action
            moveControl(monitor.getItem().control, monitor.getItem().index, index);
            props.index = hoverIndex
        },
    })
    const opacity = isDragging ? 0 : 1
    drag(drop(ref));
    return (
        <div ref={ref} style={{ ...style, opacity }}>
            {createControlHtml()}
        </div>
    )
}
