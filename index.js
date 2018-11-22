import initialize from './src/core'
import { rendermixin } from './src/core/render';
import eventMixin from './src/core/event';
import { initWatcher } from './src/core/proxy'
function Vego(config){
    this._init(config);
};

initialize(Vego);
rendermixin(Vego);
eventMixin(Vego);
initWatcher(Vego);

export default Vego;