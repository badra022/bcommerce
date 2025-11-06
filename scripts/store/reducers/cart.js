export default function cartReducer(state = [], action) {
    if (!action || !action.type)
        return state;
    switch (action.type) {
        case 'add': {
            if (!action.data) {
                return state;
            }
            action.data.quantity = Math.trunc(action.data.quantity) || 1;
            const existingItemIndex = state.findIndex(item => item.title === action.data.title);
            if (existingItemIndex !== -1) {
                const updatedItem = {
                    ...state[existingItemIndex],
                    quantity: state[existingItemIndex].quantity + action.data.quantity
                };
                const newState = [...state];
                newState[existingItemIndex] = updatedItem;
                return newState;
            }
            return [...state, action.data];
        }
        case 'remove': {
            if (!action.data) {
                return state;
            }
            return state.filter(item => !(item.title.trim().toLowerCase() === action.data.title.trim().toLowerCase()));
        }
        default:
            console.warn(`Unknown action type: ${action.type}. Returning current state.`);
            return state;
    }
}
