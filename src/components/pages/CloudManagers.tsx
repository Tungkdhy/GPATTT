import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { AdvancedFilter, FilterOption } from '../common/AdvancedFilter';
import { Plus, Edit, Trash2, Eye, EyeOff, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { cloudManagersService, Agent } from '../../services/api';
import { useServerPagination } from '@/hooks/useServerPagination';

export function CloudManagers() {
  const [reload, setReload] = useState(false);
  const [name, setName] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAgentsDialogOpen, setIsAgentsDialogOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<any>(null);
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    user_name: '',
    pass: '',
    token: '',
    refresh_token: '',
    expired_time: ''
  });

  const {
    data: cloudManagers,
  } = useServerPagination(
    (page, limit) => cloudManagersService.getAll(page, limit),
    [name, reload],
    { pageSize: 10, initialPage: 1 }
   
  );

  const filterOptions: FilterOption[] = [
    {
      key: 'user_name',
      label: 'Tên người dùng',
      type: 'select'
    },
    {
      key: 'url',
      label: 'URL',
      type: 'select'
    }
  ];

  const isTokenExpired = (expiredTime: string) => {
    return new Date(expiredTime) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const truncateToken = (token: string, maxLength: number = 20) => {
    return token.length > maxLength ? `${token.substring(0, maxLength)}...` : token;
  };

  const toggleTokenVisibility = (managerId: string) => {
    setShowTokens(prev => ({
      ...prev,
      [managerId]: !prev[managerId]
    }));
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} đã được sao chép!`);
    } catch (error) {
      toast.error('Không thể sao chép');
    }
  };

  const handleRowClick = async (manager: any) => {
    try {
      setSelectedManager(manager);
      setAgentsLoading(true);
      const response = await cloudManagersService.getAgents(manager.id);
      setAgents(response.agents);
      setIsAgentsDialogOpen(true);
    } catch (error: any) {
      console.error('Error fetching agents:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Lỗi khi tải danh sách agents');
      }
    } finally {
      setAgentsLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      await cloudManagersService.create(formData);
      setIsDialogOpen(false);
      setFormData({ url: '', user_name: '', pass: '', token: '', refresh_token: '', expired_time: '' });
      toast.success('Thêm trình quản lý đám mây thành công!');
      setReload(!reload);
    } catch (error: any) {
      // Handle API error response
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Lỗi khi thêm trình quản lý đám mây');
      }
    }
  };

  const handleEdit = (manager: any) => {
    setSelectedManager(manager);
    setFormData({
      url: manager.url,
      user_name: manager.user_name,
      pass: '', // Don't pre-fill password for security
      token: manager.token,
      refresh_token: manager.refresh_token,
      expired_time: manager.expired_time.split('T')[0] // Convert to YYYY-MM-DD format
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await cloudManagersService.update(selectedManager.id, formData);
      setIsEditDialogOpen(false);
      setSelectedManager(null);
      setFormData({ url: '', user_name: '', pass: '', token: '', refresh_token: '', expired_time: '' });
      setReload(!reload);
      toast.success('Cập nhật trình quản lý đám mây thành công!');
    } catch (error: any) {
      // Handle API error response
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Lỗi khi cập nhật trình quản lý đám mây');
      }
    }
  };

  const handleDeleteClick = (manager: any) => {
    setSelectedManager(manager);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await cloudManagersService.delete(selectedManager.id);
      setIsDeleteDialogOpen(false);
      setSelectedManager(null);
      toast.success('Xóa trình quản lý đám mây thành công!');
      setReload(!reload);
    } catch (error: any) {
      // Handle API error response
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Lỗi khi xóa trình quản lý đám mây');
      }
    }
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Quản lý xác thực Trình quản lý đám mây</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin xác thực và kết nối đến các Trình quản lý đám mây
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách Trình quản lý đám mây</CardTitle>
              <CardDescription>
                Tổng cộng {cloudManagers.length} trình quản lý đám mây trong hệ thống
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-animate scale-hover">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm Trình quản lý đám mây
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Thêm Trình quản lý đám mây mới</DialogTitle>
                  <DialogDescription>
                    Thêm thông tin xác thực cho Trình quản lý đám mây mới
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      placeholder="http://10.10.53.57"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    />
                  </div>
                   <div className="space-y-2">
                     <Label htmlFor="user_name">Tên người dùng</Label>
                     <Input
                       id="user_name"
                       placeholder="Nhập tên người dùng"
                       value={formData.user_name}
                       onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="pass">Mật khẩu</Label>
                     <Input
                       id="pass"
                       type="password"
                       placeholder="Nhập mật khẩu"
                       value={formData.pass}
                       onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
                     />
                   </div>
                  <div className="space-y-2">
                    <Label htmlFor="token">Token</Label>
                    <Input
                      id="token"
                      placeholder="Nhập token"
                      value={formData.token}
                      onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="refresh_token">Refresh Token</Label>
                    <Input
                      id="refresh_token"
                      placeholder="Nhập refresh token"
                      value={formData.refresh_token}
                      onChange={(e) => setFormData({ ...formData, refresh_token: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expired_time">Thời gian hết hạn</Label>
                    <Input
                      id="expired_time"
                      type="date"
                      value={formData.expired_time}
                      onChange={(e) => setFormData({ ...formData, expired_time: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full" onClick={handleAdd}>
                    Tạo Trình quản lý đám mây
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* <div className="mb-6">
            <AdvancedFilter
              searchPlaceholder="Tìm kiếm trình quản lý đám mây..."
              searchValue={name}
              onSearchChange={setName}
              filterOptions={filterOptions}
              filters={filters}
              onFiltersChange={setFilters}
              onReset={() => setName('')}
            />
          </div> */}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Tên người dùng</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Refresh Token</TableHead>
                <TableHead>Hết hạn</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Người tạo</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cloudManagers.map((manager: any, index: number) => (
                <TableRow 
                  key={manager.id} 
                  className="stagger-item cursor-pointer hover:bg-muted/50" 
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => handleRowClick(manager)}
                >
                  <TableCell className="font-medium">
                    <span className="font-mono text-sm">{manager.url}</span>
                  </TableCell>
                  <TableCell>{manager.user_name}</TableCell>
                   <TableCell>
                     <div className="flex items-center space-x-1">
                       <span className="font-mono text-xs">
                         {showTokens[manager.id] 
                           ? truncateToken(manager.token, 30)
                           : '••••••••••••••••'
                         }
                       </span>
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={(e: React.MouseEvent) => {
                           e.stopPropagation();
                           toggleTokenVisibility(manager.id);
                         }}
                       >
                         {showTokens[manager.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                       </Button>
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={(e: React.MouseEvent) => {
                           e.stopPropagation();
                           copyToClipboard(manager.token, 'Token');
                         }}
                         className="opacity-60 hover:opacity-100"
                       >
                         <Copy className="h-3 w-3" />
                       </Button>
                     </div>
                   </TableCell>
                   <TableCell>
                     <div className="flex items-center space-x-1">
                       <span className="font-mono text-xs">
                         {showTokens[manager.id] 
                           ? truncateToken(manager.refresh_token, 30)
                           : '••••••••••••••••'
                         }
                       </span>
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={(e: React.MouseEvent) => {
                           e.stopPropagation();
                           toggleTokenVisibility(manager.id);
                         }}
                       >
                         {showTokens[manager.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                       </Button>
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={(e: React.MouseEvent) => {
                           e.stopPropagation();
                           copyToClipboard(manager.refresh_token, 'Refresh Token');
                         }}
                         className="opacity-60 hover:opacity-100"
                       >
                         <Copy className="h-3 w-3" />
                       </Button>
                     </div>
                   </TableCell>
                  <TableCell>{formatDate(manager.expired_time)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        isTokenExpired(manager.expired_time)
                          ? 'bg-red-500/10 text-red-500 border-red-500/20'
                          : 'bg-green-500/10 text-green-500 border-green-500/20'
                      }
                    >
                      {isTokenExpired(manager.expired_time) ? 'Hết hạn' : 'Còn hiệu lực'}
                    </Badge>
                  </TableCell>
                  <TableCell>{manager.created_by_name}</TableCell>
                  <TableCell>{formatDate(manager.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="scale-hover" 
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleEdit(manager);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="scale-hover" 
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleDeleteClick(manager);
                        }}
                      >
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
          <DialogTitle>Chỉnh sửa Trình quản lý đám mây</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin xác thực Trình quản lý đám mây
          </DialogDescription>
        </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-url">URL</Label>
              <Input
                id="edit-url"
                placeholder="http://10.10.53.57"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
             <div className="space-y-2">
               <Label htmlFor="edit-user_name">Tên người dùng</Label>
               <Input
                 id="edit-user_name"
                 placeholder="Nhập tên người dùng"
                 value={formData.user_name}
                 onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="edit-pass">Mật khẩu</Label>
               <Input
                 id="edit-pass"
                 type="password"
                 placeholder="Nhập mật khẩu mới (để trống nếu không đổi)"
                 value={formData.pass}
                 onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
               />
             </div>
            <div className="space-y-2">
              <Label htmlFor="edit-token">Token</Label>
              <Input
                id="edit-token"
                placeholder="Nhập token"
                value={formData.token}
                onChange={(e) => setFormData({ ...formData, token: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-refresh_token">Refresh Token</Label>
              <Input
                id="edit-refresh_token"
                placeholder="Nhập refresh token"
                value={formData.refresh_token}
                onChange={(e) => setFormData({ ...formData, refresh_token: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-expired_time">Thời gian hết hạn</Label>
              <Input
                id="edit-expired_time"
                type="date"
                value={formData.expired_time}
                onChange={(e) => setFormData({ ...formData, expired_time: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" onClick={handleUpdate}>
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Agents Dialog */}
      <Dialog open={isAgentsDialogOpen} onOpenChange={setIsAgentsDialogOpen}>
        <DialogContent 
          style={{ 
            width: '90vw', 
            maxWidth: '1200px', 
            // height: '80vh', 
            maxHeight: '800px' 
          }}
          className="overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Danh sách Agents</DialogTitle>
            <DialogDescription>
              Cloud Manager: <strong>{selectedManager?.url}</strong> - Tổng cộng {agents.length} agents
            </DialogDescription>
          </DialogHeader>
          
          {agentsLoading ? (
            <div 
              className="flex items-center justify-center" 
              style={{ padding: '32px 0' }}
            >
              <div 
                className="animate-spin rounded-full border-b-2 border-primary"
                style={{ height: '24px', width: '24px' }}
              ></div>
              <span style={{ marginLeft: '8px' }}>Đang tải danh sách agents...</span>
            </div>
          ) : (
            <div style={{ marginBottom: '16px' }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hostname</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>OS</TableHead>
                    <TableHead>CPU Info</TableHead>
                    <TableHead>RAM (GB)</TableHead>
                    <TableHead>Disk (GB)</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent: Agent, index: number) => (
                    <TableRow key={agent.id} className="stagger-item" style={{ animationDelay: `${index * 0.05}s` }}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div 
                            className="bg-green-500 rounded-full"
                            style={{ 
                              width: '8px', 
                              height: '8px', 
                              marginRight: '8px' 
                            }}
                          ></div>
                          {agent.hostname}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span 
                          className="font-mono"
                          style={{ fontSize: '14px' }}
                        >
                          {agent.ip}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{agent.os}</div>
                          <div 
                            className="text-muted-foreground"
                            style={{ fontSize: '12px' }}
                          >
                            {agent.os_version}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span 
                          className="text-muted-foreground"
                          style={{ fontSize: '12px' }}
                        >
                          {agent.cpu_info || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{agent.ram_total_gb} GB</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{agent.disk_total_gb} GB</Badge>
                      </TableCell>
                      <TableCell>
                        <span 
                          className="text-muted-foreground"
                          style={{ fontSize: '14px' }}
                        >
                          {new Date(agent.last_seen * 1000).toLocaleString('vi-VN')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={agent.status === 'active' ? 'default' : 'secondary'}
                          className={
                            agent.status === 'active' 
                              ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                              : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                          }
                        >
                          {agent.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {agents.length === 0 && (
                <div 
                  className="text-center text-muted-foreground"
                  style={{ padding: '32px 0' }}
                >
                  Không có agents nào được tìm thấy
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAgentsDialogOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa Trình quản lý đám mây <strong>{selectedManager?.url}</strong>?
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
