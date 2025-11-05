import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AdvancedFilter, FilterOption } from '../common/AdvancedFilter';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';
import { roleService, usersService } from '../../services/api';
import { useServerPagination } from '@/hooks/useServerPagination';
import { useMultiSelect } from '@/hooks/useMultiSelect';
const roleMapper = (item: { id: string; display_name: string }) => ({
  label: item.display_name,
  value: item.id,
});
export function UserManagement() {

  // const [users, setUsers] = useState<any>([]);
  // const [loading, setLoading] = useState(false);
  const [reload,setReload] = useState(false)
  const [name, setName] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    user_name: '',
    display_name: '',
    role_id: '',
    password: ''
  });
  const {
    data: users,
    error: usersError,
  } = useServerPagination(
    (page, limit) => usersService.getAll(page, limit, { name: name }),
    [name,reload], // dependencies: ví dụ [searchTerm, filters]
    { pageSize: 10, initialPage: 1 },
    { name }
  );

  // Handle error notification when fetching users fails
  useEffect(() => {
    if (usersError) {
      const errorMessage = (usersError as any)?.response?.data?.message 
        || (usersError as any)?.message 
        || 'Lỗi khi tải danh sách người dùng';
      toast.error(errorMessage);
    }
  }, [usersError]);
  const { options } = useMultiSelect([

    { key: "roles", fetcher: () => roleService.getAll(1, 10000), mapper: roleMapper },
  ]);


  const filterOptions: FilterOption[] = [
    {
      key: 'role',
      label: 'Vai trò',
      type: 'select',
      options: options.roles
    },

  ];

  // Removed filteredUsers as it's not being used

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Security': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Operator': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Viewer': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    return status
      ? 'bg-green-500/10 text-green-500 border-green-500/20'
      : 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const handleAdd = async () => {
    try {
      const newUser = await usersService.create(formData);
      console.log(newUser);

      setIsDialogOpen(false);
      setFormData({ user_name: '', display_name: '', role_id: '', password: '' });
      toast.success('Thêm người dùng thành công!');
      setReload(!reload)
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi thêm người dùng';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setFormData({
      user_name: user.user_name,
      display_name: user.display_name,
      role_id: user?.role?.id,
      password: ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await usersService.update(selectedUser.id, {
        user_name: formData.user_name,
        display_name: formData.display_name,
        role_id: formData.role_id
      });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      setFormData({ user_name: '', display_name: '', role_id: '', password: '' });
      setReload(!reload)

      toast.success('Cập nhật người dùng thành công!');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi cập nhật người dùng';
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (user: any) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await usersService.delete(selectedUser.id);
      // setUsers(users.filter(u => u.id !== selectedUser.id));
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      toast.success('Xóa người dùng thành công!');
      setReload(!reload)
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi xóa người dùng';
      toast.error(errorMessage);
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      await usersService.toggleActive(userId, !currentStatus);
      toast.success(`Đã ${!currentStatus ? 'kích hoạt' : 'vô hiệu hóa'} người dùng thành công!`);
      setReload(!reload);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi cập nhật trạng thái người dùng';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Quản lý người dùng</h1>
        <p className="text-muted-foreground">
          Quản lý tài khoản người dùng và phân quyền hệ thống
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách người dùng</CardTitle>
              <CardDescription>
                Tổng cộng {users.length} người dùng trong hệ thống
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-animate scale-hover">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm người dùng
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Thêm người dùng mới</DialogTitle>
                  <DialogDescription>
                    Tạo tài khoản người dùng mới cho hệ thống
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="user_name">
                      Tên đăng nhập
                    </Label>
                    <Input
                      id="user_name"
                      placeholder="Nhập tên đăng nhập"
                      value={formData.user_name}
                      onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Tên hiển thị
                    </Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder="Nhập tên hiển thị"
                      value={formData.display_name}
                      onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">
                      Vai trò
                    </Label>
                    <Select value={formData.role_id} onValueChange={(value: any) => setFormData({ ...formData, role_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          options?.roles?.map((item: any) => (<SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Mật khẩu
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full" onClick={handleAdd}>Tạo người dùng</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <AdvancedFilter
              searchPlaceholder="Tìm kiếm người dùng..."
              searchValue={name}
              onSearchChange={setName}
              filterOptions={filterOptions}
              filters={filters}
              onFiltersChange={setFilters}
              onReset={() => setName('')}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên đăng nhập</TableHead>
                <TableHead>Tên hiển thị</TableHead>
                {/* <TableHead>Email</TableHead>
                <TableHead>Số điện thoại</TableHead> */}
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Kích hoạt</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: any, index: number) => (
                <TableRow key={user.id} className="stagger-item" style={{ animationDelay: `${index * 0.05}s` }}>
                  <TableCell className="font-medium">{user.user_name}</TableCell>
                  <TableCell>{user.display_name}</TableCell>
                  {/* <TableCell>{user.email || '-'}</TableCell>
                  <TableCell>{user.phone_number || '-'}</TableCell> */}
                  <TableCell>
                    <Badge variant="outline" className={getRoleColor(user?.role?.display_name)}>
                      {user?.role?.display_name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(user.is_online)}>
                      {user.is_online ? 'Online' : 'Offline'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.is_active}
                      onCheckedChange={() => handleToggleActive(user.id, user.is_active)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleEdit(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleDeleteClick(user)}>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin người dùng
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-user_name">
                Tên đăng nhập
              </Label>
              <Input
                id="edit-user_name"
                placeholder="Nhập tên đăng nhập"
                value={formData.user_name}
                onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">
                Tên hiển thị
              </Label>
              <Input
                id="edit-email"
                type="text"
                placeholder="Nhập tên hiển thị"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">
                Vai trò
              </Label>
              <Select value={formData.role_id} onValueChange={(value: any) => setFormData({ ...formData, role_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {
                    options?.roles?.map((item: any) => (<SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>))
                  }
                </SelectContent>
              </Select>
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
              Bạn có chắc chắn muốn xóa người dùng <strong>{selectedUser?.user_name}</strong>?
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