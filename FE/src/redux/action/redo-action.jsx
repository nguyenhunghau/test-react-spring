import update from 'immutability-helper';
import { saveHistory, getContainer, addNew, moveControl, removeControl } from './builder-action'

const redo = (state) => {
    // if present is last command => return
    if (state.history.present >= state.history.command.length - 1) {
        //execute present command
        return state;
    }
    const presentCommand = state.history.command[state.history.present + 1];
    switch (presentCommand.type) {
        case 'ADD':
            state.history.present++;
            return addNew(state, { count: state.count, itemType: presentCommand.controlType, idContainer: 0 });
        case 'PUSH':
            const currentContainer = getContainer(state, presentCommand.idContainer);
            currentContainer.children.push({
                id: state.count + 1,
                type: presentCommand.controlType
            });

            //remove control
            const nextCommand = state.history.command[state.history.present + 2];
            const action = { idContainer: nextCommand.idContainer, index: presentCommand.oldIndex };
            state.history.present += 2;
            return {
                ...state,
                data: removeControl(state, action)
            };
        case 'MOVE':
            state.history.present++;
            return {
                ...state,
                data: moveControl(state, {
                    control: {
                        id: presentCommand.controlId,
                        type: presentCommand.controlType
                    },
                    idContainer: presentCommand.idContainer,
                    oldIndex: presentCommand.oldIndex,
                    newIndex: presentCommand.newIndex
                }
                )
            };
        default:
            return state;
    }
    //if (present + 1).type = ADD => call action again, present++
    // if(present + 1).type = PUSH => call action (present + 1) and (present + 2),  present++
    // IF is MOVE => move again from oldIndex to newIndex, present --

    // Check PRESENT command, if it is ADD => REMOVE data in state, present --
    // const presentCommand = state.history.command[state.history.present];
    // switch (presentCommand.type) {
    //     case 'ADD':

    //     case 'REMOVE':
    //         //if is REMOVE => move data again: PUSH (present).container, 
    //         //REMOVE (present - 1).container, present --2
    //         const lastCommand = state.history.command[state.history.present - 1];
    //         const controlRemove = {
    //             id: presentCommand.controlId,
    //             type: lastCommand.controlType,
    //             text: '',
    //             link: ''
    //         };
    //         //Get container of controlRemove
    //         const oldContainer = state.data.filter((c) => `${c.id}` === presentCommand.idContainer)[0];
    //         //get control Id and indexRemove

    //         //Push into the container at index
    //         const newControlData = update(oldContainer.children, {
    //             $splice: [
    //                 [lastCommand.oldIndex, 0, controlRemove]
    //             ],
    //         });

    //         //Remove at current container
    //         const currentContainer = state.data.filter((c) => `${c.id}` === lastCommand.idContainer)[0];
    //         const removedControlData = update(currentContainer.children, {
    //             $splice: [
    //                 [currentContainer.children.length - 1, 1]
    //             ],
    //         });
    //         state = updateChildOfState(state, newControlData, oldContainer.id);
    //         state.history.present -= 2;
    //         return updateChildOfState(state, removedControlData, currentContainer.id);
    //     case 'MOVE':
    //         const presentCommand = state.history.command[state.history.present];
    //         const movedContainer = state.data.filter((c) => `${c.id}` === presentCommand.idContainer)[0];
    //         const control = {
    //             id: presentCommand.controlId,
    //             type: presentCommand.controlType,
    //             text: '',
    //             link: ''
    //         };
    //         const movedControlData = update(movedContainer.children, {
    //             $splice: [
    //                 [presentCommand.newIndex, 1],
    //                 [presentCommand.oldIndex, 0, control]
    //             ],
    //         });
    //         state.history.present --;
    //         return  updateChildOfState(state, movedControlData, movedContainer.id);
    //     default:
    //         return state;
    // }
    // IF is MOVE => move again from newIndex to oldIndex, present --

}

const updateChildOfState = (state, newControlList, idContainer) => {
    state.data = state.data.map(item =>
        item.id == idContainer ? { ...item, children: newControlList } : item
    );
    return state;
}

export default redo;