import { useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
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
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { categoryTypeService } from '../../services/api'; // ✅ Đổi sang service loại danh mục
import { useServerPagination } from '@/hooks/useServerPagination';

export function CategoryTypes() {
  const [reload, setReload] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [formData, setFormData] = useState<any>({
    display_name: '',
    description: '',
    visible: true,
    scope: ""
  });

  const {
    data: categories,
    currentPage,
    totalPages,
    setCurrentPage,
    total
  } = useServerPagination(
    (page, limit) => categoryTypeService.getAll(page, limit),
    [reload],
    { pageSize: 10, initialPage: 1 }
  );

  // Add
  const handleAdd = async () => {
    try {
      await categoryTypeService.create({
        display_name: formData.display_name,
        description: formData.description,
        visible: formData.visible,
        scope: formData.scope,
      });
      setIsDialogOpen(false);
      resetForm();
      toast.success('Thêm danh mục thành công!');
      setReload(!reload);
    } catch {
      toast.error('Lỗi khi thêm danh mục');
    }
  };

  // Edit
  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setFormData({
      display_name: item.display_name,
      description: item.description,
      visible: item.visible,
      scope: item.scope,
    });
    setIsEditDialogOpen(true);
  };

  // Update
  const handleUpdate = async () => {
    try {
      await categoryTypeService.update(selectedItem.id, {
        display_name: formData.display_name,
        description: formData.description,
        visible: formData.visible,
        scope: formData.scope,
      });
      setIsEditDialogOpen(false);
      resetForm();
      setReload(!reload);
      toast.success('Cập nhật danh mục thành công!');
    } catch {
      toast.error('Lỗi khi cập nhật danh mục');
    }
  };

  // Delete
  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await categoryTypeService.delete(selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      toast.success('Xóa danh mục thành công!');
      setReload(!reload);
    } catch {
      toast.error('Lỗi khi xóa danh mục');
    }
  };

  const resetForm = () => {
    setFormData({
      display_name: '',
      description: '',
      visible: true
    });
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Quản lý loại danh mục</h1>
        <p className="text-muted-foreground">
          Quản lý các loại danh mục trong hệ thống
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách loại danh mục</CardTitle>
              <CardDescription>
                Tổng cộng {total} loại danh mục
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-animate scale-hover">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm danh mục
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Thêm loại danh mục mới</DialogTitle>
                  <DialogDescription>
                    Nhập thông tin loại danh mục
                  </DialogDescription>
                </DialogHeader>
                {renderFormFields(formData, setFormData)}
                <DialogFooter>
                  <Button type="submit" className="w-full" onClick={handleAdd}>
                    Tạo danh mục
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
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Người tạo</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Cập nhật bởi</TableHead>
                <TableHead>Ngày cập nhật</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((item: any, idx: number) => (
                <TableRow key={item.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                  <TableCell className="font-medium">{item.display_name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    {item.visible ? (
                      <Badge className="bg-green-500">Hiển thị</Badge>
                    ) : (
                      <Badge className="bg-gray-400">Ẩn</Badge>
                    )}
                  </TableCell>
                  <TableCell>{item.created_by_user?.display_name || "-"}</TableCell>
                  <TableCell>{item.created_at ? new Date(item.created_at).toLocaleString() : "-"}</TableCell>
                  <TableCell>{item.updated_by_user?.display_name || "-"}</TableCell>
                  <TableCell>{item.updated_at ? new Date(item.updated_at).toLocaleString() : "-"}</TableCell>
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

                {[...Array(totalPages)].map((_, idx) => (
                  <PaginationItem key={idx}>
                    <PaginationLink
                      isActive={currentPage === idx + 1}
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

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
            <DialogTitle>Chỉnh sửa loại danh mục</DialogTitle>
            <DialogDescription>Cập nhật thông tin loại danh mục</DialogDescription>
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
              Bạn có chắc chắn muốn xóa danh mục <strong>{selectedItem?.display_name}</strong>?
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
        <Label>Tên danh mục</Label>
        <Input
          value={formData.display_name}
          onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Mô tả</Label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Scope</Label>
        <Input
          value={formData.scope}
          onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formData.visible}
          onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
        />
        <Label>Hiển thị</Label>
      </div>
    </div>
  );
}
