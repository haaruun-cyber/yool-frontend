import { motion } from 'framer-motion';

export function Loader({ className = '' }) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <motion.div
        className="h-10 w-10 rounded-full border-2 border-accent border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      />
    </div>
  );
}
