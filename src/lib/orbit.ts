export const orbitGeometry = {
  center: 250,
  radiusX: 205,
  radiusY: 110,
  uprightRadiusX: 160,
  badgeRadius: 28,
  rotations: [12, -28, 78],
} as const;

export function radiusForOrbit(rotation: number) {
  return rotation === orbitGeometry.rotations[2] ? orbitGeometry.uprightRadiusX : orbitGeometry.radiusX;
}

export function pointOnOrbit(rotation: number, angle: number) {
  const radians = Math.PI / 180;
  const x = radiusForOrbit(rotation) * Math.cos(angle * radians);
  const y = orbitGeometry.radiusY * Math.sin(angle * radians);
  const tilt = rotation * radians;
  return {
    x: orbitGeometry.center + x * Math.cos(tilt) - y * Math.sin(tilt),
    y: orbitGeometry.center + x * Math.sin(tilt) + y * Math.cos(tilt),
  };
}

export const orbitNodes = [
  {kind: 'design', rotation: 12, angle: 210},
  {kind: 'code', rotation: -28, angle: 0},
  {kind: 'automation', rotation: -28, angle: 180},
  {kind: 'growth', rotation: 12, angle: 20},
] as const;
