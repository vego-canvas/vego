import  { injectEvent } from '../event'
function initLifecycle(vmp, options){
    vmp.mounted = options.mountedhook.bind(vmp);
    vmp.created = options.createdhook.bind(vmp);
}
export default initLifecycle;

export function lifeCycleMixin(Vego){
    Vego.prototype.$mount = function(el){
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
        this._update();
        this.$children.forEach(({comp}) => {comp._update()})
        injectEvent(canvas, this, ratio);
        Vego.Engine.run();
    }
}
export function callhook(hook, vm){
    vm[hook]();
}