    import { motion } from 'framer-motion';
    import { ReactNode } from 'react';

    interface ScrollAnimationProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    margin?: string;
    }

    // Aparece al hacer scroll (fade in)
    export const ScrollFadeIn = ({ children, className = '', delay = 0, duration = 0.6, margin = "-100px" }: ScrollAnimationProps) => (
    <motion.div
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin }}
        transition={{ duration, delay }}
    >
        {children}
    </motion.div>
    );

    // Se desliza desde abajo al hacer scroll
    export const ScrollSlideUp = ({ children, className = '', delay = 0, duration = 0.7, margin = "-100px" }: ScrollAnimationProps) => (
    <motion.div
        className={className}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin }}
        transition={{ duration, delay, ease: "easeOut" }}
    >
        {children}
    </motion.div>
    );

    // Se desliza desde la izquierda al hacer scroll
    export const ScrollSlideLeft = ({ children, className = '', delay = 0, duration = 0.7, margin = "-100px" }: ScrollAnimationProps) => (
    <motion.div
        className={className}
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin }}
        transition={{ duration, delay, ease: "easeOut" }}
    >
        {children}
    </motion.div>
    );

    // Se desliza desde la derecha al hacer scroll
    export const ScrollSlideRight = ({ children, className = '', delay = 0, duration = 0.7, margin = "-100px" }: ScrollAnimationProps) => (
    <motion.div
        className={className}
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin }}
        transition={{ duration, delay, ease: "easeOut" }}
    >
        {children}
    </motion.div>
    );

    // Escala al aparecer durante scroll
    export const ScrollScale = ({ children, className = '', delay = 0, duration = 0.5, margin = "-100px" }: ScrollAnimationProps) => (
    <motion.div
        className={className}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin }}
        transition={{ duration, delay, ease: "easeOut" }}
    >
        {children}
    </motion.div>
    );

    // Contenedor para grid con animación escalonada durante scroll
    export const ScrollStaggerContainer = ({ children, className = '', delay = 0, margin = "-100px" }: ScrollAnimationProps) => (
    <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin }}
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

    // Item para usar con ScrollStaggerContainer
    export const ScrollStaggerItem = ({ children, className = '' }: ScrollAnimationProps) => (
    <motion.div
        className={className}
        variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.5 }}
    >
        {children}
    </motion.div>
    );