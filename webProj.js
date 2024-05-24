// Game.processInput이 끝날 때 무조건 click, esc가 false가 되므로 주의.
// 클릭 이벤트는 processInput이 끝나기 전에 처리되야 함.
const gameInput = { left: false, right: false, click: false, space: false, esc: false };
let cursorPosition = null;
let fixedCursorPosition = null;

// 밸런스 전역변수들.......................................................................................................
// 나중에 상수여야하는 것들은 CONST 붙일것.
STARTLEVEL = 1;

PLAYER_HEART = 1000;
PLAYER_SPD = 444;
BALL_MISS_DMG = 50;

BOX_PRICE_NORMAL = 30;
BOX_PRICE_BARRIER = 40;
BOX_PRICE_CANNON = 50;
BOX_PRICE_MACHINEGUN = 60;
BOX_PRICE_LAZER = 90;
BOX_PRICE_CORE = 150;

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

WAVE_DEFAULT_DIST = 500;
WAVE_DIST = 5000;

// .......................................................................................................................

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

let game = null;

// jquery 공식 문서에서는 $(document).ready() 대신 $(function() {})을 사용하도록 권장함.
$(function () {
    const gameCanvas = $("#game-canvas");

    cursorPosition = new Vector2(0, 0);
    $(document).on("mousemove", function (event) {
        cursorPosition.set(event.pageX - gameCanvas.offset().left, event.pageY - gameCanvas.offset().top);
    });

    $(document).on("mousedown", function (event) {
        gameInput.click = true;
        console.log(cursorPosition);    // 디버그 용
    });

    game = new Game(gameCanvas[0].getContext("2d"));

    $(gameCanvas).hover(
        function () {
            gameCanvas.addClass("hide_cursor");
        }, function () {
            gameCanvas.removeClass("hide_cursor");
        });
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
    state;  // "main-menu", "paused", "game"

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
    mobList;

    pauseScreenButtons;

    constructor(ctx) {
        this.level = STARTLEVEL; // 임시
        this.startMainMenu();

        this.ctx = ctx;
        this.fps = 60;
        this.delta = 1 / this.fps;
        this.previousTicks = performance.now();
        this.components = [];
        this.addList = [];
        this.removalList = [];
        this.collideablesWithBall = [];
        this.pauseScreenButtons = [];
        this.loadComponents();
        //setInterval(this.runLoop.bind(this), this.delta * 1000);
        requestAnimationFrame(this.runLoop.bind(this));

        this.coin = 0;
    }

    loadComponents() {
        this.player = new Player(this);
        this.playerBall = new PlayerBall(this, this.player);
        this.playerArrow = new PlayerLaunchAngleArrow(this, this.player, this.playerBall);
        new Anime_background(this);

        let resume = new Button(this, new Vector2(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50), 130, 50, "resume");
        resume.setEventHandler(function () { this.game.state = "game"; });
        let toMainMenu = new Button(this, new Vector2(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50), 130, 50, "main menu");
        toMainMenu.setEventHandler(function () { this.game.startMainMenu(); });

    }

    startMainMenu() {
        this.state = "main-menu";
        $("#game-section").hide();
        $("#main-menu-section").show();
    }

    startGame(level) {
        this.state = "game";
        this.level = level;
        $("#main-menu-section").hide();
        $("#game-section").show();
        this.levelStarter(level);
    }

    processInput() {
        if (this.state == "game") {
            this.player.processInput();
            if (gameInput.esc)
                this.state = "paused";
        }
        else if (this.state == "paused") {
            for (let button of this.pauseScreenButtons) {
                button.processInput();
            }
            if (gameInput.esc)
                this.state = "game";
        }
        gameInput.click = gameInput.esc = false;
    }
    updateGame(timestamp) {
        this.delta = (timestamp - this.previousTicks) / 1000;
        if (this.delta > 0.05)
            this.delta = 0.05;
        this.previousTicks = timestamp;

        this.doAdd();
        if (this.state == "game") {
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
        //플레이어 위치 초기화
        this.player.position.x = GAME_WIDTH / 2;

        //공 상태 초기화
        this.playerBall.init();

        //몹 초기화
        this.mobList = [];

        //적공격들 초기화
        for (let comp of this.components) {
            if (comp instanceof Box || comp instanceof Mob || comp instanceof Attacks)
                this.removeComponent(comp);
        }
        this.doRemoval();
    }

    levelStarter(level) { // 코어가 부서질 때 레벨을 올릴지 판단할 것.
        this.initGame();
        console.log(this.components);

        switch (level) {
            case 1:
                this.wave = 0;
                this.mobList.push(new Mob_pawn(this, new Vector2(100, 200)));
                this.mobList.push(new Mob_pawn(this, new Vector2(250, 200)));
                this.mobList.push(new Mob_pawn(this, new Vector2(400, 200)));
                this.mobList.push(new Mob_knight(this, new Vector2(250, 80)));

                this.wave = 1;
                this.mobList.push(new Mob_knight(this, new Vector2(250, 80)));
                this.mobList.push(new Mob_knight(this, new Vector2(150, 180)));
                this.mobList.push(new Mob_knight(this, new Vector2(350, 180)));

                this.wave = 2;
                this.mobList.push(new Mob_pawn(this, new Vector2(50, 100)));
                this.mobList.push(new Mob_pawn(this, new Vector2(50, 200)));
                this.mobList.push(new Mob_pawn(this, new Vector2(450, 100)));
                this.mobList.push(new Mob_pawn(this, new Vector2(450, 200)));
                this.mobList.push(new Mob_bishop(this, new Vector2(250, 80)));
                break;

            case 2:
                this.wave = 0;
                this.mobList.push(new Mob_pawn(this, new Vector2(50, 100)));
                this.mobList.push(new Mob_pawn(this, new Vector2(250, 300)));
                this.mobList.push(new Mob_pawn(this, new Vector2(450, 100)));
                this.mobList.push(new Mob_rook(this, new Vector2(100, 300)));
                this.mobList.push(new Mob_rook(this, new Vector2(400, 300)));
                this.mobList.push(new Mob_bishop(this, new Vector2(250, 100)));
                break;

            case 3:
                this.wave = 0;
                this.mobList.push(new Mob_qween(this, new Vector2(250, -600)));
                break;

            default:
                this.gameEnd();
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
                if (mob.position.y > 0)
                    return;
            }

            let frontest = this.getMostFrontMob();
            if (frontest != null) {
                for (let mob of this.mobList) {
                    if (mob != frontest)
                        mob.position.y -= frontest.position.y + 100;
                }
                frontest.position.y -= frontest.position.y + 100;
            }
        }
    }

    checkLevelUp() {
        if (this.mobList.length == 0) {
            console.log("lvup");

            //레벨 업! 표시

            this.level++;
            setTimeout(function () { this.levelStarter(this.level) }.bind(this), 2000);

        }
    }

    addCoin(toAddCoin) {
        console.log("coin : " + (this.coin += toAddCoin) + "(+" + toAddCoin + ")");
    }

    gameEnd() {

    }
}

class Component {
    game;
    position;
    drawOrder;
    constructor(game) {
        this.game = game;
        this.drawOrder = 50;
        this.position = new Vector2(0, 0);
        game.addComponent(this);
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

    constructor(game, position, width, height, text) {
        super(game, 101);
        this.game.pauseScreenButtons.push(this);
        this.position.copyFrom(position);
        this.drawOrder = 101;
        this.width = width;
        this.height = height;
        this.text = text;
        this.hover = false;
        this.eventHandler = null;
    }

    setEventHandler(eventHandler) {
        this.eventHandler = eventHandler;
    }

    processInput() {
        if (this.game.state != "paused")
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
        if (this.game.state != "paused")
            return;

        ctx.save();

        if (this.hover)
            ctx.fillStyle = "red";
        else
            ctx.fillStyle = "blue";
        ctx.fillRect(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);

        ctx.fillStyle = "black";
        ctx.font = "20px Silkscreen";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.position.x, this.position.y, this.width);

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
    constructor(game) {
        super(game);
        this.drawOrder = 90;
        this.width = 81;
        this.height = 9;
        this.maxSpeed = PLAYER_SPD;
        this.launchDirection = new Vector2(0, -1);
        this.radianLimit = Math.PI / 6;
        this.heart = PLAYER_HEART;

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
            this.isParrying = true;
            this.leftTimeForNextParrying = this.parryingCoolTime;
            // 나누기 2하는 이유는, parringToleranceTime을 충돌 이벤트 전후로 나눠서 적용하기 위함.
            this.leftParryingPersistTime = this.parryingToleranceTime / 2;
            // 충돌 이벤트 전에 발생한 패링 이벤트 허용은 Player에서, 이후에 발생한 패링은 PlayerBall에서 처리.
        }
    }

    update(delta) {
        this.processParrying(delta);
        super.update(delta);
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
        console.log("heart : " + (this.heart -= dmg) + "(-" + dmg + ")");
    }

    draw(ctx) {
        ctx.save();
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
            ctx.beginPath();
            ctx.moveTo(this.position.x - this.width / 2, this.position.y - this.height / 2 - 10);
            ctx.lineTo(this.position.x + this.width / 2, this.position.y - this.height / 2 - 10);
            ctx.lineWidth = 3;
            ctx.strokeStyle = "blue";
            ctx.stroke();
        }

        ctx.restore();
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

    constructor(game, player) {
        super(game);
        this.player = player;
        this.drawOrder = 91;
        this.radius = 10;
        this.explosionRadius = BALL_EXPLOTION_RAD;
        this.generatingDelay = 2;
        this.launchSpeedList = [BALL_SPD_1, BALL_SPD_2, BALL_SPD_3];
        this.launchSpeed = this.launchSpeedList[0];
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

        this.brokenBlockCount = 0;
        let launchDirection = Vector2.subtract(fixedCursorPosition, this.position);
        launchDirection.setLength(this.launchSpeed);
        this.setSpeed(launchDirection);
        this.updateParrying();
        this.ignoreCollideWithPlayer = true;
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


    // 공의 최소 y좌표 속도 보장하려는 용도. 부자연스러워서 삭제함
    /*applyMinYSpeed() {
        if (-this.minYSpeed < this.speed.y && this.speed.y < this.minYSpeed) {
            if (this.speed.y <= 0)
                this.speed.y = -this.minYSpeed;
            else
                this.speed.y = this.minYSpeed;

            if (this.speed.x <= 0)
                this.speed.x = -Math.sqrt(this.launchSpeed * this.launchSpeed - this.minYSpeed * this.minYSpeed);
            else
                this.speed.x = Math.sqrt(this.launchSpeed * this.launchSpeed - this.minYSpeed * this.minYSpeed);
        }
    }*/

    draw(ctx) {
        ctx.save();

        ctx.globalAlpha = this.opacity;
        ctx.drawImage(img_playerBall, this.position.x - 30, this.position.y - 30);
        ctx.globalAlpha = 1;

        if (this.state == "reinforcing") {
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.arc(this.position.x, this.position.y, this.radius + 5, 0, Math.PI * 2);
            ctx.strokeStyle = "yellow";
            ctx.stroke();
        } else if (this.state == "reinforced") {
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.arc(this.position.x, this.position.y, this.radius + 5, 0, Math.PI * 2);
            ctx.strokeStyle = "red";
            ctx.stroke();
        }
        ctx.restore();
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
        this.createdTick = this.game.previousTicks;

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

        if (collisionInfo.component instanceof PlayerBall) {
            //충돌된 상자 제거
            this.destroyBox();
        }
        else if (collisionInfo.component instanceof PlayerBallExplosion && !(this instanceof CoreBox)) {
            this.destroyBox();
        }
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
        new Anime_explode(this.game, this.explodeSize, 0.02, this);

        this.destroyed = true;
    }

    updateShape() {
        let widthHeightHalf = new Vector2(this.width / 2, this.height / 2);
        this.shape.min = Vector2.subtract(this.position, widthHeightHalf);
        this.shape.max = Vector2.plus(this.position, widthHeightHalf);
    }

    draw(ctx) {

    }

    doAttack() { }
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

    constructor(game, position, wave) {
        super(game);
        this.leastSpeed = new Vector2(0, 300); // 몹이 추구하는 속도
        this.movingSpeed = new Vector2(0, 5); // 몹이 맵에 도착하면 leastSpeed를 이것으로 바꿀것임
        this.onKnockBack = false;
        this.position = new Vector2(position.x, position.y - wave * WAVE_DIST - WAVE_DEFAULT_DIST);
        this.arrivalPosY = position.y;

        this.prepareAtk = 1000;

        this.drawOrder = 40;
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
        if (this.position.y >= this.arrivalPosY) {
            this.leastSpeed = this.movingSpeed;
        }

        // 맵 끝으로 가버렸는가
        if (this.position.y > GAME_HEIGHT - 100) {
            this.leastSpeed = new Vector2(0, 100);
        }

        // 충분히 멀리 갔다면 폭발! (코어를 부숨)
        if (this.position.y > GAME_HEIGHT + 1000) {
            for (let box of this.boxList) {
                if (box instanceof CoreBox) box.destroyBox(box);
            }
        }
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

    //코어의 위치를 찾음.
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
                , ["b", " ", "n", "n", "c", "n", "c", "n", "n", " ", "b"]
                , ["b", " ", "n", "m", "n", "n", "n", "m", "n", " ", "b"]
                , ["b", " ", "n", "n", "n", "n", "n", "n", "n", " ", "b"]
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

        this.drawOrder = 40;
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

    processCollision(collisionInfo) {////////////////////////////////////////
        this.game.removeComponent(this);
        this.game.player.playerHurt(this.damage);
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
    box;

    constructor(game, size, spd, box) {
        super(game);
        this.size = size;
        this.opacity = 1;
        this.spd = spd;
        this.drawOrder = 2;
        this.box = box;
        this.position = Vector2.copy(this.box.position);

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
        ctx.drawImage(this.img, this.position.x - this.size / 2, this.position.y - this.size / 2, this.size, this.size);
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
