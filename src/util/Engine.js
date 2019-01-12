import {
    nextTick,
} from './nextTick';
const queue = [];

let flushing = false;
let waiting = false;
let index = 0;
let has = {};

function flushSchedulerQueue() {
    flushing = true;
    let customWatcher;
    let id;
    for (index = 0; index < queue.length; index++) {
        customWatcher = queue[index];
        id = customWatcher.uid;
        has[id] = null;
        customWatcher.update();
    }

    resetSchedulerState();
}
function resetSchedulerState() {
    index = queue.length = 0;
    has = {};
    waiting = flushing = false;
}

export function queueUpdate(customWatcher) {
    const id = customWatcher.id;
    if (has[id] == null) {
        has[id] = true;
        if (!flushing) {
            queue.push(customWatcher);
        } else {
            // if already flushing, splice the watcher based on its id
            // if already past its id, it will be run next immediately.
            let i = queue.length - 1;
            while (i > index && queue[i].id > customWatcher.id) {
                i--;
            }
            queue.splice(i + 1, 0, customWatcher);
        }
        // queue the flush
        if (!waiting) {
            waiting = true;
            nextTick(flushSchedulerQueue);
        }
    }
}

// function Ticker(run) {
//     const nextFrame = (t) => {
//         if(queue.length)
//         window.requestAnimationFrame(nextFrame);
//     };
//     window.requestAnimationFrame(nextFrame);
// }
