    import { motion } from 'framer-motion';
    import { ReactNode } from 'react';

    interface ContainerProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    }

    // Contenedor con fade in
    export const FadeInContainer = ({ children, className = '', delay = 0, duration = 0.6 }: ContainerProps) => (
    <motion.div
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration, delay }}
    >
        {children}
    </motion.div>
    );

    // Contenedor que se desliza desde abajo
    export const SlideUpContainer = ({ children, className = '', delay = 0, duration = 0.7 }: ContainerProps) => (
    <motion.div
        className={className}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay, ease: "easeOut" }}
    >
        {children}
    </motion.div>
    );

    // Contenedor que se desliza desde la izquierda
    export const SlideLeftContainer = ({ children, className = '', delay = 0, duration = 0.7 }: ContainerProps) => (
    <motion.div
        className={className}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration, delay, ease: "easeOut" }}
    >
        {children}
    </motion.div>
    );

    // Contenedor que se desliza desde la derecha
    export const SlideRightContainer = ({ children, className = '', delay = 0, duration = 0.7 }: ContainerProps) => (
    <motion.div
        className={className}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration, delay, ease: "easeOut" }}
    >
        {children}
    </motion.div>
    );

    // Contenedor que escala al aparecer
    export const ScaleContainer = ({ children, className = '', delay = 0, duration = 0.5 }: ContainerProps) => (
    <motion.div
        className={className}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration, delay, ease: "easeOut" }}
    >
        {children}
    </motion.div>
    );

    // Contenedor para grid con animación escalonada
    export const StaggerContainer = ({ children, className = '', delay = 0 }: ContainerProps) => (
    <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        variants={{
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
            staggerChildren: 0.1,
            delayChildren: delay
            }
        }
        }}
    >
        {children}
    </motion.div>
    );

    // Item para usar con StaggerContainer
    export const StaggerItem = ({ children, className = '' }: ContainerProps) => (
    <motion.div
        className={className}
        variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.5 }}
    >
        {children}
    </motion.div>
    );