import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { AdvancedFilter, FilterOption } from '../common/AdvancedFilter';
import { Eye, ShieldAlert, Edit, Trash2, Plus, RefreshCw, Download } from 'lucide-react';
import { toast } from 'sonner';
import { unsafeDevicesService, UnsafeDevice, CreateUnsafeDeviceDto, UpdateUnsafeDeviceDto, UnsafeDevicesParams } from '@/services/api';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { TablePagination } from '../common/TablePagination';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { Checkbox } from '../ui/checkbox';

export function InsecureDevices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<UnsafeDevicesParams>({});
  const [selectedDevice, setSelectedDevice] = useState<UnsafeDevice | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteMultipleDialogOpen, setIsDeleteMultipleDialogOpen] = useState(false);
  const [reload, setReload] = useState(false);
  
  // Multi-select state
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  
  // Data state
  const [devices, setDevices] = useState<UnsafeDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);
  
  // Form data for create
  const [createFormData, setCreateFormData] = useState<CreateUnsafeDeviceDto>({
    agent_id: '',
    device_name: '',
    device_status: 'active',
    hostname: ''
  });

  // Form data for edit
  const [editFormData, setEditFormData] = useState<UpdateUnsafeDeviceDto>({
    device_name: '',
    device_status: 'active',
    hostname: ''
  });

  // Fetch data
  const fetchDevices = async () => {
    setLoading(true);
    try {
      const params: UnsafeDevicesParams = {
        search: searchTerm || undefined,
        ...filters,
        // Convert min_alert_count to number if exists
        min_alert_count: filters.min_alert_count ? Number(filters.min_alert_count) : undefined
      };
      
      const response = await unsafeDevicesService.getAll(currentPage, pageSize, params);
      setDevices(response.data.devices);
      setTotal(response.data.pagination.total);
      setTotalPages(response.data.pagination.pages);
      setSelectedDevices(new Set()); // Clear selection on data change
      setSelectAll(false);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi tải dữ liệu';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [currentPage, searchTerm, filters, reload]);

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, total);

  const filterOptions: FilterOption[] = [
    {
      key: 'device_status',
      label: 'Trạng thái thiết bị',
      type: 'select',
      options: [
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Không hoạt động' }
      ]
    },
    {
      key: 'severity',
      label: 'Mức độ nghiêm trọng',
      type: 'select',
      options: [
        { value: 'high', label: 'Cao' },
        { value: 'critical', label: 'Nghiêm trọng' }
      ]
    },
    {
      key: 'min_alert_count',
      label: 'Số cảnh báo tối thiểu',
      type: 'select',
      options: [
        { value: '1', label: 'Từ 1 trở lên' },
        { value: '5', label: 'Từ 5 trở lên' },
        { value: '10', label: 'Từ 10 trở lên' },
        { value: '50', label: 'Từ 50 trở lên' },
        { value: '100', label: 'Từ 100 trở lên' },
        { value: '500', label: 'Từ 500 trở lên' }
      ]
    },
    {
      key: 'sort_by',
      label: 'Sắp xếp theo',
      type: 'select',
      options: [
        { value: 'alert_count', label: 'Số cảnh báo' },
        { value: 'latest_alert', label: 'Cảnh báo gần nhất' },
        { value: 'device_name', label: 'Tên thiết bị' },
        { value: 'created_at', label: 'Ngày tạo' }
      ]
    },
    {
      key: 'sort_order',
      label: 'Thứ tự',
      type: 'select',
      options: [
        { value: 'DESC', label: 'Giảm dần' },
        { value: 'ASC', label: 'Tăng dần' }
      ]
    }
  ];

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
    return status === 'active'
      ? 'bg-green-500/10 text-green-500 border-green-500/20'
      : 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const handleViewDetail = (device: UnsafeDevice) => {
    setSelectedDevice(device);
    setIsDetailOpen(true);
  };

  const handleCreate = async () => {
    try {
      await unsafeDevicesService.create(createFormData);
      toast.success('Đã thêm thiết bị thành công!');
      setIsCreateDialogOpen(false);
      setCreateFormData({
        agent_id: '',
        device_name: '',
        device_status: 'active',
        hostname: ''
      });
      setReload(!reload);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi thêm thiết bị';
      toast.error(errorMsg);
    }
  };

  const handleEditClick = (device: UnsafeDevice) => {
    setSelectedDevice(device);
    setEditFormData({
      device_name: device.device_name,
      device_status: device.device_status,
      hostname: device.hostname
    });
    setIsEditDialogOpen(true);
  };

  const handleEdit = async () => {
    if (!selectedDevice) return;
    
    try {
      await unsafeDevicesService.update(selectedDevice.agent_id, editFormData);
      toast.success('Đã cập nhật thiết bị thành công!');
      setIsEditDialogOpen(false);
      setSelectedDevice(null);
      setReload(!reload);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi cập nhật thiết bị';
      toast.error(errorMsg);
    }
  };

  const handleDeleteClick = (device: UnsafeDevice) => {
    setSelectedDevice(device);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedDevice) return;
    
    try {
      await unsafeDevicesService.delete(selectedDevice.agent_id);
      toast.success('Đã xóa thiết bị thành công!');
      setIsDeleteDialogOpen(false);
      setSelectedDevice(null);
      setReload(!reload);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi xóa thiết bị';
      toast.error(errorMsg);
    }
  };

  const handleRefresh = () => {
    setReload(!reload);
    toast.success('Đã làm mới dữ liệu!');
  };

  // Multi-select handlers
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      const allIds = new Set(devices.map(d => d.agent_id));
      setSelectedDevices(allIds);
    } else {
      setSelectedDevices(new Set());
    }
  };

  const handleSelectDevice = (agentId: string, checked: boolean) => {
    const newSelected = new Set(selectedDevices);
    if (checked) {
      newSelected.add(agentId);
    } else {
      newSelected.delete(agentId);
    }
    setSelectedDevices(newSelected);
    setSelectAll(newSelected.size === devices.length);
  };

  const handleDeleteMultiple = async () => {
    try {
      const agentIds = Array.from(selectedDevices);
      await unsafeDevicesService.deleteMultiple(agentIds);
      toast.success(`Đã xóa ${agentIds.length} thiết bị thành công!`);
      setIsDeleteMultipleDialogOpen(false);
      setSelectedDevices(new Set());
      setSelectAll(false);
      setReload(!reload);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi xóa thiết bị';
      toast.error(errorMsg);
    }
  };

  const handleExportCSV = async () => {
    try {
      toast.info('Đang xuất dữ liệu...');
      const params: UnsafeDevicesParams = {
        search: searchTerm || undefined,
        ...filters,
        // Convert min_alert_count to number if exists
        min_alert_count: filters.min_alert_count ? Number(filters.min_alert_count) : undefined
      };
      
      const blob = await unsafeDevicesService.exportCSV(params, 1000);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `unsafe-devices-${new Date().toISOString().slice(0, 10)}.csv`;
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

  // Calculate statistics
  const totalAlerts = devices.reduce((sum, device) => sum + device.alert_count, 0);
  const totalHigh = devices.reduce((sum, device) => sum + (device.severity_levels.high || 0), 0);
  const totalCritical = devices.reduce((sum, device) => sum + (device.severity_levels.critical || 0), 0);

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left flex justify-between items-center">
        <div>
          <h1>Danh sách thiết bị mất an toàn</h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý các thiết bị có vấn đề bảo mật
          </p>
        </div>
        <div className="flex gap-2">
          {selectedDevices.size > 0 && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => setIsDeleteMultipleDialogOpen(true)}
              className="scale-hover"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa ({selectedDevices.size})
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="scale-hover">
            <Download className="h-4 w-4 mr-2" />
            Xuất file CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="scale-hover">
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          {/* <Button onClick={() => setIsCreateDialogOpen(true)} className="scale-hover">
            <Plus className="h-4 w-4 mr-2" />
            Thêm thiết bị
          </Button> */}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="stagger-item">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tổng thiết bị</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card className="stagger-item" style={{animationDelay: '0.1s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tổng cảnh báo</CardTitle>
            <ShieldAlert className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {totalAlerts}
            </div>
          </CardContent>
        </Card>
        <Card className="stagger-item" style={{animationDelay: '0.2s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Mức cao</CardTitle>
            <ShieldAlert className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {totalHigh}
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
              {totalCritical}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <CardTitle>Thiết bị có vấn đề</CardTitle>
          <CardDescription>
            Hiển thị {devices.length} thiết bị trên trang {currentPage} / {totalPages}
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

          {loading ? (
            <LoadingSkeleton />
          ) : devices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Không có dữ liệu
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Tên thiết bị</TableHead>
                    <TableHead>Agent ID</TableHead>
                    <TableHead>Hostname</TableHead>
                    <TableHead>Số cảnh báo</TableHead>
                    <TableHead>Mức độ nghiêm trọng</TableHead>
                    <TableHead>Cảnh báo gần nhất</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((device, index) => (
                    <TableRow key={device.agent_id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                      <TableCell>
                        <Checkbox
                          checked={selectedDevices.has(device.agent_id)}
                          onCheckedChange={(checked: boolean) => handleSelectDevice(device.agent_id, checked)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{device.device_name}</TableCell>
                      <TableCell className="font-mono text-xs">{device.agent_id}</TableCell>
                      <TableCell>{device.hostname || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                          {device.alert_count}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {device.severity_levels.low && (
                            <Badge variant="outline" className={getSeverityColor('low')}>
                              Thấp: {device.severity_levels.low}
                            </Badge>
                          )}
                          {device.severity_levels.medium && (
                            <Badge variant="outline" className={getSeverityColor('medium')}>
                              TB: {device.severity_levels.medium}
                            </Badge>
                          )}
                          {device.severity_levels.high && (
                            <Badge variant="outline" className={getSeverityColor('high')}>
                              Cao: {device.severity_levels.high}
                            </Badge>
                          )}
                          {device.severity_levels.critical && (
                            <Badge variant="outline" className={getSeverityColor('critical')}>
                              NT: {device.severity_levels.critical}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(device.latest_alert).toLocaleString('vi-VN')}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(device.device_status)}>
                          {device.device_status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleViewDetail(device)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {/* <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleEditClick(device)}>
                            <Edit className="h-4 w-4" />
                          </Button> */}
                          <Button variant="ghost" size="sm" className="scale-hover text-red-500" onClick={() => handleDeleteClick(device)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  totalItems={total}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
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
                <div className="col-span-2 text-sm font-medium">{selectedDevice.device_name}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Agent ID:</div>
                <div className="col-span-2 text-sm font-mono">{selectedDevice.agent_id}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Hostname:</div>
                <div className="col-span-2 text-sm">{selectedDevice.hostname || '-'}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Tổng cảnh báo:</div>
                <div className="col-span-2">
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                    {selectedDevice.alert_count}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Mức độ nghiêm trọng:</div>
                <div className="col-span-2 flex flex-wrap gap-1">
                  {selectedDevice.severity_levels.low && (
                    <Badge variant="outline" className={getSeverityColor('low')}>
                      Thấp: {selectedDevice.severity_levels.low}
                    </Badge>
                  )}
                  {selectedDevice.severity_levels.medium && (
                    <Badge variant="outline" className={getSeverityColor('medium')}>
                      Trung bình: {selectedDevice.severity_levels.medium}
                    </Badge>
                  )}
                  {selectedDevice.severity_levels.high && (
                    <Badge variant="outline" className={getSeverityColor('high')}>
                      Cao: {selectedDevice.severity_levels.high}
                    </Badge>
                  )}
                  {selectedDevice.severity_levels.critical && (
                    <Badge variant="outline" className={getSeverityColor('critical')}>
                      Nghiêm trọng: {selectedDevice.severity_levels.critical}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Loại cảnh báo:</div>
                <div className="col-span-2">
                  <div className="space-y-1">
                    {Object.entries(selectedDevice.alert_types).map(([type, count]) => (
                      <div key={type} className="text-sm">
                        <Badge variant="outline" className="mr-2">
                          {type}
                        </Badge>
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Cảnh báo gần nhất:</div>
                <div className="col-span-2 text-sm">{new Date(selectedDevice.latest_alert).toLocaleString('vi-VN')}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Trạng thái:</div>
                <div className="col-span-2">
                  <Badge variant="outline" className={getStatusColor(selectedDevice.device_status)}>
                    {selectedDevice.device_status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Ngày tạo:</div>
                <div className="col-span-2 text-sm">{new Date(selectedDevice.created_at).toLocaleString('vi-VN')}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Cập nhật lần cuối:</div>
                <div className="col-span-2 text-sm">{new Date(selectedDevice.updated_at).toLocaleString('vi-VN')}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Thêm thiết bị mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin thiết bị không an toàn
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="agent_id">Agent ID *</Label>
              <Input
                id="agent_id"
                value={createFormData.agent_id}
                onChange={(e) => setCreateFormData({ ...createFormData, agent_id: e.target.value })}
                placeholder="Nhập Agent ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="device_name">Tên thiết bị *</Label>
              <Input
                id="device_name"
                value={createFormData.device_name}
                onChange={(e) => setCreateFormData({ ...createFormData, device_name: e.target.value })}
                placeholder="Nhập tên thiết bị"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hostname">Hostname</Label>
              <Input
                id="hostname"
                value={createFormData.hostname}
                onChange={(e) => setCreateFormData({ ...createFormData, hostname: e.target.value })}
                placeholder="Nhập hostname"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="device_status">Trạng thái</Label>
              <Select
                value={createFormData.device_status}
                onValueChange={(value: string) => setCreateFormData({ ...createFormData, device_status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreate}>
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thiết bị</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin thiết bị
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_device_name">Tên thiết bị *</Label>
              <Input
                id="edit_device_name"
                value={editFormData.device_name}
                onChange={(e) => setEditFormData({ ...editFormData, device_name: e.target.value })}
                placeholder="Nhập tên thiết bị"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_hostname">Hostname</Label>
              <Input
                id="edit_hostname"
                value={editFormData.hostname}
                onChange={(e) => setEditFormData({ ...editFormData, hostname: e.target.value })}
                placeholder="Nhập hostname"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_device_status">Trạng thái</Label>
              <Select
                value={editFormData.device_status}
                onValueChange={(value: string) => setEditFormData({ ...editFormData, device_status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEdit}>
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa thiết bị <strong>{selectedDevice?.device_name}</strong>? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Multiple Dialog */}
      <AlertDialog open={isDeleteMultipleDialogOpen} onOpenChange={setIsDeleteMultipleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa nhiều</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa <strong>{selectedDevices.size}</strong> thiết bị đã chọn? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMultiple} className="bg-red-600 text-white hover:bg-red-700">
              Xóa tất cả
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
