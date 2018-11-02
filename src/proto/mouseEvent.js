class MouseEvent {
    constructor(options) {
        Object.assign(this, {
            bubble: true,
            capture: false,
            propagationStopped: false,
            defaultPrevented: false,
        }, options);
        this.type = options.type;
        this.target = options.target;
        this.eventPhase = 0;
        this.originEvent = options.evt;
        this.x = options.x;
        this.y = options.y;
    }

    preventDefault() {
        this.defaultPrevented = true;
    }

    stopPropagation() {
        this.propagationStopped = true;
    }

    toString() {
        return '[MouseEvent (type=' + this.type + ' x=' + this.x + ' y=' + this.y + ')]';
    }
}

export default MouseEvent;
