const config = {
    I: -1, // 方块出现的初始行位置
    J: 6, // 方块出现的初始列位置
    SPEED: 25, // 正常速度
    FASTSPEED: 1, // 最快速度
    TIME: 40, // 40ms的刷新速度
};
function Block(type) {
    this.type = type; // 方块类型
    this.i = config.I; // 初始行位置
    this.j = config.J; // 初始列位置
    this.speed = config.SPEED; // 初始速度
    this.defer = 0; // 延迟累计
    switch (this.type) { // 根据type值初始化方块的坐标，outline属性值存储着这些坐标值
        case 1: // l字
            this.outline = [{ i: this.i, j: this.j },
                { i: this.i - 1, j: this.j },
                { i: this.i - 2, j: this.j },
                { i: this.i - 3, j: this.j }];
            break;
        case 2: // 上字
            this.outline = [{ i: this.i, j: this.j - 1 },
                { i: this.i - 1, j: this.j },
                { i: this.i, j: this.j },
                { i: this.i, j: this.j + 1 }];
            break;
        case 3: // L字
            this.outline = [{ i: this.i - 2, j: this.j - 1 },
                { i: this.i - 1, j: this.j - 1 },
                { i: this.i, j: this.j - 1 },
                { i: this.i, j: this.j }];
            break;
        case 4: // 田字
            this.outline = [{ i: this.i - 1, j: this.j - 1 },
                { i: this.i, j: this.j - 1 },
                { i: this.i, j: this.j },
                { i: this.i - 1, j: this.j }];
            break;
        case 5: // 转字
            this.outline = [{ i: this.i - 1, j: this.j - 1 },
                { i: this.i, j: this.j - 1 },
                { i: this.i, j: this.j },
                { i: this.i + 1, j: this.j }];
            break;
    }
    this.dropBlock = function () { // 下落方块
        if (this.defer === this.speed) {
            this.outline.forEach((o) => {
                o.i = o.i + 1; // 行（i）坐标加1表示向下移
            });
            this.defer = 0;
        } else
            this.defer++;
    };
    this.speedUp = function () { // 按下方向键时，方块加速下降
        this.speed = 1;
        this.defer = 0;
    };
    this.isReady = function () {
        return this.speed === this.defer;
    };
}
const Blocks = {
    pause: false, // 游戏是否处于暂停中
    matrix: new Array(21), // 矩阵，-1表示空，0表示正在移动，1表示已存在
    block: new Block(1), // 默认第一个出现的方块类型为1
    score: 0, // 分数累计
    init() {
        for (let i = 0; i < 21; i++) { // 初始化矩阵数组
            this.matrix[i] = new Array(12);
            for (let j = 0; j < 12; j++) {
                this.matrix[i][j] = -1;
            }
        }
        document.onkeydown = (e) => {
            e.preventDefault();// 按键事件
            const code = e.keyCode || e.which;
            switch (code) {
                case 37: // ←
                    this.setSite(-1);
                    break;
                case 38: // ↑
                    this.rotateBlock();
                    break;
                case 39: // →
                    this.setSite(1);
                    break;
                case 40: // ↓ 长按加速下滑
                    if (this.block.speed === config.SPEED)
                        this.block.speedUp(); // 加速
                    break;
                case 32: // 暂停
                    !this.pause ? this.suspend() : this.start();
                    break;
                default:
                    return false;
            }
        };
        document.onkeyup = (e) => {
            e.preventDefault();
            if (e.keyCode === 40) { // 松开↓恢复速度
                this.block.speed = config.SPEED;
            }
        };
    },
    start() { // 开始游戏
        this.time = setInterval(() => {
            this.block.dropBlock(); // 下落方块
            this.refreshMat(); // 刷新矩阵
            this.reachBottom(); // 检测是否到达底部或者碰到已有方块
        }, config.TIME);
        this.pause = false;
    },
    registListener(ctx, fn) {
        this.listener = fn;
        this.listenerCtx = ctx;
    },
    registScoreListener(ctx, fn) {
        this.scorelistener = fn;
        this.listenerCtx = ctx;
    },
    suspend() { // 暂停
        this.pause = true;
        clearInterval(this.time);
    },
    refreshMat() { // 执行一次矩阵刷新
        this.block.outline.forEach((o) => { // 将移动前的位置都置为-1
            if (o.i > 0 && this.matrix[o.i - 1][o.j] !== 1)
                this.matrix[o.i - 1][o.j] = -1;
        });
        this.block.outline.forEach((o) => { // 刷新移动后的位置
            if (o.i >= 0)
                this.matrix[o.i][o.j] = 0;
        });
        this.listener.call(this.listenerCtx);
    },
    rotatePoint(c, p) { // c点为旋转中心，p为旋转点，一次顺时针旋转90度。返回旋转后的坐标
        return { j: p.i - c.i + c.j, i: -p.j + c.i + c.j };
    },
    rotateBlock() {
        let i; let o = null;
        const ctr = this.block.outline[1];
        const l = this.block.outline.length;
        if (this.block.type !== 4) { // 田字形无法旋转
            for (i = 0; i < l; i++) {
                o = this.rotatePoint(ctr, this.block.outline[i]);
                if (o.j < 0 || o.j > 11 || o.i > 20) { // 旋转时不可以碰到边界
                    break;
                } else if (o.i > 0 && o.j >= 0 && o.j <= 20 && Blocks.matrix[o.i][o.j] === 1) { // 旋转时不可以已有方块的点
                    break;
                }
            }
            if (i === 4) {
                this.block.outline.forEach((o, i) => {
                    if (o.i >= 0)
                        this.matrix[o.i][o.j] = -1; // 清空变化前的位置
                    this.block.outline[i] = this.rotatePoint(ctr, o);
                });
            }
        }
    },
    setSite(dir) { // 设置左右移动后的位置
        let i; let o; const
            l = this.block.outline.length;
        for (i = 0; i < l; i++) {
            o = this.block.outline[i];
            // 是否碰到已存在的方块，是否碰到左右边界
            if (o.i >= 0 && ((Blocks.matrix[o.i][o.j + dir] === 1) || (o.j + dir === -1 || o.j + dir === 12))) {
                break; // 一旦发生碰撞，就退出循环，并不执行移动操作
            }
        }
        if (i === l) { // 当count=l时，表明移动操作没有发生碰撞
            this.block.outline.forEach((o) => {
                if (o.i >= 0) {
                    Blocks.matrix[o.i][o.j] = -1; // 将当前位置置为-1
                    o.j = (o.j + dir === -1 || o.j + dir === 12) ? o.j : o.j + dir; // 是否允许移动，允许则将o.j+dir的值赋予o.j
                    Blocks.matrix[o.i][o.j] = 0; // 刷新最新值
                } else { // 小于0时（在矩阵之外），也需进行左右移动
                    o.j = (o.j + dir === -1 || o.j + dir === 12) ? o.j : o.j + dir;
                }
            });
        }
    },
    reachBottom() {
        let i;
        let j;
        let o;
        const l = this.block.outline.length;
        if (this.block.isReady()) { // 当前方块下落帧结束时，然后进行检测是否到达了底部
            for (j = 0; j < l; j++) {
                o = this.block.outline[j];
                if (o.i >= 0 && (o.i === 20 || this.matrix[o.i + 1][o.j] === 1)) { // 向下移动时发生碰撞
                    break; // 方块到达底部或落在其他方块上，方块停止下落，产生新的方块
                }
            }
            if (j < l) { // 当方块落在底部或其他方块时，进行检测
                for (i = 0; i < l; i++) {
                    o = this.block.outline[i];
                    if (o.i >= 0) {
                        this.matrix[o.i][o.j] = 1; // 方块停止后，修改矩阵数据
                    } else {
                        this.gameOver(); // 游戏结束
                        return;
                    }
                }
                this.ruinMat(); // 检测是否需要爆破行，如果有则执行爆破操作
                this.block = new Block(parseInt(Math.random() * 5) + 1);
            }
        }
    },
    detectMat() { // 检测矩阵，判断是否有连续一行，返回一个数组
        let count = 0; let s;

        const detecta = []; // 需要爆破的行号
        this.matrix.forEach((l, i) => {
            for (s = 0; s < l.length; s++) {
                if (l[s] === 1)
                    count++; else
                    break;
            }
            count === 12 && detecta.push(i);
            count = 0;
        });
        return detecta.length === 0 ? false : detecta;
    },
    ruinMat() { // 爆破连续的一行
        let dmat = this.detectMat(); // 返回整行都有方块的行号集合
        if (dmat) {
            this.score = this.score + (dmat.length === 1 ? 100 : dmat.length === 2 ? 250 : dmat.length === 3 ? 450 : 700);  // eslint-disable-line
            //  score.innerHTML = this.score.toString();
            this.scorelistener.call(this.listenerCtx, this.score);
            dmat.forEach((d) => {
                Blocks.matrix.splice(d, 1); // 删掉整行都有方块的行
                Blocks.matrix.unshift([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]); // 弥补被删的行
            });
        }
        dmat = null;
    },
    gameOver() {
        clearInterval(this.time);
    },
};
export default Blocks;
