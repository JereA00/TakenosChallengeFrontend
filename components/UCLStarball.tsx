interface Props {
  size?: number;
  className?: string;
}

// El Starball oficial de la UEFA Champions League:
// 8 estrellas de 5 puntas distribuidas en círculo sobre fondo navy
export default function UCLStarball({ size = 48, className = "" }: Props) {
  const cx = 50;
  const cy = 50;
  const r = 32; // radio del círculo de estrellas

  // Función para generar un polígono de estrella de 5 puntas
  function starPath(cx: number, cy: number, outerR: number, innerR: number, rotation = 0): string {
    const points: [number, number][] = [];
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI / 5) * i - Math.PI / 2 + (rotation * Math.PI) / 180;
      const rad = i % 2 === 0 ? outerR : innerR;
      points.push([cx + rad * Math.cos(angle), cy + rad * Math.sin(angle)]);
    }
    return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ") + " Z";
  }

  // 8 estrellas en ángulos: 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°
  const stars = Array.from({ length: 8 }, (_, i) => {
    const angle = ((i * 45 - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Fondo circular navy */}
      <circle cx="50" cy="50" r="50" fill="#0a1628" />

      {/* Borde blanco sutil */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.3" />

      {/* 8 estrellas blancas */}
      {stars.map((s, i) => (
        <path
          key={i}
          d={starPath(s.x, s.y, 7, 3)}
          fill="#ffffff"
        />
      ))}

      {/* Estrella central más pequeña */}
      <path d={starPath(50, 50, 5, 2)} fill="#ffffff" opacity="0.9" />
    </svg>
  );
}
