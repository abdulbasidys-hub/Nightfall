export const orbitGeometry = {
  center: 250,
  radiusX: 205,
  radiusY: 110,
  badgeRadius: 28,
  rotations: [42, -32, 88],
} as const;

export function pointOnOrbit(rotation: number, angle: number) {
  const radians = Math.PI / 180;
  const x = orbitGeometry.radiusX * Math.cos(angle * radians);
  const y = orbitGeometry.radiusY * Math.sin(angle * radians);
  const tilt = rotation * radians;
  return {
    x: orbitGeometry.center + x * Math.cos(tilt) - y * Math.sin(tilt),
    y: orbitGeometry.center + x * Math.sin(tilt) + y * Math.cos(tilt),
  };
}

export const orbitNodes = [
  {kind: 'design', rotation: 42, angle: 200},
  {kind: 'code', rotation: -32, angle: 0},
  {kind: 'automation', rotation: -32, angle: 180},
  {kind: 'growth', rotation: 42, angle: 20},
] as const;
