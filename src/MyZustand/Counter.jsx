import {createStore} from './store';

const {useStore, set} = createStore({ val: 1, name: 'john doe' });

export const Counter = () => {
    const [val] = useStore(({val}) => val);
    return <div>Random Val: {val}</div>
}

export const Name = () => {
    const [name] = useStore(({name}) => name);
    return <div>Name: {name}</div>
}

export const Button = () => {
    return <button onClick={() => set({val: Math.random().toFixed(2)})}>
        update
    </button>
}

