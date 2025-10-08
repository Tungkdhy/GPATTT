import { useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
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
import { scriptCategoriesService, ScriptCategory, CreateScriptCategoryDto, UpdateScriptCategoryDto } from '../../services/api/scriptCategories.service';
import { useServerPagination } from '@/hooks/useServerPagination';

export function ScriptCategories() {
  const [reload, setReload] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ScriptCategory | null>(null);

  const [formData, setFormData] = useState<CreateScriptCategoryDto>({
    category_type_id: '',
    display_name: '',
    value: '',
    description: '',
    data: {}
  });

  const {
    data: categories,
    currentPage,
    totalPages,
    setCurrentPage,
    total
  } = useServerPagination(
    (page, limit) => scriptCategoriesService.getAll(page, limit),
    [reload],
    { pageSize: 10, initialPage: 1 }
  );

  // Add
  const handleAdd = async () => {
    try {
      await scriptCategoriesService.create(formData);
      setIsDialogOpen(false);
      resetForm();
      toast.success('Thêm danh mục kịch bản thành công!');
      setReload(!reload);
    } catch (error) {
      console.error('Error creating script category:', error);
      toast.error('Lỗi khi thêm danh mục kịch bản');
    }
  };

  // Edit
  const handleEdit = (item: ScriptCategory) => {
    setSelectedItem(item);
    setFormData({
      category_type_id: item.category_type_id,
      display_name: item.display_name,
      value: item.value,
      description: item.description,
      data: item.data || {}
    });
    setIsEditDialogOpen(true);
  };

  // Update
  const handleUpdate = async () => {
    if (!selectedItem) return;
    
    try {
      const updateData: UpdateScriptCategoryDto = {
        category_type_id: formData.category_type_id,
        display_name: formData.display_name,
        value: formData.value,
        description: formData.description,
        data: formData.data
      };
      
      await scriptCategoriesService.update(selectedItem.id, updateData);
      setIsEditDialogOpen(false);
      resetForm();
      setReload(!reload);
      toast.success('Cập nhật danh mục kịch bản thành công!');
    } catch (error) {
      console.error('Error updating script category:', error);
      toast.error('Lỗi khi cập nhật danh mục kịch bản');
    }
  };

  // Delete
  const handleDeleteClick = (item: ScriptCategory) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    
    try {
      await scriptCategoriesService.delete(selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      toast.success('Xóa danh mục kịch bản thành công!');
      setReload(!reload);
    } catch (error) {
      console.error('Error deleting script category:', error);
      toast.error('Lỗi khi xóa danh mục kịch bản');
    }
  };

  const resetForm = () => {
    setFormData({
      category_type_id: '',
      display_name: '',
      value: '',
      description: '',
      data: {}
    });
  };

  const handleDataChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [key]: value
      }
    }));
  };

  const addDataField = () => {
    setFormData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        '': ''
      }
    }));
  };

  const removeDataField = (key: string) => {
    setFormData(prev => {
      const newData = { ...prev.data };
      delete newData[key];
      return {
        ...prev,
        data: newData
      };
    });
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Quản lý danh mục kịch bản</h1>
        <p className="text-muted-foreground">
          Quản lý các danh mục kịch bản trong hệ thống
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách danh mục kịch bản</CardTitle>
              <CardDescription>
                Tổng cộng {total} danh mục kịch bản
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
                  <DialogTitle>Thêm danh mục kịch bản mới</DialogTitle>
                  <DialogDescription>
                    Nhập thông tin danh mục kịch bản
                  </DialogDescription>
                </DialogHeader>
                {renderFormFields(formData, setFormData, handleDataChange, addDataField, removeDataField)}
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
                <TableHead>Tên hiển thị</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Loại danh mục</TableHead>
                <TableHead>Mặc định</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Dữ liệu</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((item: ScriptCategory, idx: number) => (
                <TableRow key={item.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                  <TableCell className="font-medium">{item.display_name}</TableCell>
                  <TableCell>{item.value}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.category_type_id}</TableCell>
                  <TableCell>
                    {item.is_default ? (
                      <Badge className="bg-blue-500">Mặc định</Badge>
                    ) : (
                      <Badge variant="outline">Không</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.is_active ? (
                      <Badge className="bg-green-500">Hoạt động</Badge>
                    ) : (
                      <Badge className="bg-gray-400">Không hoạt động</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.data ? (
                      <div className="max-w-xs truncate">
                        {JSON.stringify(item.data)}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
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
            <DialogTitle>Chỉnh sửa danh mục kịch bản</DialogTitle>
            <DialogDescription>Cập nhật thông tin danh mục kịch bản</DialogDescription>
          </DialogHeader>
          {renderFormFields(formData, setFormData, handleDataChange, addDataField, removeDataField)}
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
              Bạn có chắc chắn muốn xóa danh mục kịch bản <strong>{selectedItem?.display_name}</strong>?
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

function renderFormFields(
  formData: CreateScriptCategoryDto, 
  setFormData: (data: CreateScriptCategoryDto) => void,
  handleDataChange: (key: string, value: string) => void,
  addDataField: () => void,
  removeDataField: (key: string) => void
) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>ID Loại danh mục</Label>
        <Input
          value={formData.category_type_id}
          onChange={(e) => setFormData({ ...formData, category_type_id: e.target.value })}
          placeholder="Nhập ID loại danh mục"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Tên hiển thị</Label>
        <Input
          value={formData.display_name}
          onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
          placeholder="Nhập tên hiển thị"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Giá trị</Label>
        <Input
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          placeholder="Nhập giá trị"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Mô tả</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Nhập mô tả"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Dữ liệu bổ sung</Label>
        <div className="space-y-2">
          {Object.entries(formData.data || {}).map(([key, value], index) => (
            <div key={index} className="flex space-x-2 items-center">
              <Input
                placeholder="Key (ví dụ: type)"
                value={key}
                onChange={(e) => {
                  const newKey = e.target.value;
                  const newData = { ...formData.data };
                  delete newData[key];
                  newData[newKey] = value;
                  setFormData({ ...formData, data: newData });
                }}
              />
              <Input
                placeholder="Value (ví dụ: bruteforce)"
                value={value}
                onChange={(e) => {
                  handleDataChange(key, e.target.value);
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeDataField(key)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addDataField}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm trường dữ liệu
          </Button>
          
          {formData.data && Object.keys(formData.data).length > 0 && (
            <div className="text-sm text-muted-foreground p-2 bg-muted rounded">
              <strong>Dữ liệu hiện tại:</strong> {JSON.stringify(formData.data)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
