import { useEffect, useState } from "react";
/**
    zustand
    createStore - with a initial state
    return {get, set, subscribe} = unsubscribe
    internally manages listeners - calls them when set happens

    basically we create a hook
    whose state is by useState
    internal wireup this setState to listener
    wherever this hook gets used, it will re-render

 */

export const createStore = (initialState) => {
    let state = initialState;

    const listeners = new Set();

    const get = (selector) => selector(state);

    const set = (partial) => {

        let nextState;
        if (typeof partial === 'function') {
            nextState = partial(state)
        } else {
            nextState = partial
        }
        state = {...state, ...nextState}
        for (let l of listeners) {
            l(state);
        }
    }

    const subscribe = (fn) => {
        listeners.add(fn)
        return () => listeners.delete(fn)
    }

    const useStore = (selector) => {
        const [_, forceUpdate] = useState({})
        useEffect(() => {
            let prev = state;
            const listener = (next) => {
                if (selector(prev) !== selector(next)) {
                    forceUpdate({});
                }
            }
            return subscribe(listener)
        }, [selector])
        return [get(selector), set]
    }

    return { get, set, subscribe, useStore };

}

