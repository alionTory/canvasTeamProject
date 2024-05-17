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
    }

    equals(vector) {
        return this.x == vector.x && this.y == vector.y;
    }

    plus(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }
    static plus(vectorA, vectorB) {
        return new Vector2(vectorA.x + vectorB.x, vectorA.y + vectorB.y);
    }

    multiply(number) {
        this.x *= number;
        this.y *= number;
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
    getCollisionInfo(shape) { }
}

class ShapeCircle extends Shape {
    position;
    radius;
    constructor(position, radius) {
        super();
        this.position = Vector2.copy(position);
        this.radius = radius
    }

    getCollisionInfo(shape) {
        if (shape instanceof ShapeAABB) {
            let nearestPoint = shape.getNearestPoint(this.position);
            let distanceSquared = Vector2.subtract(this.position, nearestPoint).getLengthSquared();
            return new CollisionInfo(distanceSquared <= this.radius * this.radius, nearestPoint);
        }
    }
}

// 좌표축에 평행한 직사각형 히트박스를 AABB라 한다.
class ShapeAABB extends Shape{
    min;
    max;
    constructor(min, max) {
        super();
        this.min = Vector2.copy(min);
        this.max = Vector2.copy(max);
    }

    getNearestPoint(point) {
        let nearestPoint = new Vector2();
        nearestPoint.x = Math.max(this.min.x, Math.min(point.x, this.max.x));
        nearestPoint.y = Math.max(this.min.y, Math.min(point.y, this.max.y));
        return nearestPoint;
    }
}


// 충돌 정보를 담은 클래스
class CollisionInfo {
    isCollided;
    nearestPoint;
    component;
    constructor(isCollided, nearestPoint=null, component=null) {
        this.isCollided = isCollided;
        this.nearestPoint = nearestPoint;
        this.component = component;
    }

    copy() {
        return new CollisionInfo(this.isCollided, Vector2.copy(this.nearestPoint), this.component);
    }
}