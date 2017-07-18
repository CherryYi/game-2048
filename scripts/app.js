/*
游戏规则很简单：
　　开始时棋盘内随机出现两个数字，出现的数字仅可能为2或4
　　玩家可以选择上下左右四个方向，若棋盘内的数字出现位移或合并，视为有效移动
　　玩家选择的方向上若有相同的数字则合并，每次有效移动可以同时合并，但不可以连续合并
　　合并所得的所有新生成数字想加即为该步的有效得分
　　玩家选择的方向行或列前方有空格则出现位移
　　每有效移动一步，棋盘的空位(无数字处)随机出现一个数字(依然可能为2或4)
　　棋盘被数字填满，无法进行有效移动，判负，游戏结束
　　棋盘上出现2048，判胜，游戏结束
*/
const COUNT = 4; // 行列数字个数
const fontSize = ['62px', '56px', '48px', '40px']; // 1，2，3，4位数字分别对应的字体大小
var nums = undefined; // 数字，一个二维数组nums[COUNT][COUNT]

// 初始化nums，随机出一个2或者4
var initNums = () => {
    nums = new Array(COUNT);
    for (var i = 0; i < nums.length; i++) {
        nums[i] = new Array(COUNT);
        nums[i].fill(0);
    }
    console.log(nums);
    let row = parseInt(Math.random() * 100) % COUNT;
    let col = parseInt(Math.random() * 100) % COUNT;
    nums[row][col] = Math.random() > 0.5 ? 4 : 2;

    // 测试的话，随机多填一些数字,如果完成了开发注释掉即可
    nums.forEach((a, row) => {
        a.forEach((b, col) => {
            nums[row][col] = Math.pow(2, parseInt(Math.random() * 10) + 1);
        })
    })
};

// 更新数字
var updateNums = (row, col, num) => {
    nums[row][col] = num;

    var $num = $('.' + `t${row}${col}`);
    $num.text(num > 0 ? num : '');
    $num.removeAttr('id');
    $num.attr('id', `num-${num}`);
    $num.css('font-size', fontSize[String(num).length - 1]);
}

// 将数字渲染到页面上
var paintNums = () => {
    nums.forEach((numsRow, row) => {
        numsRow.forEach((num, col) => {
            updateNums(row, col, num);
        })
    })
}

// 每进行一次操作，都随机一个2或者4到游戏里面
var randNum = () => {
    var success = false;
    var emptyPos = [];
    nums.forEach((a, row) => {
        a.forEach((b, col) => {
            if (b === 0) {
                emptyPos.push({row: row, col: col})
            }
        })
    })
    if (emptyPos.length > 0) {
        var index = parseInt(Math.random() * 100) % emptyPos.length
        var pos = emptyPos[index];
        updateNums(pos.row, pos.col, (index % 2) ? (2) : (4));
        success = true;
    } else {
        // 判断一下游戏还能不能进行操作，如果不能操作返回false
    }
    return success;
}

// 处理游戏结束状态
var gameOver = () => {}

// 按左键操作
var left = () => {
    for (let row = 0; row < COUNT; row++) {
        let merge = false;
        // 如果有数字相同，先合并
        for (let col = 0; col < COUNT - 1 && (!merge); col++) {
            let curNum = nums[row][col];
            if (curNum > 0) {
                let gap = false;
                for (let next = col + 1; next < COUNT; next++) {
                    let nextNum = nums[row][next];
                    if (curNum === nextNum && (!gap)) {
                        updateNums(row, col, curNum * 2);
                        updateNums(row, next, 0);
                        merge = true;
                        break;
                    } else {
                        gap = nextNum > 0;
                    }
                }
            }
        }
        // 合并完成，将数字掉落到正确的位置
        for (let col = 0; col < COUNT; col++) {
            let curNum = nums[row][col];
            if (curNum > 0) {
                let dropIndex = -1;
                for (let next = col - 1; next >= 0; next--) {
                    let nextNum = nums[row][next];
                    if (nextNum === 0) {
                        dropIndex = next;
                    } else {
                        break;
                    }
                }
                if (dropIndex >= 0) {
                    updateNums(row, dropIndex, curNum);
                    updateNums(row, col, 0);
                }
            }
        }
    }
}

var up = () => {
    // 向上按键逻辑
}

var right = () => {
    // 向右按键逻辑
}

var down = () => {
    // 向下按键逻辑
}

// 处理按键
document.onkeydown = (e) => {
    var f = {
        '37': left,
        '38': up,
        '39': right,
        '40': down
    };

    f[e.keyCode] && f[e.keyCode]();

    if (f[e.keyCode]) {
        if (!randNum()) {
            gameOver();
        }
    }
}

// 初始化游戏
initNums();
paintNums();
