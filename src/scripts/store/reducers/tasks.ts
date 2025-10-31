interface Task {
    title: string,
    desc: string
}

type actionType = 'add' | 'remove' | 'alter'

type Action = {
    type: actionType,
    data?: Task
}

// ...existing code...
export default function tasksReducer (state: Task[] = [], action: Action) : Task[] {
    // ensure reducer is pure and returns a new state (and handles undefined initial state)
    if (!action || !action.type) return state;

    switch (action.type) {
        case 'add': {
            if (!action.data) {
                // nothing to add → return current state
                return state;
            }
            // return new array (immutable)
            return [...state, action.data];
        }
        case 'remove': {
            if (!action.data) return state;
            // remove tasks that match both title and desc (adjust predicate if you have an id)
            return state.filter(task => !(task.title === action.data!.title && task.desc === action.data!.desc));
        }
        case 'alter': {
            if (!action.data) return state;
            // replace the task that matches by title (or use an id when available)
            return state.map(task => task.title === action.data!.title ? { ...task, ...action.data } : task);
        }
        default:
            return state;
    }
}