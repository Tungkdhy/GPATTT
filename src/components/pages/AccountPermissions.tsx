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
import { Checkbox } from '../ui/checkbox';
import { AdvancedFilter, FilterOption } from '../common/AdvancedFilter';
import { Plus, Edit, Trash2, Key } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const mockPermissions = [
  { id: 1, username: 'admin', role: 'Admin', canView: true, canEdit: true, canDelete: true, canExport: true, status: 'active' },
  { id: 2, username: 'operator1', role: 'Operator', canView: true, canEdit: true, canDelete: false, canExport: true, status: 'active' },
  { id: 3, username: 'viewer1', role: 'Viewer', canView: true, canEdit: false, canDelete: false, canExport: false, status: 'active' },
  { id: 4, username: 'security', role: 'Security', canView: true, canEdit: true, canDelete: true, canExport: true, status: 'inactive' },
];

export function AccountPermissions() {
  const [permissions, setPermissions] = useState(mockPermissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: '',
    role: '',
    canView: false,
    canEdit: false,
    canDelete: false,
    canExport: false
  });

  const filterOptions: FilterOption[] = [
    {
      key: 'role',
      label: 'Vai trò',
      type: 'select',
      options: [
        { value: 'Admin', label: 'Admin' },
        { value: 'Security', label: 'Security' },
        { value: 'Operator', label: 'Operator' },
        { value: 'Viewer', label: 'Viewer' }
      ]
    },
    {
      key: 'status',
      label: 'Trạng thái',
      type: 'select',
      options: [
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Không hoạt động' }
      ]
    }
  ];

  const filteredPermissions = permissions.filter(perm => {
    const matchesSearch = perm.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filters.role || perm.role === filters.role;
    const matchesStatus = !filters.status || perm.status === filters.status;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Security': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Operator': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Viewer': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const handleAdd = () => {
    const newPermission = {
      id: permissions.length + 1,
      username: formData.username,
      role: formData.role,
      canView: formData.canView,
      canEdit: formData.canEdit,
      canDelete: formData.canDelete,
      canExport: formData.canExport,
      status: 'active'
    };
    setPermissions([...permissions, newPermission]);
    setIsDialogOpen(false);
    setFormData({ username: '', role: '', canView: false, canEdit: false, canDelete: false, canExport: false });
    toast.success('Thêm quyền tài khoản thành công!');
  };

  const handleEdit = (perm: any) => {
    setSelectedPermission(perm);
    setFormData({
      username: perm.username,
      role: perm.role,
      canView: perm.canView,
      canEdit: perm.canEdit,
      canDelete: perm.canDelete,
      canExport: perm.canExport
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    setPermissions(permissions.map(p => p.id === selectedPermission.id ? {
      ...p,
      username: formData.username,
      role: formData.role,
      canView: formData.canView,
      canEdit: formData.canEdit,
      canDelete: formData.canDelete,
      canExport: formData.canExport
    } : p));
    setIsEditDialogOpen(false);
    setSelectedPermission(null);
    setFormData({ username: '', role: '', canView: false, canEdit: false, canDelete: false, canExport: false });
    toast.success('Cập nhật quyền thành công!');
  };

  const handleDeleteClick = (perm: any) => {
    setSelectedPermission(perm);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    setPermissions(permissions.filter(p => p.id !== selectedPermission.id));
    setIsDeleteDialogOpen(false);
    setSelectedPermission(null);
    toast.success('Xóa quyền tài khoản thành công!');
  };

  const PermissionForm = () => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="username">Tên người dùng</Label>
        <Input 
          id="username" 
          placeholder="Nhập tên người dùng" 
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Vai trò</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
            <SelectItem value="Operator">Operator</SelectItem>
            <SelectItem value="Viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-3 pt-2">
        <Label>Quyền hạn</Label>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="canView" 
            checked={formData.canView}
            onCheckedChange={(checked) => setFormData({ ...formData, canView: checked as boolean })}
          />
          <label htmlFor="canView" className="text-sm cursor-pointer">
            Xem dữ liệu
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="canEdit" 
            checked={formData.canEdit}
            onCheckedChange={(checked) => setFormData({ ...formData, canEdit: checked as boolean })}
          />
          <label htmlFor="canEdit" className="text-sm cursor-pointer">
            Chỉnh sửa
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="canDelete" 
            checked={formData.canDelete}
            onCheckedChange={(checked) => setFormData({ ...formData, canDelete: checked as boolean })}
          />
          <label htmlFor="canDelete" className="text-sm cursor-pointer">
            Xóa
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="canExport" 
            checked={formData.canExport}
            onCheckedChange={(checked) => setFormData({ ...formData, canExport: checked as boolean })}
          />
          <label htmlFor="canExport" className="text-sm cursor-pointer">
            Xuất dữ liệu
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Quản lý quyền tài khoản</h1>
        <p className="text-muted-foreground">
          Quản lý và phân quyền cho các tài khoản người dùng
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách quyền tài khoản</CardTitle>
              <CardDescription>
                Tổng cộng {permissions.length} tài khoản đã được phân quyền
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-animate scale-hover">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm quyền
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Thêm quyền tài khoản</DialogTitle>
                  <DialogDescription>
                    Phân quyền cho tài khoản người dùng
                  </DialogDescription>
                </DialogHeader>
                <PermissionForm />
                <DialogFooter>
                  <Button type="submit" className="w-full" onClick={handleAdd}>Thêm quyền</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <AdvancedFilter
              searchPlaceholder="Tìm kiếm người dùng..."
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
                <TableHead>Tên người dùng</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Xem</TableHead>
                <TableHead>Sửa</TableHead>
                <TableHead>Xóa</TableHead>
                <TableHead>Xuất</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermissions.map((perm, index) => (
                <TableRow key={perm.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                  <TableCell className="font-medium">{perm.username}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRoleColor(perm.role)}>
                      {perm.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{perm.canView ? '✓' : '✗'}</TableCell>
                  <TableCell>{perm.canEdit ? '✓' : '✗'}</TableCell>
                  <TableCell>{perm.canDelete ? '✓' : '✗'}</TableCell>
                  <TableCell>{perm.canExport ? '✓' : '✗'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleEdit(perm)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleDeleteClick(perm)}>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa quyền</DialogTitle>
            <DialogDescription>
              Cập nhật quyền cho tài khoản
            </DialogDescription>
          </DialogHeader>
          <PermissionForm />
          <DialogFooter>
            <Button type="submit" className="w-full" onClick={handleUpdate}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa quyền của <strong>{selectedPermission?.username}</strong>? 
              Hành động này không thể hoàn tác.
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
