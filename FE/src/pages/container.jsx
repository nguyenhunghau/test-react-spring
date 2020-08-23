import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { Control } from './control';
import { ItemTypes } from './ItemTypes';
import {useSelector, useDispatch} from 'react-redux';

const Container = (props) => {
    const dispatch = useDispatch();

    const getContainer = (state, idContainer) => {
        return state.data.filter((c) => `${c.id}` === idContainer)[0];
    }
    
    const containerData = useSelector(item => getContainer(item.builder, props.controlList.id));
    
    const pushControl = (control, index) => {
        dispatch({type: 'PUSH', id: control.id, itemType: control.type, oldIndex: index,
        idContainer: props.controlList.id, control: control, text: control.text})
    }

    const removeControl = (index) => {
        dispatch({type: 'REMOVE', idContainer: props.controlList.id, index: index});
    }

    const moveControl = (control, oldIndex, newIndex) => {
        dispatch({type: 'MOVE', idContainer: props.controlList.id, itemType: control.type,
        control: control, oldIndex: oldIndex, newIndex: newIndex})
    }

    const [, drop] = useDrop({
        accept: ItemTypes.CONTROL,
        drop(data, monitor, component) {
            const sourceObj = monitor.getItem();
            if (props.controlList.id !== sourceObj.idLayout) {
                pushControl(sourceObj.control, sourceObj.index);
            }
            return {
                idContainer: props.controlList.id
            };
        }
    })

    return (
        <div ref={drop} class="col-md-4">
            {containerData.children && containerData.children.map((control, i) => (
                <Control
                    key={control.id}
                    idLayout={`${props.controlList.id}`}
                    id={`${control.id}`}
                    index={i}
                    moveControl={moveControl}
                    pushControl={pushControl}
                    removeControl={removeControl}
                    control={control}
                />
            ))}
        </div>
    )
}
export default Container;