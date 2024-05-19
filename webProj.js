const gameInput = { left: false, right: false, click: false };
let cursorPosition = null;

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

// jquery 공식 문서에서는 $(document).ready() 대신 $(function() {})을 사용하도록 권장함.
$(function () {
    const gameCanvas = $("#game-canvas");

    cursorPosition = new Vector2(0, 0);
    $(document).on("mousemove", function (event) {
        cursorPosition.set(event.pageX - gameCanvas.offset().left, event.pageY - gameCanvas.offset().top);
    });

    // 디버그 용
    $(document).on("click", function (event) { console.log(cursorPosition); });

    const game = new Game(gameCanvas[0].getContext("2d"));

    $(gameCanvas).hover(
        function() {
            gameCanvas.addClass("hide_cursor");
    }, function() {
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
});
$(document).on("keyup", function (event) {
    if (event.code == "KeyA") {
        gameInput.left = false;
    }
    if (event.code == "KeyD") {
        gameInput.right = false;
    }
});

const GAME_WIDTH = 500;
const GAME_HEIGHT = 700;

class Game {
    level;

    ctx;
    fps;
    delta;
    previousTicks;
    components;  // drawOrder로 정렬된 Component 배열.
    collideablesWithBall;  // 플레이어의 공과 충돌 가능한 ComponentObject들
    player;
    playerArrow;
    playerBall;

    coin;
    heart;
    mobList;

    constructor(ctx) {
        this.level = 1; // 임시

        this.ctx = ctx;
        this.fps = 60;
        this.delta = 1 / this.fps;
        this.previousTicks = performance.now();
        this.components = [];
        this.collideablesWithBall = [];
        this.loadComponents();
        //setInterval(this.runLoop.bind(this), this.delta * 1000);
        requestAnimationFrame(this.runLoop.bind(this));

        this.coin = 0;
        this.heart = 1000;
    }

    loadComponents() {
        this.player = new Player(this);
        this.playerBall = new PlayerBall(this, this.player);
        this.playerArrow = new PlayerLaunchAngleArrow(this, this.player, this.playerBall);
        new Anime_background(this);


        this.levelStarter(this.level);
    }

    processInput() {
        this.player.processInput();
    }
    updateGame(timestamp) {
        this.delta = (timestamp - this.previousTicks) / 1000;
        if (this.delta > 0.05)
            this.delta = 0.05;
        this.previousTicks = timestamp;

        for (let component of this.components) {
            component.update(this.delta);
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
        this.processInput();
        this.updateGame(timestamp);
        this.generateOutput();
    }

    // components에 component를 정렬을 유지하며 추가
    addComponent(component) {
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
    // components 에서 component를 빈 공간이 생기지 않게 삭제.
    removeComponent(component) {
        let removeIndex = this.components.indexOf(component);
        if (removeIndex == -1) {
            console.error("Game removeComponent() : 배열에 지우려는 component가 없습니다.");
            return;  // return문 추가
        }
        this.components.splice(removeIndex, 1);
    }

    levelStarter(level) { // 코어가 부서질 때 레벨을 올릴지 판단할 것.
        //공 위치 초기화
        this.playerBall.speed = new Vector2(0, 40);
        this.playerBall.position = new Vector2(GAME_WIDTH / 2, GAME_HEIGHT - 150);

        //플레이어 위치 초기화
        this.player.position.x = GAME_WIDTH / 2;

        //몹 초기화
        this.mobList = [];

        //적공격들 초기화
        let removal = []; // 조건문의 배열요소 삭제로 인한 오류 예방함.
        for (let comp of this.components) {
            if (comp instanceof Attacks) {
                removal.push(comp);
            }
        }
        for (let comp of removal) {
            this.removeComponent(comp);
        }

        switch (level) {
            case 1:
                this.mobList.push(new Mob_pawn(this, new Vector2(100, 200)));
                this.mobList.push(new Mob_pawn(this, new Vector2(250, 200)));
                this.mobList.push(new Mob_pawn(this, new Vector2(400, 200)));
                this.mobList.push(new Mob_knight(this, new Vector2(250, 80)));
                break;

            case 2:
                this.mobList.push(new Mob_pawn(this, new Vector2(50, 100)));
                this.mobList.push(new Mob_pawn(this, new Vector2(250, 300)));
                this.mobList.push(new Mob_pawn(this, new Vector2(450, 100)));
                this.mobList.push(new Mob_rook(this, new Vector2(100, 300)));
                this.mobList.push(new Mob_rook(this, new Vector2(400, 300)));
                this.mobList.push(new Mob_bishop(this, new Vector2(250, 100)));
                break;

            case 3:
                this.mobList.push(new Mob_pawn(this, new Vector2(50, 100)));
                this.mobList.push(new Mob_pawn(this, new Vector2(450, 100)));
                this.mobList.push(new Mob_pawn(this, new Vector2(50, 300)));
                this.mobList.push(new Mob_pawn(this, new Vector2(450, 300)));
                this.mobList.push(new Mob_king(this, new Vector2(250, 300)));
                this.mobList.push(new Mob_qween(this, new Vector2(250, 100)));

                break;

            default:
                this.gameEnd();
        }
    }

    checkLevelUp() {
        if (this.mobList.length == 0) {
            console.log("lvup");

            //레벨 업! 표시

            this.level++;
            this.levelStarter(this.level);
        }
    }

    ballMissed() {
        //공 위치 초기화
        this.playerBall.speed = new Vector2(0, 40);
        this.playerBall.position = new Vector2(GAME_WIDTH / 2, GAME_HEIGHT - 150);
        this.playerHurt(330);
    }

    playerHurt(dmg) {
        console.log("heart : "+( this.heart -= dmg) + "(-" + dmg + ")");
    }
    addCoin(toAddCoin) {
        console.log("coin : "+( this.coin += toAddCoin) + "(+" + toAddCoin + ")");
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
        this.drawOrder = 100;
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


class Player extends ComponentObject {
    width;
    height;
    maxSpeed;
    launchDirection;
    constructor(game) {
        super(game);
        this.width = 81;
        this.height = 9;
        this.maxSpeed = 500;
        this.launchDirection = new Vector2(0, -1);
        this.position.set(GAME_WIDTH / 2, GAME_HEIGHT - this.height / 2 - 10);
        this.shape = new ShapeAABB(this, new Vector2(), new Vector2());
        game.collideablesWithBall.push(this);
    }

    updateShape() {
        let widthHeightHalf = new Vector2(this.width / 2, this.height / 2);
        this.shape.min = Vector2.subtract(this.position, widthHeightHalf);
        this.shape.max = Vector2.plus(this.position, widthHeightHalf);
    }

    processInput() {
        if (gameInput.left) {
            this.speed.set(-this.maxSpeed, 0);
        } else if (gameInput.right) {
            this.speed.set(this.maxSpeed, 0);
        } else {
            this.speed.set(0, 0);
        }
    }

    draw(ctx) {
        ctx.drawImage(img_player, this.position.x - 46.5, this.position.y - 10.5);
        if (this.game.previousTicks % 100 > 50) {
            if (gameInput.left) { ctx.drawImage(img_fireL, this.position.x - 10.5 + 60, this.position.y - 7.5); }
            if (gameInput.right) { ctx.drawImage(img_fireR, this.position.x - 10.5 - 60, this.position.y - 7.5); }
        }
        else {
            if (gameInput.left) { ctx.drawImage(img_fireL2, this.position.x - 10.5 + 60, this.position.y - 7.5); }
            if (gameInput.right) { ctx.drawImage(img_fireR2, this.position.x - 10.5 - 60, this.position.y - 7.5); }
        }
        
    }
}

class PlayerBall extends ComponentObject {
    player;
    radius;
    launchSpeed;
    minYSpeed;
    ignoreCollideWithPlayer;  // 플레이어와 충돌한 뒤에 일정 시간동안 플레이어와 충돌하지 않도록 함.
    constructor(game, player) {
        super(game);
        this.player = player;
        this.radius = 10;
        this.launchSpeed = 500;
        this.minYSpeed = 100;
        this.ignoreCollideWithPlayer = false;
        this.position.set(player.position.x, player.position.y + this.radius + player.height / 2);
        this.shape = new ShapeCircle(this, this.position, this.radius);
    }

    update(delta) {
        this.checkWallCollision();

        for (let collideable of this.game.collideablesWithBall) {
            if (this.game.components.indexOf(collideable) >= 0)
                ComponentObject.checkCollision(this, collideable);
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
        if (this.position.y >= this.radius + GAME_HEIGHT) {  // 공 놓침
            this.game.ballMissed();
        }
    }

    processCollision(collisionInfo) {
        if (collisionInfo.component instanceof Player) {
            this.collideWithPlayer();
        } else if (collisionInfo.component instanceof Mob || collisionInfo.component == "wall") {
            if (collisionInfo.nearestPoint == "left" && this.speed.x < 0)
                this.speed.x *= -1;
            else if (collisionInfo.nearestPoint == "right" && this.speed.x > 0)
                this.speed.x *= -1;
            if (collisionInfo.nearestPoint == "up" && this.speed.y < 0)
                this.speed.y *= -1;
            else if (collisionInfo.nearestPoint == "down" && this.speed.y > 0)
                this.speed.y *= -1;
        }
    }

    collideWithPlayer() {
        if (this.ignoreCollideWithPlayer)
            return;

        let launchDirection = Vector2.copy(this.player.launchDirection);
        launchDirection.setLength(this.launchSpeed);
        this.setSpeed(launchDirection);
        this.ignoreCollideWithPlayer = true;
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
        ctx.drawImage(img_playerBall, this.position.x - 30, this.position.y - 30);
    }

}

/**
 * 플레이어의 공 발사각을 설정하고
 * 발사각을 나타내는 화살표를 그리는 Component
 */
class PlayerLaunchAngleArrow extends Component {
    length;
    radianLimit;
    player;
    ball;
    XposFixer;
    constructor(game, player, ball) {
        super(game);
        this.length = 100;
        this.radianLimit = Math.PI / 6;
        this.player = player;
        this.ball = ball;
        this.XposFixer = 0;
    }

    update(delta) {
        let vectorToCursor = Vector2.subtract(cursorPosition, this.player.position);
        
        if (Math.abs(this.ball.position.x - this.player.position.x) < this.player.width / 2) {
            this.XposFixer = this.ball.position.x - this.player.position.x;
            vectorToCursor = Vector2.subtract(vectorToCursor, new Vector2(this.XposFixer, 0));
        }


        let radian = vectorToCursor.toRadian();
        if (-this.radianLimit < radian && radian < Math.PI / 2)
            radian = -this.radianLimit;
        if (Math.PI / 2 < radian || radian < this.radianLimit - Math.PI)
            radian = this.radianLimit - Math.PI;

        let arrowDirection = Vector2.fromRadian(radian);
        this.player.launchDirection = Vector2.subtract(Vector2.copy(arrowDirection), new Vector2(this.ballDirectionFixer, 0));
        this.position = arrowDirection.setLength(this.length).plus(this.player.position);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.moveTo(this.player.position.x + this.XposFixer, this.player.position.y);
        ctx.lineTo(cursorPosition.x, cursorPosition.y);
        ctx.stroke();

        ctx.drawImage(img_target, cursorPosition.x -20, cursorPosition.y -20, 40, 40);
    }
}

// 박스 관련

class Box extends ComponentObject {
    relativePosition;
    width;
    height;
    owner;
    price;
    interval;

    constructor(game, relativePosition, width, height, owner = null, boost) {
        super(game);
        this.relativePosition = relativePosition;
        this.position = Vector2.plus(owner.position, relativePosition);
        this.width = width;
        this.height = height;
        this.owner = owner;
        // Box의 위치 정보는 ShapeAABB의 2, 3 번째 매개변수로 전달됨.
        // 추가로 필요할 수 있는 건 속도 정보.
        // 그런데 Box의 속도는 무의미하므로 대신 owner의 속도 정보에 접근할 수 있도록 함.
        this.shape = new ShapeAABB(this.owner, new Vector2(), new Vector2());
        this.updateShape();
        this.drawOrder = 50;

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
    }

    doAttack(){};

    destroyBox() {
        let toAddCoin = 0;
        let explodeSize = 60;

        if (this instanceof CoreBox) { // 코어가 부서졌다면, 적 기체 제거 + 레벨증가조건 확인
            for (let b of this.owner.boxList) {
                this.game.removeComponent(b);
                toAddCoin += b.price + 20; // 코어 부술 시 추가 코인
                clearInterval(b.interval); // 공격 멈춤
            }

            explodeSize = 120;

            // owner도 components에서 제거
            this.game.removeComponent(this.owner);
            this.game.mobList.splice(this.game.mobList.indexOf(this.owner), 1);
            this.game.mobList.remove
            // 레벨 올릴지 검사
            this.game.checkLevelUp();

        } else if (this instanceof BarrierBox) {
            setTimeout(boxChange.bind(this), 1);

            function boxChange() {
                this.owner.boxList.push(new NormalBox(this.game, this.relativePosition, this.owner));
                this.game.removeComponent(this);
            }

        }
        else {
            this.game.removeComponent(this);
            toAddCoin += this.price;
            clearInterval(this.interval); // 공격 멈춤
        }

        //코인 얻음
        this.game.addCoin(toAddCoin);

        //애니메이션
        new Anime_explode(this.game, explodeSize, this);
    }

    updateShape() {
        let widthHeightHalf = new Vector2(this.width / 2, this.height / 2);
        this.shape.min = Vector2.subtract(this.position, widthHeightHalf);
        this.shape.max = Vector2.plus(this.position, widthHeightHalf);
    }

    draw(ctx) {

    }
}

class NormalBox extends Box {
    constructor(game, position, owner, boost) {
        super(game, position, 30, 30, owner, boost);
        this.price = 10;
    }

    draw(ctx) {
        super.draw(ctx);
        ctx.drawImage(img_normalBox, this.position.x - this.width / 2, this.position.y - this.height / 2);
    }
}

class CoreBox extends Box {
    constructor(game, position, owner, boost) {
        super(game, position, 30, 30, owner, boost);
        this.price = 200;
    }

    draw(ctx) {
        super.draw(ctx);
        ctx.drawImage(img_coreBox, this.position.x - this.width / 2, this.position.y - this.height / 2);
    }
}

class BarrierBox extends Box {
    constructor(game, position, owner, boost) {
        super(game, position, 30, 30, owner, boost);
        this.price = 95;
        this.drawOrder = 49; // 다른 box들은 50
    }

    draw(ctx) {
        super.draw(ctx);
        ctx.drawImage(img_barrierBox, this.position.x - this.width / 2, this.position.y - this.height / 2);
    }
}

class CannonBox extends Box {
    interval;
    coolTime;

    constructor(game, position, owner, boost) {
        super(game, position, 30, 30, owner, boost);
        this.price = 35;
        this.coolTime = 2000;
    }

    draw(ctx) {
        ctx.drawImage(img_cannonBox, this.position.x - this.width / 2, this.position.y - this.height / 2);
    }

    doAttack() {
    new Cannon(this.game, this);
    }
}

class MachinegunBox extends Box {
    interval;
    coolTime;

    constructor(game, position, owner, boost) {
        super(game, position, 30, 30, owner, boost);
        this.price = 70;
        this.coolTime = 3000;
    }

    draw(ctx) {
        ctx.drawImage(img_machinegunBox, this.position.x - this.width / 2, this.position.y - this.height / 2);
    }

    doAttack() {
        new Bullet(this.game, this);
        new Bullet(this.game, this);
        new Bullet(this.game, this);
    }
}

class LazerBox extends Box {
    interval;
    coolTime;

    constructor(game, position, owner, boost) {
        super(game, position, 30, 30, owner, boost);
        this.price = 100;
        this.coolTime = 6666;
        this.interval = setInterval(this.doAttack.bind(this), this.coolTime);
    }

    draw(ctx) {
        ctx.drawImage(img_lazerBox, this.position.x - this.width / 2, this.position.y - this.height / 2);
    }

    doAttack() {
        if (this.game.components.indexOf(this) < 0) {
            clearInterval(this.interval);
            return;
        }

        let lazer = new Lazer(this.game, this);
    }
}

// 몹 관련

class Mob extends ComponentObject {
    boxList = [];
    resistance;
    leastSpeed;

    arrivalPosY; // 몹이 생성되고 지정된 위치에 도착한다면 느려짐.

    prepareAtk;
    atkGap = 333;

    constructor(game, position) {
        super(game);
        this.leastSpeed = new Vector2(0, 300); //몹의 이속
        this.position = new Vector2(position.x, position.y - 700);
        this.arrivalPosY = position.y;

        this.prepareAtk = 1000;

        this.drawOrder = 40;
        setTimeout(this.attack.bind(this), this.prepareAtk );
    }

    processCollision(collisionInfo) {
        if (collisionInfo.component instanceof PlayerBall) {
            // 넉백
            let newSpeed = Vector2.subtract(this.position, collisionInfo.nearestPoint).setLength(collisionInfo.component.speed.getLength());
            this.speed = newSpeed;
        } else if (collisionInfo.component == "wall") {
            if (collisionInfo.nearestPoint == "left" || collisionInfo.nearestPoint == "right")
                this.speed.x *= -1;
            if (collisionInfo.nearestPoint == "up")
                this.speed.y *= -1;
        }
    }

    update(delta) {
        this.updateSpeed(delta);
        super.update(delta);
        this.isArrived();
    }

    attack() {
        let tmp = 0;
        for (let box of this.boxList) {
            setTimeout(function(){box.interval = setInterval(box.doAttack.bind(box), box.coolTime)}, tmp);
            tmp += this.atkGap;
        }
    }

    isArrived() {
        // 맵 내부로 도착했는가
        if (this.position.y >= this.arrivalPosY) {
            this.leastSpeed = new Vector2(0, 5);
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

class Mob_pawn extends Mob {

    constructor(game, position) {
        super(game, position);


        this.boxList.push(new CoreBox(game, new Vector2(), this, true));
        this.boxList.push(new CannonBox(game, new Vector2(0, 30), this));

        this.resistance = 1000;
    }

    draw() {
        this.game.ctx.drawImage(img_pawnBody, this.position.x - 105, this.position.y - 75);
    }
}

class Mob_knight extends Mob {

    constructor(game, position) {
        super(game, position);

        this.boxList.push(new CoreBox(game, new Vector2(), this, true));
        this.boxList.push(new BarrierBox(game, new Vector2(0, 30), this));
        this.boxList.push(new CannonBox(game, new Vector2(-30, 0), this));
        this.boxList.push(new CannonBox(game, new Vector2(30, 0), this));

        this.resistance = 1500;

    }

    draw() {
        this.game.ctx.drawImage(img_knightBody, this.position.x - 105, this.position.y - 75);
    }
}

class Mob_bishop extends Mob {

    constructor(game, position) {
        super(game, position);

        this.boxList.push(new CoreBox(game, new Vector2(), this));
        this.boxList.push(new BarrierBox(game, new Vector2(0, 30), this));
        this.boxList.push(new NormalBox(game, new Vector2(0, 60), this));
        this.boxList.push(new NormalBox(game, new Vector2(30, 0), this));
        this.boxList.push(new NormalBox(game, new Vector2(60, 0), this));
        this.boxList.push(new NormalBox(game, new Vector2(-30, 0), this));
        this.boxList.push(new NormalBox(game, new Vector2(-60, 0), this));
        this.boxList.push(new NormalBox(game, new Vector2(0, -30), this, true));
        this.boxList.push(new MachinegunBox(game, new Vector2(60, 30), this));
        this.boxList.push(new MachinegunBox(game, new Vector2(60, -30), this, true));
        this.boxList.push(new MachinegunBox(game, new Vector2(-60, 30), this));
        this.boxList.push(new MachinegunBox(game, new Vector2(-60, -30), this, true));

        this.resistance = 1800;
    }

    draw() {
        this.game.ctx.drawImage(img_bishopBody, this.position.x - 105, this.position.y - 75);
    }
}

class Mob_rook extends Mob {

    constructor(game, position) {
        super(game, position);

        this.boxList.push(new CoreBox(game, new Vector2(), this));
        this.boxList.push(new BarrierBox(game, new Vector2(0, 30), this));
        this.boxList.push(new NormalBox(game, new Vector2(0, 60), this));
        this.boxList.push(new NormalBox(game, new Vector2(30, -30), this, true));
        this.boxList.push(new NormalBox(game, new Vector2(30, 0), this));
        this.boxList.push(new NormalBox(game, new Vector2(30, 30), this));
        this.boxList.push(new NormalBox(game, new Vector2(30, 60), this));
        this.boxList.push(new NormalBox(game, new Vector2(-30, -30), this, true));
        this.boxList.push(new NormalBox(game, new Vector2(-30, 0), this));
        this.boxList.push(new NormalBox(game, new Vector2(-30, 30), this));
        this.boxList.push(new NormalBox(game, new Vector2(-30, 60), this));
        this.boxList.push(new LazerBox(game, new Vector2(0, -30), this, true));

        this.resistance = 1800;
    }

    draw() {
        this.game.ctx.drawImage(img_rookBody, this.position.x - 105, this.position.y - 75);
    }
}

class Mob_qween extends Mob {

    constructor(game, position) {
        super(game, position);

        for (let i = -1; i < 2; i++) {
            for (let j = -2; j < 3; j++) {
                if (i == 0 && j == 0) {
                    this.boxList.push(new CoreBox(game, new Vector2(), this));
                    continue;
                }

                else this.boxList.push(new MachinegunBox(game, new Vector2(i * 30, j * 30), this));
            }
        }

        this.resistance = 9000;
    }

    draw() {
        //this.game.ctx.drawImage(img_rookBody, this.position.x -105  , this.position.y - 75);
    }
}

class Mob_king extends Mob {

    constructor(game, position) {
        super(game, position);

        for (let i = -2; i < 3; i++) {
            for (let j = -2; j < 4; j++) {
                if (i == 0 && j == 0) {
                    this.boxList.push(new CoreBox(game, new Vector2(), this));
                    continue;
                }

                else this.boxList.push(new BarrierBox(game, new Vector2(i * 30, j * 30), this));
            }
        }

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

        this.newSpeed = new Vector2((this.player.position.x - this.box.position.x), (this.player.position.y - this.box.position.y));
        this.speed = new Vector2(this.spdScalar * this.newSpeed.x / this.newSpeed.y + this.angleError, this.spdScalar);

        this.shape = new ShapeCircle(this, this.position, this.radius);

        this.drawOrder = 30;
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
        this.game.playerHurt(this.damage);
    }
}

class Cannon extends Attacks {
    constructor(game, box) {
        let radius = 10;
        let spdScalar = 200;
        let damage = 20;
        let err = 30;
        super(game, box, radius, spdScalar, damage, err);
    }

    draw(ctx) {
        this.game.ctx.drawImage(img_cannon, this.position.x - 30, this.position.y - 30);
    }
}

class Bullet extends Attacks {
    constructor(game, box) {
        let radius = 5;
        let spdScalar = 260;
        let damage = 10;
        let err = 80;
        super(game, box, radius, spdScalar, damage, err);
    }
    draw(ctx) {
        this.game.ctx.drawImage(img_bullet, this.position.x - 30, this.position.y - 30);
    }
}

class Lazer extends Attacks {
    constructor(game, box) {
        let radius = 30;
        let spdScalar = 50;
        let damage = 5;
        let err = 0;
        super(game, box, radius, spdScalar, damage, err);
    }
    draw(ctx) {
        this.game.ctx.drawImage(img_lazer, this.position.x - this.radius  , this.position.y - this.radius, this.radius*2, this.radius*2);
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

    draw(ctx) {}

}

class Anime_background extends Anime {
    constructor(game) {
        super(game);
        this.img = img_background1;
        this.spd = 0.01;
        this.drawOrder = 99;
    }

    draw(ctx) {
        ctx.drawImage(this.img, 0, this.spd * this.game.previousTicks % GAME_WIDTH - 700);
    }        
}

class Anime_explode extends Anime { // 미완성
    box;

    constructor(game, size, box) {
        super(game);
        this.size = size;
        this.opacity = 1;
        this.spd = 0.02;
        this.drawOrder = 98;
        this.box = box;
        this.position = Vector2.copy(this.box.position);

        this.img = img_explode1;
    }

    update(delta) {
        if (this.opacity > 0.5) {
            this.size *= 1+this.spd;
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
        this.drawOrder = 97;
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
        if (this.game.previousTicks % this.spd > this.spd/2) {
            ctx.drawImage(img_fireD, this.box.position.x - 10.5, this.box.position.y - 50.5);
        }
        else {
            ctx.drawImage(img_fireD2, this.box.position.x - 10.5, this.box.position.y - 50.5);
        }
        ctx.globalAlpha = 1;
    }
}