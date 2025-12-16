import React, { useState } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}) => {
  const baseStyle =
    'relative overflow-hidden px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-wide active:scale-95';

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] border border-blue-500/50',
    secondary:
      'bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md hover:border-white/20 shadow-lg',
    ghost: 'text-blue-200 hover:text-white hover:bg-white/5',
    outline:
      'border border-blue-400/30 text-blue-300 hover:border-blue-300 hover:text-blue-100 hover:bg-blue-500/10',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${
        variant === 'primary' ? 'btn-border-beam' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  glow = false,
  noPadding = false,
  className = '',
  children,
  ...props
}) => {
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{ '--mx': `${pos.x}%`, '--my': `${pos.y}%` } as React.CSSProperties}
      className={`relative card-flashlight rounded-2xl border border-white/10 bg-[#0f172a]/40 backdrop-blur-xl ${
        noPadding ? '' : 'p-6'
      } ${glow ? 'shadow-[0_0_40px_-10px_rgba(37,99,235,0.25)]' : 'shadow-xl'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

interface BadgeProps {
  type?: 'neutral' | 'success' | 'warning';
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  type = 'neutral',
  className = '',
  children,
}) => {
  const styles: Record<'neutral' | 'success' | 'warning', string> = {
    neutral: 'bg-blue-900/30 text-blue-200 border-blue-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[type]} flex items-center gap-1.5 w-fit backdrop-blur-md ${className}`}
    >
      {children}
    </span>
  );
};

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '' }) => (
  <span className={`inline-block overflow-hidden align-bottom ${className}`}>
    {text.split('').map((char, index) => (
      <span
        key={`${char}-${index}`}
        className="inline-block text-clip-letter"
        style={{ animationDelay: `${index * 0.04}s` }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))}
  </span>
);
