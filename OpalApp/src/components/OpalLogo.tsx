interface OpalLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function OpalLogo({ size = 'md', showText = true }: OpalLogoProps) {
  const sizeClasses = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-12 h-12', text: 'text-2xl' },
    lg: { icon: 'w-20 h-20', text: 'text-4xl' }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-3">
      {/* Circular Icon */}
      <div className={`${currentSize.icon} relative flex items-center justify-center`}>
        {/* Outer ring - mint/turquoise gradient */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="outerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#AA3BD1', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#8BB8D8', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="innerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#E8D5F2', stopOpacity: 0.6 }} />
              <stop offset="100%" style={{ stopColor: '#D4C5E8', stopOpacity: 0.8 }} />
            </linearGradient>
          </defs>
          
          {/* Outer turquoise circle */}
          <circle cx="50" cy="50" r="45" fill="url(#outerGradient)" opacity="0.9" />
          
          {/* Middle lighter circle */}
          <circle cx="50" cy="50" r="32" fill="url(#innerGradient)" />
          
          {/* Inner pink/lavender circle */}
          <circle cx="50" cy="50" r="18" fill="#E8C5E5" />
          
          {/* Sparkle accent */}
          <g transform="translate(68, 28)">
            <path 
              d="M 0,-4 L 1,-1 L 4,0 L 1,1 L 0,4 L -1,1 L -4,0 L -1,-1 Z" 
              fill="white" 
              opacity="0.9"
            />
          </g>
        </svg>
      </div>
      
      {/* Text */}
      {showText && (
        <span 
          className={`${currentSize.text} font-bold tracking-tight`}
          style={{ color: '#2C2E4A' }}
        >
          Opal
        </span>
      )}
    </div>
  );
}
