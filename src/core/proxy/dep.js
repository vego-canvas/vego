import { queueWatcher } from '../queue';
let uid = 0;

class Dep{
    constructor(){
        this.uid = uid++;
        this.targets = new Map();
    }
    depend(){
        if(Dep.currWatcher){
            this.targets.set(Dep.currWatcher.uid, Dep.currWatcher);
        }
    }
    notify(){
        this.targets.forEach(watcher => {
            // watcher.update();
            queueWatcher(watcher);
        })
    }
}
Dep.currWatcher = null;
const targetStack = []

export function pushTarget (_target) {
  if (Dep.currWatcher) targetStack.push(Dep.currWatcher)
  Dep.currWatcher = _target
}

export function popTarget () {
  Dep.currWatcher = targetStack.pop()
}
export default Dep;