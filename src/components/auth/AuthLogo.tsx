
import { useUiText } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AuthLogoProps {
  icon?: ReactNode;
}

export const AuthLogo = ({ icon }: AuthLogoProps) => {
  const ui = useUiText();
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
      className="mx-auto max-w-24 mb-6 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-xl opacity-30 animate-pulse" />
      <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-accent/15 p-2 shadow-2xl border-4 border-white dark:border-primary/40">
        {icon || (
          <img 
            src="/favicon.jpg" 
            alt={ui("Mix Food Logo")}
            className="w-full h-full rounded-full object-cover"
          />
        )}
      </div>
    </motion.div>
  );
};
