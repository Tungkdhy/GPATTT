import { useState } from 'react';
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
import { Plus, Edit, Trash2, Monitor } from 'lucide-react';
import { toast } from 'sonner';
import peripheralDevicesService from '../../services/api/peripheralDevices.service';
import { useServerPagination } from '@/hooks/useServerPagination';

export function PeripheralDevices() {
  const [reload, setReload] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [formData, setFormData] = useState<any>({
    display_name: '',
    value: '',
    description: '',
    category_type_id: 'dc2294e8-e278-408e-9f5c-5f6401cfac8d'
  });

  const {
    data: peripheralDevices,
    currentPage,
    totalPages,
    setCurrentPage,
    total
  } = useServerPagination(
    (page, limit) => peripheralDevicesService.getAllFormat(page, limit, {scope:"PERIPHERAL_DEVICES"}),
    [reload],
    { pageSize: 10, initialPage: 1 },
    {scope:"PERIPHERAL_DEVICES"}
  );

  // Add
  const handleAdd = async () => {
    try {
      await peripheralDevicesService.create(formData);
      setIsDialogOpen(false);
      resetForm();
      toast.success('Thêm thiết bị ngoại vi thành công!');
      setReload(!reload);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi thêm thiết bị ngoại vi';
      toast.error(errorMessage);
    }
  };

  // Edit
  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setFormData({
      display_name: item.display_name,
      value: item.value,
      description: item.description,
      category_type_id: 'dc2294e8-e278-408e-9f5c-5f6401cfac8d'
    });
    setIsEditDialogOpen(true);
  };

  // Update
  const handleUpdate = async () => {
    try {
      await peripheralDevicesService.update(selectedItem.id, formData);
      setIsEditDialogOpen(false);
      resetForm();
      setReload(!reload);
      toast.success('Cập nhật thiết bị ngoại vi thành công!');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi cập nhật thiết bị ngoại vi';
      toast.error(errorMessage);
    }
  };

  // Delete
  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await peripheralDevicesService.delete(selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      toast.success('Xóa thiết bị ngoại vi thành công!');
      setReload(!reload);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi xóa thiết bị ngoại vi';
      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      display_name: '',
      value: '',
      description: '',
      category_type_id: 'dc2294e8-e278-408e-9f5c-5f6401cfac8d'
    });
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Quản lý thiết bị ngoại vi</h1>
        <p className="text-muted-foreground">
          Quản lý các thiết bị ngoại vi trong hệ thống
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách thiết bị ngoại vi</CardTitle>
              <CardDescription>
                Tổng cộng {total} thiết bị ngoại vi
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-animate scale-hover">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm thiết bị ngoại vi
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Thêm thiết bị ngoại vi mới</DialogTitle>
                  <DialogDescription>
                    Nhập thông tin thiết bị ngoại vi
                  </DialogDescription>
                </DialogHeader>
                {renderFormFields(formData, setFormData)}
                <DialogFooter>
                  <Button type="submit" className="w-full" onClick={handleAdd}>
                    Tạo thiết bị ngoại vi
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
                <TableHead>Tên thiết bị</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Người tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {peripheralDevices.map((item: any, idx: number) => (
                <TableRow key={item.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                  <TableCell className="font-medium">{item.display_name}</TableCell>
                  <TableCell>{item.value}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.category_type_id}</TableCell>
                  <TableCell>{item.created_by_user?.display_name || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(item)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thiết bị ngoại vi</DialogTitle>
            <DialogDescription>Cập nhật thông tin thiết bị ngoại vi</DialogDescription>
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
              Bạn có chắc chắn muốn xóa thiết bị ngoại vi <strong>{selectedItem?.display_name}</strong>?
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
        <Label>Tên thiết bị</Label>
        <Input
          value={formData.display_name}
          onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Giá trị</Label>
        <Input
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Mô tả</Label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
    </div>
  );
}

export default PeripheralDevices;
