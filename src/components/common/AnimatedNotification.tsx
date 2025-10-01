import { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { Button } from '../ui/button';

interface NotificationProps {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
}

export function AnimatedNotification({ 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  const icons = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
    info: Info,
  };

  const colors = {
    success: 'border-green-500 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    warning: 'border-yellow-500 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    error: 'border-red-500 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    info: 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  };

  const iconColors = {
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
    info: 'text-blue-500',
  };

  const Icon = icons[type];

  if (!isVisible) return null;

  return (
    <div className={`
      fixed top-4 right-4 z-50 min-w-80 max-w-md
      ${isExiting ? 'slide-out-to-right' : 'slide-in-from-right'}
    `}>
      <div className={`
        border-l-4 rounded-lg p-4 shadow-lg
        ${colors[type]}
        card-hover
      `}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${iconColors[type]} bounce-soft`} />
          </div>
          
          <div className="ml-3 w-0 flex-1">
            <p className="font-medium fade-in-up">
              {title}
            </p>
            {message && (
              <p className="mt-1 text-sm opacity-90 fade-in-up" style={{animationDelay: '0.1s'}}>
                {message}
              </p>
            )}
          </div>
          
          <div className="ml-4 flex-shrink-0 flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="scale-hover opacity-60 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook để quản lý notifications
export function useNotification() {
  const [notifications, setNotifications] = useState<(NotificationProps & { id: string })[]>([]);

  const addNotification = (notification: Omit<NotificationProps, 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = {
      ...notification,
      id,
      onClose: () => removeNotification(id),
    };
    
    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const NotificationContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification, index) => (
        <div 
          key={notification.id}
          className="stagger-item"
          style={{animationDelay: `${index * 0.1}s`}}
        >
          <AnimatedNotification {...notification} />
        </div>
      ))}
    </div>
  );

  return {
    addNotification,
    removeNotification,
    NotificationContainer,
    notifications,
  };
}