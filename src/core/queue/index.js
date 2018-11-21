import { nextTick } from './nextTick';

const queue = []
let has = {}
let waiting = false
let flushing = false
let index = 0
/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
    flushing = true
    let watcher, id

    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.
    queue.sort((a, b) => a.id - b.id)

    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (index = 0; index < queue.length; index++) {
      watcher = queue[index]
      id = watcher.uid
      has[id] = null
      watcher.update()
    }

    resetSchedulerState()
}
function resetSchedulerState () {
    index = queue.length  = 0
    has = {}
    waiting = flushing = false
}
export function queueWatcher (watcher) {
    const id = watcher.uid
    if (has[id] == null) {
      has[id] = true
      if (!flushing) {
        queue.push(watcher)
      } else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        let i = queue.length - 1
        while (i > index && queue[i].uid > watcher.uid) {
          i--
        }
        queue.splice(i + 1, 0, watcher)
      }
      // queue the flush
      if (!waiting) {
        waiting = true
        nextTick(flushSchedulerQueue)
      }
    }
  }