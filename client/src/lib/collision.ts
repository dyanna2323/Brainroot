/**
 * Collision Detection Utility Module
 * 
 * Provides simple AABB (Axis-Aligned Bounding Box) collision detection
 * for 3D game objects. Follows gamestack_js philosophy: straightforward
 * collision detection without complex physics libraries.
 */

/**
 * Represents a 3D axis-aligned bounding box
 */
export interface Box3D {
  /** Minimum corner of the box [x, y, z] */
  min: [number, number, number];
  /** Maximum corner of the box [x, y, z] */
  max: [number, number, number];
}

/**
 * Result of a collision test including collision details
 */
export interface CollisionResult {
  /** Whether a collision occurred */
  collided: boolean;
  /** Normal vector indicating the direction to push the object [x, y, z] */
  normal?: [number, number, number];
  /** How deep the objects penetrate each other */
  penetration?: number;
}

/**
 * Creates an AABB from a center position and size
 * 
 * @param position - Center position of the box [x, y, z]
 * @param size - Dimensions of the box [width, height, depth]
 * @returns Box3D with min and max corners
 * 
 * @example
 * const box = createBox([0, 1, 0], [2, 2, 2]);
 * // Creates a 2x2x2 box centered at (0, 1, 0)
 */
export function createBox(
  position: [number, number, number],
  size: [number, number, number]
): Box3D {
  const halfSize: [number, number, number] = [
    size[0] / 2,
    size[1] / 2,
    size[2] / 2
  ];
  
  return {
    min: [
      position[0] - halfSize[0],
      position[1] - halfSize[1],
      position[2] - halfSize[2]
    ],
    max: [
      position[0] + halfSize[0],
      position[1] + halfSize[1],
      position[2] + halfSize[2]
    ]
  };
}

/**
 * Checks if two AABBs are overlapping
 * 
 * Uses the separating axis theorem: if the boxes are separated on any axis,
 * they don't collide. Otherwise, they overlap.
 * 
 * @param boxA - First bounding box
 * @param boxB - Second bounding box
 * @returns true if boxes overlap on all three axes
 * 
 * @example
 * const box1 = createBox([0, 0, 0], [2, 2, 2]);
 * const box2 = createBox([1, 0, 0], [2, 2, 2]);
 * if (checkAABBCollision(box1, box2)) {
 *   console.log("Collision detected!");
 * }
 */
export function checkAABBCollision(boxA: Box3D, boxB: Box3D): boolean {
  // Check for overlap on all three axes
  const overlapX = boxA.min[0] <= boxB.max[0] && boxA.max[0] >= boxB.min[0];
  const overlapY = boxA.min[1] <= boxB.max[1] && boxA.max[1] >= boxB.min[1];
  const overlapZ = boxA.min[2] <= boxB.max[2] && boxA.max[2] >= boxB.min[2];
  
  // Collision occurs only if there's overlap on all axes
  return overlapX && overlapY && overlapZ;
}

/**
 * Resolves collision between two AABBs and returns detailed collision information
 * 
 * Calculates the collision normal (direction to push boxA) and penetration depth.
 * The normal points along the axis with the smallest penetration (minimum
 * translation vector).
 * 
 * @param boxA - First bounding box (the one to be pushed)
 * @param boxB - Second bounding box (the obstacle)
 * @returns CollisionResult with collision status, normal, and penetration depth
 * 
 * @example
 * const player = createBox([0, 0, 0], [1, 2, 1]);
 * const wall = createBox([2, 0, 0], [1, 3, 1]);
 * const result = resolveAABBCollision(player, wall);
 * if (result.collided && result.normal) {
 *   // Push player away from wall
 *   const pushX = result.normal[0] * result.penetration!;
 *   const pushY = result.normal[1] * result.penetration!;
 *   const pushZ = result.normal[2] * result.penetration!;
 * }
 */
export function resolveAABBCollision(boxA: Box3D, boxB: Box3D): CollisionResult {
  // First check if there's a collision
  if (!checkAABBCollision(boxA, boxB)) {
    return { collided: false };
  }
  
  // Calculate penetration on each axis
  const penetrationX = Math.min(
    boxA.max[0] - boxB.min[0],
    boxB.max[0] - boxA.min[0]
  );
  
  const penetrationY = Math.min(
    boxA.max[1] - boxB.min[1],
    boxB.max[1] - boxA.min[1]
  );
  
  const penetrationZ = Math.min(
    boxA.max[2] - boxB.min[2],
    boxB.max[2] - boxA.min[2]
  );
  
  // Find the axis with minimum penetration (this is the axis we should push along)
  let normal: [number, number, number];
  let penetration: number;
  
  if (penetrationX < penetrationY && penetrationX < penetrationZ) {
    // X axis has minimum penetration
    penetration = penetrationX;
    // Determine direction: push left or right?
    const centerAX = (boxA.min[0] + boxA.max[0]) / 2;
    const centerBX = (boxB.min[0] + boxB.max[0]) / 2;
    normal = centerAX < centerBX ? [-1, 0, 0] : [1, 0, 0];
  } else if (penetrationY < penetrationZ) {
    // Y axis has minimum penetration
    penetration = penetrationY;
    // Determine direction: push down or up?
    const centerAY = (boxA.min[1] + boxA.max[1]) / 2;
    const centerBY = (boxB.min[1] + boxB.max[1]) / 2;
    normal = centerAY < centerBY ? [0, -1, 0] : [0, 1, 0];
  } else {
    // Z axis has minimum penetration
    penetration = penetrationZ;
    // Determine direction: push back or forward?
    const centerAZ = (boxA.min[2] + boxA.max[2]) / 2;
    const centerBZ = (boxB.min[2] + boxB.max[2]) / 2;
    normal = centerAZ < centerBZ ? [0, 0, -1] : [0, 0, 1];
  }
  
  return {
    collided: true,
    normal,
    penetration
  };
}

/**
 * Converts obstacle bounds to a Box3D
 * 
 * Helper function to create Box3D from common obstacle bound format.
 * 
 * @param bounds - Obstacle bounds with position and size
 * @returns Box3D representation
 * 
 * @example
 * const obstacle = {
 *   position: [5, 0, 0] as [number, number, number],
 *   size: [2, 3, 2] as [number, number, number]
 * };
 * const box = getBoxFromBounds(obstacle);
 */
export function getBoxFromBounds(bounds: {
  position: [number, number, number];
  size: [number, number, number];
}): Box3D {
  return createBox(bounds.position, bounds.size);
}
