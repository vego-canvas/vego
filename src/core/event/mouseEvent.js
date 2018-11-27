import Event from './event';
class MouseEvent extends Event{
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

export default MouseEvent;
