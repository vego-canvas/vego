import { observable } from '../../utils';
import Vego from '../../../index';
function walk(val, shallow){
    const isA = Array.isArray(val);
    if (!val || !observable(val) || val instanceof Vego || shallow) {
        return;
    }
    let i, keys;
    if (isA) {
        i = val.length;
        while (i--) walk(val[i]);
    } else {
        keys = Object.keys(val);
        i = keys.length;
        while (i--) walk(val[keys[i]]);
    }
}

export default walk;