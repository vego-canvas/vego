import initialize from './src/core'
import { rendermixin } from './src/core/render';
import eventMixin from './src/core/event';
import { initWatcher } from './src/core/proxy'
import { lifeCycleMixin } from './src/core/lifecycle'
import TweenMixin from './src/tween'
function Vego(config, parent){
    this._init(config, parent);
};

initialize(Vego);
rendermixin(Vego);
eventMixin(Vego);
initWatcher(Vego);
lifeCycleMixin(Vego);
TweenMixin(Vego);

export default Vego;