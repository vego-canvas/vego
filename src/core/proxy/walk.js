import { observable, reservedAttrs, shallowAttrs } from '../../utils';
import Vego from '../../../index';
function walk(val, shallow){
    // console.log(val, observable(val), val instanceof Vego, shallow);
    const isA = Array.isArray(val);
    if (!val || !observable(val) || shallow) {
        return;
    }
    let i, keys;
    if (isA) {
        i = val.length;
        while (i--) walk(val[i]);
    } else {
        keys = Object.keys(val);
        i = keys.length;

        while (i--) {
            const k = keys[i];
            if(!reservedAttrs(k)){
                if(shallowAttrs(k)){
                    walk(val[keys[i]], true);
                }else{
                    walk(val[keys[i]]);
                }
            }

        }
    }
}

export default walk;