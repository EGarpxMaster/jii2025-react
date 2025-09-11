import { useState, useEffect } from 'react';
import './countdown.css';

const Countdown = () => {
  const targetDate = new Date('2025-09-25T09:00:00').getTime();

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

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown-container">
      <div className="countdown-header">
        <h2 className="countdown-title">Cuenta Regresiva JII 2025</h2>
        <p className="countdown-subtitle">25-26 de Septiembre</p>
        <div className="header-divider"></div>
      </div>
      
      <div className="countdown-timer">
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.days.toString().padStart(2, '0')}</div>
          <span className="countdown-label">Días</span>
        </div>
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.hours.toString().padStart(2, '0')}</div>
          <span className="countdown-label">Horas</span>
        </div>
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.minutes.toString().padStart(2, '0')}</div>
          <span className="countdown-label">Minutos</span>
        </div>
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.seconds.toString().padStart(2, '0')}</div>
          <span className="countdown-label">Segundos</span>
        </div>
      </div>

      <div className="event-details">
        <div className="detail-item">
          <span>Universidad del Caribe</span>
        </div>
        <div className="detail-item">
          <span>Ingeniería Industrial</span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;