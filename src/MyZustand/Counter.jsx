import {createStore} from './store';

const {useStore, set} = createStore({ val: 0, name: 'vamshi' });

export const Counter = () => {
    const [store] = useStore();
    return <div>{store.val}</div>
}

export const Name = () => {
    const [store] = useStore();
    return <div>{store.name}</div>
}

export const Button = () => {
    return <button onClick={() => set({val: Math.random().toFixed(2)})}>
        update
    </button>
}

