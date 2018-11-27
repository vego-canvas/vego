class Event {
    constructor(options) {
        Object.assign(this, {
            bubble: true,
            capture: false,
            propagationStopped: false,
            defaultPrevented: false,
        }, options);
        this.type = options.type;
        this.target = options.target;
    }

    preventDefault() {
        this.defaultPrevented = true;
    }

    stopPropagation() {
        this.propagationStopped = true;
    }

    toString() {
        return '[Event (type=' + this.type + ')]';
    }
}

export default Event;
