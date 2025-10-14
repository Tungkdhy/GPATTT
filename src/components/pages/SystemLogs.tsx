import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { AdvancedFilter, FilterOption } from '../common/AdvancedFilter';
import { TablePagination } from '../common/TablePagination';
import { Eye, Download, Activity, Trash2, Calendar, User, FileText, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useServerPagination } from '../../hooks/useServerPagination';
import { logsService, Log, LogType } from '../../services/api';
import { format } from 'date-fns';

export function SystemLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteLogId, setDeleteLogId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [logTypes, setLogTypes] = useState<LogType[]>([]);
  const [reload,setReload] = useState(false);

  // Fetch log types for filter options
  useEffect(() => {
    const fetchLogTypes = async () => {
      try {
        const types = await logsService.getLogTypes();
        setLogTypes(types);
      } catch (error: any) {
        console.error('Error fetching log types:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi tải danh sách loại log';
        toast.error(errorMessage);
      }
    };
    fetchLogTypes();
  }, []);

  // Fetch logs with pagination
  const fetchLogs = async (page: number, limit: number, params: any) => {
    const queryParams = {
      type: 0, // Default type for system logs
      pageSize: limit,
      pageIndex: page,
      ...params
    };

    if (searchTerm) {
      queryParams.name = searchTerm;
    }

    if (filters.logType) {
      queryParams.logType = filters.logType;
    }

    if (filters.actionName) {
      queryParams.actionName = filters.actionName;
    }

    if (filters.userId) {
      queryParams.userId = filters.userId;
    }

    if (filters.isActive !== undefined) {
      queryParams.isActive = filters.isActive;
    }

    if (filters.startDate) {
      queryParams.startDate = filters.startDate;
    }

    if (filters.endDate) {
      queryParams.endDate = filters.endDate;
    }

    const response = await logsService.getAll(queryParams);
    return response.data;
  };

  const {
    data: logs,
    currentPage,
    totalPages,
    total,
    loading,
    error,
    setCurrentPage,
    pageSize
  } = useServerPagination(fetchLogs, [searchTerm, filters,reload], { pageSize: 10 }, {});

  // Function to refresh data
  const refreshData = () => {
    setCurrentPage(currentPage);
  };

  const filterOptions: FilterOption[] = [
    {
      key: 'logType',
      label: 'Loại log',
      type: 'select',
      options: logTypes.map(type => ({
        value: type.id,
        label: type.display_name
      }))
    },
    {
      key: 'actionName',
      label: 'Hành động',
      type: 'select',
      options: [
        { value: 'CREATE', label: 'Tạo mới' },
        { value: 'UPDATE', label: 'Cập nhật' },
        { value: 'DELETE', label: 'Xóa' },
        { value: 'LOGIN', label: 'Đăng nhập' },
        { value: 'LOGOUT', label: 'Đăng xuất' }
      ]
    },
    {
      key: 'isActive',
      label: 'Trạng thái',
      type: 'select',
      options: [
        { value: 'true', label: 'Hoạt động' },
        { value: 'false', label: 'Không hoạt động' }
      ]
    },
    {
      key: 'startDate',
      label: 'Từ ngày',
      type: 'date'
    },
    {
      key: 'endDate',
      label: 'Đến ngày',
      type: 'date'
    }
  ];

  const getActionColor = (actionName: string) => {
    if (actionName.includes('CREATE')) return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (actionName.includes('UPDATE')) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    if (actionName.includes('DELETE')) return 'bg-red-500/10 text-red-500 border-red-500/20';
    if (actionName.includes('LOGIN')) return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    if (actionName.includes('LOGOUT')) return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const getLogTypeColor = (logType: string) => {
    switch (logType) {
      case 'Application': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Security': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'System': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Network': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const handleViewDetail = (log: Log) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
  };

  const handleDeleteClick = (logId: string) => {
    setDeleteLogId(logId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteLogId) return;

    try {
      await logsService.delete(deleteLogId);
      toast.success('Xóa log thành công');
      setIsDeleteDialogOpen(false);
      setDeleteLogId(null);
      // Refresh the data
      setReload(!reload);
      refreshData();
    } catch (error: any) {
      console.error('Error deleting log:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi xóa log';
      toast.error(errorMessage);
    }
  };

  const handleExport = async () => {
    try {
      toast.success('Đang xuất nhật ký hệ thống...');
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Xuất dữ liệu thành công');
      // Refresh data after export
      refreshData();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi xuất dữ liệu';
      toast.error(errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss');
    } catch {
      return dateString;
    }
  };

  // Calculate statistics
  const totalLogs = total;
  const createLogs = logs.filter(log => log.action_name.includes('CREATE')).length;
  const updateLogs = logs.filter(log => log.action_name.includes('UPDATE')).length;
  const deleteLogs = logs.filter(log => log.action_name.includes('DELETE')).length;
  const activeLogs = logs.filter(log => log.is_active).length;

  if (error) {
    return (
      <div className="space-y-6 fade-in-up">
        <div className="slide-in-left">
          <h1>Nhật ký hệ thống</h1>
          <p className="text-muted-foreground">
            Xem và phân tích nhật ký hoạt động của hệ thống
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              <p>Có lỗi xảy ra khi tải dữ liệu: {error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Nhật ký hệ thống</h1>
        <p className="text-muted-foreground">
          Xem và phân tích nhật ký hoạt động của hệ thống
        </p>
      </div>

      <div style={{display:"flex",justifyContent:"space-between"}} className="grid gap-4 grid-cols-5 w-full">
        <Card className="stagger-item" style={{width:"100%"}}>
       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tổng logs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLogs}</div>
            <p className="text-xs text-muted-foreground">Tổng số bản ghi</p>
          </CardContent>
        </Card>
        <Card className="stagger-item" style={{width:"100%",animationDelay: '0.1s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tạo mới</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{createLogs}</div>
            <p className="text-xs text-muted-foreground">Hành động tạo</p>
          </CardContent>
        </Card>
        <Card className="stagger-item" style={{width:"100%",animationDelay: '0.2s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Cập nhật</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{updateLogs}</div>
            <p className="text-xs text-muted-foreground">Hành động sửa</p>
          </CardContent>
        </Card>
        <Card className="stagger-item" style={{width:"100%",animationDelay: '0.3s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Xóa</CardTitle>
            <Activity className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{deleteLogs}</div>
            <p className="text-xs text-muted-foreground">Hành động xóa</p>
          </CardContent>
        </Card>
        <Card className="stagger-item" style={{width:"100%",animationDelay: '0.4s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Hoạt động</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{activeLogs}</div>
            <p className="text-xs text-muted-foreground">Log đang hoạt động</p>
          </CardContent>
        </Card>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Nhật ký hệ thống</CardTitle>
              <CardDescription>
                Hiển thị {logs.length}/{total} bản ghi
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="btn-animate scale-hover" 
                onClick={refreshData}
                disabled={loading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
              <Button className="btn-animate scale-hover" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Xuất dữ liệu
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <AdvancedFilter
              searchPlaceholder="Tìm kiếm log..."
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
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Loại log</TableHead>
                    <TableHead>Hành động</TableHead>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log, index) => (
                    <TableRow key={log.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                      <TableCell className="font-medium font-mono text-sm">
                        {formatDate(log.created_at)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getLogTypeColor(log.log_type.display_name)}>
                          {log.log_type.display_name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getActionColor(log.action_name)}>
                          {log.action_name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{log.user.display_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={log.description}>
                        {log.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant={log.is_active ? "default" : "secondary"}>
                          {log.is_active ? 'Hoạt động' : 'Không hoạt động'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="scale-hover" 
                            onClick={() => handleViewDetail(log)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="scale-hover text-red-500 hover:text-red-700" 
                            onClick={() => handleDeleteClick(log.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={total}
                  startIndex={(currentPage-1)*pageSize}
                  endIndex={(currentPage)*pageSize}
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
            <DialogTitle className="text-lg">Chi tiết nhật ký</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Thời gian:</span>
                <span className="text-sm font-mono">{formatDate(selectedLog.created_at)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Loại log:</span>
                <Badge variant="outline" className={getLogTypeColor(selectedLog.log_type.display_name)}>
                  {selectedLog.log_type.display_name}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Hành động:</span>
                <Badge variant="outline" className={getActionColor(selectedLog.action_name)}>
                  {selectedLog.action_name}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Người dùng:</span>
                <div className="text-right">
                  <div className="text-sm font-medium">{selectedLog.user.display_name}</div>
                  <div className="text-xs text-muted-foreground">@{selectedLog.user.user_name}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Trạng thái:</span>
                <Badge variant={selectedLog.is_active ? "default" : "secondary"}>
                  {selectedLog.is_active ? 'Hoạt động' : 'Không hoạt động'}
                </Badge>
              </div>
              
              <div className="pt-2 border-t">
                <div className="text-sm text-muted-foreground mb-2">Mô tả:</div>
                <div className="text-sm bg-muted/50 p-3 rounded-md max-h-32 overflow-y-auto">
                  {selectedLog.description}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa log này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}