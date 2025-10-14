import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { AdvancedFilter, FilterOption } from '../common/AdvancedFilter';
import { managerVersionsService, type ManagerVersionItem } from '../../services/api';
import { toast } from 'sonner@2.0.3';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { Plus, Edit, Trash2 } from 'lucide-react';

export function SoftwareVersions() {
  const [versions, setVersions] = useState<ManagerVersionItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ManagerVersionItem | null>(null);
  const [formData, setFormData] = useState<{ version_name: string; hash_version: string }>({
    version_name: '',
    hash_version: ''
  });

  const loadList = async () => {
    try {
      const res = await managerVersionsService.list();
      setVersions(res.data.rows || []);
      setTotalCount(res.data.count || 0);
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || e?.message || 'Không thể tải danh sách phiên bản quản lý';
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const filterOptions: FilterOption[] = [];

  const filteredData = versions.filter(item => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      item.version_name.toLowerCase().includes(term) ||
      item.hash_version.toLowerCase().includes(term) ||
      (item.created_by_name?.toLowerCase() || '').includes(term);
    return matchesSearch;
  });

  const resetForm = () => setFormData({ version_name: '', hash_version: '' });

  const handleAdd = async () => {
    try {
      await managerVersionsService.create({
        version_name: formData.version_name,
        hash_version: formData.hash_version
      });
      toast.success('Thêm phiên bản quản lý thành công');
      setIsDialogOpen(false);
      resetForm();
      await loadList();
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || e?.message || 'Không thể thêm phiên bản';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (item: ManagerVersionItem) => {
    setSelectedItem(item);
    setFormData({ version_name: item.version_name, hash_version: item.hash_version });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;
    try {
      await managerVersionsService.update(selectedItem.id, {
        version_name: formData.version_name,
        hash_version: formData.hash_version
      });
      toast.success('Cập nhật phiên bản quản lý thành công');
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      resetForm();
      await loadList();
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || e?.message || 'Không thể cập nhật phiên bản';
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (item: ManagerVersionItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await managerVersionsService.remove(selectedItem.id);
      toast.success('Xóa phiên bản quản lý thành công');
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      await loadList();
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || e?.message || 'Không thể xóa phiên bản';
      toast.error(errorMessage);
    }
  };


  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Quản lý phiên bản phần mềm</h1>
        <p className="text-muted-foreground">
          Quản lý các phiên bản phần mềm trong hệ thống
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách phiên bản</CardTitle>
              <CardDescription>
                Tổng cộng {totalCount} phiên bản
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-animate scale-hover">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Thêm phiên bản quản lý</DialogTitle>
                  <DialogDescription>
                    Nhập thông tin phiên bản
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="version-name">Version name</Label>
                    <Input id="version-name" placeholder="v1.0.0" value={formData.version_name} onChange={(e) => setFormData({ ...formData, version_name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hash-version">Hash version</Label>
                    <Input id="hash-version" placeholder="a1b2c3..." value={formData.hash_version} onChange={(e) => setFormData({ ...formData, hash_version: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full" onClick={handleAdd}>Thêm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <AdvancedFilter
              searchPlaceholder="Tìm kiếm phần mềm..."
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              filterOptions={filterOptions}
              filters={filters}
              onFiltersChange={setFilters}
              onReset={() => setSearchTerm('')}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version Name</TableHead>
                <TableHead>Hash Version</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={item.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                  <TableCell className="font-medium">{item.version_name}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.hash_version}</TableCell>
                  <TableCell>{item.created_by_name}</TableCell>
                  <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleDeleteClick(item)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa phiên bản quản lý</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin phiên bản
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="version-name-edit">Version name</Label>
              <Input id="version-name-edit" placeholder="v1.0.0" value={formData.version_name} onChange={(e) => setFormData({ ...formData, version_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hash-version-edit">Hash version</Label>
              <Input id="hash-version-edit" placeholder="a1b2c3..." value={formData.hash_version} onChange={(e) => setFormData({ ...formData, hash_version: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" onClick={handleUpdate}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa phiên bản <strong>{selectedItem?.version_name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
