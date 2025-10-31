export default function tasksReducer(state = [], action) {
    if (!action || !action.type)
        return state;
    switch (action.type) {
        case 'add': {
            if (!action.data) {
                return state;
            }
            return [...state, action.data];
        }
        case 'remove': {
            if (!action.data)
                return state;
            return state.filter(task => !(task.title === action.data.title && task.desc === action.data.desc));
        }
        case 'alter': {
            if (!action.data)
                return state;
            return state.map(task => task.title === action.data.title ? Object.assign(Object.assign({}, task), action.data) : task);
        }
        default:
            return state;
    }
}
