import { useEffect, useState } from 'react';
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
import { toast } from 'sonner';
import { useServerPagination } from '@/hooks/useServerPagination';
import { accountPermissionsService, actionService, roleService } from '@/services/api';

export function AccountPermissions() {
  // const [permissions, setPermissions] = useState<any>(mockPermissions);
  // const [searchTerm, setSearchTerm] = useState('');
  const [actions, setActions] = useState<any>([])
  const [id,setId] = useState("")
  const [actionSelect, setActionSelect] = useState<any>([])
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<any>(null);
  const [reload, setReload] = useState(false)
  const [searchInput, setSearchInput] = useState("") // Giá trị hiển thị trong input
  const [search, setSearch] = useState("") // Giá trị thực tế để gửi API
  const [formData, setFormData] = useState({
    display_name: "",
    description: ""
  });
  const {
    data: permissions,
    currentPage,
    totalPages,
    total,
    loading,
    setCurrentPage,
    error: permissionsError,
  } = useServerPagination(
    (page, limit) => accountPermissionsService.getAll(page, limit, { search: search }),
    [search, reload], // dependencies: ví dụ [searchTerm, filters]
    { pageSize: 10, initialPage: 1 },
    { search }

  );
  // const filterOptions: FilterOption[] = [
  //   {
  //     key: 'role',
  //     label: 'Vai trò',
  //     type: 'select',
  //     options: [
  //       { value: 'Admin', label: 'Admin' },
  //       { value: 'Security', label: 'Security' },
  //       { value: 'Operator', label: 'Operator' },
  //       { value: 'Viewer', label: 'Viewer' }
  //     ]
  //   },
  //   {
  //     key: 'status',
  //     label: 'Trạng thái',
  //     type: 'select',
  //     options: [
  //       { value: 'active', label: 'Hoạt động' },
  //       { value: 'inactive', label: 'Không hoạt động' }
  //     ]
  //   }
  // ];


  // const getRoleColor = (role: string) => {
  //   switch (role) {
  //     case 'Admin': return 'bg-red-500/10 text-red-500 border-red-500/20';
  //     case 'Security': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
  //     case 'Operator': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
  //     case 'Viewer': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  //     default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  //   }
  // };

  const handleAdd = async () => {
    try {
      const res = await roleService.create(formData)
      console.log(res);
      await roleService.createAction({id:res.data.data.id,actionIds:actionSelect})
      toast.success('Thêm quyền quyền thành công!');
      setReload(!reload);
      setIsDialogOpen(false);
      setFormData({ description: '', display_name: '' });
      setActionSelect([]);
    }
    catch (e: any) {
      console.log(e);
      const errorMessage = e?.response?.data?.message || e?.message || 'Lỗi khi thêm quyền';
      toast.error(errorMessage);
    }

  };

  const handleEdit = async (perm: any) => {
    const res = await roleService.getById(perm.id)
    setId(perm.id)
    console.log(res);
    setActionSelect(res.actions.map((item:any)=>item.id))
    setSelectedPermission(perm);
    setFormData({
      display_name: perm.display_name,
      description: perm.description,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate =  async() => {
    try {
      const res = await roleService.update(id,formData)
      const res2 = await roleService.updateRoleAction(id,{
        id:id,
        actionIds:actionSelect
      })
      setReload(!reload);
      setIsEditDialogOpen(false);
      setSelectedPermission(null);
      setFormData({ description: '', display_name: '' });
      setActionSelect([]);
      toast.success('Cập nhật quyền thành công!');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi cập nhật quyền';
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (perm: any) => {
    setSelectedPermission(perm);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async() => {
    try {
      await roleService.delete(selectedPermission.id)
      setIsDeleteDialogOpen(false);
      setSelectedPermission(null);
      setReload(!reload)
      toast.success('Xóa quyền tài khoản thành công!');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi xóa quyền tài khoản';
      toast.error(errorMessage);
    }
  };
  useEffect(() => {
    const fetchAction = async () => {
      try {
        const res = await actionService.getAll(1, 10000)
        setActions(res.rows)
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi tải danh sách quyền hạn';
        toast.error(errorMessage);
      }
    }
    fetchAction()
  }, [])

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 500); // Debounce 500ms

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput, setCurrentPage]);

  // Handle error notification when fetching permissions fails
  useEffect(() => {
    if (permissionsError) {
      const errorMessage = (permissionsError as any)?.response?.data?.message 
        || (permissionsError as any)?.message 
        || 'Lỗi khi tải danh sách quyền tài khoản';
      toast.error(errorMessage);
    }
  }, [permissionsError]);
  const togglePermission = (actionId: string) => {
    const current = actionSelect || [];
    const exists = current.includes(actionId);
    const next = exists ? current.filter((a: string) => a !== actionId) : [...current, actionId];
    setActionSelect(next);
  };

  const toggleSelectAll = () => {
    const current = actionSelect || [];
    const allSelected = actions.length > 0 && actions.every((action: any) => current.includes(action.id));
    if (allSelected) {
      // Bỏ chọn tất cả
      setActionSelect([]);
    } else {
      // Chọn tất cả
      setActionSelect(actions.map((action: any) => action.id));
    }
  };

  const isAllSelected = actions.length > 0 && actions.every((action: any) => (actionSelect || []).includes(action.id));


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
                Tổng cộng {permissions?.length} tài khoản đã được phân quyền
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open: boolean) => {
              setIsDialogOpen(open);
              if (!open) {
                setFormData({ description: '', display_name: '' });
                setActionSelect([]);
              }
            }}>
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
                <div className="h-96  mx-auto space-y-6 py-6">
                  <div className="space-y-2">
                    <Label htmlFor="role-1">Tên quyền</Label>
                    <Input
                      id="role-1"
                      placeholder="Nhập tên quyền"
                      value={formData.display_name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, display_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="des">Mô tả</Label>
                    <Input
                      id="des"
                      placeholder="Nhập mô tả"
                      value={formData.description}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <Label>Quyền hạn</Label>

                    {/* Box chứa danh sách quyền — để lớn hơn và scroll khi có nhiều mục */}
                    <div style={{ height: 300 }} className="overflow-y-auto scroll-bar-1 border rounded-md p-3 bg-white shadow-sm">
                      {/* Header nhỏ (tuỳ chọn) */}
                      <div className="flex items-center justify-between mb-2 pb-2 border-b">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="select-all-add"
                            checked={isAllSelected}
                            onCheckedChange={toggleSelectAll}
                          />
                          <label htmlFor="select-all-add" className="text-sm font-medium cursor-pointer select-none">
                            Chọn tất cả
                          </label>
                        </div>
                        <div className="text-sm text-muted-foreground">Tổng: {actions.length} mục</div>
                      </div>

                      {/* Container scrollable */}
                      <div className="overflow-x-hidden pr-2">
                        {/* Grid: 2 cột trên sm trở lên; bạn có thể thay đổi sm:grid-cols-2 -> grid-cols-2 cố định */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {actions.map((item: any, idx: number) => {
                            const id = `perm-${item.id ?? idx}`;
                            const checked = (actionSelect || []).includes(item.id);
                            return (
                              <div key={id} className="flex items-center space-x-2 p-1 rounded hover:bg-slate-50">
                                <Checkbox
                                  id={id}
                                  checked={checked}
                                  onCheckedChange={() => togglePermission(item.id)}
                                />
                                <label htmlFor={id} className="text-sm cursor-pointer select-none">
                                  {item.display_name}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
              searchPlaceholder="Tìm kiếm quyền tài khoản..."
              searchValue={searchInput}
              onSearchChange={setSearchInput}
              filterOptions={[]}
              filters={filters}
              onFiltersChange={setFilters}
              onReset={() => setSearchInput('')}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên quyền</TableHead>
                <TableHead>Mô tả</TableHead>

                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions?.map((perm: any, index: any) => (
                <TableRow key={perm.id} className="stagger-item" style={{ animationDelay: `${index * 0.05}s` }}>

                  <TableCell>
                    {perm.display_name}
                  </TableCell>
                  <TableCell>
                    {perm.description}
                  </TableCell>
                  {/* <TableCell>{perm.canView ? '✓' : '✗'}</TableCell>
                  <TableCell>{perm.canEdit ? '✓' : '✗'}</TableCell>
                  <TableCell>{perm.canDelete ? '✓' : '✗'}</TableCell>
                  <TableCell>{perm.canExport ? '✓' : '✗'}</TableCell> */}
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

      <Dialog open={isEditDialogOpen} onOpenChange={(open: boolean) => {
        setIsEditDialogOpen(open);
        if (!open) {
          setSelectedPermission(null);
          setFormData({ description: '', display_name: '' });
          setActionSelect([]);
          setId("");
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa quyền</DialogTitle>
            <DialogDescription>
              Cập nhật quyền cho tài khoản
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="h-96  mx-auto space-y-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="role-1">Tên quyền</Label>
                <Input
                  id="role-1"
                  placeholder="Nhập tên quyền"
                  value={formData.display_name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, display_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="des">Mô tả</Label>
                <Input
                  id="des"
                  placeholder="Nhập mô tả"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-3 pt-2">
                <Label>Quyền hạn</Label>

                {/* Box chứa danh sách quyền — để lớn hơn và scroll khi có nhiều mục */}
                <div style={{ height: 300 }} className="overflow-y-auto scroll-bar-1 border rounded-md p-3 bg-white shadow-sm">
                  {/* Header nhỏ (tuỳ chọn) */}
                  <div className="flex items-center justify-between mb-2 pb-2 border-b">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="select-all-edit"
                        checked={isAllSelected}
                        onCheckedChange={toggleSelectAll}
                      />
                      <label htmlFor="select-all-edit" className="text-sm font-medium cursor-pointer select-none">
                        Chọn tất cả
                      </label>
                    </div>
                    <div className="text-sm text-muted-foreground">Tổng: {actions.length} mục</div>
                  </div>

                  {/* Container scrollable */}
                  <div className="overflow-x-hidden pr-2">
                    {/* Grid: 2 cột trên sm trở lên; bạn có thể thay đổi sm:grid-cols-2 -> grid-cols-2 cố định */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {actions.map((item: any, idx: number) => {
                        const id = `perm-${item.id ?? idx}`;
                        const checked = (actionSelect || []).includes(item.id);
                        return (
                          <div key={id} className="flex items-center space-x-2 p-1 rounded hover:bg-slate-50">
                            <Checkbox
                              id={id}
                              checked={checked}
                              onCheckedChange={() => togglePermission(item.id)}
                            />
                            <label htmlFor={id} className="text-sm cursor-pointer select-none">
                              {item.display_name}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              Bạn có chắc chắn muốn xóa quyền <strong>{selectedPermission?.display_name}</strong>?
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
