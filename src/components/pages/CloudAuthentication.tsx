import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Eye, Trash2, RefreshCw, Key, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import cloudAuthService, { CloudAuthManager, TokenDetails } from '@/services/api/cloudAuth.service';
import { TablePagination } from '../common/TablePagination';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

export function CloudAuthentication() {
  const [cloudManagers, setCloudManagers] = useState<CloudAuthManager[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(20);
  const [reload, setReload] = useState(false);

  // Dialog states
  const [selectedCloud, setSelectedCloud] = useState<CloudAuthManager | null>(null);
  const [tokenDetails, setTokenDetails] = useState<TokenDetails | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteTokenDialogOpen, setIsDeleteTokenDialogOpen] = useState(false);
  const [isRenewTokenDialogOpen, setIsRenewTokenDialogOpen] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);

  // Fetch cloud managers
  const fetchCloudManagers = async () => {
    setLoading(true);
    try {
      const response = await cloudAuthService.getAll(pageSize, currentPage);
      const managers = response.data.rows;
      
      // Fetch token details for each cloud manager
      const managersWithTokens = await Promise.all(
        managers.map(async (manager) => {
          try {
            const tokenResponse = await cloudAuthService.getTokenDetails(manager.id);
            return {
              ...manager,
              token_details: tokenResponse.data.token_details
            };
          } catch (error) {
            // If token details fetch fails, return manager without token_details
            console.error(`Failed to fetch token for ${manager.id}:`, error);
            return manager;
          }
        })
      );
      
      setCloudManagers(managersWithTokens);
      setTotal(response.data.count);
      setTotalPages(Math.ceil(response.data.count / pageSize));
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi tải dữ liệu';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCloudManagers();
  }, [currentPage, reload]);

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, total);

  // View token details
  const handleViewDetails = (cloud: CloudAuthManager) => {
    setSelectedCloud(cloud);
    setTokenDetails(cloud.token_details || null);
    setIsDetailOpen(true);
  };

  // Delete cloud manager
  const handleDeleteClick = (cloud: CloudAuthManager) => {
    setSelectedCloud(cloud);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCloud) return;
    
    try {
      await cloudAuthService.delete(selectedCloud.id);
      toast.success('Đã xóa Cloud Manager thành công!');
      setIsDeleteDialogOpen(false);
      setSelectedCloud(null);
      setReload(!reload);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi xóa';
      toast.error(errorMsg);
    }
  };

  // Delete token only
  const handleDeleteTokenClick = (cloud: CloudAuthManager) => {
    setSelectedCloud(cloud);
    setIsDeleteTokenDialogOpen(true);
  };

  const handleRenewTokenClick = (cloud: CloudAuthManager) => {
    setSelectedCloud(cloud);
    setIsRenewTokenDialogOpen(true);
  };

  const handleDeleteToken = async () => {
    if (!selectedCloud) return;
    
    try {
      await cloudAuthService.deleteToken(selectedCloud.id);
      toast.success('Đã xóa Token thành công!');
      setIsDeleteTokenDialogOpen(false);
      setSelectedCloud(null);
      setReload(!reload);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi xóa token';
      toast.error(errorMsg);
    }
  };

  const handleRenewToken = async () => {
    if (!selectedCloud) return;

    try {
      setIsRenewing(true);
      await cloudAuthService.renewToken(selectedCloud.id);
      toast.success('Đã gia hạn Token thành công!');
      setIsRenewTokenDialogOpen(false);
      setSelectedCloud(null);
      setReload(!reload);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi gia hạn token';
      toast.error(errorMsg);
    } finally {
      setIsRenewing(false);
    }
  };

  const handleRefresh = () => {
    setReload(!reload);
    toast.success('Đã làm mới dữ liệu!');
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-500/10 text-green-500 border-green-500/20' 
      : 'bg-red-500/10 text-red-500 border-red-500/20';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getDaysUntilExpiryColor = (days: number) => {
    if (days < 0) return 'text-red-500';
    if (days < 7) return 'text-orange-500';
    if (days < 30) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left flex justify-between items-center">
        <div>
          <h1>Quản lý xác thực</h1>
          <p className="text-muted-foreground">
            Quản lý token xác thực
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} className="scale-hover">
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>
      {/* Stats Cards */}
    

      <Card className="card-hover">
        <CardHeader>
          <CardTitle>Danh sách xác thực</CardTitle>
          <CardDescription>
            Hiển thị {cloudManagers.length} xác thực trên trang {currentPage} / {totalPages}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSkeleton />
          ) : cloudManagers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Không có dữ liệu
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Mã xác thực</TableHead>
                    <TableHead>Refresh Token</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cloudManagers.map((cloud, index) => (
                    <TableRow key={cloud.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                      <TableCell className="font-medium">{cloud.name || cloud.id}</TableCell>
                      <TableCell className="font-mono text-xs">{cloud.url}</TableCell>
                      <TableCell>{cloud.token_details?.user_name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(cloud.token_details?.token_status || 'inactive')}>
                          {cloud.token_details?.token_status || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(cloud.token_details?.refresh_token_status || 'inactive')}>
                          {cloud.token_details?.refresh_token_status || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(cloud.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleViewDetails(cloud)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {cloud.token_details && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="scale-hover text-orange-500" 
                              onClick={() => handleDeleteTokenClick(cloud)}
                              title="Xóa mã xác thực"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {cloud.token_details && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="scale-hover text-blue-500" 
                              onClick={() => handleRenewTokenClick(cloud)}
                              title="Gia hạn Token"
                            >
                              <Key className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="scale-hover text-red-500" 
                            onClick={() => handleDeleteClick(cloud)}
                            title="Xóa Cloud Manager"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  totalItems={total}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết Token</DialogTitle>
            <DialogDescription>
              Thông tin xác thực của Cloud Manager
            </DialogDescription>
          </DialogHeader>
          {tokenDetails ? (
            <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">ID:</div>
                <div className="col-span-2 text-sm font-mono text-xs break-all">{tokenDetails.id}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">URL:</div>
                <div className="col-span-2 text-sm font-mono text-xs">{tokenDetails.url}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">User:</div>
                <div className="col-span-2 text-sm font-medium">{tokenDetails.user_name}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Token Status:</div>
                <div className="col-span-2">
                  <Badge variant="outline" className={getStatusColor(tokenDetails.token_status)}>
                    {tokenDetails.token_status}
                  </Badge>
                </div>
              </div>
              {tokenDetails.token_preview && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm text-muted-foreground">Token Preview:</div>
                  <div className="col-span-2 text-sm font-mono text-xs break-all">{tokenDetails.token_preview}</div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Refresh Token:</div>
                <div className="col-span-2">
                  <Badge variant="outline" className={getStatusColor(tokenDetails.refresh_token_status)}>
                    {tokenDetails.refresh_token_status}
                  </Badge>
                </div>
              </div>
              {tokenDetails.refresh_token_preview && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm text-muted-foreground">Refresh Preview:</div>
                  <div className="col-span-2 text-sm font-mono text-xs break-all">{tokenDetails.refresh_token_preview}</div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Expired Time:</div>
                <div className="col-span-2 text-sm">{formatDate(tokenDetails.expired_time)}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Is Expired:</div>
                <div className="col-span-2">
                  <Badge variant="outline" className={tokenDetails.is_expired ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}>
                    {tokenDetails.is_expired ? 'Đã hết hạn' : 'Còn hiệu lực'}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Days Until Expiry:</div>
                <div className="col-span-2">
                  <span className={`text-sm font-medium ${getDaysUntilExpiryColor(tokenDetails.days_until_expiry)}`}>
                    {tokenDetails.days_until_expiry < 0 
                      ? `Đã hết hạn ${Math.abs(tokenDetails.days_until_expiry)} ngày` 
                      : `Còn ${tokenDetails.days_until_expiry} ngày`}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Ngày tạo:</div>
                <div className="col-span-2 text-sm">{formatDate(tokenDetails.created_at)}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Cập nhật:</div>
                <div className="col-span-2 text-sm">{formatDate(tokenDetails.updated_at)}</div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Không có thông tin token
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Cloud Manager Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa Cloud Manager</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa Cloud Manager này? Hành động này sẽ xóa cả token và không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">
              Xóa Cloud Manager
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Token Only Dialog */}
      <AlertDialog open={isDeleteTokenDialogOpen} onOpenChange={setIsDeleteTokenDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa Token</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa Token này? Cloud Manager sẽ được giữ lại nhưng token sẽ bị xóa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteToken} className="bg-orange-600 text-white hover:bg-orange-700">
              Xóa Token
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Renew Token Dialog */}
      <AlertDialog open={isRenewTokenDialogOpen} onOpenChange={setIsRenewTokenDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận gia hạn Token</AlertDialogTitle>
            <AlertDialogDescription>
              Hệ thống sẽ yêu cầu tạo token mới cho Cloud Manager này. Tiếp tục?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRenewing}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleRenewToken} className="bg-blue-600 text-white hover:bg-blue-700" disabled={isRenewing}>
              {isRenewing ? 'Đang gia hạn...' : 'Gia hạn Token'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

