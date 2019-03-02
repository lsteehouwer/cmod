import { Drawing } from "./drawing";
import { Vector2D } from "src/shapes/vector2d";

export interface Hittable extends Drawing {
    hit(point: Vector2D, context: CanvasRenderingContext2D): boolean;
}

export function isHittable(object: any): object is Hittable {
    return 'hit' in object;
}
