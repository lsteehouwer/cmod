class Vector2D {
    public vec: Vector;

    public constructor(x: number, y: number) {
        this.vec = new Vector(2);
        this.vec.set(0, x);
        this.vec.set(1, y);
    }

    public x() {
        return this.vec.get(0);
    }

    public y() {
        return this.vec.get(1);
    }

    public static add(lhs: Vector2D, rhs: Vector2D) {
        let vec = Vector.add(lhs.vec, rhs.vec);
        return new Vector2D(vec.get(0), vec.get(1));
    }

    public static sub(lhs: Vector2D, rhs: Vector2D) {
        let rhss = Vector2D.scale(rhs, -1);
        return Vector2D.add(lhs, rhss);
    }

    public static scale(v: Vector2D, t: number) {
        let r = Vector.scale(v.vec, t);
        return new Vector2D(r.get(0), r.get(1));
    }

    public static norm(v: Vector2D) {
        return Vector.norm(v.vec);
    }

    public static unit(v: Vector2D) {
        let norm = Vector2D.norm(v);
        return Vector2D.scale(v, 1 / norm);
    }
}