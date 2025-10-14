// SystemParams
import { useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

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
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { parametersService } from '../../services/api';
import { useServerPagination } from '@/hooks/useServerPagination';

export function SystemParams() {
  const [reload, setReload] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedParam, setSelectedParam] = useState<any>(null);

  const [formData, setFormData] = useState<any>({
    display_name: '',
    value: '',
    description: '',
    unit: '',
    min: '',
    max: '',
    default_value: '',
    display_value: ''
  });

  const {
    data: parameters,
    currentPage,
    totalPages,
    total,
    loading,
    setCurrentPage,
  } = useServerPagination(
    (page, limit) => parametersService.getAll(page, limit),
    [reload],
    { pageSize: 10, initialPage: 1 }
  );

  const handleAdd = async () => {
    try {
      await parametersService.create({
        display_name: formData.display_name,
        value: formData.value,
        description: formData.description,
        data: {
          unit: formData.unit,
          display_value: formData.display_value,
          min: Number(formData.min),
          max: Number(formData.max),
          default_value: formData.default_value
        }
      });
      setIsDialogOpen(false);
      resetForm();
      toast.success('Thêm tham số thành công!');
      setReload(!reload);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi thêm tham số';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (param: any) => {
    setSelectedParam(param);
    setFormData({
      display_name: param.display_name,
      value: param.value,
      description: param.description,
      unit: param.data.unit,
      display_value: param.data.display_value,
      min: param.data.min,
      max: param.data.max,
      default_value: param.data.default_value
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await parametersService.update(selectedParam.id, {
        display_name: formData.display_name,
        value: formData.value,
        description: formData.description,
        data: {
          unit: formData.unit,
          display_value: formData.display_value,
          min: Number(formData.min),
          max: Number(formData.max),
          default_value: formData.default_value
        }
      });
      setIsEditDialogOpen(false);
      resetForm();
      setReload(!reload);
      toast.success('Cập nhật tham số thành công!');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi cập nhật tham số';
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (param: any) => {
    setSelectedParam(param);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await parametersService.delete(selectedParam.id);
      setIsDeleteDialogOpen(false);
      setSelectedParam(null);
      toast.success('Xóa tham số thành công!');
      setReload(!reload);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi xóa tham số';
      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      display_name: '',
      value: '',
      description: '',
      unit: '',
      min: '',
      max: '',
      default_value: '',
      display_value: ''
    });
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Quản lý tham số hệ thống</h1>
        <p className="text-muted-foreground">
          Quản lý cấu hình và tham số của hệ thống
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách tham số</CardTitle>
              <CardDescription>
                Tổng cộng {parameters.length} tham số
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-animate scale-hover">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm tham số
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Thêm tham số mới</DialogTitle>
                  <DialogDescription>
                    Cấu hình tham số hệ thống
                  </DialogDescription>
                </DialogHeader>
                {renderFormFields(formData, setFormData)}
                <DialogFooter>
                  <Button type="submit" className="w-full" onClick={handleAdd}>
                    Tạo tham số
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên hiển thị</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Đơn vị tính</TableHead>
                <TableHead>Mặc định</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parameters.map((param: any, index: number) => (
                <TableRow key={param.id} style={{ animationDelay: `${index * 0.05}s` }}>
                  <TableCell className="font-medium">{param.display_name}</TableCell>
                  <TableCell>{param.value}</TableCell>
                  <TableCell>{param.description}</TableCell>
                  <TableCell>
                    <Badge>{param?.data?.unit}</Badge>
                  </TableCell>
                  <TableCell>{param?.data?.default_value}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(param)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(param)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa tham số</DialogTitle>
            <DialogDescription>Cập nhật thông tin tham số</DialogDescription>
          </DialogHeader>
          {renderFormFields(formData, setFormData)}
          <DialogFooter>
            <Button type="submit" className="w-full" onClick={handleUpdate}>
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tham số <strong>{selectedParam?.display_name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function renderFormFields(formData: any, setFormData: any) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Tên hiển thị</Label>
        <Input value={formData.display_name} onChange={(e) => setFormData({ ...formData, display_name: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Giá trị</Label>
        <Input value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Mô tả</Label>
        <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Đơn vị tính</Label>
        <Input value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Hiển thị giá trị</Label>
        <Input value={formData.display_value} onChange={(e) => setFormData({ ...formData, display_value: e.target.value })} />
      </div>
      <div className="flex space-x-4">
        <div className="space-y-2 flex-1">
          <Label>Tôi thiểu</Label>
          <Input type="number" value={formData.min} onChange={(e) => setFormData({ ...formData, min: e.target.value })} />
        </div>
        <div className="space-y-2 flex-1">
          <Label>Tối đa</Label>
          <Input type="number" value={formData.max} onChange={(e) => setFormData({ ...formData, max: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Giá trị mặc định</Label>
        <Input value={formData.default_value} onChange={(e) => setFormData({ ...formData, default_value: e.target.value })} />
      </div>
    </div>
  );
}
