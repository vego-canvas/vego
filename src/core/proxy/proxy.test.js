import {addOBProxy} from './index';
import Watcher from './watcher';

describe('proxy test', function(){
    const obj = {
        a: 'xxx',
        b: {
            c: 6666,
        },
        d: [
            'test',
            {
                g: 'hhhh'
            }
        ]
    };
    const proxyObj = addOBProxy(obj);
    const vm = {
        data: proxyObj,
        render(){
            console.log(this.data);
        },
        watch: {
            a(){
                console.log(`a = ${vm.data.a}`);
                vm.data.b.c = 8888;
            }
        }
    };
    new Watcher({
        vm,
        cb: function() {
            this.render();
        },
        getter: function() {
            console.log('getter!');
            return this.data;
        }
    });
    new Watcher({
        vm,
        cb: function() {
            this.watch.a();
        },
        getter: function() {
            return this.data.a;
        }
    });
    console.log('-----------------------');
    vm.data.a = 'gggg';
    console.log('-----------------------');
    vm.data.b.c = 0;
    console.log('-----------------------');
    vm.data.d[1].g = 'pppssss';
});
