import  { injectEvent } from '../event'
function lifecycle(vm){
    const Vego = vm.constructor;
    vm.mounted = vm.$options.mountedhook;
    vm.$options.mountedhook = null;
    vm.$mount = (function(el){
        const ratio = window.devicePixelRatio || 1;
        const canvas = document.getElementById(el);

        const { width, height } = canvas;
        if (devicePixelRatio !== 1) {
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
        } else {
            canvas.width = width;
            canvas.height = height;
            canvas.style.width = '';
            canvas.style.height = '';
        }
        Vego.Engine.setCanvas(canvas, ratio);
        Vego.Engine._render = this._render.bind(this);
        vm._update();
        vm.$children.forEach(({comp}) => {comp._update()})
        injectEvent(canvas, vm, ratio);
        Vego.Engine.run();
    }).bind(vm);
}
export default lifecycle;

export function callhook(hook, vm){
    vm[hook]();
}