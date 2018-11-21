let ch = true;
export const log = function(){
    if(ch){
        console.log.apply(null, arguments);
    }
};
export const assert = function(msg){
    console.assert(false, msg);
};
