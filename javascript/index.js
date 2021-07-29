const buttons = [".one", ".two", ".three", ".four", ".five", ".six", ".seven", ".eight", ".nine", ".ten", ".eleven", ".twelve", ".thirteen", ".fourteen", ".fifteen", ".sixteen"];
// テーブルの定義
const raw1 = [0, 1, 2, 3];
const raw2 = [4, 5, 6, 7];
const raw3 = [8, 9, 10, 11];
const raw4 = [12, 13, 14, 15];
const column1 = [0, 4, 8, 12];
const column2 = [1, 5, 9, 13];
const column3 = [2, 6, 10, 14];
const column4 = [3, 7, 11, 15];
const raws = [raw1, raw2, raw3, raw4]
const columns = [column1, column2, column3, column4]

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝　時間計測　＝＝＝＝＝＝＝＝＝＝＝＝＝＝
let PassTime;
let PassageID = setInterval('showPassageTime()', 100);

function showPassageTime() {
    PassTime++;
    const time = (PassTime / 10).toFixed(1);
    $(".duration").text(time);
}

function startShowingTime() {
    PassTime = 0;
    PassageID = setInterval('showPassageTime()', 100);
}

function stopShowingTime() {
    clearInterval(PassageID);
}

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝　配列生成　＝＝＝＝＝＝＝＝＝＝＝＝＝＝
function intRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomIntList(min, max) {
    const randoms = [];
    for (let i = min; i <= max; i++) {
        while (true) {
            const randomInt = intRandom(min, max);
            if (!randoms.includes(randomInt)) {
                randoms.push(randomInt);
                break;
            }
        }
    }

    return randoms;
}

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝　取得系　＝＝＝＝＝＝＝＝＝＝＝＝＝＝
function getImagePassByImageID(imageID) {
    const imagePass = "image/" + imageID + ".png";
    return imagePass;
}

function getImageIDByButtonID(buttonID) {
    src = $(buttons[buttonID]).find("img").attr("src");
    if (src === undefined) {
        return null
    } else {
        const ImageID = src.replace("image/", "").replace(".png", "");
        return Number(ImageID);
    }
}

function getButtonClassByEvent(event) {
    return event.originalEvent.path[2].classList[0];
}

function getButtonIDByButtonClass(buttonClass) {
    return buttons.indexOf("." + buttonClass);
}

function getCanMoveButtonID(removedButton) {
    let up = false;
    let down = false;
    let upButtons = [];
    let downButtons = [];
    let leftButtons = [];
    let rightButtons = [];
    // 上端のとき
    if (raw1.includes(removedButton)) {
        up = true;
    }

    // 下端のとき
    if (raw4.includes(removedButton)) {
        down = true;
    }

    if (!up) {
        for (let i = 0; i < 3; i++) {
            buttonID = removedButton - 4 * (i + 1);
            if (buttonID < 0) {
                break;
            }
            upButtons.push(buttonID);
        }
    }

    if (!down) {
        for (let i = 0; i < 3; i++) {
            buttonID = removedButton + 4 * (i + 1);
            if (buttonID > 15) {
                break;
            }
            downButtons.push(buttonID);
        }
    }

    // 左端の操作
    for (let i = 0; i < 4; i++) {
        if (columns[i].includes(removedButton)) {
            for (let j = 0; j < i; j++) {
                leftButtons.push(removedButton - j - 1);
            }
        }
    }

    // 右端の操作
    for (let i = 0; i < 4; i++) {
        if (columns[i].includes(removedButton)) {
            for (let j = 0; j < 3 - i; j++) {
                rightButtons.push(removedButton + j + 1);
            }
        }
    }

    return [upButtons, downButtons, leftButtons, rightButtons]
}

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝　移動系　＝＝＝＝＝＝＝＝＝＝＝＝＝＝
function moveImages(buttonID, removedButtonID) {
    const buttonClass = buttons[buttonID];
    const removedButtonClass = buttons[removedButtonID];
    const imageID = getImageIDByButtonID(buttonID);
    $(buttonClass).find("img").attr("src","image/black.png");
    $(removedButtonClass).find("img").attr("src", getImagePassByImageID(imageID));
}

function moveRandom(number) {
    for (let j = 0; j < number; j++) {
        let canMoveButtonIDs = getCanMoveButtonID(removedButtonID);
        const buttonID = intRandom(0, 15)

        canMoveButtonIDs.forEach((canMoveButtonID) => {
            // 動かせるマスなのか判定
            if (canMoveButtonID.includes(buttonID)) {
                const moveLength = canMoveButtonID.indexOf(buttonID);
                for (let i = 0; i < moveLength + 1; i++) {
                    const targetButtonID = canMoveButtonID[i];
                    moveImages(targetButtonID, removedButtonID);
                    removedButtonID = targetButtonID;
                }
            }
        });
    }
}

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝　画面表示系　＝＝＝＝＝＝＝＝＝＝＝＝＝＝
function startGame() {
    stopShowingTime()
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    let removedButtonID = 15;

    buttons.forEach((button, i) => {
        $(button).find("img").attr("src", getImagePassByImageID(arr[i]));
    });

    let removedButtonClass = (buttons[removedButtonID]);
    const removedImageID = getImageIDByButtonID(removedButtonID);
    $(removedButtonClass).find("img").removeAttr("src");
    $("#start-game").hide();
    $("#result").hide();
    $("#answer").hide();
    $("#puzzle").show();
    $("#reset-game").show();
    $("#finish-game").show();
    $("#duration-line").show();
    startShowingTime();
    window.clickCount = 0;
    $(".click-count").text(clickCount);
    window.removedImageID = removedImageID;
    window.removedButtonID = removedButtonID;
    // ↓をコメントアウトすると初期画面に完成画像が表示される
    moveRandom(1000);
}

function resetGame() {
    $("#result").hide();
    $("#puzzle").hide();
    $("#reset-game").hide();
    $("#finish-game").hide();
    $("#duration-line").hide();
    $("#answer").show();
    $("#start-game").show();
}

function showResult() {
    stopShowingTime()
    $("#puzzle").hide();
    $("#duration-line").hide();
    $("#finish-game").hide();
    const finishTime = (PassTime / 10).toFixed(1);
    const finishClickCount = clickCount;
    $(".finish-time").text(finishTime);
    $(".finish-click-count").text(finishClickCount);
    $("#result").show();
    $(".reset-button").show();
    $("#answer").show();
}

function printIDInfo(removedButtonID, buttonID, imageID) {
    console.log("========================================");
    console.log("removedButtonID", removedButtonID);
    console.log("buttonID", buttonID);
    console.log("imageID", imageID);
}

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝　ボタン処理　＝＝＝＝＝＝＝＝＝＝＝＝＝＝
$("#start-game").click(() => {
    startGame();
});

$("#reset-game").click(() => {
    resetGame()
});

$("#finish-game").click(() => {
    let isCorrectAnswer = true;
    buttons.some((button, buttonID) => {
        // 空いてるマスはスキップ
        if (buttonID === removedImageID) {
            return false;
        }

        let imageID = getImageIDByButtonID(buttonID);
        if (buttonID !== imageID) {
            alert("不正解じゃ( *´艸｀)");
            isCorrectAnswer = false;
            return true;
        }
    });

    if (isCorrectAnswer) {
        alert("正解です！おめでとう！('ω')ノ");
        showResult()
        return false;
    }
});

$(".number-button").click((event) => {
    const target = event.target;
    if (target.tagName !== "IMG") {
        return false;
    }

    let canMoveButtonIDs = getCanMoveButtonID(removedButtonID);
    const buttonClass = getButtonClassByEvent(event);
    const buttonID = getButtonIDByButtonClass(buttonClass);

    canMoveButtonIDs.forEach((canMoveButtonID) => {
        // 動かせるマスなのか判定
        if (canMoveButtonID.includes(buttonID)) {
            const moveLength = canMoveButtonID.indexOf(buttonID);
            for (let i = 0; i < moveLength + 1; i++) {
                const targetButtonID = canMoveButtonID[i];
                moveImages(targetButtonID, removedButtonID);
                removedButtonID = targetButtonID;
            }

            clickCount++;
            return false;
        }
    });

    $(".click-count").text(clickCount);
    return false;
});