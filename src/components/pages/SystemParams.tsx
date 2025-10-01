import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Save, RefreshCw, AlertTriangle } from 'lucide-react';

export function SystemParams() {
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleSave = () => {
    setUnsavedChanges(false);
    // Simulate save operation
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex items-center justify-between slide-in-left">
        <div>
          <h1>Tham số hệ thống</h1>
          <p className="text-muted-foreground">
            Cấu hình các tham số và thiết lập hệ thống
          </p>
        </div>
        {unsavedChanges && (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 badge-bounce">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Có thay đổi chưa lưu
          </Badge>
        )}
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="stagger-item">
          <TabsTrigger value="general">Tổng quát</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
          <TabsTrigger value="monitoring">Giám sát</TabsTrigger>
          <TabsTrigger value="backup">Sao lưu</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Cấu hình chung</CardTitle>
              <CardDescription>Các thiết lập cơ bản của hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="system-name">Tên hệ thống</Label>
                  <Input 
                    id="system-name" 
                    defaultValue="Security Management System"
                    onChange={() => setUnsavedChanges(true)}
                    className="input-focus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email quản trị</Label>
                  <Input 
                    id="admin-email" 
                    type="email"
                    defaultValue="admin@example.com"
                    onChange={() => setUnsavedChanges(true)}
                    className="input-focus"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Thời gian hết phiên (phút)</Label>
                  <Input 
                    id="session-timeout" 
                    type="number"
                    defaultValue="30"
                    onChange={() => setUnsavedChanges(true)}
                    className="input-focus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-login-attempts">Số lần đăng nhập tối đa</Label>
                  <Input 
                    id="max-login-attempts" 
                    type="number"
                    defaultValue="5"
                    onChange={() => setUnsavedChanges(true)}
                    className="input-focus"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Kích hoạt log debug</Label>
                    <p className="text-sm text-muted-foreground">
                      Ghi lại thông tin chi tiết để debug
                    </p>
                  </div>
                  <Switch onCheckedChange={() => setUnsavedChanges(true)} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tự động backup</Label>
                    <p className="text-sm text-muted-foreground">
                      Tự động sao lưu dữ liệu hàng ngày
                    </p>
                  </div>
                  <Switch defaultChecked onCheckedChange={() => setUnsavedChanges(true)} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Thông báo email</Label>
                    <p className="text-sm text-muted-foreground">
                      Gửi email khi có sự kiện quan trọng
                    </p>
                  </div>
                  <Switch defaultChecked onCheckedChange={() => setUnsavedChanges(true)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Cấu hình bảo mật</CardTitle>
              <CardDescription>Thiết lập các chính sách bảo mật</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password-min-length">Độ dài mật khẩu tối thiểu</Label>
                  <Input 
                    id="password-min-length" 
                    type="number"
                    defaultValue="8"
                    onChange={() => setUnsavedChanges(true)}
                    className="input-focus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-expiry">Hết hạn mật khẩu (ngày)</Label>
                  <Input 
                    id="password-expiry" 
                    type="number"
                    defaultValue="90"
                    onChange={() => setUnsavedChanges(true)}
                    className="input-focus"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Yêu cầu ký tự đặc biệt</Label>
                    <p className="text-sm text-muted-foreground">
                      Mật khẩu phải chứa ký tự đặc biệt
                    </p>
                  </div>
                  <Switch defaultChecked onCheckedChange={() => setUnsavedChanges(true)} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Xác thực 2 yếu tố</Label>
                    <p className="text-sm text-muted-foreground">
                      Bắt buộc 2FA cho tất cả người dùng
                    </p>
                  </div>
                  <Switch onCheckedChange={() => setUnsavedChanges(true)} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Khóa IP sau nhiều lần sai</Label>
                    <p className="text-sm text-muted-foreground">
                      Tự động khóa IP khi đăng nhập sai nhiều lần
                    </p>
                  </div>
                  <Switch defaultChecked onCheckedChange={() => setUnsavedChanges(true)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Cấu hình giám sát</CardTitle>
              <CardDescription>Thiết lập các tham số giám sát hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scan-interval">Chu kỳ quét (giây)</Label>
                  <Input 
                    id="scan-interval" 
                    type="number"
                    defaultValue="60"
                    onChange={() => setUnsavedChanges(true)}
                    className="input-focus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alert-threshold">Ngưỡng cảnh báo (%)</Label>
                  <Input 
                    id="alert-threshold" 
                    type="number"
                    defaultValue="80"
                    onChange={() => setUnsavedChanges(true)}
                    className="input-focus"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Giám sát CPU</Label>
                    <p className="text-sm text-muted-foreground">
                      Theo dõi sử dụng CPU của hệ thống
                    </p>
                  </div>
                  <Switch defaultChecked onCheckedChange={() => setUnsavedChanges(true)} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Giám sát RAM</Label>
                    <p className="text-sm text-muted-foreground">
                      Theo dõi sử dụng bộ nhớ
                    </p>
                  </div>
                  <Switch defaultChecked onCheckedChange={() => setUnsavedChanges(true)} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Giám sát mạng</Label>
                    <p className="text-sm text-muted-foreground">
                      Theo dõi lưu lượng mạng
                    </p>
                  </div>
                  <Switch defaultChecked onCheckedChange={() => setUnsavedChanges(true)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Cấu hình sao lưu</CardTitle>
              <CardDescription>Thiết lập chính sách sao lưu dữ liệu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backup-time">Thời gian backup</Label>
                  <Input 
                    id="backup-time" 
                    type="time"
                    defaultValue="02:00"
                    onChange={() => setUnsavedChanges(true)}
                    className="input-focus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retention-days">Giữ lại (ngày)</Label>
                  <Input 
                    id="retention-days" 
                    type="number"
                    defaultValue="30"
                    onChange={() => setUnsavedChanges(true)}
                    className="input-focus"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-location">Đường dẫn sao lưu</Label>
                <Input 
                  id="backup-location" 
                  defaultValue="/var/backups/security-system"
                  onChange={() => setUnsavedChanges(true)}
                  className="input-focus"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nén backup</Label>
                    <p className="text-sm text-muted-foreground">
                      Nén file backup để tiết kiệm dung lượng
                    </p>
                  </div>
                  <Switch defaultChecked onCheckedChange={() => setUnsavedChanges(true)} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Backup từ xa</Label>
                    <p className="text-sm text-muted-foreground">
                      Sao lưu lên server từ xa
                    </p>
                  </div>
                  <Switch onCheckedChange={() => setUnsavedChanges(true)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center space-x-2 stagger-item">
        <Button onClick={handleSave} disabled={!unsavedChanges} className="btn-animate scale-hover">
          <Save className="mr-2 h-4 w-4" />
          Lưu thay đổi
        </Button>
        <Button variant="outline" className="scale-hover">
          <RefreshCw className="mr-2 h-4 w-4" />
          Khôi phục mặc định
        </Button>
      </div>
    </div>
  );
}