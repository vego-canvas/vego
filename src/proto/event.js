import Vue from 'vue';

const noop = function(target){
  return new Vue({
    data(){
      return {
        hit: false,
      }
    },
  })
}
const EventTypes = {
  mouseenter: function(target, bubble){
    return new Vue({
       data(){
          return {
            hit: false,
            bubble,
          }
        },
        watch:{
          hit(val, oldVal){
            if(val && !this.bubble){
              target.$emit('mouseenter');
            }
            if(this.bubble){
              target._hit = val;
              this.bubble.$emit('mouseinboundcheck', {
                target
              });
            }
          }
        }
    })
  },
  mouseleave: function(target, bubble){
    return new Vue({
       data(){
          return {
            hit: false,
            bubble
          }
        },
        watch:{
          hit(val, oldVal){
            if(!val && !this.bubble){
              target.$emit('mouseleave');
            }
            if(this.bubble){
              target._hit = val;
              this.bubble.$emit('mouseinboundcheck', {
                target
              });
            }
          }
        }
    })
  },
  mousemove: noop,
  mousedown: noop,
  mouseup: noop,
  pressmove: function(target, bubble){
    return new Vue({
       data(){
          return {
            anchor: null,
            pos: null,
            bubble
          }
        },
        watch:{
          pos(val){
            if(this.anchor && !this.bubble){
              target.$emit('pressmove', {
                ...this.anchor,
                ...val
              })
            }
          }
        }
    })
  },
  click: noop,
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

function isStateSharedEvent(type){
  return type === "mousedown" || type === "mouseup";
}
function isStableEvent(type) {
   return type === "mousemove" || type === "pressmove";
}

class EventDispatcher {
  constructor(){
    this._listeners = null
  }

  dispatch(type, sourceevent){
    const {
      _sourceevt,
      _source
    } = sourceevent;
    
    const {
      offsetX,
      offsetY
    } = _sourceevt;

    if(this._listeners && this._listeners[type]){
      const event = new Event({
        type, offsetX, offsetY
      });


      if(isStableEvent(type)){
        this._listeners[type].forEach(watcher => {
          watcher.state.pos = { x: offsetX, y: offsetY };
        })
        return;
      }

      if(type === 'mouseup'){
        this._listeners[type].forEach(watcher => {
          watcher.state.anchor = null;
          watcher.target.$emit(type, event);
        })
      }

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
        }
        if(type === 'mousedown'){
          // console.log(event)
          watcher.state.anchor = { anchorX: offsetX, anchorY: offsetY };
          watcher.target.$emit(type, event);
        }

        // if(type === 'pressmove'){
        //   watcher.state.pos = { x: offsetX, y: offsetY };
        // } 

        // if(type === 'mouseup'){
        //   watcher.state.anchor = null;
        //   watcher.target.$emit(type, event);
        // }

        // if(type === 'mousemove'){
        //   watcher.target.$emit(type, event);
        // }
      }else{
        if(type === "mousedown"){
          console.log('no watcher');
          _source.$emit(type, event)
        }       
      }
    }
  }

  contains(type, uid){
    return !!this._listeners[type].find(t => t.uid === uid);
  }
  
  push(eventType, target, bubble){
    if(target.$children.length > 0){
      target.$children.forEach(child => {
        this.push(eventType, child, target);
      });
    }else{
      this._push(eventType, target, bubble);
    }
  }

  _push(eventType, target, bubbleTarget){
    // console.log(eventType, target._uid)
    if(!EventTypes[eventType]) throw `no such eventType: ${eventType}`
    if(!this._listeners) this._listeners = {};
    if(!this._listeners[eventType]) this._listeners[eventType] = [];

    // if(target.$children.length > 0){
    //   ret
    // }

    const am = EventTypes[eventType](target, bubbleTarget);
    const watcher = {
      uid: target._uid,
      target,
      state: am,
    };
    this._listeners[eventType].push(watcher);
    if(eventType === "pressmove"){
      if(!this._listeners['mousedown']) this._listeners['mousedown'] = [];
      this._listeners['mousedown'].push(watcher);
      if(!this._listeners['mouseup']) this._listeners['mouseup'] = [];
      this._listeners['mouseup'].push(watcher);
    }
  }
}

export default EventDispatcher;


