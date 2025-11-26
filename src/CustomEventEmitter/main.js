/**

Requirements ================================
Custom Event Emitter
- register a listener
- remove
- trigger all listeners on event
- register listener for once event


Scope ================================


HLD ================================
EventEmitter class
Methods
- on(event, listener)
- emit(event, ...args)
- off(event, listener)
- once(event, listener)

LLD ================================


*/

class EventEmitter {
    constructor() {
        this.events = {
            // eventName: listenersSet
        }
    }

    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = new Set();
        }
        this.events[event].add(listener);
    }

    // we don't know how many args are there..
    // so we capture all of them into args array
    emit(event, ...args) {
        const listeners = this.events[event];
        for (let l of listeners) {
            l(args);
        }
    }

    once(event, listener) {
        const wrapper = (...args) => {
            listener(args);
            this.off(event, listener);
        }
        this.on(event, wrapper)
    }

    off(event, listener) {
        this.events[event].delete(listener);
    }
}

const em = new EventEmitter()

const greet = (name) => console.log(`hello ${name}`);
em.on('greet', greet);
em.emit('greet', 'vamshi', 'budy')
em.off('greet', greet)


