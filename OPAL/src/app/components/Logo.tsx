import logoImg from "../../imports/unnamed.png";

interface LogoProps {
  size?: 'small' | 'large';
  className?: string;
}

export function Logo({ size = 'small', className = '' }: LogoProps) {
  const sizeClasses = size === 'large' ? 'w-32 h-32' : 'w-12 h-12';
  
  return (
    <img 
      src={logoImg} 
      alt="OPal Logo" 
      className={`${sizeClasses} ${className}`}
    />
  );
}