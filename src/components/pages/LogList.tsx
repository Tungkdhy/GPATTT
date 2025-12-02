import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { AdvancedFilter, FilterOption } from '../common/AdvancedFilter';
import { Eye, AlertTriangle, Edit, Trash2, RefreshCw, Download, CheckCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { alertsService, Alert, UpdateAlertDto, AlertsParams, AlertStats, CreateAlertDto } from '@/services/api';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { TablePagination } from '../common/TablePagination';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
// import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';

export function LogList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<AlertsParams>({});
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  // const [isDeleteMultipleDialogOpen, setIsDeleteMultipleDialogOpen] = useState(false);
  const [reload, setReload] = useState(false);
  
  // Multi-select state
  // const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());
  // const [selectAll, setSelectAll] = useState(false);
  
  // Data state
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(20);
  
  // Stats state
  const [stats, setStats] = useState<AlertStats | null>(null);

  // Form data for edit
  const [editFormData, setEditFormData] = useState<UpdateAlertDto>({
    hostname: '',
    type: '',
    severity: '',
    source: '',
    summary: '',
    is_processed: 0
  });

  const [createFormData, setCreateFormData] = useState<CreateAlertDto>({
    agent_id: '',
    hostname: '',
    ts: Math.floor(Date.now() / 1000),
    type: '',
    severity: 'low',
    count: '1'
  });
  const [isCreating, setIsCreating] = useState(false);

  // Fetch data
  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const params: AlertsParams = {
        search: searchTerm || undefined,
        ...filters
      };
      
      const response = await alertsService.getAll(currentPage, pageSize, params);
      setAlerts(response.data.alerts);
      setTotal(response.data.pagination.total);
      setTotalPages(response.data.pagination.pages);
      // setSelectedAlerts(new Set());
      // setSelectAll(false);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi tải dữ liệu';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const statsData = await alertsService.getStats();
      setStats(statsData);
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [currentPage, searchTerm, filters, reload]);

  useEffect(() => {
    fetchStats();
  }, [reload]);

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, total);

  const filterOptions: FilterOption[] = [
    {
      key: 'severity',
      label: 'Mức độ nghiêm trọng',
      type: 'select',
      options: [
        { value: 'low', label: 'Thấp' },
        { value: 'medium', label: 'Trung bình' },
        { value: 'high', label: 'Cao' },
        { value: 'critical', label: 'Nghiêm trọng' }
      ]
    },
    {
      key: 'is_processed',
      label: 'Trạng thái xử lý',
      type: 'select',
      options: [
        { value: '0', label: 'Chưa xử lý' },
        { value: '1', label: 'Đã xử lý' }
      ]
    },
    {
      key: 'sort_by',
      label: 'Sắp xếp theo',
      type: 'select',
      options: [
        // { value: 'ts', label: 'Thời gian' },
        { value: 'severity', label: 'Mức độ nghiêm trọng' },
        { value: 'type', label: 'Loại cảnh báo' },
        { value: 'created_at', label: 'Ngày tạo' }
      ]
    },
    {
      key: 'sort_order',
      label: 'Thứ tự',
      type: 'select',
      options: [
        { value: 'DESC', label: 'Tăng dần' },
        { value: 'ASC', label: 'Giảm dần' }
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

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'SYN_SCAN': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      'TCP_CONNECT_SCAN': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      'AI_MALWARE_DETECT': 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return colors[type] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const handleViewDetail = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsDetailOpen(true);
  };

  const handleEditClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setEditFormData({
      hostname: alert.hostname,
      type: alert.type,
      severity: alert.severity,
      source: alert.source,
      summary: alert.summary,
      is_processed: alert.is_processed
    });
    setIsEditDialogOpen(true);
  };

  const handleCreateClick = () => {
    setCreateFormData({
      agent_id: '',
      hostname: '',
      ts: Math.floor(Date.now() / 1000),
      type: '',
      severity: 'low',
      count: '1'
    });
    setIsCreateDialogOpen(true);
  };

  const handleEdit = async () => {
    if (!selectedAlert) return;
    
    try {
      await alertsService.update(selectedAlert.id, editFormData);
      toast.success('Đã cập nhật cảnh báo thành công!');
      setIsEditDialogOpen(false);
      setSelectedAlert(null);
      setReload(!reload);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi cập nhật cảnh báo';
      toast.error(errorMsg);
    }
  };

  const handleDeleteClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedAlert) return;
    
    try {
      await alertsService.delete(selectedAlert.id);
      toast.success('Đã xóa cảnh báo thành công!');
      setIsDeleteDialogOpen(false);
      setSelectedAlert(null);
      setReload(!reload);
      fetchStats();
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi xóa cảnh báo';
      toast.error(errorMsg);
    }
  };

  const handleCreate = async () => {
    if (!createFormData.agent_id.trim()) {
      toast.error('Vui lòng nhập Agent ID');
      return;
    }
    if (!createFormData.hostname.trim()) {
      toast.error('Vui lòng nhập Hostname');
      return;
    }
    if (!createFormData.type.trim()) {
      toast.error('Vui lòng nhập loại cảnh báo');
      return;
    }
    if (!createFormData.severity) {
      toast.error('Vui lòng chọn mức độ cảnh báo');
      return;
    }
    if (!createFormData.count.trim() || Number(createFormData.count) <= 0) {
      toast.error('Số lượng phải lớn hơn 0');
      return;
    }
    if (!Number.isFinite(createFormData.ts) || createFormData.ts <= 0) {
      toast.error('Timestamp không hợp lệ');
      return;
    }

    try {
      setIsCreating(true);
      await alertsService.create({
        agent_id: createFormData.agent_id,
        hostname: createFormData.hostname,
        ts: Math.floor(createFormData.ts),
        type: createFormData.type,
        severity: createFormData.severity,
        count: createFormData.count
      });
      toast.success('Đã thêm Log mới thành công!');
      setIsCreateDialogOpen(false);
      setReload(!reload);
      fetchStats();
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi thêm Log';
      toast.error(errorMsg);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRefresh = () => {
    setReload(!reload);
    fetchStats();
    toast.success('Đã làm mới dữ liệu!');
  };

  // Multi-select handlers
  // const handleSelectAll = (checked: boolean) => {
  //   setSelectAll(checked);
  //   if (checked) {
  //     const allIds = new Set(alerts.map(a => a.id));
  //     setSelectedAlerts(allIds);
  //   } else {
  //     setSelectedAlerts(new Set());
  //   }
  // };

  // const handleSelectAlert = (id: string, checked: boolean) => {
  //   const newSelected = new Set(selectedAlerts);
  //   if (checked) {
  //     newSelected.add(id);
  //   } else {
  //     newSelected.delete(id);
  //   }
  //   setSelectedAlerts(newSelected);
  //   setSelectAll(newSelected.size === alerts.length);
  // };

  // const handleDeleteMultiple = async () => {
  //   try {
  //     const ids = Array.from(selectedAlerts);
  //     await alertsService.deleteMultiple(ids);
  //     toast.success(`Đã xóa ${ids.length} cảnh báo thành công!`);
  //     setIsDeleteMultipleDialogOpen(false);
  //     setSelectedAlerts(new Set());
  //     setSelectAll(false);
  //     setReload(!reload);
  //     fetchStats();
  //   } catch (error: any) {
  //     const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi xóa cảnh báo';
  //     toast.error(errorMsg);
  //   }
  // };

  const handleMarkAsProcessed = async (id: string) => {
    try {
      await alertsService.markAsProcessed(id);
      toast.success('Đã đánh dấu đã xử lý!');
      setReload(!reload);
      fetchStats();
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra';
      toast.error(errorMsg);
    }
  };

  // const handleMarkMultipleAsProcessed = async () => {
  //   try {
  //     const ids = Array.from(selectedAlerts);
  //     await alertsService.markMultipleAsProcessed(ids);
  //     toast.success(`Đã đánh dấu ${ids.length} cảnh báo là đã xử lý!`);
  //     setSelectedAlerts(new Set());
  //     setSelectAll(false);
  //     setReload(!reload);
  //     fetchStats();
  //   } catch (error: any) {
  //     const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra';
  //     toast.error(errorMsg);
  //   }
  // };

  const handleExportCSV = async () => {
    try {
      toast.info('Đang xuất dữ liệu...');
      const params: AlertsParams = {
        search: searchTerm || undefined,
        ...filters
      };
      
      const blob = await alertsService.exportCSV(params, 1000);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `alerts-${new Date().toISOString().slice(0, 10)}.csv`;
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

  const formatTimestamp = (ts: number) => {
    return new Date(ts * 1000).toLocaleString('vi-VN');
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left flex justify-between items-center">
        <div>
          <h1>Danh sách Log</h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý các Log bảo mật
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleCreateClick} className="scale-hover">
            <Plus className="h-4 w-4 mr-2" />
            Thêm mới Log
          </Button>
          {/* {selectedAlerts.size > 0 && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleMarkMultipleAsProcessed}
                className="scale-hover"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Đánh dấu đã xử lý ({selectedAlerts.size})
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => setIsDeleteMultipleDialogOpen(true)}
                className="scale-hover"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa ({selectedAlerts.size})
              </Button>
            </>
          )} */}
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="scale-hover">
            <Download className="h-4 w-4 mr-2" />
            Xuất file CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="scale-hover">
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="stagger-item">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tổng Log</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>
        <Card className="stagger-item" style={{animationDelay: '0.1s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Chưa xử lý</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {stats?.byStatus.unprocessed || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="stagger-item" style={{animationDelay: '0.2s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Mức cao</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {stats?.bySeverity.high || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="stagger-item" style={{animationDelay: '0.3s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Nghiêm trọng</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {stats?.bySeverity.critical || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <CardTitle>Log bảo mật</CardTitle>
          <CardDescription>
            Hiển thị {alerts.length} Log trên trang {currentPage} / {totalPages}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <AdvancedFilter
              searchPlaceholder="Tìm kiếm Log..."
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
          ) : alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Không có dữ liệu
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead> */}
                    <TableHead>Loại</TableHead>
                    <TableHead>Mức độ</TableHead>
                    <TableHead>Hostname</TableHead>
                    <TableHead className="w-[180px]">Nguồn</TableHead>
                    <TableHead>Tóm tắt</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert, index) => (
                    <TableRow key={alert.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                      {/* <TableCell>
                        <Checkbox
                          checked={selectedAlerts.has(alert.id)}
                          onCheckedChange={(checked: boolean) => handleSelectAlert(alert.id, checked)}
                        />
                      </TableCell> */}
                      <TableCell>
                        <Badge variant="outline" className={getTypeColor(alert?.type)}>
                          {alert?.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getSeverityColor(alert?.severity)}>
                          {alert?.severity === 'low' ? 'Thấp' :
                           alert?.severity === 'medium' ? 'TB' :
                           alert?.severity === 'high' ? 'Cao' : 'NT'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{alert?.hostname}</TableCell>
                      <TableCell className="max-w-xs truncate">{alert?.source}</TableCell>
                      <TableCell className="max-w-xs truncate">{alert?.summary}</TableCell>
                      <TableCell className="text-sm">{formatTimestamp(alert?.ts)}</TableCell>
                      <TableCell>
                        {alert?.is_processed === 1 ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            Đã xử lý
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                            Chưa xử lý
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {alert?.is_processed === 0 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="scale-hover text-green-500" 
                              onClick={() => handleMarkAsProcessed(alert?.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleViewDetail(alert)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleEditClick(alert)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="scale-hover text-red-500" onClick={() => handleDeleteClick(alert)}>
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

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm Log mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin để thêm Log mới vào hệ thống
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create_agent_id">Agent ID</Label>
              <Input
                id="create_agent_id"
                value={createFormData.agent_id}
                onChange={(e) => setCreateFormData({ ...createFormData, agent_id: e.target.value })}
                placeholder="Nhập Agent ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_hostname">Hostname</Label>
              <Input
                id="create_hostname"
                value={createFormData.hostname}
                onChange={(e) => setCreateFormData({ ...createFormData, hostname: e.target.value })}
                placeholder="Nhập hostname"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_type">Loại cảnh báo</Label>
              <Input
                id="create_type"
                value={createFormData.type}
                onChange={(e) => setCreateFormData({ ...createFormData, type: e.target.value })}
                placeholder="Nhập loại cảnh báo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_severity">Mức độ</Label>
              <Select
                value={createFormData.severity}
                onValueChange={(value: string) => setCreateFormData({ ...createFormData, severity: value as CreateAlertDto['severity'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="critical">Nghiêm trọng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_ts">Timestamp (giây)</Label>
              <Input
                id="create_ts"
                type="number"
                min="0"
                value={createFormData.ts.toString()}
                onChange={(e) => setCreateFormData({ ...createFormData, ts: Number(e.target.value) })}
                placeholder="Nhập timestamp (giây)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_count">Số lượng</Label>
              <Input
                id="create_count"
                type="number"
                min="1"
                value={createFormData.count}
                onChange={(e) => setCreateFormData({ ...createFormData, count: e.target.value })}
                placeholder="Nhập số lượng"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isCreating}>
              Hủy
            </Button>
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating ? 'Đang thêm...' : 'Thêm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết Log</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về Log bảo mật
            </DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">ID:</div>
                <div className="col-span-2 text-sm font-mono text-xs">{selectedAlert.id}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Loại:</div>
                <div className="col-span-2">
                  <Badge variant="outline" className={getTypeColor(selectedAlert.type)}>
                    {selectedAlert.type}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Mức độ:</div>
                <div className="col-span-2">
                  <Badge variant="outline" className={getSeverityColor(selectedAlert.severity)}>
                    {selectedAlert.severity}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Hostname:</div>
                <div className="col-span-2 text-sm font-medium">{selectedAlert.hostname}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Agent ID:</div>
                <div className="col-span-2 text-sm font-mono text-xs">{selectedAlert.agent_id}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Nguồn:</div>
                <div className="col-span-2 text-sm font-mono">{selectedAlert.source}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Tóm tắt:</div>
                <div className="col-span-2 text-sm">{selectedAlert.summary}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Thời gian:</div>
                <div className="col-span-2 text-sm">{formatTimestamp(selectedAlert.ts)}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Trạng thái:</div>
                <div className="col-span-2">
                  {selectedAlert.is_processed === 1 ? (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      Đã xử lý
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                      Chưa xử lý
                    </Badge>
                  )}
                </div>
              </div>
              {selectedAlert.file_path && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm text-muted-foreground">File path:</div>
                  <div className="col-span-2 text-sm font-mono text-xs break-all">{selectedAlert.file_path}</div>
                </div>
              )}
              {selectedAlert.file_hash && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm text-muted-foreground">File hash:</div>
                  <div className="col-span-2 text-sm font-mono text-xs break-all">{selectedAlert.file_hash}</div>
                </div>
              )}
              {selectedAlert.yara_rule && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm text-muted-foreground">YARA Rule:</div>
                  <div className="col-span-2 text-sm font-mono text-xs">{selectedAlert.yara_rule}</div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Thiết bị:</div>
                <div className="col-span-2 text-sm">{selectedAlert.agent.device_name}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Ngày tạo:</div>
                <div className="col-span-2 text-sm">{new Date(selectedAlert.created_at).toLocaleString('vi-VN')}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Cập nhật:</div>
                <div className="col-span-2 text-sm">{new Date(selectedAlert.updated_at).toLocaleString('vi-VN')}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Log</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin Log
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
              <Label htmlFor="edit_type">Loại cảnh báo</Label>
              <Input
                id="edit_type"
                value={editFormData.type}
                onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                placeholder="Nhập loại cảnh báo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_severity">Mức độ</Label>
              <Select
                value={editFormData.severity}
                onValueChange={(value: string) => setEditFormData({ ...editFormData, severity: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="critical">Nghiêm trọng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_source">Nguồn</Label>
              <Input
                id="edit_source"
                value={editFormData.source}
                onChange={(e) => setEditFormData({ ...editFormData, source: e.target.value })}
                placeholder="Nhập nguồn"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_summary">Tóm tắt</Label>
              <Textarea
                id="edit_summary"
                value={editFormData.summary}
                onChange={(e) => setEditFormData({ ...editFormData, summary: e.target.value })}
                placeholder="Nhập tóm tắt"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_is_processed">Trạng thái xử lý</Label>
              <Select
                value={editFormData.is_processed?.toString()}
                onValueChange={(value: string) => setEditFormData({ ...editFormData, is_processed: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Chưa xử lý</SelectItem>
                  <SelectItem value="1">Đã xử lý</SelectItem>
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
              Bạn có chắc chắn muốn xóa Log này? Hành động này không thể hoàn tác.
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
      {/* <AlertDialog open={isDeleteMultipleDialogOpen} onOpenChange={setIsDeleteMultipleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa nhiều</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa <strong>{selectedAlerts.size}</strong> Log đã chọn? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMultiple} className="bg-red-600 text-white hover:bg-red-700">
              Xóa tất cả
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </div>
  );
}

