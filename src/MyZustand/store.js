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

export const createStore = (iState) => {
    let state = iState;

    const listeners = new Set();

    const get = () => state;

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

    const useStore = () => {
        const [_, forceUpdate] = useState({})
        useEffect(() => {
            const listener = () => forceUpdate({});
            return subscribe(listener)
        }, [])
        return [get(), set]
    }
    
    return { get, set, subscribe, useStore };

}

