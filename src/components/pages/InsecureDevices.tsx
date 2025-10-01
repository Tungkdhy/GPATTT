import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { AdvancedFilter, FilterOption } from '../common/AdvancedFilter';
import { Eye, ShieldAlert, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const mockInsecureDevices = [
  { id: 1, deviceName: 'Server-DB-01', ipAddress: '192.168.1.100', issue: 'Outdated security patches', severity: 'high', detectedDate: '2024-01-15 10:30', status: 'unresolved' },
  { id: 2, deviceName: 'Workstation-05', ipAddress: '10.0.0.50', issue: 'Weak password detected', severity: 'medium', detectedDate: '2024-01-14 15:20', status: 'unresolved' },
  { id: 3, deviceName: 'Router-Main', ipAddress: '172.16.0.1', issue: 'Firmware vulnerability', severity: 'critical', detectedDate: '2024-01-13 09:15', status: 'resolved' },
  { id: 4, deviceName: 'Firewall-01', ipAddress: '203.162.4.191', issue: 'Misconfigured rules', severity: 'high', detectedDate: '2024-01-12 14:45', status: 'unresolved' },
];

export function InsecureDevices() {
  const [devices, setDevices] = useState(mockInsecureDevices);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);

  const filterOptions: FilterOption[] = [
    {
      key: 'severity',
      label: 'Mức độ',
      type: 'select',
      options: [
        { value: 'low', label: 'Thấp' },
        { value: 'medium', label: 'Trung bình' },
        { value: 'high', label: 'Cao' },
        { value: 'critical', label: 'Nghiêm trọng' }
      ]
    },
    {
      key: 'status',
      label: 'Trạng thái',
      type: 'select',
      options: [
        { value: 'unresolved', label: 'Chưa xử lý' },
        { value: 'resolved', label: 'Đã xử lý' }
      ]
    }
  ];

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ipAddress.includes(searchTerm) ||
      device.issue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = !filters.severity || device.severity === filters.severity;
    const matchesStatus = !filters.status || device.status === filters.status;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'resolved' 
      ? 'bg-green-500/10 text-green-500 border-green-500/20'
      : 'bg-red-500/10 text-red-500 border-red-500/20';
  };

  const handleViewDetail = (device: any) => {
    setSelectedDevice(device);
    setIsDetailOpen(true);
  };

  const handleResolveClick = (device: any) => {
    setSelectedDevice(device);
    setIsResolveDialogOpen(true);
  };

  const handleResolve = () => {
    setDevices(devices.map(d => d.id === selectedDevice.id ? { ...d, status: 'resolved' } : d));
    setIsResolveDialogOpen(false);
    setSelectedDevice(null);
    toast.success('Đã đánh dấu thiết bị là an toàn!');
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Danh sách thiết bị mất an toàn</h1>
        <p className="text-muted-foreground">
          Theo dõi và quản lý các thiết bị có vấn đề bảo mật
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="stagger-item">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tổng thiết bị</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devices.length}</div>
          </CardContent>
        </Card>
        <Card className="stagger-item" style={{animationDelay: '0.1s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Chưa xử lý</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {devices.filter(d => d.status === 'unresolved').length}
            </div>
          </CardContent>
        </Card>
        <Card className="stagger-item" style={{animationDelay: '0.2s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Đã xử lý</CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {devices.filter(d => d.status === 'resolved').length}
            </div>
          </CardContent>
        </Card>
        <Card className="stagger-item" style={{animationDelay: '0.3s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Nghiêm trọng</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {devices.filter(d => d.severity === 'critical').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <CardTitle>Thiết bị có vấn đề</CardTitle>
          <CardDescription>
            Hiển thị {filteredDevices.length}/{devices.length} thiết bị
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <AdvancedFilter
              searchPlaceholder="Tìm kiếm thiết bị..."
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              filterOptions={filterOptions}
              filters={filters}
              onFiltersChange={setFilters}
              onReset={() => setSearchTerm('')}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên thiết bị</TableHead>
                <TableHead>Địa chỉ IP</TableHead>
                <TableHead>Vấn đề</TableHead>
                <TableHead>Mức độ</TableHead>
                <TableHead>Ngày phát hiện</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((device, index) => (
                <TableRow key={device.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                  <TableCell className="font-medium">{device.deviceName}</TableCell>
                  <TableCell className="font-mono">{device.ipAddress}</TableCell>
                  <TableCell>{device.issue}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getSeverityColor(device.severity)}>
                      {device.severity === 'low' ? 'Thấp' :
                       device.severity === 'medium' ? 'Trung bình' :
                       device.severity === 'high' ? 'Cao' : 'Nghiêm trọng'}
                    </Badge>
                  </TableCell>
                  <TableCell>{device.detectedDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(device.status)}>
                      {device.status === 'resolved' ? 'Đã xử lý' : 'Chưa xử lý'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleViewDetail(device)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {device.status === 'unresolved' && (
                        <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleResolveClick(device)}>
                          <ShieldCheck className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết thiết bị</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về vấn đề bảo mật
            </DialogDescription>
          </DialogHeader>
          {selectedDevice && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Tên thiết bị:</div>
                <div className="col-span-2 text-sm font-medium">{selectedDevice.deviceName}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Địa chỉ IP:</div>
                <div className="col-span-2 text-sm font-mono">{selectedDevice.ipAddress}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Vấn đề:</div>
                <div className="col-span-2 text-sm">{selectedDevice.issue}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Mức độ:</div>
                <div className="col-span-2">
                  <Badge variant="outline" className={getSeverityColor(selectedDevice.severity)}>
                    {selectedDevice.severity === 'low' ? 'Thấp' :
                     selectedDevice.severity === 'medium' ? 'Trung bình' :
                     selectedDevice.severity === 'high' ? 'Cao' : 'Nghiêm trọng'}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Ngày phát hiện:</div>
                <div className="col-span-2 text-sm">{selectedDevice.detectedDate}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Trạng thái:</div>
                <div className="col-span-2">
                  <Badge variant="outline" className={getStatusColor(selectedDevice.status)}>
                    {selectedDevice.status === 'resolved' ? 'Đã xử lý' : 'Chưa xử lý'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đã xử lý</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn rằng vấn đề bảo mật của thiết bị <strong>{selectedDevice?.deviceName}</strong> đã được xử lý?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleResolve} className="bg-green-600 text-white hover:bg-green-700">
              Xác nhận đã xử lý
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
