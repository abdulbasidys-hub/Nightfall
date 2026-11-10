import test from 'node:test';
import assert from 'node:assert/strict';
import {orbitGeometry, orbitNodes, pointOnOrbit} from '../src/lib/orbit.ts';

test('badge centers remain on their tilted orbital curves at phone and desktop sizes', () => {
  for (const width of [246, 282, 310, 450]) {
    const scale = width / 500;
    for (const node of orbitNodes) {
      const point = pointOnOrbit(node.rotation, node.angle);
      const dx = (point.x * scale - 250 * scale) / scale;
      const dy = (point.y * scale - 250 * scale) / scale;
      const rotation = -node.rotation * Math.PI / 180;
      const x = dx * Math.cos(rotation) - dy * Math.sin(rotation);
      const y = dx * Math.sin(rotation) + dy * Math.cos(rotation);
      assert.ok(Math.abs((x / 205) ** 2 + (y / 110) ** 2 - 1) < 1e-10);
    }
  }
});

test('badges stay inside the graphic and do not collide', () => {
  const points = orbitNodes.map(node => pointOnOrbit(node.rotation, node.angle));
  const radius = orbitGeometry.badgeRadius;
  for (const point of points) {
    assert.ok(point.x - radius > 0 && point.x + radius < 500);
    assert.ok(point.y - radius > 60 && point.y + radius < 440);
  }
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      assert.ok(Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y) > radius * 2 + 16);
    }
  }
});
