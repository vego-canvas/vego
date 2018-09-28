import Vue from 'vue';

const noop = () => null;
const EventTypes = {
  mouseenter: function(target){
    return new Vue({
       data(){
          return {
            hit: false,
          }
        },
        watch:{
          hit(val, oldVal){
            if(val){
              target.$emit('mouseenter');
            }
          }
        }
    })
  },
  mouseleave: function(target){
    return new Vue({
       data(){
          return {
            hit: false,
          }
        },
        watch:{
          hit(val, oldVal){
            if(!val){
              target.$emit('mouseleave');
            }
          }
        }
    })
  },
  mousemove: noop,
}

class Event {
  constructor(options = {}){
    this.type = options.type;

    this.bubbles = !!options.bubbles;
    this.cancelable = !!options.cancelable;
    this.timeStamp = (new Date()).getTime();
    this.propagationStopped = false;
    this.defaultPrevented = false;
    // 0 - capture from parent to target
    // 1 - at target
    // 2 - bubble from child to top parent
    this.eventPhase = 0;

    this.x = options.x;
    this.y = options.y;
    
  }
  preventDefault(){
    this.defaultPrevented = true;
  }
  stopPropagation(){
    this.stopPropagation = true;
  }
  toString() {
    return "[MouseEvent (type="+this.type+" x="+this.x+" y="+this.y+")]";
  }
}

function isStateChangeEvent(type){
  return type === "mouseenter" || type === "mouseleave";
}

class EventDispatcher {
  constructor(){
    this._listeners = null
  }

  dispatch(type, winevent){
    const { offsetX, offsetY } = winevent;

    if(this._listeners && this._listeners[type]){
      const event = new Event({
        type, offsetX, offsetY
      });
      const watchers = this._listeners[type].filter(watcher => {
        const { target, state } = watcher;
        const hit = target._hitTest(offsetX, offsetY);
        if(!hit) state.hit = hit;
        return hit;
      }).sort((a, b) => {
        // last draw, high layer, bigger uid
        return b.target._uid - a.target._uid
      });

      if(watchers.length > 0){
        const watcher = watchers[0];
        if(isStateChangeEvent(type)){
          watcher.state.hit = true;
          for (var i = watchers.length - 1; i > 0; i--) {
            watchers[i].state.hit = false;
          }
        }else{
          watcher.target.$emit(type, event);
        }
      }
    }
  }

  push(eventType, target){
    console.log(eventType, target._uid)
    if(!this._listeners) this._listeners = {};
    if(!this._listeners[eventType]) this._listeners[eventType] = [];
    this._listeners[eventType].push({
      target,
      state: EventTypes[eventType](target),
    });
  }
}

export default EventDispatcher;


