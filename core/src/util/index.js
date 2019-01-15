export function findmax(array, key) {
    let max = 0;
    let target = null;
    const a = array.length;

    let counter;

    for (counter = 0; counter < a; counter++) {
        if (array[counter][key] > max) {
            max = array[counter][key];
            target = array[counter];
        }
    }
    return target;
}
