import { queueWatcher } from '../queue';
let uid = 0;

class Dep{
    constructor(){
        this.uid = uid++;
        this.targets = new Map();
    }
    depend(){
        if(Dep.currWatcher){
            Dep.currWatcher._deps.push(this);
            this.targets.set(Dep.currWatcher.uid, Dep.currWatcher);
        }
    }
    notify(){
        this.targets.forEach(watcher => {
            // watcher.update();
            queueWatcher(watcher);
        })
    }
    undepend(){
        if(Dep.currWatcher){
            if(this.targets.has(Dep.currWatcher.uid)){
                this.targets.delete(Dep.currWatcher.uid);
            }
        }
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