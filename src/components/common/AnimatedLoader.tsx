import { Shield, Lock, Monitor, Activity } from 'lucide-react';

interface AnimatedLoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AnimatedLoader({ text = 'Đang tải...', size = 'md' }: AnimatedLoaderProps) {
  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-8 w-8' : 'h-12 w-12';
  const textSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg';

  return (
    <div className="flex flex-col items-center justify-center space-y-4 fade-in-up">
      <div className="relative">
        {/* Rotating outer ring */}
        <div className="absolute inset-0 loading-spinner">
          <Shield className={`${iconSize} text-primary/30`} />
        </div>
        
        {/* Pulsing center */}
        <div className="relative flex items-center justify-center">
          <Lock className={`${iconSize} text-primary pulse-slow`} />
        </div>
        
        {/* Floating icons */}
        <div className="absolute -top-2 -right-2">
          <Monitor className="h-3 w-3 text-muted-foreground float" />
        </div>
        <div className="absolute -bottom-2 -left-2">
          <Activity className="h-3 w-3 text-muted-foreground float" style={{animationDelay: '1s'}} />
        </div>
      </div>
      
      <div className={`${textSize} text-muted-foreground text-center pulse-slow`}>
        {text}
      </div>
      
      {/* Loading dots */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-primary rounded-full bounce-soft"></div>
        <div className="w-2 h-2 bg-primary rounded-full bounce-soft" style={{animationDelay: '0.2s'}}></div>
        <div className="w-2 h-2 bg-primary rounded-full bounce-soft" style={{animationDelay: '0.4s'}}></div>
      </div>
    </div>
  );
}

export function FullScreenLoader({ text = 'Đang khởi tạo hệ thống...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-8 shadow-lg border card-hover">
        <AnimatedLoader text={text} size="lg" />
      </div>
    </div>
  );
}