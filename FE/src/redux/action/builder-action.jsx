import update from 'immutability-helper';

export const addNew = (state, action) => {
    state.data[action.idContainer].children.push({
        id: state.count + 1,
        type: action.itemType,
        text: '',
        link: ''
    });
    return {
        ...state,
        count: state.count + 1,
        data: state.data
    };
}

export const getContainer = (state, idContainer) => {
    return state.data.filter((c) => `${c.id}` === idContainer)[0];
}

export const moveControl = (state, action) => {
    const currentContainer = { ...getContainer(state, action.idContainer) };
    const newControlList = update(currentContainer.children, {
        $splice: [
            [action.oldIndex, 1],
            [action.newIndex, 0, action.control],
        ],
    });
    return state.data.map(item =>
        item.id == action.idContainer ? { ...item, children: newControlList } : item
    );
}

export const removeControl = (state, action) => {
    const currentContainer = { ...getContainer(state, action.idContainer) };
    const newControlList = update(currentContainer.children, {
        $splice: [
            [action.index, 1]
        ],
    });
    return state.data.map(item =>
        item.id == action.idContainer ? { ...item, children: newControlList } : item
    );
}

export const modifyControl = (state, action) => {
    //Find control by id
    let controlFind = {};
    for(var container of state.data) {
        controlFind = container.children.filter(control => control.id == action.id)[0];
        if(controlFind) {
            controlFind.text = action.text;
            controlFind.oldText = action.oldText;
            return state;
        }
    }
    return state;
}

export const saveHistory = (state, action) => {
    state.history.command.push({
        type: action.type, controlType: action.itemType, idContainer: action.idContainer,
        oldContainer: '', newContainer: '', controlId: (action.id || (action.control && action.control.id) || state.count + 1),
        oldIndex: action.oldIndex, newIndex: action.newIndex,
        oldText: action.oldText, text: action.text
    });
    state.history.present++;
    return state;
}