export interface CartItem {
    title: string,
    desc?: string,
    price?: number,
    quantity?: number,
    discount?: number
}

interface CartRules {
    maxItemsPerType: number,
    maxTitleLength: number,
    pricePercesion: number,
    maxPrice: number,
    maxQuantity: number,
    allowDiscounts: boolean
}

type actionType = 'add' | 'remove' | 'alter'

type Action = {
    type: actionType,
    data?: CartItem
}

export default function cartReducer (state: CartItem[] = [], action: Action) : CartItem[] {
    // if no valid action passed, return current state
    if (!action || !action.type) return state;

    switch (action.type) {
        case 'add': {
            if (!action.data) {
                // nothing to add → return current state
                return state;
            }

            action.data.quantity = 	Math.trunc(action.data.quantity) || 1;

            const existingItemIndex = state.findIndex(item => item.title === action.data!.title);
            if(existingItemIndex !== -1) {
                // item already exists, update quantity
                const updatedItem = {
                    ...state[existingItemIndex],
                    quantity: state[existingItemIndex].quantity + action.data!.quantity
                }

                const newState = [...state];
                newState[existingItemIndex] = updatedItem;
                return newState;
            }

            // if not already existing, add new item
            return [...state, action.data];
        }
        case 'remove': {
            if (!action.data) {
                // nothing to remove → return current state
                return state;
            }
            return state.filter(item => !(item.title.trim().toLowerCase() === action.data!.title.trim().toLowerCase()));
        }
        default:
            console.warn(`Unknown action type: ${action.type}. Returning current state.`);
            return state;
    }
}