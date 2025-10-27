import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AdvancedFilter, FilterOption } from '../common/AdvancedFilter';
import { TablePagination } from '../common/TablePagination';
import { Plus, Edit, Trash2, MapPin, Server, AlertTriangle, Trash, Download } from 'lucide-react';
import { toast } from 'sonner';
import { blacklistIPsService } from '../../services/api';
import { useServerPagination } from '../../hooks/useServerPagination';
import { format } from 'date-fns';

export function BlacklistIPs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isConfirmDeleteAllDialogOpen, setIsConfirmDeleteAllDialogOpen] = useState(false);
  const [deleteAllConfirmText, setDeleteAllConfirmText] = useState('');
  const [selectedIP, setSelectedIP] = useState<any>(null);
  const [reload, setReload] = useState(false);
  const [formData, setFormData] = useState({
    ip_public: '',
    ip_local: '',
    type: '',
    description: '',
    location: '',
    status: 'active'
  });

  // Fetch data with pagination
  const fetchIPs = async (page: number, limit: number, params: any) => {
    const queryParams = {
      ...params
    };

    if (searchTerm) {
      queryParams.ip_public = searchTerm;
    }

    if (filters.type) {
      queryParams.type = filters.type;
    }

    if (filters.status) {
      queryParams.status = filters.status;
    }

    if (filters.location) {
      queryParams.location = filters.location;
    }

    const response = await blacklistIPsService.getAll(page, limit, {...queryParams,ip_type:"blacklist"});
    return response;
  };

  const {
    data: blacklistIPs,
    currentPage,
    totalPages,
    total,
    loading,
    setCurrentPage,
    pageSize
  } = useServerPagination(fetchIPs, [searchTerm, filters, reload], { pageSize: 10 }, {});

  const filterOptions: FilterOption[] = [
    {
      key: 'type',
      label: 'Loại',
      type: 'select',
      options: [
        { value: 'manager', label: 'Manager' },
        { value: 'agent', label: 'Agent' },
        { value: 'gateway', label: 'Gateway' },
        { value: 'firewall', label: 'Firewall' },
        { value: 'other', label: 'Other' }
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
    },
    {
      key: 'location',
      label: 'Vị trí',
      type: 'text'
    }
  ];

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-500/10 text-green-500 border-green-500/20'
      : 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'manager': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'agent': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'gateway': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'firewall': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'other': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss');
    } catch {
      return dateString;
    }
  };

  // Validate IP address format
  const isValidIP = (ip: string) => {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/(?:[0-9]|[1-2][0-9]|3[0-2]))?$/;
    return ipRegex.test(ip);
  };

  const handleAdd = async () => {
    // Validate required fields
    if (!formData.ip_public.trim()) {
      toast.error('Vui lòng nhập IP Public');
      return;
    }
    if (!formData.ip_local.trim()) {
      toast.error('Vui lòng nhập IP Local');
      return;
    }
    if (!formData.type) {
      toast.error('Vui lòng chọn loại');
      return;
    }
    if (!formData.location.trim()) {
      toast.error('Vui lòng nhập vị trí');
      return;
    }
    if (!formData.status) {
      toast.error('Vui lòng chọn trạng thái');
      return;
    }

    // Validate IP format
    if (!isValidIP(formData.ip_public)) {
      toast.error('IP Public không đúng định dạng');
      return;
    }
    if (!isValidIP(formData.ip_local)) {
      toast.error('IP Local không đúng định dạng');
      return;
    }

    try {
      await blacklistIPsService.create({...formData,ip_type:"blacklist"});
      setIsDialogOpen(false);
      setFormData({ ip_public: '', ip_local: '', type: '', description: '', location: '', status: 'active' });
      toast.success('Thêm IP manager thành công!');
      setReload(!reload);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi thêm IP manager';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (ip: any) => {
    setSelectedIP(ip);
    setFormData({
      ip_public: ip.ip_public,
      ip_local: ip.ip_local,
      type: ip.type,
      description: ip.description,
      location: ip.location,
      status: ip.status
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    // Validate required fields
    if (!formData.ip_public.trim()) {
      toast.error('Vui lòng nhập IP Public');
      return;
    }
    if (!formData.ip_local.trim()) {
      toast.error('Vui lòng nhập IP Local');
      return;
    }
    if (!formData.type) {
      toast.error('Vui lòng chọn loại');
      return;
    }
    if (!formData.location.trim()) {
      toast.error('Vui lòng nhập vị trí');
      return;
    }
    if (!formData.status) {
      toast.error('Vui lòng chọn trạng thái');
      return;
    }

    // Validate IP format
    if (!isValidIP(formData.ip_public)) {
      toast.error('IP Public không đúng định dạng');
      return;
    }
    if (!isValidIP(formData.ip_local)) {
      toast.error('IP Local không đúng định dạng');
      return;
    }

    try {
      await blacklistIPsService.update(selectedIP.id, {...formData,ip_type:"blacklist"});
      setIsEditDialogOpen(false);
      setSelectedIP(null);
      setFormData({ ip_public: '', ip_local: '', type: '', description: '', location: '', status: 'active' });
      toast.success('Cập nhật IP manager thành công!');
      setReload(!reload);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi cập nhật IP manager';
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (ip: any) => {
    setSelectedIP(ip);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await blacklistIPsService.delete(selectedIP.id);
      setIsDeleteDialogOpen(false);
      setSelectedIP(null);
      toast.success('Xóa IP manager thành công!');
      setReload(!reload);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi xóa IP manager';
      toast.error(errorMessage);
    }
  };

  // Delete all blacklist IPs
  const handleDeleteAllClick = () => {
    setIsDeleteAllDialogOpen(true);
  };

  const handleDeleteAllConfirm = () => {
    setIsDeleteAllDialogOpen(false);
    setIsConfirmDeleteAllDialogOpen(true);
    setDeleteAllConfirmText('');
  };

  const handleDeleteAll = async () => {
    if (deleteAllConfirmText !== 'XÓA TẤT CẢ BLACKLIST') {
      toast.error('Vui lòng nhập chính xác "XÓA TẤT CẢ BLACKLIST"');
      return;
    }
    
    try {
      await blacklistIPsService.deleteAllBlacklist();
      setIsConfirmDeleteAllDialogOpen(false);
      setDeleteAllConfirmText('');
      toast.success('Xóa tất cả IP blacklist thành công!');
      setReload(!reload);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi xóa tất cả IP blacklist';
      toast.error(errorMessage);
    }
  };

  const handleExportCSV = async () => {
    try {
      toast.info('Đang xuất dữ liệu...');
      const blob = await blacklistIPsService.exportBlacklistCSV();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `blacklist-ips-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Đã xuất file CSV thành công!');
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi xuất dữ liệu';
      toast.error(errorMsg);
    }
  };

  // if (loading) {
  //   return (
  //     <div className="space-y-6 fade-in-up">
  //       <div className="slide-in-left">
  //         <h1>Quản lý IP Manager</h1>
  //         <p className="text-muted-foreground">
  //           Quản lý danh sách địa chỉ IP trong hệ thống
  //         </p>
  //       </div>
  //       <Card>
  //         <CardContent className="p-6">
  //           <div className="text-center">
  //             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
  //             <p className="mt-2 text-muted-foreground">Đang tải dữ liệu...</p>
  //           </div>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Quản lý đanh sách đen</h1>
        <p className="text-muted-foreground">
          Quản lý danh sách địa chỉ đanh sách đen trong hệ thống
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách đanh sách đen</CardTitle>
              <CardDescription>
                Tổng cộng {total} đanh sách đen trong hệ thống
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="scale-hover"
              >
                <Download className="h-4 w-4 mr-2" />
                Xuất file CSV
              </Button>
              <Button 
                variant="destructive"
                className="btn-animate scale-hover"
                onClick={handleDeleteAllClick}
                disabled={total === 0}
              >
                <Trash className="mr-2 h-4 w-4" />
                Xóa tất cả
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-animate scale-hover">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm IP đen
                  </Button>
                </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Thêm IP đen mới</DialogTitle>
                  <DialogDescription>
                    Thêm địa chỉ IP đen mới vào hệ thống
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="ip_public">IP Public *</Label>
                    <Input 
                      id="ip_public" 
                      placeholder="VD: 203.0.113.10 hoặc 203.0.113.10/24" 
                      value={formData.ip_public}
                      onChange={(e) => setFormData({ ...formData, ip_public: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Địa chỉ IP công khai (có thể có CIDR)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ip_local">IP Local *</Label>
                    <Input 
                      id="ip_local" 
                      placeholder="VD: 10.0.0.10" 
                      value={formData.ip_local}
                      onChange={(e) => setFormData({ ...formData, ip_local: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Địa chỉ IP nội bộ</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Loại *</Label>
                    <Select value={formData.type} onValueChange={(value: string) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="agent">Agent</SelectItem>
                        <SelectItem value="gateway">Gateway</SelectItem>
                        <SelectItem value="firewall">Firewall</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Vị trí *</Label>
                    <Input 
                      id="location" 
                      placeholder="VD: Ha Noi" 
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Trạng thái *</Label>
                    <Select value={formData.status} onValueChange={(value: string) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Không hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Nhập mô tả cho IP đen" 
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full" onClick={handleAdd}>Thêm IP đen</Button>
                </DialogFooter>
              </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <AdvancedFilter
              searchPlaceholder="Tìm kiếm theo IP..."
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              filterOptions={filterOptions}
              filters={filters}
              onFiltersChange={setFilters}
              onReset={() => {
                setSearchTerm('');
                setFilters({});
              }}
            />
          </div>
            {
              !loading && <>
              
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP Public</TableHead>
                <TableHead>IP Local</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Người tạo</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blacklistIPs.map((ip: any, index: number) => (
                <TableRow key={ip.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                  <TableCell className="font-medium font-mono">
                    <div className="flex items-center space-x-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <span>{ip.ip_public}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{ip.ip_local}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeColor(ip.type)}>
                      {ip.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{ip.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={ip.description}>
                    {ip.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(ip.status)}>
                      {ip.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </TableCell>
                  <TableCell>{ip.created_by_name}</TableCell>
                  <TableCell className="font-mono text-sm">{formatDate(ip.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleEdit(ip)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleDeleteClick(ip)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={total}
              startIndex={(currentPage-1)*pageSize}
              endIndex={(currentPage)*pageSize}
              onPageChange={setCurrentPage}
            />
          </div></>
            }
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa IP đen</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin IP đen
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-ip_public">IP Public *</Label>
              <Input 
                id="edit-ip_public" 
                placeholder="VD: 203.0.113.10 hoặc 203.0.113.10/24" 
                value={formData.ip_public}
                onChange={(e) => setFormData({ ...formData, ip_public: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Địa chỉ IP công khai (có thể có CIDR)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-ip_local">IP Local *</Label>
              <Input 
                id="edit-ip_local" 
                placeholder="VD: 10.0.0.10" 
                value={formData.ip_local}
                onChange={(e) => setFormData({ ...formData, ip_local: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Địa chỉ IP nội bộ</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Loại *</Label>
              <Select value={formData.type} onValueChange={(value: string) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="gateway">Gateway</SelectItem>
                  <SelectItem value="firewall">Firewall</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Vị trí *</Label>
              <Input 
                id="edit-location" 
                placeholder="VD: Ha Noi" 
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Trạng thái *</Label>
              <Select value={formData.status} onValueChange={(value: string) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea 
                id="edit-description" 
                placeholder="Nhập mô tả cho IP đen" 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" onClick={handleUpdate}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete All Warning Dialog */}
      <AlertDialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              CẢNH BÁO NGUY HIỂM
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">⚠️ XÓA TẤT CẢ IP BLACKLIST</h4>
                <p className="text-red-700">
                  Bạn sắp thực hiện thao tác <strong>XÓA TẤT CẢ {total} IP BLACKLIST</strong>.
                  Điều này sẽ:
                </p>
                <ul className="list-disc list-inside text-red-700 mt-2 space-y-1">
                  <li>Xóa tất cả {total} IP trong danh sách đen</li>
                  <li>Xóa toàn bộ cấu hình và thiết lập liên quan</li>
                  <li>Không thể khôi phục sau khi thực hiện</li>
                  <li>Có thể ảnh hưởng đến bảo mật hệ thống</li>
                </ul>
              </div>
              <p className="text-gray-700">
                <strong>Chỉ thực hiện khi:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Bạn có quyền quản trị viên</li>
                <li>Đã sao lưu danh sách IP quan trọng</li>
                <li>Đã thông báo cho team</li>
                <li>Đã hiểu rõ tác động đến hệ thống</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAllConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Tôi hiểu rủi ro, tiếp tục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Final Confirmation Dialog */}
      <AlertDialog open={isConfirmDeleteAllDialogOpen} onOpenChange={setIsConfirmDeleteAllDialogOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              XÁC NHẬN CUỐI CÙNG
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium">
                  Để xác nhận xóa tất cả {total} IP blacklist, 
                  vui lòng nhập chính xác: <strong>"XÓA TẤT CẢ BLACKLIST"</strong>
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-delete-all-text">Nhập xác nhận:</Label>
                <Input
                  id="confirm-delete-all-text"
                  value={deleteAllConfirmText}
                  onChange={(e) => setDeleteAllConfirmText(e.target.value)}
                  placeholder="XÓA TẤT CẢ BLACKLIST"
                  className="font-mono"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteAllConfirmText('')}>
              Hủy bỏ
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAll}
              disabled={deleteAllConfirmText !== 'XÓA TẤT CẢ BLACKLIST'}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            >
              <Trash className="mr-2 h-4 w-4" />
              XÓA TẤT CẢ
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
              Bạn có chắc chắn muốn xóa IP đen <strong>{selectedIP?.ip_public}</strong>? 
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