import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Bell, LogOut, Settings, User, ChevronDown } from 'lucide-react';
import { Badge } from '../ui/badge';

export function Header() {
  const { user, logout } = useAuth();
  const [notifications] = useState(3); // Mock notification count

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get display name from user
  const getDisplayName = () => {
    if (user?.display_name) return user.display_name;
    if (user?.user_name) return user.user_name;
    return 'User';
  };

  // Get role display name
  const getRoleDisplayName = () => {
    if (user?.role?.display_name) return user.role.display_name;
    if (user?.role?.code) return user.role.code;
    return 'User';
  };

  // Get email
  const getEmail = () => {
    if (user?.email) return user.email;
    if (user?.user_name) return `${user.user_name}@example.com`;
    return '';
  };

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        {/* <h2 className="font-semibold">Hệ thống quản trị bảo mật</h2> */}
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        {/* <Button variant="ghost" size="sm" className="relative scale-hover">
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center notification-badge"
            >
              {notifications}
            </Badge>
          )}
        </Button> */}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center space-x-3 h-auto py-2 px-3 scale-hover"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={getDisplayName()} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getUserInitials(getDisplayName())}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{getDisplayName()}</span>
                <span className="text-xs text-muted-foreground">{getRoleDisplayName()}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{getDisplayName()}</p>
                <p className="text-xs text-muted-foreground">{getEmail() || 'No email'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Thông tin cá nhân</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Cài đặt</span>
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
