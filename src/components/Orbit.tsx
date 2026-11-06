import {CapabilityIcon} from './Icons';
import {orbitGeometry, orbitNodes, pointOnOrbit} from '@/lib/orbit';

export function Orbit({small = false}: {small?: boolean}) {
  const {center, radiusX, radiusY, badgeRadius, rotations} = orbitGeometry;
  const greenNode = pointOnOrbit(88, 225);
  const gradientId = small ? 'orbit-core-small' : 'orbit-core';

  return <svg className={`orbit${small ? ' small' : ''}`} viewBox="0 0 500 500" width="500" height="500" fill="none" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id={gradientId} cx="30%" cy="25%" r="75%">
        <stop offset="0" stopColor="#b6c3bb"/>
        <stop offset=".4" stopColor="#405448"/>
        <stop offset="1" stopColor="#15231b"/>
      </radialGradient>
    </defs>
    {rotations.map((rotation, index) => <ellipse
      key={rotation}
      className={`orbit-track orbit-track-${index + 1}`}
      cx={center} cy={center} rx={radiusX} ry={radiusY}
      transform={`rotate(${rotation} ${center} ${center})`}
      vectorEffect="non-scaling-stroke"
    />)}
    <circle cx={center} cy={center} r="28" fill={`url(#${gradientId})`}/>
    <circle className="orbit-node" cx={greenNode.x} cy={greenNode.y} r="5"/>
    {orbitNodes.map(({kind, rotation, angle}) => {
      const point = pointOnOrbit(rotation, angle);
      return <g key={kind} className={`orbit-badge ${kind}`} transform={`translate(${point.x} ${point.y})`}>
        <circle r={badgeRadius} vectorEffect="non-scaling-stroke"/>
        <g transform="translate(-18 -18)"><CapabilityIcon kind={kind} size={36}/></g>
      </g>;
    })}
  </svg>;
}
