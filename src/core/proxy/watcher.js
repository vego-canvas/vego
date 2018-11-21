import Dep, { pushTarget, popTarget } from './dep';
import walk from './walk';
let uid = 0;
class Watcher{
    constructor({
        vm,
        cb,
        getter,
        shallow
    }){
        this.uid = uid ++;
        this.vm = vm;
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
    }
    update(){
        this.cb.call(this.vm, this.getter.call(this.vm, this.vm));
    }
}

export default Watcher;