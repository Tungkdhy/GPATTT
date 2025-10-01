import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AdvancedFilter, FilterOption } from '../common/AdvancedFilter';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const mockDevices = [
  { id: 1, name: 'Server-001', type: 'Server', ip: '192.168.1.10', status: 'online', location: 'Datacenter A', lastSeen: '2024-01-15 12:30' },
  { id: 2, name: 'Firewall-Main', type: 'Firewall', ip: '192.168.1.1', status: 'online', location: 'Network Room', lastSeen: '2024-01-15 12:29' },
  { id: 3, name: 'Switch-Core', type: 'Switch', ip: '192.168.1.5', status: 'offline', location: 'Network Room', lastSeen: '2024-01-15 10:15' },
  { id: 4, name: 'Workstation-01', type: 'Workstation', ip: '192.168.1.50', status: 'online', location: 'Office Floor 1', lastSeen: '2024-01-15 12:25' },
  { id: 5, name: 'Router-Gateway', type: 'Router', ip: '192.168.1.254', status: 'warning', location: 'Network Room', lastSeen: '2024-01-15 12:20' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'offline': return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'warning': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'online': return 'Trực tuyến';
    case 'offline': return 'Ngoại tuyến';
    case 'warning': return 'Cảnh báo';
    default: return 'Không xác định';
  }
};

export function DeviceManagement() {
  const [devices, setDevices] = useState(mockDevices);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    ip: '',
    location: ''
  });

  const filterOptions: FilterOption[] = [
    {
      key: 'type',
      label: 'Loại thiết bị',
      type: 'select',
      options: [
        { value: 'Server', label: 'Server' },
        { value: 'Firewall', label: 'Firewall' },
        { value: 'Switch', label: 'Switch' },
        { value: 'Router', label: 'Router' },
        { value: 'Workstation', label: 'Workstation' }
      ]
    },
    {
      key: 'status',
      label: 'Trạng thái',
      type: 'select',
      options: [
        { value: 'online', label: 'Trực tuyến' },
        { value: 'offline', label: 'Ngoại tuyến' },
        { value: 'warning', label: 'Cảnh báo' }
      ]
    },
    {
      key: 'location',
      label: 'Vị trí',
      type: 'select',
      options: [
        { value: 'Datacenter A', label: 'Datacenter A' },
        { value: 'Network Room', label: 'Network Room' },
        { value: 'Office Floor 1', label: 'Office Floor 1' }
      ]
    }
  ];

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ip.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filters.type || device.type === filters.type;
    const matchesStatus = !filters.status || device.status === filters.status;
    const matchesLocation = !filters.location || device.location === filters.location;
    
    return matchesSearch && matchesType && matchesStatus && matchesLocation;
  });

  const handleAdd = () => {
    const newDevice = {
      id: devices.length + 1,
      name: formData.name,
      type: formData.type,
      ip: formData.ip,
      status: 'online',
      location: formData.location,
      lastSeen: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    setDevices([...devices, newDevice]);
    setIsDialogOpen(false);
    setFormData({ name: '', type: '', ip: '', location: '' });
    toast.success('Thêm thiết bị thành công!');
  };

  const handleEdit = (device: any) => {
    setSelectedDevice(device);
    setFormData({
      name: device.name,
      type: device.type,
      ip: device.ip,
      location: device.location
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    setDevices(devices.map(d => d.id === selectedDevice.id ? {
      ...d,
      name: formData.name,
      type: formData.type,
      ip: formData.ip,
      location: formData.location
    } : d));
    setIsEditDialogOpen(false);
    setSelectedDevice(null);
    setFormData({ name: '', type: '', ip: '', location: '' });
    toast.success('Cập nhật thiết bị thành công!');
  };

  const handleDeleteClick = (device: any) => {
    setSelectedDevice(device);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    setDevices(devices.filter(d => d.id !== selectedDevice.id));
    setIsDeleteDialogOpen(false);
    setSelectedDevice(null);
    toast.success('Xóa thiết bị thành công!');
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Quản lý thiết bị</h1>
        <p className="text-muted-foreground">
          Quản lý và giám sát các thiết bị trong hệ thống mạng
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách thiết bị</CardTitle>
              <CardDescription>
                Tổng cộng {devices.length} thiết bị trong hệ thống
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-animate scale-hover">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm thiết bị
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Thêm thiết bị mới</DialogTitle>
                  <DialogDescription>
                    Thêm thiết bị mới vào hệ thống quản lý
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="device-name">Tên thiết bị</Label>
                    <Input 
                      id="device-name" 
                      placeholder="Nhập tên thiết bị" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="device-type">Loại thiết bị</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại thiết bị" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Server">Server</SelectItem>
                        <SelectItem value="Firewall">Firewall</SelectItem>
                        <SelectItem value="Switch">Switch</SelectItem>
                        <SelectItem value="Router">Router</SelectItem>
                        <SelectItem value="Workstation">Workstation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="device-ip">Địa chỉ IP</Label>
                    <Input 
                      id="device-ip" 
                      placeholder="192.168.1.x" 
                      value={formData.ip}
                      onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="device-location">Vị trí</Label>
                    <Input 
                      id="device-location" 
                      placeholder="Nhập vị trí thiết bị" 
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full" onClick={handleAdd}>Thêm thiết bị</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
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
                <TableHead>Loại thiết bị</TableHead>
                <TableHead>Địa chỉ IP</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead>Lần cuối thấy</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((device, index) => (
                <TableRow key={device.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                  <TableCell className="font-medium">{device.name}</TableCell>
                  <TableCell>{device.type}</TableCell>
                  <TableCell>{device.ip}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(device.status)}>
                      {getStatusText(device.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{device.location}</TableCell>
                  <TableCell>{device.lastSeen}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleEdit(device)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleDeleteClick(device)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thiết bị</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin thiết bị
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-device-name">Tên thiết bị</Label>
              <Input 
                id="edit-device-name" 
                placeholder="Nhập tên thiết bị" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-device-type">Loại thiết bị</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại thiết bị" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Server">Server</SelectItem>
                  <SelectItem value="Firewall">Firewall</SelectItem>
                  <SelectItem value="Switch">Switch</SelectItem>
                  <SelectItem value="Router">Router</SelectItem>
                  <SelectItem value="Workstation">Workstation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-device-ip">Địa chỉ IP</Label>
              <Input 
                id="edit-device-ip" 
                placeholder="192.168.1.x" 
                value={formData.ip}
                onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-device-location">Vị trí</Label>
              <Input 
                id="edit-device-location" 
                placeholder="Nhập vị trí thiết bị" 
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" onClick={handleUpdate}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa thiết bị <strong>{selectedDevice?.name}</strong>? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
