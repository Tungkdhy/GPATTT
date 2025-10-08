// SYSTEM BACKUP MANAGEMENT
import { useState, useEffect } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious
} from "../ui/pagination";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from '../ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { 
  Plus, 
  RotateCcw, 
  Trash2, 
  Download, 
  Database, 
  Calendar,
  User,
  Folder,
  Edit,
  AlertTriangle,
  Trash
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { systemBackupService, SystemBackup, UpdateBackupDto } from '../../services/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function SystemBackup() {
  const [reload, setReload] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isClearSystemDialogOpen, setIsClearSystemDialogOpen] = useState(false);
  const [isConfirmClearDialogOpen, setIsConfirmClearDialogOpen] = useState(false);
  const [clearConfirmText, setClearConfirmText] = useState('');
  const [selectedBackup, setSelectedBackup] = useState<SystemBackup | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateBackupDto>({
    name: '',
    type: 0
  });
  const [backups, setBackups] = useState<SystemBackup[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);

  // Fetch backups
  const fetchBackups = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await systemBackupService.getAll({
        pageIndex: page,
        pageSize: pageSize,
        type: 0 // Default type
      });
      
      if (response.statusCode === '10000') {
        setBackups(response.data.rows);
        setTotal(response.data.count);
        setTotalPages(Math.ceil(response.data.count / pageSize));
      }
    } catch (error) {
      console.error('Error fetching backups:', error);
      toast.error('Lỗi khi tải danh sách sao lưu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups(currentPage);
  }, [currentPage, reload]);

  // Create new backup
  const handleCreateBackup = async () => {
    try {
      setLoading(true);
      await systemBackupService.createBackup();
      toast.success('Tạo sao lưu thành công!');
      setReload(!reload);
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Lỗi khi tạo sao lưu');
    } finally {
      setLoading(false);
    }
  };

  // Restore backup
  const handleRestoreClick = (backup: SystemBackup) => {
    setSelectedBackup(backup);
    setIsRestoreDialogOpen(true);
  };

  const handleRestore = async () => {
    if (!selectedBackup) return;
    
    try {
      setLoading(true);
      await systemBackupService.restoreBackup(selectedBackup.id);
      setIsRestoreDialogOpen(false);
      setSelectedBackup(null);
      toast.success('Phục hồi sao lưu thành công!');
      setReload(!reload);
    } catch (error) {
      console.error('Error restoring backup:', error);
      toast.error('Lỗi khi phục hồi sao lưu');
    } finally {
      setLoading(false);
    }
  };

  // Edit backup
  const handleEditClick = (backup: SystemBackup) => {
    setSelectedBackup(backup);
    setEditFormData({
      name: backup.name,
      type: backup.type
    });
    setIsEditDialogOpen(true);
  };

  const handleEdit = async () => {
    if (!selectedBackup) return;
    
    try {
      setLoading(true);
      await systemBackupService.updateBackup(selectedBackup.id, editFormData);
      setIsEditDialogOpen(false);
      setSelectedBackup(null);
      toast.success('Cập nhật thông tin sao lưu thành công!');
      setReload(!reload);
    } catch (error) {
      console.error('Error updating backup:', error);
      toast.error('Lỗi khi cập nhật thông tin sao lưu');
    } finally {
      setLoading(false);
    }
  };

  // Delete backup
  const handleDeleteClick = (backup: SystemBackup) => {
    setSelectedBackup(backup);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedBackup) return;
    
    try {
      setLoading(true);
      await systemBackupService.deleteBackup(selectedBackup.id);
      setIsDeleteDialogOpen(false);
      setSelectedBackup(null);
      toast.success('Xóa sao lưu thành công!');
      setReload(!reload);
    } catch (error) {
      console.error('Error deleting backup:', error);
      toast.error('Lỗi khi xóa sao lưu');
    } finally {
      setLoading(false);
    }
  };

  // Clear system
  const handleClearSystemClick = () => {
    setIsClearSystemDialogOpen(true);
  };

  const handleClearSystemConfirm = () => {
    setIsClearSystemDialogOpen(false);
    setIsConfirmClearDialogOpen(true);
    setClearConfirmText('');
  };

  const handleClearSystem = async () => {
    if (clearConfirmText !== 'XÓA TOÀN BỘ HỆ THỐNG') {
      toast.error('Vui lòng nhập chính xác "XÓA TOÀN BỘ HỆ THỐNG"');
      return;
    }
    
    try {
      setLoading(true);
      await systemBackupService.clearSystem();
      setIsConfirmClearDialogOpen(false);
      setClearConfirmText('');
      toast.success('Xóa toàn bộ hệ thống thành công!');
      setReload(!reload);
    } catch (error) {
      console.error('Error clearing system:', error);
      toast.error('Lỗi khi xóa toàn bộ hệ thống');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getTypeLabel = (type: number) => {
    switch (type) {
      case 0:
        return 'Tự động';
      case 1:
        return 'Thủ công';
      default:
        return 'Không xác định';
    }
  };

  const getTypeBadgeVariant = (type: number) => {
    switch (type) {
      case 0:
        return 'default';
      case 1:
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Sao lưu & Phục hồi hệ thống</h1>
        <p className="text-muted-foreground">
          Quản lý các bản sao lưu và phục hồi dữ liệu hệ thống
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách bản sao lưu</CardTitle>
              <CardDescription>
                Tổng cộng {total} bản sao lưu
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                className="btn-animate scale-hover"
                onClick={handleCreateBackup}
                disabled={loading}
              >
                <Plus className="mr-2 h-4 w-4" />
                Tạo sao lưu
              </Button>
              <Button 
                variant="destructive"
                className="btn-animate scale-hover"
                onClick={handleClearSystemClick}
                disabled={loading}
              >
                <Trash className="mr-2 h-4 w-4" />
                Xóa toàn bộ hệ thống
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên sao lưu</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Đường dẫn</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Người tạo</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">Đang tải...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : backups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Không có dữ liệu sao lưu
                  </TableCell>
                </TableRow>
              ) : (
                backups.map((backup, idx) => (
                  <TableRow key={backup.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Database className="mr-2 h-4 w-4 text-primary" />
                        {backup.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeBadgeVariant(backup.type)}>
                        {getTypeLabel(backup.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Folder className="mr-1 h-3 w-3" />
                        {backup.path}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={backup.is_active ? "default" : "secondary"}>
                        {backup.is_active ? "Hoạt động" : "Không hoạt động"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {backup.created_by_user ? (
                        <div className="flex items-center">
                          <User className="mr-1 h-3 w-3" />
                          {backup.created_by_user.display_name}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(backup.created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditClick(backup)}
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRestoreClick(backup)}
                          title="Phục hồi"
                        >
                          <RotateCcw className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteClick(backup)}
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-end mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {(() => {
                  const maxVisiblePages = 5;
                  const pages = [];
                  
                  // Always show first page
                  pages.push(
                    <PaginationItem key={1}>
                      <PaginationLink
                        isActive={currentPage === 1}
                        onClick={() => setCurrentPage(1)}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  );
                  
                  // Calculate range for middle pages
                  const startPage = Math.max(2, currentPage - 1);
                  const endPage = Math.min(totalPages - 1, currentPage + 1);
                  
                  // Add ellipsis after first page if needed
                  if (startPage > 2) {
                    pages.push(
                      <PaginationItem key="ellipsis1">
                        <span className="px-3 py-2 text-sm text-muted-foreground">...</span>
                      </PaginationItem>
                    );
                  }
                  
                  // Add middle pages
                  for (let i = startPage; i <= endPage; i++) {
                    if (i !== 1 && i !== totalPages) {
                      pages.push(
                        <PaginationItem key={i}>
                          <PaginationLink
                            isActive={currentPage === i}
                            onClick={() => setCurrentPage(i)}
                          >
                            {i}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  }
                  
                  // Add ellipsis before last page if needed
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <PaginationItem key="ellipsis2">
                        <span className="px-3 py-2 text-sm text-muted-foreground">...</span>
                      </PaginationItem>
                    );
                  }
                  
                  // Always show last page (if more than 1 page)
                  if (totalPages > 1) {
                    pages.push(
                      <PaginationItem key={totalPages}>
                        <PaginationLink
                          isActive={currentPage === totalPages}
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  
                  return pages;
                })()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận phục hồi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn phục hồi từ bản sao lưu <strong>{selectedBackup?.name}</strong>?
              <br />
              <span className="text-red-600 font-medium">
                ⚠️ Cảnh báo: Hành động này sẽ ghi đè lên dữ liệu hiện tại và không thể hoàn tác!
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRestore} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Phục hồi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin sao lưu</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin cho bản sao lưu
            </DialogDescription>
          </DialogHeader>
          {renderEditFormFields(editFormData, setEditFormData)}
          <DialogFooter>
            <Button 
              type="submit" 
              className="w-full" 
              onClick={handleEdit}
              disabled={loading}
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear System Warning Dialog */}
      <AlertDialog open={isClearSystemDialogOpen} onOpenChange={setIsClearSystemDialogOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              CẢNH BÁO NGUY HIỂM
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">⚠️ THAO TÁC CỰC KỲ NGUY HIỂM</h4>
                <p className="text-red-700">
                  Bạn sắp thực hiện thao tác <strong>XÓA TOÀN BỘ HỆ THỐNG</strong>.
                  Điều này sẽ:
                </p>
                <ul className="list-disc list-inside text-red-700 mt-2 space-y-1">
                  <li>Xóa tất cả dữ liệu trong hệ thống</li>
                  <li>Xóa tất cả cấu hình và thiết lập</li>
                  <li>Xóa tất cả người dùng và quyền hạn</li>
                  <li>Xóa tất cả bản sao lưu</li>
                  <li>Không thể hoàn tác sau khi thực hiện</li>
                </ul>
              </div>
              <p className="text-gray-700">
                <strong>Chỉ thực hiện khi:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Bạn có quyền quản trị viên cao nhất</li>
                <li>Đã sao lưu tất cả dữ liệu quan trọng</li>
                <li>Đã thông báo cho tất cả người dùng</li>
                <li>Đã có kế hoạch phục hồi hệ thống</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearSystemConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Tôi hiểu rủi ro, tiếp tục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear System Final Confirmation Dialog */}
      <AlertDialog open={isConfirmClearDialogOpen} onOpenChange={setIsConfirmClearDialogOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              XÁC NHẬN CUỐI CÙNG
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium">
                  Để xác nhận thao tác xóa toàn bộ hệ thống, 
                  vui lòng nhập chính xác: <strong>"XÓA TOÀN BỘ HỆ THỐNG"</strong>
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-text">Nhập xác nhận:</Label>
                <Input
                  id="confirm-text"
                  value={clearConfirmText}
                  onChange={(e) => setClearConfirmText(e.target.value)}
                  placeholder="XÓA TOÀN BỘ HỆ THỐNG"
                  className="font-mono"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setClearConfirmText('')}>
              Hủy bỏ
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearSystem}
              disabled={clearConfirmText !== 'XÓA TOÀN BỘ HỆ THỐNG' || loading}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  XÓA TOÀN BỘ HỆ THỐNG
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bản sao lưu <strong>{selectedBackup?.name}</strong>?
              <br />
              <span className="text-red-600 font-medium">
                ⚠️ Hành động này không thể hoàn tác!
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-white"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function renderEditFormFields(formData: UpdateBackupDto, setFormData: React.Dispatch<React.SetStateAction<UpdateBackupDto>>) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Tên sao lưu</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nhập tên sao lưu"
        />
      </div>
      <div className="space-y-2">
        <Label>Loại sao lưu</Label>
        <Select 
          value={formData.type.toString()} 
          onValueChange={(value) => setFormData({ ...formData, type: parseInt(value) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại sao lưu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Tự động</SelectItem>
            <SelectItem value="1">Thủ công</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
