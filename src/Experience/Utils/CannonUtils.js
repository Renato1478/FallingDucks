import * as CANNON from "cannon-es";

export const createPhysicsBox = (width, height, depth, position, material) => {
  const shape = new CANNON.Box(
    new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
  );
  const body = new CANNON.Body({
    position: {
      x: position.x,
      y: position.y,
      z: position.z,
    },
    mass: width * height * depth,
    shape,
    material,
  });

  return { shape, body };
};
