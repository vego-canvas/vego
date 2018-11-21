import initialize from './src/core'
import { rendermixin } from './src/core/render';
import eventMixin from './src/core/event';
function Vego(config){
    this._init(config);
};

initialize(Vego);
rendermixin(Vego);
eventMixin(Vego);

export default Vego;