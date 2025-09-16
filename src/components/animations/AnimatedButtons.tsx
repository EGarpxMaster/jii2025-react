import { motion } from 'framer-motion';

// Botón primario con animación
export const AnimatedButtonPrimary = ({ children, onClick, className = '' }: { children: React.ReactNode; onClick: () => void; className?: string }) => (
  <motion.button
    className={` text-white py-3 px-8 rounded-lg text-lg font-medium ${className}`}
    onClick={onClick}
    whileHover={{ y: -3, transition: { duration: 0.2 } }}
    whileTap={{ y: 0, scale: 0.98, transition: { duration: 0.1 } }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.button>
);

// Botón secundario con animación
export const AnimatedButtonSecondary = ({ children, onClick, className = '' }: { children: React.ReactNode; onClick: () => void; className?: string }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ y: -3, transition: { duration: 0.2 } }}
    whileTap={{ y: 0, scale: 0.98, transition: { duration: 0.1 } }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
  >
    {children}
  </motion.button>
);