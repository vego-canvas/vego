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

class MouseEvent extends Event {
    constructor(options) {
        super(options);
        this.originEvent = options.evt;
        this.x = options.x;
        this.y = options.y;
    }

    toString() {
        return '[MouseEvent (type=' + this.type + ' x=' + this.x + ' y=' + this.y + ')]';
    }
}
class PayloadEvent extends Event {
    constructor(options) {
        super(options);
        this.payload = options.payload;
    }
}

export {
    MouseEvent,
    PayloadEvent,
};
