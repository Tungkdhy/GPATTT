import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Shield, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      const success = login(username, password);
      if (!success) {
        setError('Sai thông tin đăng nhập! Vui lòng sử dụng admin/admin');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md card-hover fade-in-up">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary bounce-soft" />
          </div>
          <CardTitle className="text-2xl">Đăng nhập hệ thống</CardTitle>
          <CardDescription>
            Vui lòng nhập thông tin đăng nhập để truy cập hệ thống quản trị
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-focus"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-focus"
                required
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full btn-animate scale-hover" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Lock className="mr-2 h-4 w-4 loading-spinner" />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </form>
          {/* <div className="mt-4 text-center text-sm text-muted-foreground">
            Demo: username: admin, password: admin
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}