import update from 'immutability-helper';
import {modifyControl} from './builder-action';
const undo = (state) => {
    // IF PRESENT is first command => return
    if (state.history.present < 0) {
        return state;
    }
    // Check PRESENT command, if it is ADD => REMOVE data in state, present --
    const presentCommand = state.history.command[state.history.present];
    switch (presentCommand.type) {
        case 'ADD':
            const numItem = state.data[0].children.length;
            const newControlList = update(state.data[0].children, {
                $splice: [
                    [numItem - 1, 1]
                ],
            });
            state.history.present--;
            return updateChildOfState(state, newControlList, 'c0');
        case 'REMOVE':
            //if is REMOVE => move data again: PUSH (present).container, 
            //REMOVE (present - 1).container, present --2
            const lastCommand = state.history.command[state.history.present - 1];
            const controlRemove = {
                id: presentCommand.controlId,
                type: lastCommand.controlType,
                text: '',
                link: ''
            };
            //Get container of controlRemove
            const oldContainer = state.data.filter((c) => `${c.id}` === presentCommand.idContainer)[0];
            //get control Id and indexRemove

            //Push into the container at index
            const newControlData = update(oldContainer.children, {
                $splice: [
                    [lastCommand.oldIndex, 0, controlRemove]
                ],
            });

            //Remove at current container
            const currentContainer = state.data.filter((c) => `${c.id}` === lastCommand.idContainer)[0];
            const removedControlData = update(currentContainer.children, {
                $splice: [
                    [currentContainer.children.length - 1, 1]
                ],
            });
            state = updateChildOfState(state, newControlData, oldContainer.id);
            state.history.present -= 2;
            return updateChildOfState(state, removedControlData, currentContainer.id);
        case 'MOVE':
            // const presentCommand = state.history.command[state.history.present];
            const movedContainer = state.data.filter((c) => `${c.id}` === presentCommand.idContainer)[0];
            const control = {
                id: presentCommand.controlId,
                type: presentCommand.controlType,
                text: '',
                link: ''
            };
            const movedControlData = update(movedContainer.children, {
                $splice: [
                    [presentCommand.newIndex, 1],
                    [presentCommand.oldIndex, 0, control]
                ],
            });
            state.history.present--;
            return updateChildOfState(state, movedControlData, movedContainer.id);
        case 'MODIFY':
            return modifyControl(state, {
                id: presentCommand.controlId, oldText: presentCommand.oldText,
                text: presentCommand.text
            });
        default:
            return state;
    }
}

const updateChildOfState = (state, newControlList, idContainer) => {
    state.data = state.data.map(item =>
        item.id === idContainer ? { ...item, children: newControlList } : item
    );
    return state;
}

export default undo;