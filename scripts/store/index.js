import cartReducer from './reducers/cart.js';
function createStore(reducer, storeName) {
    const persistKey = storeName;
    let state;
    let listeners = [];
    try {
        const raw = localStorage.getItem(persistKey);
        if (raw) {
            state = JSON.parse(raw);
        }
    }
    catch (e) {
    }
    function getState() {
        return state;
    }
    function dispatch(action) {
        if (!action)
            throw Error("no action passed for dispatch method!");
        state = reducer(state, action);
        try {
            localStorage.setItem(persistKey, JSON.stringify(state));
        }
        catch (e) {
        }
        listeners.forEach((listener) => listener(action));
    }
    function subscribe(listener) {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter((l) => l !== listener);
        };
    }
    return { getState, dispatch, subscribe };
}
export const cart = createStore(cartReducer, 'cart');
