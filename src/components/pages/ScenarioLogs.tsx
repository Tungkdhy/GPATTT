import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { AdvancedFilter, FilterOption } from '../common/AdvancedFilter';
import { TablePagination } from '../common/TablePagination';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { Eye, Download, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useServerPagination } from '@/hooks/useServerPagination';
import { scriptHistoriesService, ScriptHistory, usersService } from '@/services/api';
import categoryService from '@/services/api/category.service';
import { format } from 'date-fns';

export function ScenarioLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({
    script_id: '__all__',
    action: '__all__',
    changed_by: '__all__'
  });
  const [selectedLog, setSelectedLog] = useState<ScriptHistory | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [scripts, setScripts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // Load scripts and users for filter dropdowns
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        // Load scripts from category API with scope=SCRIPT
        const scriptsResponse = await categoryService.getAll(1, 10000, { scope: 'SCRIPT' });
        setScripts(scriptsResponse || []);
        
        // Load users
        const usersResponse = await usersService.getAll(1, 10000, {});
        setUsers(usersResponse?.rows || []);
      } catch (error) {
        console.error('Error loading filter options:', error);
        toast.error('Lỗi khi tải dữ liệu filter');
      }
    };

    loadFilterOptions();
  }, []);

  const {
    data: logs,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    total,
    loading,
    error,
    setCurrentPage,
    pageSize,
  } = useServerPagination<ScriptHistory>(
    async (page, limit) => {
      const response = await scriptHistoriesService.getAll(page, limit, {
        script_id: filters.script_id === '__all__' ? '' : (filters.script_id || searchTerm),
        action: filters.action === '__all__' ? '' : filters.action,
        changed_by: filters.changed_by === '__all__' ? '' : filters.changed_by,
      });
      return response.data;
    },
    [searchTerm, filters]
  );

  const filterOptions: FilterOption[] = [
    {
      key: 'script_id',
      label: 'Kịch bản',
      type: 'select',
      options: scripts.map(script => ({
        value: script.id,
        label: script.display_name || script.value || script.name
      }))
    },
    {
      key: 'action',
      label: 'Hành động',
      type: 'select',
      options: [
        { value: 'CREATE', label: 'Tạo mới' },
        { value: 'UPDATE', label: 'Cập nhật' },
        { value: 'DELETE', label: 'Xóa' }
      ]
    },
    {
      key: 'changed_by',
      label: 'Người thực hiện',
      type: 'select',
      options: users.map(user => ({
        value: user.id,
        label: user.display_name || user.user_name
      }))
    }
  ];

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'UPDATE': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'DELETE': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'CREATE': return 'Tạo mới';
      case 'UPDATE': return 'Cập nhật';
      case 'DELETE': return 'Xóa';
      default: return action;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss');
    } catch {
      return dateString;
    }
  };

  const handleViewDetail = (log: ScriptHistory) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
  };

  const handleExport = () => {
    toast.success('Đang xuất dữ liệu log kịch bản...');
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({
      script_id: '__all__',
      action: '__all__',
      changed_by: '__all__'
    });
  };

  if (error) {
    return (
      <div className="space-y-6 fade-in-up">
        <div className="slide-in-left">
          <h1>Lịch sử thay đổi kịch bản</h1>
          <p className="text-muted-foreground">
            Theo dõi và phân tích lịch sử thay đổi các kịch bản
          </p>
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Không thể tải dữ liệu</h3>
              <p className="text-sm text-muted-foreground">
                {error.message || 'Đã xảy ra lỗi khi tải dữ liệu'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Lịch sử thay đổi kịch bản</h1>
        <p className="text-muted-foreground">
          Theo dõi và phân tích lịch sử thay đổi các kịch bản
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lịch sử thay đổi</CardTitle>
              <CardDescription>
                Hiển thị {startIndex + 1}-{endIndex} trong tổng số {total} bản ghi
              </CardDescription>
            </div>
            <Button className="btn-animate scale-hover" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Xuất dữ liệu
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <AdvancedFilter
              searchPlaceholder="Tìm kiếm theo tên kịch bản..."
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              filterOptions={filterOptions}
              filters={filters}
              onFiltersChange={setFilters}
              onReset={handleResetFilters}
            />
          </div>

          {loading ? (
            <LoadingSkeleton rows={pageSize} />
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Không tìm thấy dữ liệu</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Tên kịch bản</TableHead>
                    <TableHead>Hành động</TableHead>
                    <TableHead>Người thực hiện</TableHead>
                    <TableHead>Địa chỉ IP</TableHead>
                    <TableHead>Loại kịch bản</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log, index) => (
                    <TableRow key={log.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                      <TableCell className="font-medium font-mono text-sm">
                        {formatDateTime(log.changed_at)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {log.new_values?.script_name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getActionColor(log.action)}>
                          {getActionLabel(log.action)}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.changed_by_name}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ip_address}</TableCell>
                      <TableCell>{log.new_values?.script_type_name || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleViewDetail(log)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  totalItems={total}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết lịch sử thay đổi</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về thay đổi kịch bản
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Thông tin chung</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm text-muted-foreground">Thời gian:</div>
                  <div className="col-span-2 text-sm font-mono">{formatDateTime(selectedLog.changed_at)}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm text-muted-foreground">Hành động:</div>
                  <div className="col-span-2">
                    <Badge variant="outline" className={getActionColor(selectedLog.action)}>
                      {getActionLabel(selectedLog.action)}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm text-muted-foreground">Người thực hiện:</div>
                  <div className="col-span-2 text-sm font-medium">{selectedLog.changed_by_name}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm text-muted-foreground">Địa chỉ IP:</div>
                  <div className="col-span-2 text-sm font-mono">{selectedLog.ip_address}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm text-muted-foreground">User Agent:</div>
                  <div className="col-span-2 text-sm break-all">{selectedLog.user_agent}</div>
                </div>
              </div>

              {selectedLog.old_values && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Giá trị cũ</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Tên:</span> {selectedLog.old_values.script_name}</div>
                      <div><span className="font-medium">File:</span> {selectedLog.old_values.rule_file_name}</div>
                      <div><span className="font-medium">Loại:</span> {selectedLog.old_values.script_type_name}</div>
                      <div><span className="font-medium">Trạng thái:</span> {selectedLog.old_values.is_published ? 'Đã xuất bản' : 'Chưa xuất bản'}</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedLog.new_values && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Giá trị mới</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Tên:</span> {selectedLog.new_values.script_name}</div>
                      <div><span className="font-medium">File:</span> {selectedLog.new_values.rule_file_name}</div>
                      <div><span className="font-medium">Loại:</span> {selectedLog.new_values.script_type_name}</div>
                      <div><span className="font-medium">Trạng thái:</span> {selectedLog.new_values.is_published ? 'Đã xuất bản' : 'Chưa xuất bản'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

