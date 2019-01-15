import { PayloadEvent } from './Event';

export const AVAILABLE_EVENT_TYPES = [
    'click',
    'mousemove',
    'mouseenter',
    'mouseleave',
    'mousedown',
    'pressmove',
    'mouseup',
];

class EventDispatcher {
    constructor() {
        this._listeners = [];
        this.ratio = 1;
        AVAILABLE_EVENT_TYPES.forEach((t) => this._listeners[t] = []);
    }

    $regist(type, cb) {
        if (!(type in this._listeners))
            this._listeners[type] = [];
        this._listeners[type].push(cb);
    }

    $emit(type, event) {
        if (type in this._listeners && this._listeners[type].length)
            this._listeners[type].forEach((f) => f(event));
    }

    $dispatch(type, payload) {
        const event = new PayloadEvent({
            type,
            payload,
            target: this,
        });
        this._dispatch(event);
    }

    _dispatch(event) {
        this.$emit(event.type, event);
        if (event.bubble && !event.propagationStopped && this.$parent) {
            this.$parent._dispatch(event);
        }
    }
}

export default EventDispatcher;
