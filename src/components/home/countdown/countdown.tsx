import { useState, useEffect } from 'react';
import './countdown.css';

const Countdown = () => {
  const targetDate = new Date('2025-09-25T00:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    // Calcular inicialmente
    calculateTimeLeft();

    // Actualizar cada segundo
    const timer = setInterval(calculateTimeLeft, 1000);

    // Limpiar intervalo al desmontar
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown-container">
      <h2 className="countdown-title">Cuenta Regresiva JII 2025</h2>
      <div className="countdown-timer">
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.days}</div>
          <span className="countdown-label">Días</span>
        </div>
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.hours}</div>
          <span className="countdown-label">Horas</span>
        </div>
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.minutes}</div>
          <span className="countdown-label">Minutos</span>
        </div>
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.seconds}</div>
          <span className="countdown-label">Segundos</span>
        </div>
      </div>
      <hr className="my-5" />
    </div>
  );
};

export default Countdown;