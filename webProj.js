// Game.processInput이 끝날 때 무조건 click, esc가 false가 되므로 주의.
// 클릭 이벤트는 processInput이 끝나기 전에 처리되야 함.
const gameInput = { left: false, right: false, click: false, space: false, esc: false };
let cursorPosition = null;
let fixedCursorPosition = null;

// 밸런스 전역변수들.......................................................................................................
// 나중에 상수여야하는 것들은 CONST 붙일것.

PLAYER_HEART = 1000;
START_COIN = 0;
PLAYER_SPD = 444;
BALL_MISS_DMG = 50;

BOX_PRICE_NORMAL = 30;
BOX_PRICE_BARRIER = 40;
BOX_PRICE_CANNON = 50;
BOX_PRICE_MACHINEGUN = 60;
BOX_PRICE_LAZER = 90;
BOX_PRICE_CORE = 150;
WAVE_CALL_BONUS = 100;

CANNON_COOL = 2000;
CANNON_ERR = 30;
CANNON_SPD = 200;
CANNON_DMG = 10;

MACHINEGUN_COOL = 3000;
MACHINEGUN_ERR = 80;
MACHINEGUN_SPD = 360;
MACHINEGUN_DMG = 7;

LAZER_COOL = 11111;
LAZER_ERR = 0;
LAZER_SPD = 100;
LAZER_DMG = 99;

MOVE_SPD_PAWN = 5;
MOVE_SPD_KNIGHT = 5;
MOVE_SPD_BISHOP = 5;
MOVE_SPD_ROOK = 5;
MOVE_SPD_QWEEN = 10;
MOVE_SPD_KING = 10;

BALL_SPD_1 = 400;
BALL_SPD_2 = 500;
BALL_SPD_3 = 600;
BALL_EXPLOTION_RAD = 29;

WAVE_DEFAULT_DIST = 300;
WAVE_DIST = 1000;

MAX_LEVEL = 3;

//상점관련함수/\.........................................................................................

function buy_maxHealth() {
    game.player.heart+=200;
    $(".heart").text(game.player.heart+"/"+(lifemax*200+1000));
}
function buy_regeneration() {
    if(game.player.heart+300>lifemax*200+1000){
        game.player.heart=lifemax*200+1000;
    }
    else{
        game.player.heart+=300;
    }
    $(".heart").text(game.player.heart+"/"+(lifemax*200+1000)); 
}
function buy_shield() {
    game.player.shieldCount+=1;
    $("#shield").text("보호막("+(3-game.player.shieldCount)+"/3)");
    if(game.player.shieldCount>=3){
        $("#shieldpurchase").text("sold out");
        $("#shieldpurchase").attr("disabled",true);
    }
}
function buy_parryCool() {
    game.player.parryingToleranceTime=Math.floor((game.player.parryingToleranceTime+0.2)*10)/10;
    $("#parring").html("패링시간<br>0.2초 증가<br>(현재: "+game.player.parryingToleranceTime+"초)");
    if(game.player.parryingToleranceTime>=1){
        $("#parringtime").text("sold out");
        $("#parringtime").attr("disabled",true);
    }
}
function buy_explodeUp() {
    explosionrange+=1;
    game.playerBall.explosionRadius+=3;
    $("#explosion").html("폭발 범위<br>증가<br>(현재:"+explosionrange+"강)");
    if(explosionrange>=4){
        $("#explosionrange").text("sold out");
        $("#explosionrange").attr("disabled",true);
    }
}
function buy_reloadCool() {
    game.playerBall.generatingDelay-=0.5;
    $("#reload").html("재장전 시간<br> 0.5초 감소<br>(현재: "+game.playerBall.generatingDelay+"초)");
    if(game.playerBall.generatingDelay<=0.5){
        $("#reloadtime").text("sold out");
        $("#reloadtime").attr("disabled",true);
    }
    
}
function buy_hidingSkill() {
    if(game.player.isHiding==false){
        $("#stealth").html("은신 기능<br>(0/1)");
        $("#stealthpurchase").text("sold out");
        $("#stealthpurchase").attr("disabled",true);
    }
    else{
        $("#stealth").html("은신 기능<br>(1/1)");
    }
}

// 이미지........................................................................................................................
var img_normalBox = new Image(); img_normalBox.src = "imgFolder/normalBox.png";
var img_cannonBox = new Image(); img_cannonBox.src = "imgFolder/cannonBox.png";
var img_machinegunBox = new Image(); img_machinegunBox.src = "imgFolder/machinegunBox.png";
var img_lazerBox = new Image(); img_lazerBox.src = "imgFolder/lazerBox.png";
var img_coreBox = new Image(); img_coreBox.src = "imgFolder/coreBox.png";
var img_barrierBox = new Image(); img_barrierBox.src = "imgFolder/barrierBox.png";

var img_pawnBody = new Image(); img_pawnBody.src = "imgFolder/pawnBody.png";
var img_knightBody = new Image(); img_knightBody.src = "imgFolder/knightBody.png";
var img_bishopBody = new Image(); img_bishopBody.src = "imgFolder/bishopBody.png";
var img_rookBody = new Image(); img_rookBody.src = "imgFolder/rookBody.png";
var img_qweenBody = new Image(); img_qweenBody.src = "imgFolder/qweenBody3.png";

var img_lazer = new Image(); img_lazer.src = "imgFolder/lazer.png";
var img_bullet = new Image(); img_bullet.src = "imgFolder/bullet.png";
var img_cannon = new Image(); img_cannon.src = "imgFolder/cannon.png";
var img_playerBall = new Image(); img_playerBall.src = "imgFolder/playerBall.png";
var img_background1 = new Image(); img_background1.src = "imgFolder/background1.png";

var img_explode1 = new Image(); img_explode1.src = "imgFolder/explode1.png";
var img_explode2 = new Image(); img_explode2.src = "imgFolder/explode2.png";
var img_explode3 = new Image(); img_explode3.src = "imgFolder/explode3.png";
var img_explode4 = new Image(); img_explode4.src = "imgFolder/explode4.png";

var img_target = new Image(); img_target.src = "imgFolder/target.png";
var img_player = new Image(); img_player.src = "imgFolder/player.png";

var img_fireR = new Image(); img_fireR.src = "imgFolder/fireR.png";
var img_fireR2 = new Image(); img_fireR2.src = "imgFolder/fireR2.png";
var img_fireL = new Image(); img_fireL.src = "imgFolder/fireL.png";
var img_fireL2 = new Image(); img_fireL2.src = "imgFolder/fireL2.png";
var img_fireD = new Image(); img_fireD.src = "imgFolder/fireD.png";
var img_fireD2 = new Image(); img_fireD2.src = "imgFolder/fireD2.png";

// 배경음악/...........................................................
const level1_bgm = new Audio("soundFolder/game1.mp3");
const level2_bgm = new Audio("soundFolder/game2.mp3");
const level3_bgm = new Audio("soundFolder/game3.mp3");

let game = null;

//온로드...................................................................
$(function () {
    const gameCanvas = $("#game-canvas");
    const infCanvas = $("#inf-canvas");

    cursorPosition = new Vector2(0, 0);
    $(document).on("mousemove", function (event) {
        cursorPosition.set(event.pageX - gameCanvas.offset().left, event.pageY - gameCanvas.offset().top);
    });

    $(document).on("mousedown", function (event) {
        gameInput.click = true;
        console.log(cursorPosition);    // 디버그 용
    });

    game = new Game(gameCanvas[0].getContext("2d"));

    shopReady();
});

$(document).on("keydown", function (event) {
    if (event.code == "KeyA") {
        gameInput.left = true;
    }
    if (event.code == "KeyD") {
        gameInput.right = true;
    }
    if (event.code == "Space") {
        gameInput.space = true;
    }
    if (event.code == "Escape") {
        gameInput.esc = true;
    }
});
$(document).on("keyup", function (event) {
    if (event.code == "KeyA") {
        gameInput.left = false;
    }
    if (event.code == "KeyD") {
        gameInput.right = false;
    }
    if (event.code == "Space") {
        gameInput.space = false;
    }
    if (event.code == "Escape") {
        gameInput.esc = false;
    }
});

const GAME_WIDTH = 500;
const GAME_HEIGHT = 700;

class Game {
    level;
    state;  // "main-menu", "paused", "game", "gameover", "gameclear"
    currentBgm;

    ctx;
    fps;
    delta;
    previousTicks;
    components;  // drawOrder로 정렬된 Component 배열.
    addList;  // 새로 생성할 Component들을 담는 배열
    removalList;  // 삭제할 Component들을 담는 배열
    collideablesWithBall;  // 플레이어의 공과 충돌 가능한 ComponentObject들
    player;
    playerArrow;
    playerBall;

    wave;
    coin;
    score;
    mobList;

    nextWaveInfo;

    buttons;

    constructor(ctx) {
        this.level = 1; // 임시
        this.startMainMenu();
        this.currentBgm = null;

        this.ctx = ctx;
        this.fps = 60;
        this.delta = 1 / this.fps;
        this.previousTicks = performance.now();
        this.components = [];
        this.addList = [];
        this.removalList = [];
        this.collideablesWithBall = [];
        this.buttons = {};
        this.loadComponents();
        this.startCountdown=this.startCountdown.bind(this);
        //setInterval(this.runLoop.bind(this), this.delta * 1000);
        requestAnimationFrame(this.runLoop.bind(this));

        this.coin = START_COIN;
        this.score = 0;

        this.nextWaveInfo = new NextWaveInfo(this);
    }

    loadComponents() {
        this.player = new Player(this);
        this.playerBall = new PlayerBall(this, this.player);
        this.playerArrow = new PlayerLaunchAngleArrow(this, this.player, this.playerBall);
        new Anime_background(this);

        let pauseScreenResumeButton = new Button(this, new Vector2(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50), 130, 50, "resume");
        pauseScreenResumeButton.setEventHandler(function () {             
            this.hidePauseScreenButtons();
            this.startCountdown(() => {
                this.state = "game";
            });
        }.bind(this));
        this.buttons["pause-resume"] = pauseScreenResumeButton;

        let pauseScreenMainmenuButton = new Button(this, new Vector2(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50), 130, 50, "main menu");
        pauseScreenMainmenuButton.setEventHandler(function () {  
            this.hidePauseScreenButtons();
            this.startMainMenu();
         }.bind(this));
        this.buttons["pause-mainmenu"] = pauseScreenMainmenuButton;

        let gameEndMainmenuButton = new Button(this, new Vector2(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50), 130, 50, "main menu");
        gameEndMainmenuButton.setEventHandler(function () { this.game.startMainMenu(); });
        this.buttons["gameend-mainmenu"] = gameEndMainmenuButton;
    }

    startMainMenu() {
        this.state = "main-menu";
        $("#game-section").hide();
        $("#main-menu-section").show();
        this.stopBgm();

        this.coin = START_COIN;
        this.heart = PLAYER_HEART;
        this.score = 0;

        $(".heart").text(PLAYER_HEART + "/" + PLAYER_HEART);
        $(".money").text(START_COIN + "g");
        $(".score").text("score:" + 0);
    }

    startGame(level) {
        this.state = "game";
        this.level = level;
        $("#main-menu-section").hide();
        $("#game-section").show();
        this.levelStarter(level);
    }

    pauseGame() {
        this.state = "paused";
        this.buttons["pause-resume"].isActive = true;
        this.buttons["pause-mainmenu"].isActive = true;
        this.buttons["pause-resume"].visible = true;
        this.buttons["pause-mainmenu"].visible = true;
        $("#game-canvas").removeClass("hide_cursor");
    }

    resumeGame() {
        this.state = "game";
        this.buttons["pause-resume"].isActive = false;
        this.buttons["pause-mainmenu"].isActive = false;
        $("#game-canvas").addClass("hide_cursor");
    }

    processInput() {
        if (this.state == "game") {
            this.player.processInput();
            if (gameInput.esc){
                this.pauseGame();
            }
        }
        else if (this.state == "paused") {
            if (gameInput.esc){
                this.startCountdown(() => {
                    this.resumeGame();
                });
            }
        }
        for (let key in this.buttons) {
            this.buttons[key].processInput();
        }
        gameInput.click = gameInput.esc = false;
    }

    updateGame(timestamp) {
        this.delta = (timestamp - this.previousTicks) / 1000;
        if (this.delta > 0.05)
            this.delta = 0.05;
        this.previousTicks = timestamp;

        this.doAdd();
        if (this.state == "game" || this.state == "gameover" || this.state == "gameclear") {
            for (let component of this.components) {
                component.update(this.delta);
            }

            this.tryWaveCall();

            this.doRemoval();
        }
    }
    generateOutput() {
        this.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        for (let component of this.components) {
            component.draw(this.ctx);
        }
    }

    runLoop(timestamp) {
        requestAnimationFrame(this.runLoop.bind(this));
        if (this.state != "main-menu") {
            this.processInput();
            this.updateGame(timestamp);
            this.generateOutput();
        }
    }

    // components에 component를 정렬을 유지하며 추가
    addComponent(component) {
        this.addList.push(component);
    }

    // drawOrder가 Component의 자식 생성자에서 수정되었을 수 있으므로,
    // 수정 이후의 drawOrder 값을 반영할 수 있도록
    // components에 바로 추가하지 않고, addList에 추가한 뒤 doAdd()에서 components에 추가.
    doAdd() {
        for (let component of this.addList) {
            let insertionIndex = this.components.findIndex(function (element) {
                if (component.getDrawOrder() <= element.getDrawOrder())
                    return true;
                return false;
            });
            if (insertionIndex == -1) {
                this.components.push(component);
            } else {
                this.components.splice(insertionIndex, 0, component);
            }
        }
        this.addList = [];
    }

    // 실제로는 removalList에 component를 추가하는 역할
    removeComponent(component) {
        this.removalList.push(component);
    }

    // components 에서 removalList의 component들을 빈 공간이 생기지 않게 삭제.
    doRemoval() {
        for (let component of this.removalList) {
            let removeIndex = this.components.indexOf(component);
            if (removeIndex == -1)
                console.error("Game removeComponent() : 배열에 지우려는 component가 없습니다.");
            else
                this.components.splice(removeIndex, 1);

            removeIndex = this.collideablesWithBall.indexOf(component);
            if (removeIndex != -1)
                this.collideablesWithBall.splice(removeIndex, 1);
        }
        this.removalList = [];
    }

    initGame() {
        // 버튼 초기화
        for (let key in this.buttons) {
            this.buttons[key].isActive = false;
        }

        $("#game-canvas").addClass("hide_cursor");

        //플레이어 상태 초기화
        this.player.position.x = GAME_WIDTH / 2;
        this.player.isBroken = false;

        //공 상태 초기화
        this.playerBall.init();

        //몹 초기화
        this.mobList = [];

        // 이전 게임에 남아있던 불필요한 componet 제거
        this.trashComponentClear();
    }

    trashComponentClear() {
        for (let comp of this.components) {
            if (comp instanceof Box || comp instanceof Mob || comp instanceof Attacks
                || comp instanceof Message || comp instanceof VariableMessage)
                this.removeComponent(comp);
        }
        this.doRemoval();
    }

    levelStarter(level) { // 코어가 부서질 때 레벨을 올릴지 판단할 것.
        this.initGame();

        switch (level) {
            // wave * WAVE_DISTANCE가 다음 웨이브 몬스터의 요구 이동 거리
            case 1:
                this.wave = 0;
                this.mobList.push(new Mob_pawn(this, new Vector2(100, 200)));
                this.mobList.push(new Mob_pawn(this, new Vector2(250, 200)));
                this.mobList.push(new Mob_pawn(this, new Vector2(400, 200)));
                this.mobList.push(new Mob_knight(this, new Vector2(250, 80)));

                this.wave = 6;
                this.mobList.push(new Mob_knight(this, new Vector2(250, 80)));
                this.mobList.push(new Mob_knight(this, new Vector2(150, 180)));
                this.mobList.push(new Mob_knight(this, new Vector2(350, 180)));

                this.wave = 12;
                this.mobList.push(new Mob_pawn(this, new Vector2(50, 100)));
                this.mobList.push(new Mob_pawn(this, new Vector2(50, 200)));
                this.mobList.push(new Mob_pawn(this, new Vector2(450, 100)));
                this.mobList.push(new Mob_pawn(this, new Vector2(450, 200)));
                this.mobList.push(new Mob_bishop(this, new Vector2(250, 80)));

                this.playBgm("level1_bgm");
                break;

            case 2:
                this.wave = 0;
                this.mobList.push(new Mob_pawn(this, new Vector2(50, 100)));
                this.mobList.push(new Mob_pawn(this, new Vector2(250, 300)));
                this.mobList.push(new Mob_pawn(this, new Vector2(450, 100)));
                this.mobList.push(new Mob_rook(this, new Vector2(100, 300)));
                this.mobList.push(new Mob_rook(this, new Vector2(400, 300)));
                this.mobList.push(new Mob_bishop(this, new Vector2(250, 100)));

                this.playBgm("level2_bgm");
                break;

            case 3:
                this.wave = 0;
                this.mobList.push(new Mob_qween(this, new Vector2(250, -650)));

                this.playBgm("level3_bgm");
                break;

            default:
                console.err("잘못된 레벨...");
        }

    }

    playBgm(bgmName) {
        this.stopBgm();
        switch (bgmName) {
            case "level1_bgm":
                this.currentBgm = level1_bgm;
                break;
            case "level2_bgm":
                this.currentBgm = level2_bgm;
                break;
            case "level3_bgm":
                this.currentBgm = level3_bgm;
                break;
        }
        if (bgmName == null) {
            console.error("playBgm() : 존재하지 않는 bgm입니다.");
            console.trace();
            return;
        }
        this.currentBgm.currentTime = 0;
        this.currentBgm.loop = true;
        this.currentBgm.play();
    }

    stopBgm() {
        if (this.currentBgm != null) {
            this.currentBgm.pause();
            this.currentBgm = null;
        }
    }

    getMostFrontMob() {
        if (this.mobList.length == 0) return null;
        let frontest = this.mobList[0];
        for (let mob of this.mobList) {
            if (mob.position.y > frontest.position.y) frontest = mob;
        }
        return frontest;
    }

    tryWaveCall() {
        if (gameInput.space) {
            for (let mob of this.mobList) {
                if (mob.frontestBox.position.y > -WAVE_DEFAULT_DIST)
                    return;
            }

            let frontest = this.getMostFrontMob();
            if (frontest != null) {
                for (let mob of this.mobList) {
                    if (mob != frontest)
                        mob.position.y -= frontest.position.y + WAVE_DEFAULT_DIST;
                }
                frontest.position.y -= frontest.position.y + WAVE_DEFAULT_DIST;
                this.addScore(WAVE_CALL_BONUS * Math.floor(this.nextWaveInfo.leftTime));
            }
        }
    }

    checkLevelUp() {
        if (this.mobList.length == 0) {
            //레벨 클리어
            this.stopBgm();
            let gameclear_mp3 = new Audio("soundFolder/gameclear.mp3");
            gameclear_mp3.play();
            if (this.level == MAX_LEVEL) {
                this.gameEnd("win");
            } else {
                //레벨 업
                console.log("lvup");

                this.level++;
                let levelUpMessage = new Message(this, "LEVEL UP!", new Vector2(GAME_WIDTH / 2, GAME_HEIGHT / 2));
                setTimeout(() => {
                    this.levelStarter(this.level);
                    this.removeComponent(levelUpMessage);
                }, 5000)
                //setTimeout(function () { this.levelStarter(this.level) }.bind(this), 2000);
            }
        }
    }

    addCoin(toAddCoin) {
        console.log("coin : " + (this.coin += toAddCoin) + "(+" + toAddCoin + ")");
        if(this.coin>=1000){
            $(".money").text(Math.floor(this.coin/1000)+"kg");
        }
        else{
            $(".money").text(this.coin+"g");
        }
        this.addScore(toAddCoin);
    }

    addScore(toAddScore) {
        console.log("score : " + (this.score += 10 * toAddScore) + "(+" + 10 * toAddScore + ")");
        if(this.score>=1000){
            $(".score").text("score:"+Math.floor(this.score/1000)+"k");
        }
        else{
            $(".score").text("score:"+this.score);
        }
    }

    selectBall(ballNum) {
        this.playerBall.removeSkill();
        switch (ballNum) {
            case 0:
                this.playerBall.ball_id = null;
                break;
            case 1:
                this.playerBall.ball_id = new BallSkill_1(this, this.playerBall);
                break;
            case 2:
                this.playerBall.ball_id = new BallSkill_2(this, this.playerBall);
                break;
        }
    }

    gameEnd(winLose) {
        switch (winLose) {
            case "win":
                this.state = "gameclear";
                console.log("win");
                this.trashComponentClear();
                let clearText = new Message(this, "GAME CLEAR!", new Vector2(GAME_WIDTH / 2, GAME_HEIGHT / 2));

                setTimeout(() => {
                    this.removeComponent(clearText);
                    new VariableMessage(this, function () { return "SCORE : " + this.game.score; }, new Vector2(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 70));
                    this.buttons["gameend-mainmenu"].isActive = true;
                    $("#game-canvas").removeClass("hide_cursor");
                }, 5000);
                break;

            case "lose":
                this.state = "gameover";
                console.log("lose");
                let gameOverText = new Message(this, "GAME OVER", new Vector2(GAME_WIDTH / 2, GAME_HEIGHT / 2));
                setTimeout(() => {
                    this.player.isBroken = true;
                }, 3000);
                setTimeout(() => {
                    console.log(gameOverText);
                    this.removeComponent(gameOverText);
                    new VariableMessage(this, function () { return "SCORE : " + this.game.score; }, new Vector2(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 70));
                    this.buttons["gameend-mainmenu"].isActive = true;
                    $("#game-canvas").removeClass("hide_cursor");
                }, 5000)
                new Anime_BrokenPlayer(this, this.player);

                Box.attackAble = false;
                for (let mob of this.mobList) {
                    mob.leastSpeed = new Vector2(0, 100);
                }

                break;
        }
    }
    startCountdown(callback) {
        for (let key in this.buttons) {
            this.buttons[key].visible = false;
        }

        let countdown = 3;
        const countdownElement = document.createElement('div');
        countdownElement.id = 'countdown';

        const gameCanvas = document.getElementById("game-canvas");
        const canvasRect = gameCanvas.getBoundingClientRect();

        countdownElement.style.position = 'absolute';
        countdownElement.style.top = `${canvasRect.top + canvasRect.height / 2}px`;
        countdownElement.style.left = `${canvasRect.left + canvasRect.width / 2}px`;
        countdownElement.style.transform = 'translate(-50%, -50%)';
        countdownElement.style.color = 'white';
        countdownElement.style.fontSize = '80px';
        countdownElement.style.zIndex = '1000';
        countdownElement.innerHTML = countdown;
        document.body.appendChild(countdownElement);

        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                countdownElement.innerHTML = countdown;
            } else {
                clearInterval(interval);
                document.body.removeChild(countdownElement);
                callback();
            }
        }, 1000);
    }
    showPauseScreenButtons() {
            this.buttons["pause-resume"].visible=true;
            this.buttons["pause-mainmenu"].visible=true; 
    }

    hidePauseScreenButtons() {
            this.buttons["pause-resume"].visible=false;
            this.buttons["pause-mainmenu"].visible=false;
    }

}

class Component {
    game;
    position;
    drawOrder;
    tmpTick;
    constructor(game) {
        this.game = game;
        this.drawOrder = 50;
        this.position = new Vector2(0, 0);
        game.addComponent(this);
        this.tmpTick = this.game.previousTicks;
    }
    update(delta) {
    }
    draw(ctx) {
    }

    getPosition() {
        return Vector2.copy(this.position);
    }
    setPosition(vector2) {
        this.position = Vector2.copy(vector2);
    }

    getDrawOrder() {
        return this.drawOrder;
    }
    setDrawOrder(drawOrder) {
        this.drawOrder = drawOrder;
    }
}

class ComponentObject extends Component {
    speed;
    shape;
    constructor(game) {
        super(game);
        this.speed = new Vector2(0, 0);
    }

    update(delta) {
        this.position.plus(Vector2.multiply(this.speed, delta));
        this.updateShape();
    }

    updateShape() { }

    getSpeed() {
        return Vector2.copy(this.speed);
    }
    setSpeed(vector2) {
        this.speed = Vector2.copy(vector2);
    }

    processCollision(collisionInfo) {
    }

    static checkCollision(object1, object2) {
        if (object1.shape instanceof ShapeCircle) {
            if (object2.shape instanceof ShapeAABB) {
                let collisionInfo = object1.shape.getCollisionInfo(object2.shape);
                if (collisionInfo[0].isCollided) {
                    object2.processCollision(collisionInfo[1]);
                    object1.processCollision(collisionInfo[0]);
                }
            }
        }
    }
}

class Button extends Component {
    width;
    height;
    text;
    hover;
    eventHandler;
    isActive;
    visible;

    constructor(game, position, width, height, text) {
        super(game, 101);
        this.position.copyFrom(position);
        this.drawOrder = 101;
        this.width = width;
        this.height = height;
        this.text = text;
        this.hover = false;
        this.eventHandler = null;
        this.isActive = false;
        this.visible=false;
    }

    setEventHandler(eventHandler) {
        this.eventHandler = eventHandler;
    }

    processInput() {
        if (!this.isActive||!this.visible)
            return;

        if (this.position.x - this.width / 2 <= cursorPosition.x && cursorPosition.x <= this.position.x + this.width / 2
            && this.position.y - this.height / 2 <= cursorPosition.y && cursorPosition.y <= this.position.y + this.height / 2)
            this.hover = true;
        else
            this.hover = false;

        if (gameInput.click && this.hover) {
            this.eventHandler();
        }
    }

    draw(ctx) {
        if (!this.visible)
            return;

        ctx.save();

        if (this.hover) {
            ctx.fillStyle = "black";
            ctx.strokeStyle = "white"
            ctx.lineWidth = 5;
            ctx.strokeRect(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height)
        }
        else
            ctx.fillStyle = "lightgray";
        ctx.fillRect(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);


        if (this.hover)
            ctx.fillStyle = "white";
        else
            ctx.fillStyle = "black";
        ctx.font = "20px Silkscreen";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.position.x, this.position.y, this.width);

        ctx.restore();
    }
}

class Message extends Component {
    text;

    constructor(game, text, position) {
        super(game);
        this.text = text;
        this.position = position;
    }

    draw(ctx) {
        ctx.save();

        ctx.fillStyle = "white";
        ctx.font = "50px Silkscreen";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.position.x, this.position.y);

        ctx.restore();
    }
}

class VariableMessage extends Component {
    getMessage;

    constructor(game, getMessage, position) {
        super(game);
        this.getMessage = getMessage;
        this.position = position;
    }

    draw(ctx) {
        ctx.save();

        ctx.fillStyle = "white";
        ctx.font = "50px Silkscreen";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.getMessage(), this.position.x, this.position.y);

        ctx.restore();
    }
}


class Player extends ComponentObject {
    width;
    height;
    maxSpeed;
    launchDirection;
    radianLimit
    heart
    parryingCoolTime;  // 패링 쿨타임은 parryingCoolTime과 leftTimeForNextParrying으로 관리
    leftTimeForNextParrying;
    isParrying;
    parryingToleranceTime;  // 충돌 이벤트 전후로 parringToleranceTime / 2 초 동안은 패링으로 쳐줌
    leftParryingPersistTime;
    isHiding;  // 은신 스킬이 활성화 되어있는지
    shieldCount;
    shield;
    isBroken;  // 게임 오버되어 플레이어 캐릭터가 부서졌는가
    constructor(game) {
        super(game);
        this.drawOrder = 90;
        this.width = 81;
        this.height = 9;
        this.maxSpeed = PLAYER_SPD;
        this.launchDirection = new Vector2(0, -1);
        this.radianLimit = Math.PI / 6;
        this.heart = PLAYER_HEART;
        this.isHiding = false;
        this.shieldCount = 3;
        this.isBroken = false;

        this.shield = new PlayerShield(this.game, this);

        // 공 패링 관련
        this.parryingCoolTime = 0.5;
        this.leftTimeForNextParrying = 0;
        this.isParrying = false;
        this.parryingToleranceTime = 0.2;
        this.leftParryingPersistTime = 0;

        this.position.set(GAME_WIDTH / 2, GAME_HEIGHT - this.height / 2 - 10);
        this.shape = new ShapeAABB(this, new Vector2(), new Vector2());
        game.collideablesWithBall.push(this);
    }

    processInput() {
        if (gameInput.left && 0 < this.position.x) {
            this.speed.set(-this.maxSpeed, 0);
        } else if (gameInput.right && this.position.x < GAME_WIDTH) {
            this.speed.set(this.maxSpeed, 0);
        } else {
            this.speed.set(0, 0);
        }
        this.fixCursorPosition();

        if (gameInput.click && this.leftTimeForNextParrying <= 0) {
            new Anime_rectAct(this.game, this, 4, 700, "lightGreen");
            this.isParrying = true;
            this.leftTimeForNextParrying = this.parryingCoolTime;
            // 나누기 2하는 이유는, parringToleranceTime을 충돌 이벤트 전후로 나눠서 적용하기 위함.
            this.leftParryingPersistTime = this.parryingToleranceTime / 2;
            // 충돌 이벤트 전에 발생한 패링 이벤트 허용은 Player에서, 이후에 발생한 패링은 PlayerBall에서 처리.
        }
    }

    update(delta) {
        if (this.game.state == "gameover") return;
        this.processParrying(delta);
        super.update(delta);
    }

    processShield() {
        new Anime_rectAct(this.game, this, 4, 500, "lightBlue");
        this.shieldCount--;
    }

    processParrying(delta) {
        if (this.leftTimeForNextParrying > 0)
            this.leftTimeForNextParrying -= delta;

        if (this.leftParryingPersistTime > 0)
            this.leftParryingPersistTime -= delta;
        else if (this.isParrying)
            this.isParrying = false;
    }

    updateShape() {
        let widthHeightHalf = new Vector2(this.width / 2, this.height / 2);
        this.shape.min = Vector2.subtract(this.position, widthHeightHalf);
        this.shape.max = Vector2.plus(this.position, widthHeightHalf);
    }

    fixCursorPosition() {
        let vectorToCursor = Vector2.subtract(cursorPosition, this.position);
        let length = vectorToCursor.getLength();

        let radian = vectorToCursor.toRadian();
        if (-this.radianLimit < radian && radian < Math.PI / 2)
            radian = -this.radianLimit;
        if (Math.PI / 2 < radian || radian < this.radianLimit - Math.PI)
            radian = this.radianLimit - Math.PI;

        vectorToCursor = Vector2.fromRadian(radian).setLength(length);
        fixedCursorPosition = this.moveVectorToCursorInsideCanvas(vectorToCursor.plus(this.position));
    }

    moveVectorToCursorInsideCanvas(cursorPositionParam) {
        if (cursorPositionParam.x < 0)
            cursorPositionParam.x = 0;
        if (GAME_WIDTH < cursorPositionParam.x)
            cursorPositionParam.x = GAME_WIDTH;
        if (cursorPositionParam.y < 0)
            cursorPositionParam.y = 0;
        return cursorPositionParam;
    }

    playerHurt(dmg) {
        if (this.heart <= 0) return;

        console.log("heart : " + (this.heart -= dmg) + "(-" + dmg + ")");
        if(this.heart<0){
            $(".heart").text("0/"+(lifemax*200+1000));
        }
        else{
            $(".heart").text(this.heart+"/"+(lifemax*200+1000));
        }
        if (this.heart <= 0) {
            this.game.gameEnd("lose");
        }
    }

    draw(ctx) {
        if (this.isBroken) return;

        ctx.save();
        if (this.isHiding) ctx.globalAlpha = 0.5;

        ctx.drawImage(img_player, this.position.x - 46.5, this.position.y - 10.5);
        if (this.game.previousTicks % 100 > 50) {
            if (this.speed.x < 0) { ctx.drawImage(img_fireL, this.position.x - 10.5 + 60, this.position.y - 7.5); }
            else if (this.speed.x > 0) { ctx.drawImage(img_fireR, this.position.x - 10.5 - 60, this.position.y - 7.5); }
        }
        else {
            if (this.speed.x < 0) { ctx.drawImage(img_fireL2, this.position.x - 10.5 + 60, this.position.y - 7.5); }
            else if (this.speed.x > 0) { ctx.drawImage(img_fireR2, this.position.x - 10.5 - 60, this.position.y - 7.5); }
        }

        if (this.isParrying) {
            //
        }

        ctx.restore();
    }
}

class PlayerShield extends ComponentObject {
    player;
    shieldCount;
    theta;
    theta2;
    theta3;
    orbitRad;
    radius;
    constructor(game, player) {
        super(game);
        this.player = player;
        this.theta = 0
        this.orbitRad = 5;
        this.radius = 2;
        this.drawOrder = 99;
    }

    update(delta) {
        this.position = Vector2.plus(this.player.position, new Vector2(40, -20));
        this.shieldCount = this.player.shieldCount;

        super.update(delta);
        this.theta += 6 * Math.PI / 180;

        if (this.theta == Math.PI * 2) this.theta = 0;

        this.theta2 = this.theta + 120 * Math.PI / 180;
        this.theta3 = this.theta + 240 * Math.PI / 180;
    }

    draw(ctx) {
        ctx.strokeStyle = "lightBlue";
        ctx.fillStyle = 'lightBlue';

        switch (this.shieldCount) {
            case 3:
                ctx.beginPath();
                ctx.arc(this.position.x + Math.sin(this.theta) * this.orbitRad, this.position.y + Math.cos(this.theta) * this.orbitRad, this.radius, 0, Math.PI * 2, false);
                ctx.stroke();
                ctx.fill();
            case 2:
                ctx.beginPath();
                ctx.arc(this.position.x + Math.sin(this.theta2) * this.orbitRad, this.position.y + Math.cos(this.theta2) * this.orbitRad, this.radius, 0, Math.PI * 2, false);
                ctx.stroke();
                ctx.fill();
            case 1:
                ctx.beginPath();
                ctx.arc(this.position.x + Math.sin(this.theta3) * this.orbitRad, this.position.y + Math.cos(this.theta3) * this.orbitRad, this.radius, 0, Math.PI * 2, false);
                ctx.stroke();
                ctx.fill();
            case 0:
                break;

        }
    }
}

class PlayerBall extends ComponentObject {
    player;
    radius;
    explosionRadius;  // 강화된 공이 충돌 시 근처 블록을 부수는 범위.
    state;  // "generating", "normal", "reinforcing", "reinforced"
    generatingDelay;
    leftTimeForGenerating;
    opacity;
    launchSpeed;
    launchSpeedList;  // 공의 상태에 따라 정해질 발사 속도 리스트
    parryingCount;
    parryingCheckTimeLeft;  // 플레이어가 충돌 이벤트 발생 이후에 클릭한 경우 패링을 검사하기 위한 필드.
    ignoreCollideWithPlayer;  // 플레이어와 충돌한 뒤에 일정 시간동안 플레이어와 충돌하지 않도록 함.
    // 공이 플레이어와 부딪힌 뒤 몇 개의 블럭을 부수었는지 기록. 일정 개수 이상의 블록을 부수면 강화됨.
    // 주의 : 강화되는 순간 brokenBlockCount는 0으로 초기화됨. 따라서 실제 부순 블록 개수와는 달라질 수 있음.
    brokenBlockCount;

    ball_id;

    constructor(game, player) {
        super(game);
        this.player = player;
        this.drawOrder = 91;
        this.radius = 10;
        this.explosionRadius = BALL_EXPLOTION_RAD;
        this.generatingDelay = 2;
        this.launchSpeedList = [BALL_SPD_1, BALL_SPD_2, BALL_SPD_3];
        this.launchSpeed = this.launchSpeedList[0];
        this.ball_id = null;

        this.init();
    }

    init() {
        this.position.set(this.player.position.x, this.player.position.y + this.radius + this.player.height / 2);
        this.shape = new ShapeCircle(this, this.position, this.radius);
        this.speed.set(0, 0);
        this.ignoreCollideWithPlayer = false;
        this.state = "generating";
        this.leftTimeForGenerating = this.generatingDelay;
        this.opacity = 0;
        this.parryingCount = 0;
        this.parryingCheckTimeLeft = 0;
        this.brokenBlockCount = 0;
    }

    update(delta) {
        if (this.game.state == "gameover" || this.game.state == "gameclear") return;

        if (this.state == "generating") {
            this.leftTimeForGenerating -= delta;
            if (this.leftTimeForGenerating < 0)
                this.leftTimeForGenerating = 0;

            this.opacity = 1 - this.leftTimeForGenerating / this.generatingDelay;
            this.position.set(this.player.position.x, this.player.position.y - this.radius - this.player.height / 2);
            if (this.leftTimeForGenerating == 0) {
                this.setState("normal");
            }

        } else {
            this.checkParryingAfterCollision(delta);
            this.checkWallCollision();
            for (let collideable of this.game.collideablesWithBall) {
                if (this.game.components.indexOf(collideable) >= 0)
                    ComponentObject.checkCollision(this, collideable);
            }

            this.checkBallMissed();
        }

        super.update(delta);

        // 플레이어와의 충돌 무효 시간 해제
        if (this.ignoreCollideWithPlayer && this.game.player.height / 2 + this.radius < this.game.player.position.y - this.position.y) {
            this.ignoreCollideWithPlayer = false;
        }
    }

    updateShape() {
        this.shape.position = Vector2.copy(this.position);
    }

    checkWallCollision() {
        if (this.position.x <= this.radius) {  // 왼쪽 벽
            this.processCollision(new CollisionInfo(true, "left", "wall"));
        }
        else if (GAME_WIDTH - this.position.x <= this.radius) {  // 오른쪽 벽
            this.processCollision(new CollisionInfo(true, "right", "wall"));
        }
        if (this.position.y <= this.radius) {  // 위쪽 벽과 충돌
            this.processCollision(new CollisionInfo(true, "up", "wall"));
        }
    }

    processCollision(collisionInfo) {
        if (collisionInfo.component instanceof Player) {
            this.collideWithPlayer();
        } else if (collisionInfo.component instanceof Mob || collisionInfo.component == "wall") {
            let collisionPoint = Vector2.copy(this.position);

            if (collisionInfo.nearestPoint == "left" && this.speed.x < 0) {
                this.speed.x *= -1;
                collisionPoint.x -= this.radius;
            } else if (collisionInfo.nearestPoint == "right" && this.speed.x > 0) {
                this.speed.x *= -1;
                collisionPoint.x += this.radius;
            } if (collisionInfo.nearestPoint == "up" && this.speed.y < 0) {
                this.speed.y *= -1;
                collisionPoint.y -= this.radius;
            } else if (collisionInfo.nearestPoint == "down" && this.speed.y > 0) {
                this.speed.y *= -1;
                collisionPoint.y += this.radius;
            }

            if (collisionInfo.component instanceof Mob) {
                this.addBrokenBlockCount();
                if (this.state == "reinforced") {
                    new PlayerBallExplosion(this.game, collisionPoint, this.explosionRadius);
                }
            }
        }
    }

    collideWithPlayer() {
        if (this.ignoreCollideWithPlayer)
            return;

        let jump_mp3 = new Audio("soundFolder/jump.mp3");
        jump_mp3.play();
        this.brokenBlockCount = 0;
        let launchDirection = Vector2.subtract(fixedCursorPosition, this.position);
        launchDirection.setLength(this.launchSpeed);
        this.setSpeed(launchDirection);
        this.updateParrying();
        this.ignoreCollideWithPlayer = true;
    }

    removeSkill() {
        if (this.ball_id != null)
            this.game.removeComponent(this.ball_id);

        if (this.ball_id instanceof BallSkill_2) {
            this.ball_id.comboReset();
        }
    }

    updateParrying() {
        if (this.game.player.isParrying) {
            this.parryingSuccess();
        } else {
            // 충돌 이후 발생한 클릭을 검출하기 위함.
            this.parryingCheckTimeLeft = this.game.player.parryingToleranceTime / 2;
        }
    }

    parryingSuccess() {
        this.parryingCount++;
        if (this.parryingCount == 1)
            this.setState("reinforcing");
        else if (this.parryingCount == 2)
            this.setState("reinforced");

        if (this.ball_id instanceof BallSkill_2) {
            this.ball_id.comboUp();
        }
    }

    parryingFailed() {
        if (this.parryingCount >= 2)
            this.parryingCount = 1;
        else
            this.parryingCount = 0;

        if (this.parryingCount == 1)
            this.setState("reinforcing");
        else if (this.parryingCount == 0)
            this.setState("normal");

        if (this.ball_id instanceof BallSkill_2) {
            this.ball_id.comboReset();
        }
    }

    checkParryingAfterCollision(delta) {
        if (this.parryingCheckTimeLeft > 0) {
            this.parryingCheckTimeLeft -= delta;

            if (this.game.player.isParrying) {
                this.parryingSuccess();
                this.parryingCheckTimeLeft = 0;
            } else if (this.parryingCheckTimeLeft <= 0) {
                this.parryingFailed();
            }
        }
    }

    // generating으로 바꿀 때는 사용되지 않음. generating으로 바꾸려면 init() 사용.
    setState(state) {
        this.state = state;
        switch (state) {
            case "normal":
                this.launchSpeed = this.launchSpeedList[0];
                break;
            case "reinforcing":
                this.launchSpeed = this.launchSpeedList[1];
                break;
            case "reinforced":
                this.launchSpeed = this.launchSpeedList[2];
                break;
        }
        if (this.speed.getLength() != 0)
            this.speed.setLength(this.launchSpeed);
    }

    // normal 상태일 때 블럭 5개를 부수면 reinforcing 상태가 됨. brokenBlockCount는 0으로 초기화.
    // reinforcing 상태일 때 블럭 8개를 부수면 reinforced 상태가 됨. brokenBlockCount는 0으로 초기화.
    addBrokenBlockCount() {
        this.brokenBlockCount++;
        if (this.brokenBlockCount >= 5 && this.state == "normal") {
            this.setState("reinforcing");
            this.brokenBlockCount = 0;
        } else if (this.brokenBlockCount >= 10 && this.state == "reinforcing") {
            this.setState("reinforced");
            this.brokenBlockCount = 0;
        }
    }

    checkBallMissed() {
        if (this.position.y >= this.radius + GAME_HEIGHT) {  // 공 놓침
            this.player.playerHurt(BALL_MISS_DMG);
            this.init();
        }
    }

    draw(ctx) {
        if (this.game.state == "gameover" || this.game.state == "gameclear") return;

        ctx.save();

        ctx.globalAlpha = this.opacity;
        ctx.drawImage(img_playerBall, this.position.x - 30, this.position.y - 30);
        ctx.globalAlpha = 1;

        if (this.state == "reinforcing") {

            if (this.game.previousTicks > this.tmpTick + 200) {
                new Anime_circleAct(this.game, this, 0, this.explosionRadius * 20, "green");
                this.tmpTick = this.game.previousTicks;
            }
        } else if (this.state == "reinforced") {

            if (this.game.previousTicks > this.tmpTick + 100) {
                new Anime_circleAct(this.game, this, 0, this.explosionRadius * 20, "green");
                this.tmpTick = this.game.previousTicks;
            }
        }
        ctx.restore();
    }

}

//위성
class BallSkill_1 extends ComponentObject {
    playerBall;
    theta;
    orbitRad;
    radius;
    clockwise;
    dirChangeCool;

    constructor(game, playerBall) {
        super(game);
        this.playerBall = playerBall;
        this.theta = 0
        this.orbitRad = 40;
        this.radius = 5;
        this.drawOrder = 99;
        this.clockwise = 1;
        this.dirChangeCool = 0;

        this.shape = new ShapeCircle(this, this.position, this.radius);
    }

    processCollision(collisionInfo) {
        if (collisionInfo.component instanceof Mob && this.dirChangeCool == 0) {
            this.clockwise *= -1;
            this.dirChangeCool = 10;
            new Anime_circleAct(this.game, this, 0, 600, "lightGreen");
            //this.playerBall.addBrokenBlockCount(); // 이건써야하는지 몰라서 내비둠.
        }
    }

    update(delta) {
        this.position = new Vector2(this.playerBall.position.x + Math.sin(this.theta) * this.orbitRad, this.playerBall.position.y + Math.cos(this.theta) * this.orbitRad)
        super.update(delta);
        this.updateShape();
        this.theta += 6 * Math.PI / 180 * this.clockwise;

        if (this.theta == Math.PI * 2) this.theta = 0;

        if (this.dirChangeCool > 0) this.dirChangeCool--;

        for (let collideable of this.game.collideablesWithBall) {
            if (this.game.components.indexOf(collideable) >= 0) {
                ComponentObject.checkCollision(this, collideable);
            }

        }
    }

    updateShape() {
        this.shape.position = Vector2.copy(this.position);
    }

    draw(ctx) {
        ctx.strokeStyle = "lightGreen";
        ctx.fillStyle = 'lightGreen';

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.playerBall.position.x, this.playerBall.position.y, this.orbitRad, 0, Math.PI * 2, false);
        ctx.stroke();
    }
}

//판정 강화
class BallSkill_2 extends ComponentObject {
    playerBall;
    combo;
    sizeScalar;
    sizseScalarDefault;
    comboDiff;

    constructor(game, playerBall) {
        super(game);
        this.playerBall = playerBall;
        this.combo = 0;
        this.drawOrder = 99;
        this.sizseScalarDefault = 7;
        this.sizeScaler = this.sizseScalarDefault;
        this.comboDiff = 0.85;
    }

    comboUp() {
        this.combo += this.sizeScalar;
        this.sizeScalar *= this.comboDiff;
        this.playerBall.shape = new ShapeCircle(this.playerBall, this.playerBall.position, this.playerBall.radius + this.combo);
    }

    comboReset() {
        this.combo = 0;
        this.sizeScalar = this.sizseScalarDefault;
        this.playerBall.shape = new ShapeCircle(this.playerBall, this.playerBall.position, this.playerBall.radius);
    }

    update(delta) {
        this.position = Vector2.copy(this.playerBall.position);
        super.update(delta);
    }

    draw(ctx) {
        ctx.strokeStyle = "lightGreen";
        ctx.fillStyle = 'lightGreen';
        ctx.globalAlpha = 0.2;

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.playerBall.radius + this.combo, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.fill();

        ctx.globalAlpha = 1;
    }
}

// 강화된 공의 폭발 효과를 처리. 현재는 주변 블록과의 충돌 처리만 맡고 있음.
class PlayerBallExplosion extends ComponentObject {
    radius;
    leftExplosionTime;

    constructor(game, position, radius) {
        super(game);
        this.position.copyFrom(position);
        this.radius = radius;
        // 폭발 애니메이션을 대비해 일단 1초간 존재하도록 함.
        // 애니메이션을 딴 클래스에 넣는다면 충돌 처리만 하고 바로 삭제되도록 수정 필요.
        this.leftExplosionTime = 1;
        this.shape = new ShapeCircle(this, this.position, this.radius);
        this.checkCollisionAtConstruct();

        //new Anime_circleAct(this.game, this, 0, 700, "green");
        console.log(this.game.player.explosionRadius);
        new Anime_circleAct(this.game, this, 0, this.game.playerBall.explosionRadius * 22, "green");
    }

    // 생성될 때 한 번만 충돌 처리.
    checkCollisionAtConstruct() {
        for (let collideable of this.game.collideablesWithBall) {
            if (this.game.components.indexOf(collideable) >= 0) {
                ComponentObject.checkCollision(this, collideable);
            }
        }
    }

    update(delta) {
        this.leftExplosionTime -= delta;
        if (this.leftExplosionTime <= 0)
            this.game.removeComponent(this);
    }

}

/**
 * 플레이어의 공 발사각을 설정하고
 * 발사각을 나타내는 화살표를 그리는 Component
 */
class PlayerLaunchAngleArrow extends Component {
    length;
    player;
    ball;
    constructor(game, player, ball) {
        super(game);
        this.drawOrder = 92;
        this.length = 100;
        this.player = player;
        this.ball = ball;
    }

    update(delta) {
        this.position = Vector2.copy(fixedCursorPosition);
    }


    draw(ctx) {
        if (this.game.state == "gameover" || this.game.state == "gameclear") return;

        ctx.save();

        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.setLineDash([5, 5]);
        ctx.moveTo(this.player.position.x, this.player.position.y);
        ctx.lineTo(this.position.x, this.position.y);
        ctx.stroke();

        ctx.drawImage(img_target, this.position.x - 20, this.position.y - 20, 40, 40);
        ctx.restore();
    }
}

// 박스 관련

class Box extends ComponentObject {
    static attackAble = true;
    relativePosition;
    width;
    height;
    owner;
    price;
    distroyed;  // destroyBox 중복 호출 방지
    explodeSize;
    bonusCoin;

    createdTick;

    constructor(game, relativePosition, width, height, owner = null, boost) {
        super(game);

        this.relativePosition = relativePosition;
        this.position = Vector2.plus(owner.position, relativePosition);
        this.width = width;
        this.height = height;
        this.owner = owner;
        this.destroyed = false;
        // Box의 위치 정보는 ShapeAABB의 2, 3 번째 매개변수로 전달됨.
        // 추가로 필요할 수 있는 건 속도 정보.
        // 그런데 Box의 속도는 무의미하므로 대신 owner의 속도 정보에 접근할 수 있도록 함.
        this.shape = new ShapeAABB(this.owner, new Vector2(), new Vector2());
        this.updateShape();
        this.drawOrder = 50;
        //createdTick은 오로지 doAttack에서만 쓸것...
        this.createdTick = this.game.previousTicks + Math.random() * 500;

        this.bonusCoin = 20;
        this.explodeSize = 60;

        if (boost) {
            new Anime_boost(this.game, this);
        }

        game.collideablesWithBall.push(this);
    }

    update(delta) {
        this.checkWallCollision();
        //this.speed = Vector2.copy(this.owner.speed);
        this.position = Vector2.plus(this.owner.position, this.relativePosition);
        super.update(delta);
        if (Box.attackAble)
            this.doAttack();
    }

    checkWallCollision() {
        if (this.position.x <= this.width / 2 && this.owner.speed.x < 0) {  // 왼쪽 벽
            this.processCollision(new CollisionInfo(true, "left", "wall"));
        }
        else if (GAME_WIDTH - this.position.x <= this.width / 2 && this.owner.speed.x > 0) {  // 오른쪽 벽
            this.processCollision(new CollisionInfo(true, "right", "wall"));
        }

        if (this.position.y <= this.height && this.owner.speed.y < 0) {  // 위쪽 벽과 충돌 계산
            this.processCollision(new CollisionInfo(true, "up", "wall"));
        }
    }

    processCollision(collisionInfo) {
        this.owner.processCollision(collisionInfo);

        if (collisionInfo.component instanceof PlayerBall || collisionInfo.component instanceof BallSkill_1) {
            this.playCollisionSound();
            //충돌된 상자 제거
            this.destroyBox();
        }
        else if (collisionInfo.component instanceof PlayerBallExplosion && !(this instanceof CoreBox)) {
            this.destroyBox();
        }
    }

    playCollisionSound() {
        let crash_mp3 = new Audio("soundFolder/crash.mp3");
        crash_mp3.play();
    }

    destroyBox(coreBroken) {
        if (this.destroyed)
            return;

        this.game.removeComponent(this);

        //코인 얻음
        this.game.addCoin(this.price);

        if (coreBroken) {
            this.game.addCoin(this.bonusCoin);
        }

        //애니메이션
        new Anime_explode(this.game, this.explodeSize, 0.02, this, 0, 0);

        this.destroyed = true;
    }

    updateShape() {
        let widthHeightHalf = new Vector2(this.width / 2, this.height / 2);
        this.shape.min = Vector2.subtract(this.position, widthHeightHalf);
        this.shape.max = Vector2.plus(this.position, widthHeightHalf);
    }

    draw(ctx) {

    }

    doAttack() {

    }
}

class NormalBox extends Box {
    constructor(game, position, owner, boost) {
        super(game, position, 30, 30, owner, boost);
        this.price = BOX_PRICE_NORMAL;
    }

    draw(ctx) {
        super.draw(ctx);
        ctx.drawImage(img_normalBox, this.position.x - this.width / 2, this.position.y - this.height / 2);
    }
}

class CoreBox extends Box {
    constructor(game, position, owner, boost) {
        super(game, position, 30, 30, owner, boost);
        this.price = BOX_PRICE_CORE;

        this.explodeSize = 80;
    }

    destroyBox(coreBroken) {
        if (this.destroyed)
            return;

        if (coreBroken) {
            super.destroyBox();
            return;
        }

        for (let b of this.owner.boxList) {
            b.destroyBox(true); // coreBroken = true -> 배리어 한번에 처리 + 보너스코인 + 무한루프방지
        }

        // owner도 components에서 제거
        this.game.removeComponent(this.owner);
        let mobListIndex = this.game.mobList.indexOf(this.owner);
        if (mobListIndex != -1)
            this.game.mobList.splice(mobListIndex, 1);
        else {
            console.error("destroyBox() : 코어를 소유한 mob이 mobList에 없습니다.")
            console.trace();
        }
        this.game.mobList.remove

        // 레벨 올릴지 검사
        this.game.checkLevelUp();

        this.destroyed = true;
    }

    playCollisionSound() {
        let coreexplosion_mp3 = new Audio("soundFolder/coreexplosion.mp3");
        coreexplosion_mp3.play();
    }

    draw(ctx) {
        super.draw(ctx);
        ctx.drawImage(img_coreBox, this.position.x - this.width / 2, this.position.y - this.height / 2);
    }
}

class BarrierBox extends Box {
    barrierState;  // "unbroken", "broken"
    constructor(game, position, owner, boost) {
        super(game, position, 30, 30, owner, boost);
        this.price = BOX_PRICE_BARRIER;
        this.drawOrder = 51; // 다른 box들은 50
        this.barrierState = "unbroken";
    }

    destroyBox(coreBroken) {
        if (coreBroken) {
            super.destroyBox();
        }

        if (this.barrierState == "unbroken") {
            this.barrierState = "broken";
            return;
        }

        super.destroyBox(coreBroken);
    }

    draw(ctx) {
        super.draw(ctx);
        if (this.barrierState == "unbroken")
            ctx.drawImage(img_barrierBox, this.position.x - this.width / 2, this.position.y - this.height / 2);
        else
            ctx.drawImage(img_normalBox, this.position.x - this.width / 2, this.position.y - this.height / 2);
    }
}

class CannonBox extends Box {
    coolTime;

    constructor(game, position, owner, boost) {
        super(game, position, 30, 30, owner, boost);
        this.price = BOX_PRICE_CANNON;
        this.coolTime = CANNON_COOL;
    }

    draw(ctx) {
        ctx.drawImage(img_cannonBox, this.position.x - this.width / 2, this.position.y - this.height / 2);
    }

    doAttack() {
        if (this.game.previousTicks - this.createdTick > this.coolTime && this.position.y > 0) {
            this.createdTick = this.game.previousTicks + Math.random() * 500;
            new Cannon(this.game, this);
            new Anime_rectAct(this.game, this, 0, 700, "red");
        }
    }
}

class MachinegunBox extends Box {
    coolTime;

    constructor(game, position, owner, boost) {
        super(game, position, 30, 30, owner, boost);
        this.price = BOX_PRICE_MACHINEGUN;
        this.coolTime = MACHINEGUN_COOL;
    }

    draw(ctx) {
        ctx.drawImage(img_machinegunBox, this.position.x - this.width / 2, this.position.y - this.height / 2);
    }

    doAttack() {
        if (this.game.previousTicks - this.createdTick > this.coolTime && this.position.y > 0) {
            this.createdTick = this.game.previousTicks + Math.random() * 500;
            new Bullet(this.game, this);
            new Bullet(this.game, this);
            new Bullet(this.game, this);
            new Anime_rectAct(this.game, this, 0, 700, "red");
        }
    }
}

class LazerBox extends Box {
    coolTime;

    constructor(game, position, owner, boost) {
        super(game, position, 30, 30, owner, boost);
        this.price = BOX_PRICE_LAZER;
        this.coolTime = LAZER_COOL;
    }

    draw(ctx) {
        ctx.drawImage(img_lazerBox, this.position.x - this.width / 2, this.position.y - this.height / 2);
    }

    doAttack() {
        if (this.game.previousTicks - this.createdTick > this.coolTime && this.position.y > 0) {
            this.createdTick = this.game.previousTicks + Math.random() * 500;
            new Lazer(this.game, this);
            new Anime_rectAct(this.game, this, 0, 700, "red");
        }
    }
}

// 몹 관련

class Mob extends ComponentObject {
    boxList = [];
    resistance;
    leastSpeed;
    movingSpeed;
    data;
    onKnockBack;  // 강화된 공의 폭발 공격으로 인해, 한 프레임에 넉백을 중복해서 받는 것을 방지하기 위함.
    arrivalPosY; // 몹이 생성되고 지정된 위치에 도착한다면 느려짐.
    prepareAtk;
    frontestBox;
    arrived;

    constructor(game, position, wave) {
        super(game);
        this.leastSpeed = new Vector2(0, 300); // 몹이 추구하는 속도
        this.movingSpeed = new Vector2(0, 5); // 몹이 맵에 도착하면 leastSpeed를 이것으로 바꿀것임
        this.onKnockBack = false;
        this.position = new Vector2(position.x, position.y - wave * WAVE_DIST - WAVE_DEFAULT_DIST);
        this.arrivalPosY = position.y;

        this.prepareAtk = 1000;

        this.drawOrder = 40;
        this.arrived = false;
    }

    processCollision(collisionInfo) {
        if (collisionInfo.component instanceof PlayerBall || collisionInfo.component instanceof PlayerBallExplosion) {
            // 넉백
            if (!this.onKnockBack) {
                let newSpeed = Vector2.subtract(this.position, collisionInfo.nearestPoint).setLength(this.game.playerBall.speed.getLength());
                this.speed = newSpeed;
                this.onKnockBack = true;
            }
        } else if (collisionInfo.component == "wall") {
            if (collisionInfo.nearestPoint == "left" || collisionInfo.nearestPoint == "right")
                this.speed.x *= -1;
            if (collisionInfo.nearestPoint == "up")
                this.speed.y *= -1;
        }
    }

    update(delta) {
        this.onKnockBack = false;
        this.updateSpeed(delta);
        super.update(delta);
        this.isArrived();
    }

    isArrived() {
        // 맵 내부로 도착했는가
        if (this.position.y >= this.arrivalPosY && !this.arrived) {
            this.leastSpeed = this.movingSpeed;
            this.arrived = true;
        }

        // 맵 끝으로 가버렸는가
        if (this.position.y > GAME_HEIGHT - 100) {
            this.leastSpeed = this.leastSpeed.plus(new Vector2(0, 10));
        }

        // 충분히 멀리 갔다면 순수 제거
        if (this.position.y > GAME_HEIGHT + 1000) {
            this.removeMobHard();
            console.log("몹 제거됨.");
        }
    }

    removeMobHard() {
        for (let box of this.boxList) {
            this.game.removeComponent(box);
        }
        this.game.removeComponent(this);
        this.game.doRemoval();
        this.game.checkLevelUp();
    }

    updateSpeed(delta) {
        if (this.speed.x > this.leastSpeed.x) {
            this.speed.x -= this.resistance * delta;
            if (this.speed.x < this.leastSpeed.x)
                this.speed.x = this.leastSpeed.x;
        } else if (this.speed.x < this.leastSpeed.x) {
            this.speed.x += this.resistance * delta;
            if (this.speed.x > this.leastSpeed.x)
                this.speed.x = this.leastSpeed.x;
        }

        if (this.speed.y > this.leastSpeed.y) {
            this.speed.y -= this.resistance * delta;
            if (this.speed.y < this.leastSpeed.y)
                this.speed.y = this.leastSpeed.y;
        } else if (this.speed.y < this.leastSpeed.y) {
            this.speed.y += this.resistance * delta;
            if (this.speed.y > this.leastSpeed.y)
                this.speed.y = this.leastSpeed.y;
        }

        // 밑에 세줄은 충돌 테스트용
        // if (this.speed.y <= this.leastSpeed.y && this.position.y >= this.arrivalPosY) {
        //     this.resistance = 100;
        // }
    }
}

function mobMaker(mob, data) {  // o core / n normal / b barrier / c cannon / m machinegun / l lazer / other none
    // 대문자 -> 박스 뒤에 불 나옴
    let coreIdx;

    //코어의 위치를 찾음 + 가장 앞의 박스 찾음
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] == "O" || data[i][j] == "o") {
                coreIdx = new Vector2(j * 30, i * 30);
            }
        }
    }

    //박스 만들기
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {

            let ralativeVec = Vector2.subtract(new Vector2(j * 30, i * 30), coreIdx);

            switch (data[i][j]) {
                case "O": mob.boxList.push(new CoreBox(mob.game, new Vector2(0, 0), mob, true)); break;
                case "N": mob.boxList.push(new NormalBox(mob.game, ralativeVec, mob, true)); break;
                case "B": mob.boxList.push(new BarrierBox(mob.game, ralativeVec, mob, true)); break;
                case "C": mob.boxList.push(new CannonBox(mob.game, ralativeVec, mob, true)); break;
                case "M": mob.boxList.push(new MachinegunBox(mob.game, ralativeVec, mob, true)); break;
                case "L": mob.boxList.push(new LazerBox(mob.game, ralativeVec, mob, true)); break;

                case "o": mob.boxList.push(new CoreBox(mob.game, new Vector2(0, 0), mob)); break;
                case "n": mob.boxList.push(new NormalBox(mob.game, ralativeVec, mob)); break;
                case "b": mob.boxList.push(new BarrierBox(mob.game, ralativeVec, mob)); break;
                case "c": mob.boxList.push(new CannonBox(mob.game, ralativeVec, mob)); break;
                case "m": mob.boxList.push(new MachinegunBox(mob.game, ralativeVec, mob)); break;
                case "l": mob.boxList.push(new LazerBox(mob.game, ralativeVec, mob)); break;

                default: break;
            }
        }
    }

    //가장 앞의 박스 찾음
    let frontestBox = mob.boxList[0];

    for (let i = 0; i < mob.boxList.length; i++) {
        if (frontestBox.position.y < mob.boxList[i].position.y) {
            frontestBox = mob.boxList[i];
        }
    }

    mob.frontestBox = frontestBox;
}

class Mob_pawn extends Mob {

    constructor(game, position) {
        super(game, position, game.wave);

        this.data = [["O"]
            , ["c"]];

        mobMaker(this, this.data);

        this.movingSpeed = new Vector2(0, MOVE_SPD_PAWN);
        this.resistance = 1000;
    }

    draw() {
        this.game.ctx.drawImage(img_pawnBody, this.position.x - 105, this.position.y - 75);
    }
}

class Mob_knight extends Mob {

    constructor(game, position) {
        super(game, position, game.wave);

        this.data =
            [["c", "O", "c"]
                , [" ", "b", " "]];

        mobMaker(this, this.data);

        this.movingSpeed = new Vector2(0, MOVE_SPD_KNIGHT);
        this.resistance = 1500;

    }

    draw() {
        this.game.ctx.drawImage(img_knightBody, this.position.x - 105, this.position.y - 75);
    }
}

class Mob_bishop extends Mob {

    constructor(game, position) {
        super(game, position, game.wave);

        this.data =
            [["M", " ", "N", " ", "M"]
                , ["n", "n", "o", "n", "n"]
                , ["m", " ", "b", " ", "m"]
                , [" ", " ", "n", " ", " "]]

        mobMaker(this, this.data);

        this.movingSpeed = new Vector2(0, MOVE_SPD_BISHOP);
        this.resistance = 1800;
    }

    draw() {
        this.game.ctx.drawImage(img_bishopBody, this.position.x - 105, this.position.y - 75);
    }
}

class Mob_rook extends Mob {

    constructor(game, position) {
        super(game, position, game.wave);

        this.data =
            [["N", "L", "N"]
                , ["n", "O", "n"]
                , ["n", "b", "n"]
                , ["n", "n", "n"]]

        mobMaker(this, this.data);

        this.movingSpeed = new Vector2(0, MOVE_SPD_ROOK);
        this.resistance = 1800;
    }

    draw() {
        this.game.ctx.drawImage(img_rookBody, this.position.x - 105, this.position.y - 75);
    }
}

class Mob_qween extends Mob {

    constructor(game, position) {
        super(game, position, game.wave);

        this.data =  //11 * 28
            [[" ", " ", "B", "B", "B", "B", "B", "B", "B", " ", " "]
                , ["b", "b", "b", " ", " ", " ", " ", " ", "b", "b", "b"]
                , ["b", " ", " ", " ", " ", " ", " ", " ", " ", " ", "b"]
                , ["b", " ", "n", "n", "n", "n", "n", "n", "n", " ", "b"]
                , ["b", " ", "n", "m", "n", "n", "n", "m", "n", " ", "b"]
                , ["b", " ", "n", "n", "c", "n", "c", "n", "n", " ", "b"]
                , ["b", "l", "n", "n", "n", "o", "n", "n", "n", "l", "b"]
                , ["b", " ", "n", "n", "c", "b", "c", "n", "n", " ", "b"]
                , ["b", " ", "b", "m", "n", "b", "n", "m", "b", " ", "b"]
                , ["b", " ", "b", "b", "b", "b", "b", "b", "b", " ", "b"]
                , ["b", " ", " ", " ", " ", " ", " ", " ", " ", " ", "b"]
                , ["b", "l", "c", "n", "n", " ", "n", "n", "c", "l", "b"]
                , ["b", " ", " ", " ", " ", " ", " ", " ", " ", " ", "b"]
                , ["b", " ", "m", "n", "n", " ", "n", "n", "m", " ", "b"]
                , ["b", " ", " ", " ", " ", " ", " ", " ", " ", " ", "b"]
                , ["b", " ", "c", "n", "n", " ", "n", "n", "c", " ", "b"]
                , ["b", "l", " ", " ", " ", " ", " ", " ", " ", "l", "b"]
                , ["b", " ", "m", "n", "n", " ", "n", "n", "m", " ", "b"]
                , ["b", " ", " ", " ", " ", " ", " ", " ", " ", " ", "b"]
                , ["b", " ", "c", "n", "n", " ", "n", "n", "c", " ", "b"]
                , ["b", " ", " ", " ", " ", " ", " ", " ", " ", " ", "b"]
                , ["b", "l", "m", "n", "n", " ", "n", "n", "m", "l", "b"]
                , ["b", "n", " ", " ", " ", " ", " ", " ", " ", "n", "b"]
                , [" ", "b", "c", " ", " ", " ", " ", " ", "c", "b", " "]
                , [" ", " ", "b", "n", " ", " ", " ", "n", "b", " ", " "]
                , [" ", " ", " ", "b", "c", "n", "c", "b", " ", " ", " "]
                , [" ", " ", " ", " ", "b", "n", "b", " ", " ", " ", " "]
                , [" ", " ", " ", " ", " ", "b", " ", " ", " ", " ", " "]];

        mobMaker(this, this.data);
        this.movingSpeed = new Vector2(0, MOVE_SPD_QWEEN);
        this.resistance = 10000000;
    }

    draw() {
        this.game.ctx.drawImage(img_qweenBody, this.position.x - 225, this.position.y - 255);
    }
}

class Mob_king extends Mob {

    constructor(game, position) {
        super(game, position, game.wave);

        this.data =
            [["O"]];

        mobMaker(this, this.data);

        this.movingSpeed = new Vector2(0, MOVE_SPD_KING);
        this.resistance = 9000;
    }

    draw() {
        //this.game.ctx.drawImage(img_rookBody, this.position.x -105  , this.position.y - 75);
    }
}

class Attacks extends ComponentObject {
    player;
    box;
    radius;
    spdScalar;
    newSpeed;
    damage;
    angleError;
    err;

    constructor(game, box, radius, spdScalar, damage, err) {
        super(game);
        this.player = game.player;
        this.box = box;
        this.radius = radius;
        this.spdScalar = spdScalar;
        this.damage = damage;
        this.position = Vector2.copy(this.box.position);
        this.err = err;
        this.angleError = Math.random() * this.err - 0.5 * err;

        this.newSpeed = new Vector2((this.player.position.x - this.box.position.x + this.angleError), (this.player.position.y - this.box.position.y)).nomalize();
        this.speed = this.newSpeed.multiply(this.spdScalar);

        this.shape = new ShapeCircle(this, this.position, this.radius);

        this.drawOrder = 55;
    }

    update(delta) {

        if (this.position.y >= 800) {
            this.game.removeComponent(this);
        }

        ComponentObject.checkCollision(this, this.game.player);

        super.update(delta);
    }

    updateShape() {
        this.shape.position = Vector2.copy(this.position);
    }

    processCollision(collisionInfo) {
        if (collisionInfo.component instanceof Player && !this.game.player.isHiding) {

            if (this.player.shieldCount > 0) {
                this.player.processShield();
            } else {
                new Anime_explode(this.game, this.radius * 5, 0.02, this, 0, 0);
                this.game.player.playerHurt(this.damage);
            }
            this.game.removeComponent(this);


        }
    }
}

class Cannon extends Attacks {
    constructor(game, box) {
        let radius = 10;
        let spdScalar = CANNON_SPD;
        let damage = CANNON_DMG;
        let err = CANNON_ERR;
        super(game, box, radius, spdScalar, damage, err);
    }

    draw(ctx) {
        this.game.ctx.drawImage(img_cannon, this.position.x - 30, this.position.y - 30);
    }
}

class Bullet extends Attacks {
    constructor(game, box) {
        let radius = 5;
        let spdScalar = MACHINEGUN_SPD;
        let damage = MACHINEGUN_DMG;
        let err = MACHINEGUN_ERR;
        super(game, box, radius, spdScalar, damage, err);
    }
    draw(ctx) {
        this.game.ctx.drawImage(img_bullet, this.position.x - 30, this.position.y - 30);
    }
}

class Lazer extends Attacks {
    constructor(game, box) {
        let radius = 30;
        let spdScalar = LAZER_SPD;
        let damage = LAZER_DMG;
        let err = LAZER_ERR;
        super(game, box, radius, spdScalar, damage, err);
    }
    draw(ctx) {
        this.game.ctx.drawImage(img_lazer, this.position.x - this.radius, this.position.y - this.radius, this.radius * 2, this.radius * 2);
    }
}

class NextWaveInfo extends ComponentObject {
    frontestMob;
    leftTime;

    constructor(game) {
        super(game);
        this.drawOrder = 40;
        this.leftTime = 0;
    }

    update(delta) {
        this.frontestMob = this.game.getMostFrontMob();
        super.update(delta);
    }

    draw(ctx) {
        if (this.frontestMob == null) return;
        if (this.frontestMob.frontestBox.position.y >= -(2 + WAVE_DEFAULT_DIST)) return;

        let dist = -(WAVE_DEFAULT_DIST + this.frontestMob.frontestBox.position.y);
        this.leftTime = dist / this.frontestMob.leastSpeed.y;

        let msg = 'press \'SPACE\' to call next Wave ( nextWave : ' + this.leftTime.toFixed(1) + "s )";

        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';

        ctx.fillText(msg, GAME_WIDTH / 2, 30);
    }
}

class Anime extends Component {
    img;
    spd;
    opacity;
    size;
    constructor(game) {
        super(game);
    }

    draw(ctx) { }

}

class Anime_background extends Anime {
    constructor(game) {
        super(game);
        this.img = img_background1;
        this.spd = 0.01;
        this.drawOrder = 1;
    }

    draw(ctx) {
        ctx.drawImage(this.img, 0, this.spd * this.game.previousTicks % GAME_WIDTH - 700);
    }
}

class Anime_explode extends Anime {
    where;
    errX;
    errY;

    constructor(game, size, spd, where, errX, errY) {
        super(game);
        this.size = size;
        this.opacity = 1;
        this.spd = spd;
        this.drawOrder = 99;
        this.where = where;
        this.position = Vector2.copy(this.where.position);

        this.errX = errX;
        this.errY = errY;
        this.img = img_explode1;
    }

    update(delta) {
        if (this.opacity > 0.5) {
            this.size *= 1 + this.spd;
            this.opacity -= this.spd;
        } else {
            this.game.removeComponent(this);
        }
        super.update(delta);
    }

    draw(ctx) {
        switch (Math.floor(this.opacity / 0.10)) {
            case 9: this.img = img_explode1; break;
            case 8: this.img = img_explode2; break;
            case 7: this.img = img_explode3; break;
            case 6: this.img = img_explode4; break;
        }

        ctx.globalAlpha = this.opacity;
        ctx.drawImage(this.img, this.position.x + this.errX - this.size / 2, this.position.y + this.errY - this.size / 2, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}

class Anime_boost extends Anime {
    box;
    constructor(game, box) {
        super(game);
        this.drawOrder = 3;
        this.box = box;
        this.spd = 160;
        this.opacity = 0.35;
    }

    update(delta) {
        super.update(delta);
        if (this.game.components.indexOf(this.box) < 0) {
            this.game.removeComponent(this);
        }
    }

    draw(ctx) {
        ctx.globalAlpha = this.opacity;
        if (this.game.previousTicks % this.spd > this.spd / 2) {
            ctx.drawImage(img_fireD, this.box.position.x - 10.5, this.box.position.y - 50.5);
        }
        else {
            ctx.drawImage(img_fireD2, this.box.position.x - 10.5, this.box.position.y - 50.5);
        }
        ctx.globalAlpha = 1;
    }
}

class Anime_rectAct extends Anime {
    comp;
    gap;
    startTick;
    duration;
    sizeScalar;
    color;

    constructor(game, comp, gap, duration, color) {
        super(game);
        this.drawOrder = 70;
        this.comp = comp;
        this.startTick = game.previousTicks;
        this.gap = gap;
        this.duration = duration;
        this.sizeScalar = 0.5;
        this.color = color;
    }

    update(delta) {
        super.update(delta);
        this.gap += this.sizeScalar;
        if (this.startTick + this.duration < this.game.previousTicks) {
            this.game.removeComponent(this);
        }
    }

    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 1 - (this.game.previousTicks - this.startTick) / this.duration;

        ctx.beginPath();
        ctx.moveTo(this.comp.position.x - (this.comp.width / 2 + this.gap), this.comp.position.y - (this.comp.height / 2 + this.gap));
        ctx.lineTo(this.comp.position.x + (this.comp.width / 2 + this.gap), this.comp.position.y - (this.comp.height / 2 + this.gap));
        ctx.lineTo(this.comp.position.x + (this.comp.width / 2 + this.gap), this.comp.position.y + (this.comp.height / 2 + this.gap));
        ctx.lineTo(this.comp.position.x - (this.comp.width / 2 + this.gap), this.comp.position.y + (this.comp.height / 2 + this.gap));
        ctx.lineTo(this.comp.position.x - (this.comp.width / 2 + this.gap), this.comp.position.y - (this.comp.height / 2 + this.gap));
        ctx.stroke();

        ctx.globalAlpha = 1;
        ctx.lineWidth = 1;
    }
}

class Anime_circleAct extends Anime {
    comp;
    gap;
    startTick;
    duration;
    sizeScalar;
    color;

    constructor(game, comp, gap, duration, color) {
        super(game);
        this.drawOrder = 70;
        this.comp = comp;
        this.startTick = game.previousTicks;
        this.gap = gap;
        this.duration = duration;
        this.sizeScalar = 0.9;
        this.color = color;
    }

    update(delta) {
        super.update(delta);
        this.gap += this.sizeScalar;
        if (this.startTick + this.duration < this.game.previousTicks) {
            this.game.removeComponent(this);
        }
    }

    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 1 - (this.game.previousTicks - this.startTick) / this.duration;

        ctx.beginPath();
        ctx.arc(this.comp.position.x, this.comp.position.y, this.comp.radius + this.gap, 0, Math.PI * 2, false);
        ctx.stroke();

        ctx.globalAlpha = 1;
        ctx.lineWidth = 1;
    }
}

class Anime_BrokenPlayer extends Anime {
    player;
    scalarX;
    scalarY;
    startedTick;

    constructor(game, player) {
        super(game);
        this.player = player;
        this.scalarX = 100;
        this.scalarY = 50;
        this.startedTick = this.game.previousTicks;
    }

    update(delta) {
        super.update(delta);
        if (this.startedTick + 3000 < this.game.previousTicks) {
            this.game.removeComponent(this);
        }
    }

    draw(ctx) {
        if (this.tmpTick + 600 < this.game.previousTicks) {
            new Anime_explode(this.game, 50, 0.02, this.player, Math.random() * this.scalarX - this.scalarX / 2, Math.random() * this.scalarY - this.scalarY / 2);
            this.tmpTick = this.game.previousTicks;
        }
    }
}
