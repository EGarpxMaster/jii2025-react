import { motion } from 'framer-motion';

// Animación para H1
export const AnimatedH1 = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.h1
    className={`text-4xl font-extrabold ${className}`}
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
  >
    {children}
  </motion.h1>
);

// Animación para H2
export const AnimatedH2 = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className="relative">
    <motion.h2
      className={`text-3xl font-bold ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: .8, ease: "easeOut" }}
    >
      {children}
    </motion.h2>

  </div>
);

// Animación para H3
export const AnimatedH3 = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className="relative">
  <motion.h3
    className={`text-2xl font-semibold ${className}`}
    initial={{ opacity: 0, y: -15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
  >
    {children}
  </motion.h3>
  </div>
);

// Animación para H4
export const AnimatedH4 =({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.h4
    className={`text-lg leading-relaxed${className}`}
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
  >
    {children}
  </motion.h4>
);

// Texto con efecto de máquina de escribir
export const TypewriterText = ({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) => {
  return (
    <motion.span
      className={`inline-block overflow-hidden ${className}`}
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ 
        duration: 1.5,
        delay,
        ease: "easeInOut"
      }}
    >
      {text}
    </motion.span>
  );
};

// Animación para párrafos
export const AnimatedParagraph = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.p
    className={`text-lg leading-relaxed ${className}`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
  >
    {children}
  </motion.p>
);