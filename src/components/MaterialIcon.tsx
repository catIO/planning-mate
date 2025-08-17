import React from 'react';

interface MaterialIconProps {
  icon: string;
  className?: string;
  size?: number;
  variant?: 'filled' | 'outlined';
}

export const MaterialIcon: React.FC<MaterialIconProps> = ({ 
  icon, 
  className = '', 
  size = 24,
  variant = 'filled'
}) => {
  const iconClass = variant === 'outlined' ? 'material-symbols-outlined' : 'material-icons';
  
  return (
    <span 
      className={`${iconClass} ${className}`}
      style={{ 
        fontSize: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1
      }}
    >
      {icon}
    </span>
  );
};
