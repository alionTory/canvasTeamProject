class Vector2 {
    x;
    y;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    static copy(vector) {
        return new Vector2(vector.x, vector.y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    equals(vector) {
        return this.x == vector.x && this.y == vector.y;
    }

    plus(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }
    static plus(vectorA, vectorB) {
        return new Vector2(vectorA.x + vectorB.x, vectorA.y + vectorB.y);
    }

    multiply(number) {
        this.x *= number;
        this.y *= number;
        return this;
    }
    static multiply(vector, number) {
        return new Vector2(vector.x * number, vector.y * number);
    }

    static subtract(vectorA, vectorB) {
        return new Vector2(vectorA.x - vectorB.x, vectorA.y - vectorB.y);
    }

    getLengthSquared() {
        return this.x * this.x + this.y * this.y;
    }
    getLength() {
        return Math.sqrt(this.getLengthSquared());
    }
    nomalize() {
        let vectorLength = this.getLength();
        if (vectorLength == 0) {
            console.error("Vector2 nomalize error : 길이가 0인 벡터를 정규화할 수 없습니다.");
            return;
        }
        this.x /= vectorLength;
        this.y /= vectorLength;
        return this;
    }
    setLength(newLength) {
        this.nomalize();
        this.x *= newLength;
        this.y *= newLength;
        return this;
    }

    static dot(vectorA, vectorB) {
        return vectorA.x * vectorB.x + vectorA.y * vectorB.y;
    }

    static reflect(vectorA, vectorNomal) {
        return Vector2.subtract(vectorA, Vector2.multiply(vectorNomal, 2 * Vector2.dot(vectorA, vectorNomal)));
    }
    // static fromRadian(radian) {
    //     return new Vector2(Math.cos(radian), Math.sin(radian));
    // }

}

// 충돌 판정을 위한 클래스. ComponentObject의 필드로 저장된다.
class Shape {
    owner;
    constructor(owner) {
        this.owner = owner;
    }
    getCollisionInfo(shape) { }
}

class ShapeCircle extends Shape {
    position;
    radius;
    constructor(owner, position, radius) {
        super(owner);
        this.position = Vector2.copy(position);
        this.radius = radius
    }

    // AABB의 whatSideHavePoint를 Circle 관점으로 변환
    static getCollisionPointFromBoxSide(whatSide) {
        if (whatSide == "up") return "down";
        if (whatSide == "down") return "up";
        if (whatSide == "left") return "right";
        if (whatSide == "right") return "left";
        return null;
    }

    getCollisionInfo(shape) {
        if (shape instanceof ShapeAABB) {
            let circleCollisionInfo, boxCollisionInfo;
            let whatSide;
            let nearestPoint = shape.getNearestPoint(this.position);
            // 원의 중심이 상자 안에 들어온 경우
            if (shape.min.x <= this.position.x && this.position.x <= shape.max.x
                && shape.min.y <= this.position.y && this.position.y <= shape.max.y) {
                let actualCollisionPoint = shape.assumeCollisionPointWithSpeed(this.position, this.owner.speed);
                whatSide = shape.whatSideHavePoint(actualCollisionPoint);
                circleCollisionInfo = new CollisionInfo(true, ShapeCircle.getCollisionPointFromBoxSide(whatSide), shape.owner);
                boxCollisionInfo = new CollisionInfo(true, actualCollisionPoint, this.owner);
            } else {  // 원의 중심이 상자 밖에 있는 경우
                whatSide = shape.whatSideHavePoint(nearestPoint);
                let distanceSquared = Vector2.subtract(this.position, nearestPoint).getLengthSquared();
                let colided = distanceSquared <= this.radius * this.radius;
                circleCollisionInfo = new CollisionInfo(colided, ShapeCircle.getCollisionPointFromBoxSide(whatSide), shape.owner);
                boxCollisionInfo = new CollisionInfo(colided, nearestPoint, this.owner);
            }

            // 디버깅용
            if (whatSide == null) {
                console.error("getCollisionInfo : 추정된 충돌지점이 상자의 변에 존재하지 않습니다.");
                console.log(`collisionPoint : (${circleCollisionInfo.nearestPoint.x}, ${circleCollisionInfo.nearestPoint.y})`);
                console.log(`AABB : (${shape.min.x}, ${shape.min.y}), (${shape.max.x}, ${shape.max.y})`);
            }
            return [circleCollisionInfo, boxCollisionInfo];
        }
    }
}

// 좌표축에 평행한 직사각형 히트박스를 AABB라 한다.
class ShapeAABB extends Shape {
    min;
    max;
    constructor(owner, min, max) {
        super(owner);
        this.min = Vector2.copy(min);
        this.max = Vector2.copy(max);
    }

    getNearestPoint(point) {
        let nearestPoint = new Vector2();
        nearestPoint.x = Math.max(this.min.x, Math.min(point.x, this.max.x));
        nearestPoint.y = Math.max(this.min.y, Math.min(point.y, this.max.y));
        return nearestPoint;
    }

    // 충돌하는 물체 중심이 상자 안으로 뚫고 들어온 경우
    // 물체의 속도를 이용해 실제 충돌 지점을 구하는 메소드
    // point : 물체 중심, speed : 물체 속도
    // speed의 x,y 중 하나가 0이여도 됨. 그러나 둘다 0이면 오작동.
    assumeCollisionPointWithSpeed(point, speed) {
        // speed의 x축에 얼마를 곱해야 상자의 변에 도달하는지를 저장하는 변수
        // speed가 0이면 Infinity가 됨
        let ratioX;
        // speed가 음수이면 distance도 음수가 됨에 주의
        let distanceX;
        if (speed.x < 0)
            distanceX = this.min.x - point.x;
        else
            distanceX = this.max.x - point.x;
        ratioX = distanceX / speed.x;

        let ratioY, distanceY;
        if (speed.y < 0)
            distanceY = this.min.y - point.y;
        else
            distanceY = this.max.y - point.y;
        ratioY = distanceY / speed.y;

        return Vector2.copy(speed).multiply(Math.min(ratioX, ratioY)).plus(point);
    }

    // 점이 사각형의 어느 변에 존재하는가
    whatSideHavePoint(point) {
        if (point.y == this.max.y) return "down";
        if (point.y == this.min.y) return "up";
        if (point.x == this.min.x) return "left";
        if (point.x == this.max.x) return "right";
        return null;
    }
}


// 충돌 정보를 담은 클래스
class CollisionInfo {
    isCollided;
    nearestPoint;
    component;  // 충돌 상대가 누구인가
    constructor(isCollided, nearestPoint = null, component = null) {
        this.isCollided = isCollided;
        this.nearestPoint = nearestPoint;
        this.component = component;
    }

    copy() {
        return new CollisionInfo(this.isCollided, Vector2.copy(this.nearestPoint), this.component);
    }
}