import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { AdvancedFilter, FilterOption } from '../common/AdvancedFilter';
import { Eye, AlertTriangle, Trash2, RefreshCw, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { warningService, Warning, WarningParams } from '@/services/api';
import { TablePagination } from '../common/TablePagination';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { Checkbox } from '../ui/checkbox';

export function Alerts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<WarningParams>({});
  const [selectedWarning, setSelectedWarning] = useState<Warning | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteMultipleDialogOpen, setIsDeleteMultipleDialogOpen] = useState(false);
  const [reload, setReload] = useState(false);
  
  // Multi-select state
  const [selectedWarnings, setSelectedWarnings] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  
  // Data state
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);

  // Fetch data
  const fetchWarnings = async () => {
    setLoading(true);
    try {
      const params: WarningParams = {
        search: searchTerm || undefined,
        ...filters
      };
      
      const response = await warningService.getAll(currentPage, pageSize, params);
      setWarnings(response.data.rows);
      setTotal(response.data.count);
      setTotalPages(Math.ceil(response.data.count / pageSize));
      setSelectedWarnings(new Set());
      setSelectAll(false);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi tải dữ liệu';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarnings();
  }, [currentPage, searchTerm, filters, reload]);

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, total);

  const filterOptions: FilterOption[] = [
    {
      key: 'is_process',
      label: 'Trạng thái xử lý',
      type: 'select',
      options: [
        { value: 'false', label: 'Chưa xử lý' },
        { value: 'true', label: 'Đã xử lý' }
      ]
    },
    {
      key: 'sort_by',
      label: 'Sắp xếp theo',
      type: 'select',
      options: [
        { value: 'display_name', label: 'Tên' },
        { value: 'usage', label: 'Sử dụng' },
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

  const getUsagePercentage = (usage: number, total: number) => {
    if (total === 0) return 0;
    return ((usage / total) * 100).toFixed(1);
  };

  const getUsageColor = (usage: number, total: number) => {
    const percentage = (usage / total) * 100;
    if (percentage >= 90) return 'bg-red-500/10 text-red-500 border-red-500/20';
    if (percentage >= 75) return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    if (percentage >= 50) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    return 'bg-green-500/10 text-green-500 border-green-500/20';
  };

  const handleViewDetail = (warning: Warning) => {
    setSelectedWarning(warning);
    setIsDetailOpen(true);
  };

  const handleDeleteClick = (warning: Warning) => {
    setSelectedWarning(warning);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedWarning) return;
    
    try {
      await warningService.delete(selectedWarning.id);
      toast.success('Đã xóa cảnh báo thành công!');
      setIsDeleteDialogOpen(false);
      setSelectedWarning(null);
      setReload(!reload);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi xóa cảnh báo';
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
      const allIds = new Set(warnings.map(w => w.id));
      setSelectedWarnings(allIds);
    } else {
      setSelectedWarnings(new Set());
    }
  };

  const handleSelectWarning = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedWarnings);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedWarnings(newSelected);
    setSelectAll(newSelected.size === warnings.length);
  };

  const handleDeleteMultiple = async () => {
    try {
      const ids = Array.from(selectedWarnings);
      await warningService.deleteMultiple(ids);
      toast.success(`Đã xóa ${ids.length} cảnh báo thành công!`);
      setIsDeleteMultipleDialogOpen(false);
      setSelectedWarnings(new Set());
      setSelectAll(false);
      setReload(!reload);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi xóa cảnh báo';
      toast.error(errorMsg);
    }
  };

  const handleMarkAsProcessed = async (id: string) => {
    try {
      await warningService.markAsProcessed(id);
      toast.success('Đã đánh dấu đã xử lý!');
      setReload(!reload);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra';
      toast.error(errorMsg);
    }
  };

  const handleMarkMultipleAsProcessed = async () => {
    try {
      const ids = Array.from(selectedWarnings);
      await warningService.markMultipleAsProcessed(ids);
      toast.success(`Đã đánh dấu ${ids.length} cảnh báo là đã xử lý!`);
      setSelectedWarnings(new Set());
      setSelectAll(false);
      setReload(!reload);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra';
      toast.error(errorMsg);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left flex justify-between items-center">
        <div>
          <h1>Danh sách cảnh báo tài nguyên</h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý các cảnh báo về tài nguyên hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          {selectedWarnings.size > 0 && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleMarkMultipleAsProcessed}
                className="scale-hover"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Đánh dấu đã xử lý ({selectedWarnings.size})
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => setIsDeleteMultipleDialogOpen(true)}
                className="scale-hover"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa ({selectedWarnings.size})
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={handleRefresh} className="scale-hover">
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* <div className="grid gap-4 md:grid-cols-3">
        <Card className="stagger-item">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tổng cảnh báo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card className="stagger-item" style={{animationDelay: '0.1s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Chưa xử lý</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {warnings.filter(w => !w.is_process).length}
            </div>
          </CardContent>
        </Card>
        <Card className="stagger-item" style={{animationDelay: '0.2s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Đã xử lý</CardTitle>
            <AlertTriangle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {warnings.filter(w => w.is_process).length}
            </div>
          </CardContent>
        </Card>
      </div> */}

      <Card className="card-hover">
        <CardHeader>
          <CardTitle>Cảnh báo tài nguyên</CardTitle>
          <CardDescription>
            Hiển thị {warnings.length} cảnh báo trên trang {currentPage} / {totalPages}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* <div className="mb-6">
            <AdvancedFilter
              searchPlaceholder="Tìm kiếm cảnh báo..."
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              filterOptions={filterOptions}
              filters={filters}
              onFiltersChange={setFilters}
              onReset={() => setSearchTerm('')}
            />
          </div> */}

          {loading ? (
            <LoadingSkeleton />
          ) : warnings.length === 0 ? (
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
                    <TableHead>Tên hiển thị</TableHead>
                    <TableHead>Sử dụng</TableHead>
                    <TableHead>Tổng</TableHead>
                    <TableHead>Tỷ lệ</TableHead>
                    <TableHead>Người tạo</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warnings.map((warning, index) => (
                    <TableRow key={warning.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                      <TableCell>
                        <Checkbox
                          checked={selectedWarnings.has(warning.id)}
                          onCheckedChange={(checked: boolean) => handleSelectWarning(warning.id, checked)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{warning.display_name}</TableCell>
                      <TableCell>{warning.usage.toFixed(2)} GB</TableCell>
                      <TableCell>{warning.total.toFixed(2)} GB</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getUsageColor(warning.usage, warning.total)}>
                          {getUsagePercentage(warning.usage, warning.total)}%
                        </Badge>
                      </TableCell>
                      <TableCell>{warning.created_by_user?.display_name || 'N/A'}</TableCell>
                      <TableCell className="text-sm">{formatDate(warning.created_at)}</TableCell>
                      <TableCell>
                        {warning.is_process ? (
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
                          {!warning.is_process && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="scale-hover text-green-500" 
                              onClick={() => handleMarkAsProcessed(warning.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleViewDetail(warning)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="scale-hover text-red-500" onClick={() => handleDeleteClick(warning)}>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết cảnh báo</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về cảnh báo tài nguyên
            </DialogDescription>
          </DialogHeader>
          {selectedWarning && (
            <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">ID:</div>
                <div className="col-span-2 text-sm font-mono text-xs">{selectedWarning.id}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Tên:</div>
                <div className="col-span-2 text-sm font-medium">{selectedWarning.display_name}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Sử dụng:</div>
                <div className="col-span-2 text-sm">{selectedWarning.usage.toFixed(2)} GB</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Tổng:</div>
                <div className="col-span-2 text-sm">{selectedWarning.total.toFixed(2)} GB</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Tỷ lệ:</div>
                <div className="col-span-2">
                  <Badge variant="outline" className={getUsageColor(selectedWarning.usage, selectedWarning.total)}>
                    {getUsagePercentage(selectedWarning.usage, selectedWarning.total)}%
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Người tạo:</div>
                <div className="col-span-2 text-sm">{selectedWarning.created_by_user?.display_name || 'N/A'}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Trạng thái:</div>
                <div className="col-span-2">
                  {selectedWarning.is_process ? (
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
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Ngày tạo:</div>
                <div className="col-span-2 text-sm">{formatDate(selectedWarning.created_at)}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Cập nhật:</div>
                <div className="col-span-2 text-sm">{formatDate(selectedWarning.updated_at)}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa cảnh báo này? Hành động này không thể hoàn tác.
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
              Bạn có chắc chắn muốn xóa <strong>{selectedWarnings.size}</strong> cảnh báo đã chọn? Hành động này không thể hoàn tác.
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

