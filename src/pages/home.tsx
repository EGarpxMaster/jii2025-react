import React, { useState, useEffect } from "react";
import Carousel from "../components/home/carousel/carousel";
import EventInfo from "../components/home/event-info/event-info";
import "../components/home/countdown/countdown";
import Countdown from "../components/home/countdown/countdown";

export default function Home() {
  // Estado para la barra de progreso
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Efecto para la barra de progreso de scroll
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollPx / winHeightPx) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div className="w-full">
      {/* Barra de progreso de scroll */}
      <div 
        className="scroll-progress-bar" 
        style={{ '--scroll-progress': `${scrollProgress}%` } as React.CSSProperties}
      ></div>
      
      <main className="w-full">
        <Carousel />
        <Countdown />
        <EventInfo />
      </main>
    </div>
  )
}