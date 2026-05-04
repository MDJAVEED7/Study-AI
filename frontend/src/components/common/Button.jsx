import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap';

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95',
    secondary: 
      'bg-light/20 text-primary hover:bg-light/30 border border-light/50',
    outline: 
      'border border-gray-300 text-foreground hover:bg-gray-50 hover:border-primary',
    accent:
      'bg-gradient-to-r from-accent to-primary text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95',
    ghost:
      'text-primary hover:bg-gray-100 hover:text-secondary',
  };

  const sizeStyles = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-12 px-8 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[baseStyles, variantStyles[variant], sizeStyles[size], className].join(' ')}
    >
      {children}
    </button>
  );
};

export default Button;
