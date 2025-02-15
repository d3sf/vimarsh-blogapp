import { cn } from '@/lib/utils';
import LogoIcon from './LogoIcon';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  withText?: boolean;
  withIcon?: boolean;
  color?: 'default' | 'white' | 'black' | 'dark';
}

const Logo = ({ size = 'md', className, withText = false, withIcon = true, color = 'default' }: LogoProps) => {
  const sizeClasses = {
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const getIconColor = () => {
    switch (color) {
      case 'white':
        return 'text-white';
      case 'black':
        return 'text-black';
      case 'dark':
        return 'text-[#1A1A1A]';
      default:
        return 'text-customPink';
    }
  };

  const getTextColor = () => {
    switch (color) {
      case 'white':
        return 'text-white';
      case 'black':
        return 'text-black';
      case 'dark':
        return 'text-[#1A1A1A]';
      default:
        return 'bg-gradient-to-r from-[#db0042] via-[#DB0042] to-[#DB0042] bg-clip-text text-transparent';
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {withIcon && (
        <div className={cn('relative', getIconColor(), sizeClasses[size])}>
          <LogoIcon className="w-full h-full" />
        </div>
      )}
      {withText && (
        <span className={cn(
          'font-heletica font-black',
          getTextColor(),
          size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'
        )}>
          VIMARSH
        </span>
      )}
    </div>
  );
};

export default Logo; 