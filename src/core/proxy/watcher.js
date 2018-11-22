import Dep, { pushTarget, popTarget } from './dep';
import walk from './walk';
let uid = 0;
class Watcher{
    constructor({
        vm,
        cb,
        getter,
        shallow
    }, render){
        this._deps = [];
        this.uid = uid ++;
        this.vm = vm;
        if(render) this.vm._mainWatcher = this;
        this.vm._watchers.push(this);
        this.cb = cb;
        this.getter = getter;
        this.shallow = !!shallow;
        this.value = undefined;
        this.get();
    }
    get(){
        pushTarget(this);
        this.value = this.getter.call(this.vm, this.vm);
        walk(this.value, this.shallow);
        popTarget();
        return this.value;
    }
    update(){
        this.cb.call(this.vm, this.getter.call(this.vm, this.vm));
    }
    del(){
        pushTarget(this);
        let dep = null;
        while (dep = this._deps.pop()) {
            dep.undepend();
        }
        popTarget();
    }
}

export default Watcher;