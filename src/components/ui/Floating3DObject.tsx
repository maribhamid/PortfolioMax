import React, { useEffect, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Shape3D } from '../../types/portfolio';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Edge {
  a: number;
  b: number;
}

const PHI = (1 + Math.sqrt(5)) / 2;

const getIcosahedron = (): { vertices: Point3D[]; edges: Edge[] } => {
  const v: Point3D[] = [
    { x: -1, y: PHI, z: 0 },
    { x: 1, y: PHI, z: 0 },
    { x: -1, y: -PHI, z: 0 },
    { x: 1, y: -PHI, z: 0 },
    { x: 0, y: -1, z: PHI },
    { x: 0, y: 1, z: PHI },
    { x: 0, y: -1, z: -PHI },
    { x: 0, y: 1, z: -PHI },
    { x: PHI, y: 0, z: -1 },
    { x: PHI, y: 0, z: 1 },
    { x: -PHI, y: 0, z: -1 },
    { x: -PHI, y: 0, z: 1 },
  ];

  const normalized = v.map((p) => {
    const len = Math.hypot(p.x, p.y, p.z);
    return { x: p.x / len, y: p.y / len, z: p.z / len };
  });

  const edges: Edge[] = [];
  const distThreshold = 1.1;
  for (let i = 0; i < normalized.length; i++) {
    for (let j = i + 1; j < normalized.length; j++) {
      const d = Math.hypot(
        normalized[i].x - normalized[j].x,
        normalized[i].y - normalized[j].y,
        normalized[i].z - normalized[j].z
      );
      if (d < distThreshold) {
        edges.push({ a: i, b: j });
      }
    }
  }

  return { vertices: normalized, edges };
};

const getHypercube = (): { vertices: Point3D[]; edges: Edge[] } => {
  const vertices: Point3D[] = [];
  const edges: Edge[] = [];

  for (let x = -1; x <= 1; x += 2) {
    for (let y = -1; y <= 1; y += 2) {
      for (let z = -1; z <= 1; z += 2) {
        vertices.push({ x: x * 0.85, y: y * 0.85, z: z * 0.85 });
      }
    }
  }

  for (let x = -1; x <= 1; x += 2) {
    for (let y = -1; y <= 1; y += 2) {
      for (let z = -1; z <= 1; z += 2) {
        vertices.push({ x: x * 0.42, y: y * 0.42, z: z * 0.42 });
      }
    }
  }

  const addCubeEdges = (offset: number) => {
    for (let i = 0; i < 8; i++) {
      for (let j = i + 1; j < 8; j++) {
        const dx = Math.abs(vertices[offset + i].x - vertices[offset + j].x);
        const dy = Math.abs(vertices[offset + i].y - vertices[offset + j].y);
        const dz = Math.abs(vertices[offset + i].z - vertices[offset + j].z);
        const diffCount = (dx > 0.1 ? 1 : 0) + (dy > 0.1 ? 1 : 0) + (dz > 0.1 ? 1 : 0);
        if (diffCount === 1) {
          edges.push({ a: offset + i, b: offset + j });
        }
      }
    }
  };

  addCubeEdges(0);
  addCubeEdges(8);

  for (let i = 0; i < 8; i++) {
    edges.push({ a: i, b: i + 8 });
  }

  return { vertices, edges };
};

const getTorus = (): { vertices: Point3D[]; edges: Edge[] } => {
  const vertices: Point3D[] = [];
  const edges: Edge[] = [];

  const pointsPerRing = 16;
  const radius = 0.85;

  for (let i = 0; i < pointsPerRing; i++) {
    const angle = (i / pointsPerRing) * Math.PI * 2;
    vertices.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z: 0 });
    edges.push({ a: i, b: (i + 1) % pointsPerRing });
  }

  const offset2 = pointsPerRing;
  for (let i = 0; i < pointsPerRing; i++) {
    const angle = (i / pointsPerRing) * Math.PI * 2;
    vertices.push({ x: 0, y: Math.cos(angle) * radius, z: Math.sin(angle) * radius });
    edges.push({ a: offset2 + i, b: offset2 + ((i + 1) % pointsPerRing) });
  }

  const offset3 = pointsPerRing * 2;
  for (let i = 0; i < pointsPerRing; i++) {
    const angle = (i / pointsPerRing) * Math.PI * 2;
    vertices.push({ x: Math.sin(angle) * radius, y: 0, z: Math.cos(angle) * radius });
    edges.push({ a: offset3 + i, b: offset3 + ((i + 1) % pointsPerRing) });
  }

  return { vertices, edges };
};

const geometryMap: Record<Shape3D, () => { vertices: Point3D[]; edges: Edge[] }> = {
  icosahedron: getIcosahedron,
  cube: getHypercube,
  torus: getTorus,
};

interface Floating3DObjectProps {
  className?: string;
  size?: number;
  shapeOverride?: Shape3D;
  interactive?: boolean;
}

export const Floating3DObject: React.FC<Floating3DObjectProps> = ({
  className = '',
  size = 280,
  shapeOverride,
  interactive = true,
}) => {
  const { data } = usePortfolio();
  const config = data.settings.effectsConfig?.floating3D;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isEnabled = config?.enabled ?? true;
  const shape = shapeOverride || config?.shape || 'icosahedron';
  const speed = config?.speed ?? 1.0;
  const scaleMultiplier = config?.scale ?? 1.0;

  const mouseTilt = useRef({ x: 0, y: 0 });
  const angleRef = useRef({ x: 0.4, y: 0.6, z: 0.2 });
  const isVisibleRef = useRef(true);

  // Mouse tilt tracking (throttled)
  useEffect(() => {
    if (!interactive) return;

    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const winW = window.innerWidth || 1920;
          const winH = window.innerHeight || 1080;
          mouseTilt.current = {
            x: (e.clientY / winH - 0.5) * 1.5,
            y: (e.clientX / winW - 0.5) * 1.5,
          };
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  // Canvas render loop with 0 React state updates
  useEffect(() => {
    if (!isEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // HiDPI / Retina scale
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const geometry = geometryMap[shape] ? geometryMap[shape]() : getIcosahedron();
    let animFrame: number;

    const fov = 3.5;
    const baseRadius = (size / 2) * 0.72 * scaleMultiplier * dpr;
    const center = (size / 2) * dpr;

    const primaryColor = data.settings.customPrimaryColor || '#8b5cf6';
    const accentColor = data.settings.customAccentColor || '#06b6d4';

    // IntersectionObserver to pause loop when out of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const projectedNodes: { x: number; y: number; z: number }[] = new Array(geometry.vertices.length);

    const render = () => {
      if (!isVisibleRef.current) {
        animFrame = requestAnimationFrame(render);
        return;
      }

      angleRef.current.x += 0.008 * speed;
      angleRef.current.y += 0.012 * speed;
      angleRef.current.z += 0.004 * speed;

      const ax = angleRef.current.x + mouseTilt.current.x * 0.8;
      const ay = angleRef.current.y + mouseTilt.current.y * 0.8;
      const az = angleRef.current.z;

      const cosX = Math.cos(ax);
      const sinX = Math.sin(ax);
      const cosY = Math.cos(ay);
      const sinY = Math.sin(ay);
      const cosZ = Math.cos(az);
      const sinZ = Math.sin(az);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Project vertices
      for (let i = 0; i < geometry.vertices.length; i++) {
        const p = geometry.vertices[i];

        const x1 = p.x * cosY + p.z * sinY;
        const y1 = p.y;
        const z1 = -p.x * sinY + p.z * cosY;

        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        const x3 = x2 * cosZ - y2 * sinZ;
        const y3 = x2 * sinZ + y2 * cosZ;
        const z3 = z2;

        const scaleFactor = fov / (fov + z3);
        const screenX = center + x3 * scaleFactor * baseRadius;
        const screenY = center + y3 * scaleFactor * baseRadius;

        projectedNodes[i] = { x: screenX, y: screenY, z: z3 };
      }

      // Draw edges
      for (let i = 0; i < geometry.edges.length; i++) {
        const e = geometry.edges[i];
        const p1 = projectedNodes[e.a];
        const p2 = projectedNodes[e.b];
        const avgZ = (p1.z + p2.z) / 2;
        const normDepth = Math.max(0.15, Math.min(0.9, (avgZ + 1.2) / 2.4));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = normDepth > 0.5 ? accentColor : primaryColor;
        ctx.globalAlpha = normDepth;
        ctx.lineWidth = (normDepth > 0.6 ? 1.75 : 1) * dpr;
        ctx.stroke();
      }

      // Draw glowing vertices
      for (let i = 0; i < projectedNodes.length; i++) {
        const node = projectedNodes[i];
        const normDepth = (node.z + 1.2) / 2.4;
        const radius = Math.max(1.5, normDepth * 3.8) * dpr;
        const alpha = Math.max(0.3, Math.min(1, normDepth));

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = normDepth > 0.5 ? accentColor : primaryColor;
        ctx.globalAlpha = alpha;
        ctx.fill();

        // Inner white highlight
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = alpha;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animFrame = requestAnimationFrame(render);
    };

    animFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrame);
      observer.disconnect();
    };
  }, [isEnabled, shape, speed, scaleMultiplier, size, data.settings.customPrimaryColor, data.settings.customAccentColor]);

  if (!isEnabled) return null;

  return (
    <div
      className={`relative select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none will-change-transform filter drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]"
      />
    </div>
  );
};
