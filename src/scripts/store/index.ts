import tasksReducer from './reducers/tasks.js'


function createStore(reducer: (state: any, action: any) => any, storeName: string) {
  // persistence is mandatory for this store and uses a fixed key
  const persistKey = storeName;
  let state: any;
  let listeners: Array<(data?: any) => void> = [];

  // initialize state (load from localStorage, fall back to reducer)
  try {
    const raw = localStorage.getItem(persistKey);
    if (raw) {
      state = JSON.parse(raw);
    }
  } catch (e) {
    // ignore import errors - start fresh!
  }

  // returns the current state
  function getState() {
    return state;
  }

  // dispatches an action
  function dispatch(action) {
    if(!action) throw Error("no action passed for dispatch method!");
    state = reducer(state, action);
    // persist updated state
    try {
      localStorage.setItem(persistKey, JSON.stringify(state));
    } catch (e) {
      // ignore storage errors
    }
    listeners.forEach((listener) => listener(action));
  }

  // subscribe to state changes
  function subscribe(listener) {
    listeners.push(listener);
    // return an unsubscribe function
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  return { getState, dispatch, subscribe };
}


export const tasks = createStore(tasksReducer, 'tasks');