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
        this.playerArrow = new PlayerLaunchAngleArrow(this, this.player);
        this.playerBall = new PlayerBall(this, this.player);
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

        //총알들 초기화
        for (let comp of this.components) {
            if (comp instanceof Attacks) {
                this.removeComponent(comp);
            }
        }

        switch(level) {
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
                if (collisionInfo.isCollided) {
                    collisionInfo.component = object2;
                    object1.processCollision(collisionInfo);

                    collisionInfo = collisionInfo.copy();
                    collisionInfo.component = object1;
                    object2.processCollision(collisionInfo);
                }
            }
        }
    }
}


class Player extends ComponentObject {
    width;
    height;
    maxSpeed;
    constructor(game) {
        super(game);
        this.width = 80;
        this.height = 10;
        this.maxSpeed = 500;
        this.position.set(GAME_WIDTH / 2, GAME_HEIGHT - this.height / 2 - 10);
        this.shape = new ShapeAABB(new Vector2(), new Vector2());
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
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);
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
        this.shape = new ShapeCircle(this.position, this.radius);
    }

    update(delta) {
        // 벽과의 충돌 계산
        if (this.position.x <= this.radius && this.speed.x < 0) {  // 왼쪽 벽
            this.speed.x *= -1;
        }
        else if (GAME_WIDTH - this.position.x <= this.radius && this.speed.x > 0) {  // 오른쪽 벽
            this.speed.x *= -1;
        }

        if (this.position.y <= this.radius && this.speed.y < 0) {  // 위쪽 벽과 충돌 계산
            this.speed.y *= -1;
        }

        for (let collideable of this.game.collideablesWithBall) {
            if (this.game.components.indexOf(collideable) >= 0)
                ComponentObject.checkCollision(this, collideable);
            // let collideInfo = this.shape.getCollisionInfo(collideable.shape);
            // if (collideInfo.isCollided) {
            //     if (collideable instanceof Player) {
            //         this.collideWithPlayer();
            //     } else {
            //         let normal = Vector2.subtract(this.position, collideInfo.nearestPoint).nomalize();
            //         let newSpeed = Vector2.reflect(this.speed, normal);
            //         this.speed = newSpeed;
            //     }
            // }
        }

        //this.applyMinYSpeed();

        super.update(delta);

        // 플레이어와의 충돌 무효 시간 해제
        if (this.ignoreCollideWithPlayer && this.game.player.height / 2 + this.radius < this.game.player.position.y - this.position.y) {
            this.ignoreCollideWithPlayer = false;
        }
    }

    updateShape() {
        this.shape.position = Vector2.copy(this.position);
    }

    processCollision(collisionInfo) {
        if (collisionInfo.component instanceof Player) {
            this.collideWithPlayer();
        } else {
            let normal = Vector2.subtract(this.position, collisionInfo.nearestPoint).nomalize();
            // 공이 좌우로만 움직이는 걸 방지하기 위해
            // 박스 모서리에 부딪혀도 y방향만 바뀌도록 함.
            if (normal.x != 0 && normal.y != 0)
                normal.y = 0;
            let newSpeed = Vector2.reflect(this.speed, normal);
            this.speed = newSpeed;
        }
    }

    collideWithPlayer() {
        if (this.ignoreCollideWithPlayer)
            return;

        let launchDirection = Vector2.subtract(cursorPosition, this.position);
        launchDirection.setLength(this.launchSpeed);
        this.setSpeed(launchDirection);
        this.ignoreCollideWithPlayer = true;
    }

    // 공의 최소 y좌표 속도 보장
    applyMinYSpeed() {
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
    }

    draw(ctx) {
        ctx.drawImage(img_playerBall, this.position.x - 30, this.position.y - 30);
    }

}

class PlayerLaunchAngleArrow extends Component {
    length;
    player;
    constructor(game, player) {
        super(game);
        this.length = 100;
        this.player = player;
    }

    update(delta) {
        let vectorToCursor = Vector2.subtract(cursorPosition, this.player.position);
        vectorToCursor.setLength(this.length);
        this.position = Vector2.plus(this.player.position, vectorToCursor);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.player.position.x, this.player.position.y);
        ctx.lineTo(this.position.x, this.position.y);
        ctx.stroke();
    }
}

// 박스 관련

class Box extends ComponentObject {
    width;
    height;
    owner;
    price;
    constructor(game, position, width, height, owner = null) {
        super(game);
        this.position = Vector2.copy(position);
        this.width = width;
        this.height = height;
        this.owner = owner;
        this.shape = new ShapeAABB(new Vector2(), new Vector2());
        this.updateShape();

        this.drawOrder = 50;

        game.collideablesWithBall.push(this);
    }

    update(delta) {
        this.speed = Vector2.copy(this.owner.speed);
        super.update(delta);
    }

    processCollision(collisionInfo) {
        this.owner.processCollision(collisionInfo);

        if (collisionInfo.component instanceof PlayerBall) {
            //충돌된 상자 제거
            this.destroyBox();
        }
    }

    destroyBox() {  
        let toAddCoin = 0;
        if (this instanceof CoreBox) { // 코어가 부서졌다면, 적 기체 제거 + 레벨증가조건 확인
            for (let b of this.owner.boxList) {
                if (this.game.components.indexOf(b) >= 0) {
                    this.game.removeComponent(b);
                    toAddCoin += b.price + 20; // 코어 부술 시 추가 코인
                }
            }

            // owner도 components에서 제거
            this.game.removeComponent(this.owner);
            this.game.mobList.splice(this.game.mobList.indexOf(this.owner),1);
            this.game.mobList.remove
            // 레벨 올릴지 검사
            this.game.checkLevelUp();

        } else if (this instanceof BarrierBox) {
            setTimeout(boxChange.bind(this), 1);

            function boxChange() {
                this.owner.boxList.push(new NormalBox(this.game, this.position, this.owner));
                this.game.removeComponent(this);
            }

        }
        else {
            this.game.removeComponent(this);
            toAddCoin += this.price;
        }

        //코인 얼마나 벌었는지
        this.game.coin += toAddCoin;
        console.log(this.game.coin + "( + " + toAddCoin + ")");
    }

    updateShape() {
        let widthHeightHalf = new Vector2(this.width / 2, this.height / 2);
        this.shape.min = Vector2.subtract(this.position, widthHeightHalf);
        this.shape.max = Vector2.plus(this.position, widthHeightHalf);
    }

    draw(ctx) {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);
    }
}

class NormalBox extends Box {
    constructor(game, position, owner) {
        super(game, position, 30, 30, owner);
        this.price = 10;
    }

    draw(ctx) {
        // ctx.fillStyle = "lightGray";
        // ctx.fillRect(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);
        ctx.drawImage(img_normalBox, this.position.x - this.width / 2, this.position.y - this.height / 2);
    }
}

class CoreBox extends Box {
    constructor(game, position, owner) {
        super(game, position, 30, 30, owner);
        this.price = 200;
    }

    draw(ctx) {
        ctx.drawImage(img_coreBox, this.position.x - this.width / 2, this.position.y - this.height / 2);
    }
}

class BarrierBox extends Box {
    constructor(game, position, owner) {
        super(game, position, 30, 30, owner);
        this.price = 95;
        this.drawOrder = 49; // 다른 box들은 50
    }

    draw(ctx) {
        ctx.drawImage(img_barrierBox, this.position.x - this.width / 2, this.position.y - this.height / 2);
    }
}

class CannonBox extends Box {
    interval;
    coolTime;

    constructor(game, position, owner) {
        super(game, position, 30, 30, owner);
        this.price = 35;
        this.coolTime = 2000;
        this.interval = setInterval(this.doAttack.bind(this), this.coolTime);
    }

    draw(ctx) {
        ctx.drawImage(img_cannonBox, this.position.x - this.width / 2, this.position.y - this.height / 2);
    }

    doAttack() {
        if (this.game.components.indexOf(this) < 0 ) {
            clearInterval(this.interval);
            return;
        }

        let cannon = new Cannon(this.game, this);
    }
}

class MachinegunBox extends Box {
    interval;
    coolTime;

    constructor(game, position, owner) {
        super(game, position, 30, 30, owner);
        this.price = 70;
        this.coolTime = 3000;
        this.interval = setInterval(this.doAttack.bind(this), this.coolTime);
    }

    draw(ctx) {
        ctx.drawImage(img_machinegunBox, this.position.x - this.width / 2, this.position.y - this.height / 2);
    }

    doAttack() {
        if (this.game.components.indexOf(this) < 0 ) {
            clearInterval(this.interval);
        return;
    }
        let bullet1 = new Bullet(this.game, this);
        let bullet2 = new Bullet(this.game, this);
        let bullet3 = new Bullet(this.game, this);
    }
}

class LazerBox extends Box {
    interval;
    coolTime;

    constructor(game, position, owner) {
        super(game, position, 30, 30, owner);
        this.price = 100;
        this.coolTime = 6666;
        this.interval = setInterval(this.doAttack.bind(this), this.coolTime);
    }

    draw(ctx) {
        ctx.drawImage(img_lazerBox, this.position.x - this.width / 2, this.position.y - this.height / 2);
    }

    doAttack() {
        if (this.game.components.indexOf(this) < 0 ) {
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

    constructor(game, position) {
        super(game);
        this.leastSpeed = new Vector2(0, 300); //몹의 이속
        this.position = new Vector2(position.x, position.y - 700);
        this.arrivalPosY = position.y;

        this.drawOrder = 40;
    }

    processCollision(collisionInfo) {
        // 넉백
        let newSpeed = Vector2.subtract(this.position, collisionInfo.nearestPoint).setLength(collisionInfo.component.speed.getLength());
        this.speed = newSpeed;
    }

    update(delta) {
        this.updateSpeed(delta);
        super.update(delta);
        this.isArrived();
    }

    isArrived() { 
        // 맵 내부로 도착했는가
        if (this.position.y >= this.arrivalPosY) {
            this.leastSpeed = new Vector2(0, 5);
        }

        // 맵 끝으로 가버렸는가
        if (this.position.y > GAME_HEIGHT - 100) {
            console.log(this.leastSpeed);
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
        if (this.speed.y <= this.leastSpeed.y && this.position.y >= this.arrivalPosY) {
            this.resistance = 100;
        }
    }
}

class Mob_pawn extends Mob {

    constructor(game, position) {
        super(game, position);

        this.boxList.push(new CoreBox(game, this.position, this));
        this.boxList.push(new CannonBox(game, new Vector2(this.position.x, this.position.y + 30), this));

        this.resistance = 1000;

    }

    draw() {
        this.game.ctx.drawImage(img_pawnBody, this.position.x - 105, this.position.y - 75);
    }
}

class Mob_knight extends Mob{
    
    constructor(game, position) {
        super(game, position);
         
        this.boxList.push (new CoreBox(game, this.position, this));
        this.boxList.push (new BarrierBox(game, new Vector2(this.position.x + 0, this.position.y + 30), this));
        this.boxList.push (new CannonBox(game, new Vector2(this.position.x - 30, this.position.y + 0), this));
        this.boxList.push (new CannonBox(game, new Vector2(this.position.x + 30, this.position.y + 0), this));

        this.resistance = 1500;

    }

    draw() {
        this.game.ctx.drawImage(img_knightBody, this.position.x -105  , this.position.y - 75);
    }
}

class Mob_bishop extends Mob{
    
    constructor(game, position) {
        super(game, position);
         
        this.boxList.push (new CoreBox(game, this.position, this));
        this.boxList.push (new BarrierBox(game, new Vector2(this.position.x + 0, this.position.y + 30), this));
        this.boxList.push (new NormalBox(game, new Vector2(this.position.x + 0, this.position.y + 60), this));
        this.boxList.push (new NormalBox(game, new Vector2(this.position.x + 30, this.position.y + 0), this));
        this.boxList.push (new NormalBox(game, new Vector2(this.position.x + 60, this.position.y + 0), this));
        this.boxList.push (new NormalBox(game, new Vector2(this.position.x - 30, this.position.y + 0), this));
        this.boxList.push (new NormalBox(game, new Vector2(this.position.x - 60, this.position.y + 0), this));
        this.boxList.push (new NormalBox(game, new Vector2(this.position.x + 0, this.position.y - 30), this));
        this.boxList.push (new MachinegunBox(game, new Vector2(this.position.x + 60, this.position.y + 30), this));
        this.boxList.push (new MachinegunBox(game, new Vector2(this.position.x + 60, this.position.y - 30), this));
        this.boxList.push (new MachinegunBox(game, new Vector2(this.position.x - 60, this.position.y + 30), this));
        this.boxList.push (new MachinegunBox(game, new Vector2(this.position.x - 60, this.position.y - 30), this));
    
        this.resistance = 1800;
    }

    draw() {
        this.game.ctx.drawImage(img_bishopBody, this.position.x -105  , this.position.y - 75);
    }
}

class Mob_rook extends Mob{
    
    constructor(game, position) {
        super(game, position);
         
        this.boxList.push (new CoreBox(game, this.position, this));
        this.boxList.push (new BarrierBox(game, new Vector2(this.position.x + 0, this.position.y + 30), this));
        this.boxList.push (new NormalBox(game, new Vector2(this.position.x + 0, this.position.y + 60), this));
        this.boxList.push (new NormalBox(game, new Vector2(this.position.x + 30, this.position.y - 30), this));
        this.boxList.push (new NormalBox(game, new Vector2(this.position.x + 30, this.position.y + 0), this));
        this.boxList.push (new NormalBox(game, new Vector2(this.position.x + 30, this.position.y + 30), this));
        this.boxList.push (new NormalBox(game, new Vector2(this.position.x + 30, this.position.y + 60), this));
        this.boxList.push (new NormalBox(game, new Vector2(this.position.x - 30, this.position.y - 30), this));
        this.boxList.push (new NormalBox(game, new Vector2(this.position.x - 30, this.position.y + 0), this));
        this.boxList.push (new NormalBox(game, new Vector2(this.position.x - 30, this.position.y + 30), this));
        this.boxList.push (new NormalBox(game, new Vector2(this.position.x - 30, this.position.y + 60), this));
        this.boxList.push (new LazerBox(game, new Vector2(this.position.x + 0, this.position.y - 30), this));

        this.resistance = 1800;
    }

    draw() {
        this.game.ctx.drawImage(img_rookBody, this.position.x -105  , this.position.y - 75);
    }
}

class Mob_qween extends Mob{
    
    constructor(game, position) {
        super(game, position);

        for (let i = -1; i < 2; i++) {
            for (let j = -2; j < 3; j++) {
                if (i == 0 && j == 0) {
                    this.boxList.push (new CoreBox(game, this.position, this));
                    continue;
                }

                else this.boxList.push (new MachinegunBox(game, new Vector2(this.position.x + i*30, this.position.y + j*30), this));
            }
        }

        this.resistance = 9000;
    }

    draw() {
        //this.game.ctx.drawImage(img_rookBody, this.position.x -105  , this.position.y - 75);
    }
}

class Mob_king extends Mob{
    
    constructor(game, position) {
        super(game, position);

        for (let i = -2; i < 3; i++) {
            for (let j = -2; j < 4; j++) {
                if (i == 0 && j == 0) {
                    this.boxList.push (new CoreBox(game, this.position, this));
                    continue;
                }

                else this.boxList.push (new BarrierBox(game, new Vector2(this.position.x + i*30, this.position.y + j*30), this));
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
        this.angleError = Math.random() * this.err -0.5 * err;

        this.newSpeed = new Vector2((this.player.position.x - this.box.position.x), (this.player.position.y - this.box.position.y));
        this.speed = new Vector2(this.spdScalar * this.newSpeed.x/this.newSpeed.y + this.angleError, this.spdScalar);
        
        this.shape = new ShapeCircle(this.position, this.radius);

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
        this.game.heart -= this.damage;
        console.log(this.game.heart);
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
        this.game.ctx.drawImage(img_cannon, this.position.x -30  , this.position.y - 30);
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
        this.game.ctx.drawImage(img_bullet, this.position.x -30  , this.position.y - 30);
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
        this.game.ctx.drawImage(img_lazer, this.position.x -30  , this.position.y - 30);
    }
}

class Anime_background extends Component{
    spd;

    constructor(game) {
        super(game);
        this.spd = 0.01;
        this.drawOrder = 99;
    }

    draw(ctx) {
        ctx.drawImage(img_background1, 0, this.spd * this.game.previousTicks % GAME_WIDTH - 700);
    }        
}

class Anime_explode extends Component{ // 미완성
    spd;
    size;
    opacity;

    constructor(game, size) {
        super(game);

        this.size = size;
        this.opacity = 1;
        this.spd = 0.01;
        this.drawOrder = 99;
    }

    update(delta) {
        if (this.opacity > 0) {
            this.size *= 1.1;
            opacity -= this.spd;
            this.globalAlpha = opacity;
        } else {
            removeComponent(this);
        }
        super.update(delta);
    }

    draw(ctx) {
        //ctx.drawImage(img_background1, 0, this.spd * this.game.previousTicks % GAME_WIDTH - 700);
    }        
}