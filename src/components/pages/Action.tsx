import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useServerPagination } from '@/hooks/useServerPagination';
import { actionService, categoryService } from '@/services/api';
import { useMultiSelect } from '@/hooks/useMultiSelect';

// giả lập services (bạn thay bằng api thật)
// import { apiService } from '../../services/api';
const roleMapper = (item: { id: string; display_name: string }) => ({
  label: item.display_name,
  value: item.id,
});
export function Action() {
  const [reload, setReload] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    display_name: '',
    url: '',
    method: '',
    is_active: true,
    description: ""
  });
  const {
    data: actions,
    currentPage,
    totalPages,
    total,
    loading,
    setCurrentPage,
  } = useServerPagination(
    (page, limit) => actionService.getAll(page, limit),
    [name, reload], // dependencies: ví dụ [searchTerm, filters]
    { pageSize: 10, initialPage: 1 },

  );
  const { options } = useMultiSelect([

    { key: "category", fetcher: () => categoryService.getAll(1, 10000, { scope: "ACTION" }), mapper: roleMapper },
  ]);
  // lấy data từ API
  // const { data: actions = [] } = apiService.getAll({ reload });

  const handleAdd = async () => {
    try {
      await actionService.create(formData);
      toast.success('Thêm API endpoint thành công!');
      setIsDialogOpen(false);
      setFormData({ display_name: '', url: '', method: '', description: '', is_active: true });
      setReload(!reload);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi thêm API endpoint';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setFormData({
      display_name: item.display_name,
      url: item.url,
      method: item.method_category?.id || '',
      description: item.description, is_active: true
      // is_active: item.is_active,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await actionService.update(selectedItem.id, formData);
      toast.success('Cập nhật API endpoint thành công!');
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      setReload(!reload);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi cập nhật API endpoint';
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await actionService.delete(selectedItem.id);
      toast.success('Xóa API endpoint thành công!');
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      setReload(!reload);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi xóa API endpoint';
      toast.error(errorMessage);
    }
  };

  const getStatusColor = (status: boolean) =>
    status
      ? 'bg-green-500/10 text-green-500 border-green-500/20'
      : 'bg-gray-500/10 text-gray-500 border-gray-500/20';

  return (
    <div className="space-y-6">
      <h1>Quản lý API Endpoint</h1>
      <p className="text-muted-foreground">Danh sách các API trong hệ thống</p>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách API</CardTitle>
              <CardDescription>
                Tổng cộng {actions.length} API endpoint
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Thêm API
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm API mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="space-y-2">Tên hiển thị</Label>
                    <Input
                      value={formData.display_name}
                      onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="space-y-2">URL</Label>
                    <Input
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="space-y-2">Method</Label>
                    <Select
                      value={formData.method}
                      onValueChange={(value: any) => setFormData({ ...formData, method: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn method" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          options?.category?.map((item: any) => (<SelectItem value={item.value}>{item.label}</SelectItem>))
                        }

                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="space-y-2">Mô tả</Label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAdd}>Tạo</Button>
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
                <TableHead>URL</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actions.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.display_name}</TableCell>
                  <TableCell>{item.url}</TableCell>
                  <TableCell>
                    <Badge>{item.method_category?.display_name}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(item.is_active)}>
                      {item.is_active ? 'Hoạt động' : 'Ngừng'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteClick(item)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa API</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="space-y-2">Tên hiển thị</Label>
              <Input
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="space-y-2">URL</Label>
              <Input
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="space-y-2">Method</Label>
              <Select
                value={formData.method}
                onValueChange={(value: any) => setFormData({ ...formData, method: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectContent>
                    {
                      options?.category?.map((item: any) => (<SelectItem value={item.value}>{item.label}</SelectItem>))
                    }

                  </SelectContent>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="space-y-2">Mô tả</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdate}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa <strong>{selectedItem?.display_name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
