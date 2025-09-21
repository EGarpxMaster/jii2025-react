import React from 'react';
import './CupoBadge.css';

interface CupoBadgeProps {
  inscritos: number;
  cupoMaximo: number;
  className?: string;
}

const CupoBadge: React.FC<CupoBadgeProps> = ({ 
  inscritos, 
  cupoMaximo, 
  className = ''
}) => {
  // Calcular espacios disponibles
  const disponibles = Math.max(0, cupoMaximo - inscritos);
  
  // Determinar color según las reglas del sistema:
  // Green: 30%+ disponible
  // Yellow: 10-29% disponible  
  // Red: <10% disponible
  const porcentajeDisponible = cupoMaximo > 0 ? (disponibles / cupoMaximo) * 100 : 0;
  
  let badgeColor: 'green' | 'yellow' | 'red';
  
  if (porcentajeDisponible >= 30) {
    badgeColor = 'green';
  } else if (porcentajeDisponible >= 10) {
    badgeColor = 'yellow';
  } else {
    badgeColor = 'red';
  }

  return (
    <div className={`cupo-badge cupo-badge--${badgeColor} ${className}`}>
      <div className={`cupo-badge__dot cupo-badge__dot--${badgeColor}`}></div>
      <span className="cupo-badge__text">
        {disponibles} {disponibles === 1 ? 'espacio' : 'espacios'}
      </span>
    </div>
  );
};

export default CupoBadge;