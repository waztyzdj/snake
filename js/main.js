
// 全局变量：设置方向（默认向右移动）
let dir = 39;

// 全局变量：设置移动距离
const dist = 5;

// 全局变量：设置移动速度
let speed = 100;

// 全局变量：设置移动速度提升倍率
let speedRate = 1.25;

// 全局变量：设置每吃多少个食物则增加速度
let speedLengthUp = 1;

// 全局变量：设置起始左偏移量
const startLeft = 2 * dist;

// 全局变量：设置起始上偏移量
const startTop = 2 * dist;

// 缩放比例
const rate = 0.2;

// 全局变量：设置body宽度
const bodyWidth = parseInt(((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) * rate - 2 * dist) / dist) * dist;

// 全局变量：设置body高度
const bodyheight = parseInt(((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * rate - 2 * dist) / dist) * dist;

// 全局变量：蛇列表
const snake = [];

// 全局变量：蛇颜色
const snakeColor = "black";

// 全局变量：食物
let food;

// 全局变量：定时器
let timer;
 
window.onload = function () {
    // 设置body宽高
    document.body.style.width = bodyWidth + "px";

    document.body.style.height = bodyheight + "px";

    document.body.style.margin = (dist - 1) + "px";

    // screen.availWidth
    // 初始化一个div
    const div = init(startLeft, startTop);

    // 将div放到蛇列表中
    snake.push(div);

    // 随机位置生成食物
    food = initFood();

    // 绑定上下左右按钮事件
    document.onkeydown = function (event) {
        event = event || window.event;

        // 不能反方向移动
        if (Math.abs(event.keyCode - dir) != 2) {
            dir = event.keyCode;
        }
    };

    // 开启移动定时器
    timer = setInterval(function () {
        move();
    }, speed);
}

/**
 * @TODO 初始化一个div
 * @param {left偏移量} left 
 * @param {top偏移量} top 
 * @returns 
 */
function init(left, top) {
    let div = document.createElement("div");
    div.style.width = dist + "px";
    div.style.height = dist + "px";
    div.style.left = left + "px";
    div.style.top = top + "px";
    div.style.position = "absolute";
    div.style.backgroundColor = snakeColor;
    document.body.appendChild(div);
    return div;
}

/**
 * @TODO 随机生成食物
 */
function initFood() {
    // 随机生成位置
    let random = Math.random();
    let left = parseInt(random * bodyWidth / dist) * dist + dist;
    let top = parseInt(random * bodyheight / dist) * dist + dist;
    // 校验生成位置是否在蛇内部，如果在则重新生成

    if (isInSnake(left, top)) {
        initFood()
    }
    return init(left, top);
}

/**
 * @TODO 蛇移动算法
 */
function move() {
    // 1. 获取蛇头
    const snakeHead = snake[0];

    // 2. 计算得出蛇下一个位置
    let nextLeft = parseInt(snakeHead.style.left);
    let nextTop = parseInt(snakeHead.style.top)
    switch (dir) {
        case 38:// 上
            nextTop = nextTop - dist;
            break;
        case 40:// 下
            nextTop = nextTop + dist;
            break;
        case 37:// 左
            nextLeft = nextLeft - dist;
            break;
        case 39:// 右
            nextLeft = nextLeft + dist;
            break;
        default:
            break;
    }
    // 3. 判断是否撞墙或者撞到自己了
    if(nextLeft < 0 || nextTop < 0 || nextLeft >= bodyWidth || nextTop >= bodyheight || isInSnake(nextLeft, nextTop)) {
        clearInterval(timer);
        if(confirm("哎呀，撞到了，是否重新开始？")) {
            window.location.reload(true);
        } else {
            return;
        }
    }

    // 4. 判断食物是否在下一个位置上
    if(nextLeft == parseInt(food.style.left) && nextTop == parseInt(food.style.top)) {
        // 4.1 食物在下一个位置上
        // 4.1.1 添加食物到蛇头，并初始化下一个食物。
        snake.unshift(food);
        food = initFood();

        // 4.1.2 达到加速条件，清除定时器，并重新加速
        if(snake.length % speedLengthUp == 0) {
            clearInterval(timer);
            speed = speed / speedRate;
                // 开启移动定时器
            timer = setInterval(function () {
                move();
            }, speed);
        }

        return;
    } else {
        // 4.2 食物不在该下一个置上，将蛇尾div移动到下一个位置。
        const snakeTail = snake.pop();
        snakeTail.style.left = nextLeft + "px";
        snakeTail.style.top = nextTop + "px";
        snake.unshift(snakeTail);
    }
}

/**
 * @TODO 判断是否在自己里面
 * @param {left偏移量} left 
 * @param {top偏移量} top 
 */
function isInSnake(left, top) {
    let isInSnake = false;
    try {
        snake.forEach(function (item) {
            if (left == parseInt(item.style.left) && top == parseInt(item.style.top)) {
                isInSnake = true;
                throw '位置已被占用';
            }
        });
    } catch (error) {
    }
    return isInSnake;
}
