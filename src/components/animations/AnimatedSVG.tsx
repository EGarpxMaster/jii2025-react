import { motion } from 'framer-motion';

export const AnimatedArrowIcon = ({ className = '' }: { className?: string }) => (
  <motion.svg
    className={`w-5 h-5 ml-3 ${className}`}
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    initial={{ x: 0 }}
    whileHover={{ x: 5 }}
    transition={{ type: "spring", stiffness: 500 }}
  >
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </motion.svg>
);