import { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { AdvancedFilter, FilterOption } from '../common/AdvancedFilter';
import { Plus, Edit, Trash2, Loader2, Eye, Download } from 'lucide-react';
import { toast } from 'sonner';
import managedDevicesService, { ManagedDevice, CreateManagedDeviceDto } from '../../services/api/managedDevices.service';
import categoryService from '../../services/api/category.service';
import usersService from '../../services/api/users.service';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'inactive': return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'maintenance': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'Hoạt động';
    case 'inactive': return 'Không hoạt động';
    case 'maintenance': return 'Bảo trì';
    default: return 'Không xác định';
  }
};

export function DeviceManagement() {
  const [devices, setDevices] = useState<ManagedDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<ManagedDevice | null>(null);
  const [deviceTypes, setDeviceTypes] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [formData, setFormData] = useState<CreateManagedDeviceDto>({
    device_name: '',
    serial_number: '',
    ip_address: '',
    device_status: 'active',
    description: '',
    device_type_id: '',
    owner: '',
    host: '',
    os: '',
    os_version: '',
    cpu_info: '',
    ram_total_gb: '',
    agent_id: '',
    token: ''
  });

  const filterOptions: FilterOption[] = [
    {
      key: 'device_status',
      label: 'Trạng thái',
      type: 'select',
      options: [
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Không hoạt động' },
        { value: 'maintenance', label: 'Bảo trì' }
      ]
    },
    {
      key: 'os',
      label: 'Hệ điều hành',
      type: 'select',
      options: [
        { value: 'Windows 11', label: 'Windows 11' },
        { value: 'Windows 10', label: 'Windows 10' },
        { value: 'Linux', label: 'Linux' },
        { value: 'macOS', label: 'macOS' }
      ]
    }
  ];

  // Load devices and options on component mount
  useEffect(() => {
    loadDevices();
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      setLoadingOptions(true);
      const [deviceTypesRes, usersRes] = await Promise.all([
        categoryService.getAll(1, 1000, { scope: 'DEVICE_TYPE' }),
        usersService.getAll(1, 1000)
      ]);
      setDeviceTypes(deviceTypesRes);
      setUsers(usersRes.rows || []);
    } catch (error) {
      console.error('Error loading options:', error);
      toast.error('Không thể tải danh sách lựa chọn');
    } finally {
      setLoadingOptions(false);
    }
  };

  const loadDevices = async () => {
    try {
      setLoading(true);
      const response = await managedDevicesService.getAll();
      setDevices(response.data.rows);
    } catch (error) {
      console.error('Error loading devices:', error);
      toast.error('Không thể tải danh sách thiết bị');
    } finally {
      setLoading(false);
    }
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.device_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ip_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.serial_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filters.device_status || device.device_status === filters.device_status;
    const matchesOS = !filters.os || device.os === filters.os;
    
    return matchesSearch && matchesStatus && matchesOS;
  });

  const handleAdd = async () => {
    try {
      const newDevice = await managedDevicesService.create(formData);
    setDevices([...devices, newDevice]);
    setIsDialogOpen(false);
      resetFormData();
    toast.success('Thêm thiết bị thành công!');
    } catch (error) {
      console.error('Error creating device:', error);
      toast.error('Không thể thêm thiết bị');
    }
  };

  const handleEdit = (device: ManagedDevice) => {
    setSelectedDevice(device);
    setFormData({
      device_name: device.device_name,
      serial_number: device.serial_number,
      ip_address: device.ip_address,
      device_status: device.device_status,
      description: device.description,
      device_type_id: device.device_type_id,
      owner: device.owner,
      host: device.host,
      os: device.os,
      os_version: device.os_version,
      cpu_info: device.cpu_info,
      ram_total_gb: device.ram_total_gb,
      agent_id: device.agent_id || '',
      token: device.token || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedDevice) return;
    
    try {
      const updatedDevice = await managedDevicesService.update(selectedDevice.id, formData);
      setDevices(devices.map(d => d.id === selectedDevice.id ? updatedDevice : d));
    setIsEditDialogOpen(false);
    setSelectedDevice(null);
      resetFormData();
    toast.success('Cập nhật thiết bị thành công!');
    } catch (error) {
      console.error('Error updating device:', error);
      toast.error('Không thể cập nhật thiết bị');
    }
  };

  const handleDeleteClick = (device: ManagedDevice) => {
    setSelectedDevice(device);
    setIsDeleteDialogOpen(true);
  };

  const handleViewDetails = (device: ManagedDevice) => {
    setSelectedDevice(device);
    setIsDetailDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedDevice) return;
    
    try {
      await managedDevicesService.delete(selectedDevice.id);
    setDevices(devices.filter(d => d.id !== selectedDevice.id));
    setIsDeleteDialogOpen(false);
    setSelectedDevice(null);
    toast.success('Xóa thiết bị thành công!');
    } catch (error) {
      console.error('Error deleting device:', error);
      toast.error('Không thể xóa thiết bị');
    }
  };

  const resetFormData = () => {
    setFormData({
      device_name: '',
      serial_number: '',
      ip_address: '',
      device_status: 'active',
      description: '',
      device_type_id: '',
      owner: '',
      host: '',
      os: '',
      os_version: '',
      cpu_info: '',
      ram_total_gb: '',
      agent_id: '',
      token: ''
    });
  };

  const getDeviceTypeName = (deviceTypeId: string) => {
    const deviceType = deviceTypes.find(type => type.id === deviceTypeId);
    return deviceType ? deviceType.name : 'Không xác định';
  };

  const getOwnerName = (ownerId: string) => {
    const owner = users.find(user => user.id === ownerId);
    return owner ? (owner.display_name || owner.user_name) : 'Không xác định';
  };

  const handleExportCSV = async () => {
    try {
      toast.info('Đang xuất dữ liệu...');
      const blob = await managedDevicesService.exportCSV();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `devices-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Đã xuất file CSV thành công!');
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi xuất dữ liệu';
      toast.error(errorMsg);
    }
  };

  const handleExportConfiguration = async () => {
    try {
      toast.info('Đang xuất cấu hình máy tác chiến...');
      const blob = await managedDevicesService.exportConfiguration();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `device-configuration-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Đã xuất file cấu hình thành công!');
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi xuất cấu hình';
      toast.error(errorMsg);
    }
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
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportCSV}
                className="scale-hover"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportConfiguration}
                className="scale-hover"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Cấu hình
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-animate scale-hover">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm thiết bị
                  </Button>
                </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[70vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Thêm thiết bị mới</DialogTitle>
                  <DialogDescription>
                    Thêm thiết bị mới vào hệ thống quản lý
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="device-name">Tên thiết bị *</Label>
                    <Input 
                      id="device-name" 
                      placeholder="Nhập tên thiết bị" 
                        value={formData.device_name}
                        onChange={(e) => setFormData({ ...formData, device_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serial-number">Số serial *</Label>
                      <Input 
                        id="serial-number" 
                        placeholder="Nhập số serial" 
                        value={formData.serial_number}
                        onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="device-ip">Địa chỉ IP *</Label>
                      <Input 
                        id="device-ip" 
                        placeholder="192.168.1.x" 
                        value={formData.ip_address}
                        onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="device-status">Trạng thái</Label>
                      <Select value={formData.device_status} onValueChange={(value: string) => setFormData({ ...formData, device_status: value })}>
                      <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="active">Hoạt động</SelectItem>
                          <SelectItem value="inactive">Không hoạt động</SelectItem>
                          <SelectItem value="maintenance">Bảo trì</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="device-type-id">Loại thiết bị</Label>
                      <Select value={formData.device_type_id} onValueChange={(value: string) => setFormData({ ...formData, device_type_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại thiết bị" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingOptions ? (
                            <SelectItem value="" disabled>Đang tải...</SelectItem>
                          ) : (
                            deviceTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.display_name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner">Chủ sở hữu</Label>
                      <Select value={formData.owner} onValueChange={(value: string) => setFormData({ ...formData, owner: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chủ sở hữu" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingOptions ? (
                            <SelectItem value="" disabled>Đang tải...</SelectItem>
                          ) : (
                            users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.display_name || user.user_name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* System Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="host">Host</Label>
                      <Input 
                        id="host" 
                        placeholder="Nhập host" 
                        value={formData.host}
                        onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="os">Hệ điều hành</Label>
                      <Input 
                        id="os" 
                        placeholder="Nhập hệ điều hành" 
                        value={formData.os}
                        onChange={(e) => setFormData({ ...formData, os: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="os-version">Phiên bản OS</Label>
                      <Input 
                        id="os-version" 
                        placeholder="Nhập phiên bản OS" 
                        value={formData.os_version}
                        onChange={(e) => setFormData({ ...formData, os_version: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpu-info">Thông tin CPU</Label>
                      <Input 
                        id="cpu-info" 
                        placeholder="Nhập thông tin CPU" 
                        value={formData.cpu_info}
                        onChange={(e) => setFormData({ ...formData, cpu_info: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ram-total">RAM (GB)</Label>
                    <Input 
                        id="ram-total" 
                        placeholder="Nhập dung lượng RAM" 
                        value={formData.ram_total_gb}
                        onChange={(e) => setFormData({ ...formData, ram_total_gb: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agent-id">Agent ID</Label>
                      <Input 
                        id="agent-id" 
                        placeholder="Nhập Agent ID" 
                        value={formData.agent_id}
                        onChange={(e) => setFormData({ ...formData, agent_id: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="token">Token</Label>
                      <Input 
                        id="token" 
                        placeholder="Nhập Token" 
                        value={formData.token}
                        onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Nhập mô tả thiết bị" 
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full" onClick={handleAdd}>Thêm thiết bị</Button>
                </DialogFooter>
              </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <AdvancedFilter
              searchPlaceholder="Tìm kiếm theo tên, IP, serial..."
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              filterOptions={filterOptions}
              filters={filters}
              onFiltersChange={setFilters}
              onReset={() => {
                setSearchTerm('');
                setFilters({});
              }}
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Đang tải...</span>
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên thiết bị</TableHead>
                  <TableHead>Số serial</TableHead>
                <TableHead>Địa chỉ IP</TableHead>
                <TableHead>Trạng thái</TableHead>
                  <TableHead>Hệ điều hành</TableHead>
                  <TableHead>Chủ sở hữu</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((device, index) => (
                <TableRow key={device.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                    <TableCell className="font-medium">{device.device_name}</TableCell>
                    <TableCell>{device.serial_number}</TableCell>
                    <TableCell>{device.ip_address}</TableCell>
                  <TableCell>
                      <Badge variant="outline" className={getStatusColor(device.device_status)}>
                        {getStatusText(device.device_status)}
                    </Badge>
                  </TableCell>
                    <TableCell>{device.os} {device.os_version}</TableCell>
                    <TableCell>{getOwnerName(device.owner)}</TableCell>
                    <TableCell>{new Date(device.created_at).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleViewDetails(device)} title="Xem chi tiết">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleEdit(device)} title="Chỉnh sửa">
                        <Edit className="h-4 w-4" />
                      </Button>
                        <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleDeleteClick(device)} title="Xóa">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thiết bị</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin thiết bị
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="edit-device-name">Tên thiết bị *</Label>
              <Input 
                id="edit-device-name" 
                placeholder="Nhập tên thiết bị" 
                  value={formData.device_name}
                  onChange={(e) => setFormData({ ...formData, device_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-serial-number">Số serial *</Label>
                <Input 
                  id="edit-serial-number" 
                  placeholder="Nhập số serial" 
                  value={formData.serial_number}
                  onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-device-ip">Địa chỉ IP *</Label>
                <Input 
                  id="edit-device-ip" 
                  placeholder="192.168.1.x" 
                  value={formData.ip_address}
                  onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-device-status">Trạng thái</Label>
                <Select value={formData.device_status} onValueChange={(value: string) => setFormData({ ...formData, device_status: value })}>
                <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                </SelectContent>
              </Select>
            </div>
              <div className="space-y-2">
                <Label htmlFor="edit-device-type-id">Loại thiết bị</Label>
                <Select value={formData.device_type_id} onValueChange={(value: string) => setFormData({ ...formData, device_type_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại thiết bị" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingOptions ? (
                      <SelectItem value="" disabled>Đang tải...</SelectItem>
                    ) : (
                      deviceTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.display_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-owner">Chủ sở hữu</Label>
                <Select value={formData.owner} onValueChange={(value: string) => setFormData({ ...formData, owner: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chủ sở hữu" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingOptions ? (
                      <SelectItem value="" disabled>Đang tải...</SelectItem>
                    ) : (
                      users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.display_name || user.user_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* System Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-host">Host</Label>
                <Input 
                  id="edit-host" 
                  placeholder="Nhập host" 
                  value={formData.host}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-os">Hệ điều hành</Label>
                <Input 
                  id="edit-os" 
                  placeholder="Nhập hệ điều hành" 
                  value={formData.os}
                  onChange={(e) => setFormData({ ...formData, os: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-os-version">Phiên bản OS</Label>
                <Input 
                  id="edit-os-version" 
                  placeholder="Nhập phiên bản OS" 
                  value={formData.os_version}
                  onChange={(e) => setFormData({ ...formData, os_version: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cpu-info">Thông tin CPU</Label>
                <Input 
                  id="edit-cpu-info" 
                  placeholder="Nhập thông tin CPU" 
                  value={formData.cpu_info}
                  onChange={(e) => setFormData({ ...formData, cpu_info: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ram-total">RAM (GB)</Label>
              <Input 
                  id="edit-ram-total" 
                  placeholder="Nhập dung lượng RAM" 
                  value={formData.ram_total_gb}
                  onChange={(e) => setFormData({ ...formData, ram_total_gb: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-agent-id">Agent ID</Label>
                <Input 
                  id="edit-agent-id" 
                  placeholder="Nhập Agent ID" 
                  value={formData.agent_id}
                  onChange={(e) => setFormData({ ...formData, agent_id: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-token">Token</Label>
                <Input 
                  id="edit-token" 
                  placeholder="Nhập Token" 
                  value={formData.token}
                  onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea 
                id="edit-description" 
                placeholder="Nhập mô tả thiết bị" 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" onClick={handleUpdate}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Device Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết thiết bị</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về thiết bị {selectedDevice?.device_name}
            </DialogDescription>
          </DialogHeader>
          {selectedDevice && (
            <div className="space-y-6 py-4">
              {/* Device Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Tên thiết bị:</span>
                      <span className="text-right">{selectedDevice.device_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Số serial:</span>
                      <span className="text-right">{selectedDevice.serial_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Địa chỉ IP:</span>
                      <span className="font-mono text-right">{selectedDevice.ip_address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Trạng thái:</span>
                      <Badge variant="outline" className={getStatusColor(selectedDevice.device_status)}>
                        {getStatusText(selectedDevice.device_status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Hệ điều hành:</span>
                      <span className="text-right">{selectedDevice.os}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Phiên bản OS:</span>
                      <span className="text-right">{selectedDevice.os_version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">CPU:</span>
                      <span className="text-right">{selectedDevice.cpu_info}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">RAM:</span>
                      <span className="text-right">{selectedDevice.ram_total_gb} GB</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Host:</span>
                      <span className="text-right">{selectedDevice.host}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Loại thiết bị:</span>
                      <span className="text-right">{getDeviceTypeName(selectedDevice.device_type_id)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Chủ sở hữu:</span>
                      <span className="text-right">{getOwnerName(selectedDevice.owner)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Ngày tạo:</span>
                      <span className="text-right text-sm">{new Date(selectedDevice.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Người tạo:</span>
                      <span className="text-right">{selectedDevice.created_by_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Ngày nhận:</span>
                      <span className="text-right text-sm">{selectedDevice.date_received ? new Date(selectedDevice.date_received).toLocaleDateString('vi-VN') : 'Chưa có'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {selectedDevice.description && (
                <div className="space-y-2">
                  <span className="font-medium">Mô tả:</span>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                    {selectedDevice.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="font-medium text-sm">Agent ID:</span>
                  <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                    {selectedDevice.agent_id}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="font-medium text-sm">ID thiết bị:</span>
                  <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                    {selectedDevice.id}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Đóng
            </Button>
            <Button onClick={() => {
              setIsDetailDialogOpen(false);
              handleEdit(selectedDevice!);
            }}>
              Chỉnh sửa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa thiết bị <strong>{selectedDevice?.device_name}</strong>? 
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
