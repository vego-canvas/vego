export function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }



export function getData(l){
    return new Promise((resolve) => {
        setImmediate(() => {
            const data = new Array(l || ~~(Math.random() * 5 + 5)).fill(0).map(() => ({
                data: ~~(Math.random() * 100),
                name: Math.random().toString(36).substr(2),
                color: getRandomColor()
            }));
            resolve(data)
        });
    })
}