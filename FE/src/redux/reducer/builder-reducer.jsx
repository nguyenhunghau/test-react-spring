import update from 'immutability-helper';
import undo from '../action/undo-action'
import redo from '../action/redo-action'
import { saveHistory, getContainer, addNew, moveControl, removeControl, modifyControl } from '../action/builder-action'

const initialState = {
    count: 0,
    data: [
        {
            type: 'layout', id: 'c0', index: 0,
            children: [
            ]
        },
        {
            type: 'layout', id: 'c1', index: 1,
            children: [
            ]
        },
        {
            type: 'layout', id: 'c2', index: 1,
            children: [
            ]
        }
    ],
    history: {
        command: [],
        present: -1
    }
};

function BuilderReducer(state = initialState, action) {
    // console.log('reducer', state, action);
    console.log(action.type);
    switch (action.type) {
        case 'ADD':
            saveHistory(state, action);
            return addNew(state, action);
        case 'IMPORT':
            saveHistory(state, action);
            return { ...action.data };
        case 'GET_CONTAINER':
            saveHistory(state, action);
            return getContainer(state, action.idContainer);
        case 'PUSH':
            saveHistory(state, action);
            const currentContainer = getContainer(state, action.idContainer);
            currentContainer.children.push(action.control);
            return {
                ...state,
                count: state.count,
                data: state.data
            };
        case 'MOVE':
            saveHistory(state, action);
            return {
                ...state,
                data: moveControl(state, action)
            };
        case 'REMOVE':
            saveHistory(state, action);
            return {
                ...state,
                count: state.count - 1,
                data: removeControl(state, action)
            };
        case 'MODIFY':
            saveHistory(state, action);
            return modifyControl(state, action);
        case 'UNDO':
            return undo(state);
        case 'REDO':
            return redo(state);
        default:
            return state;
    }
}
export default BuilderReducer;