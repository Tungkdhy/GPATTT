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
import { AdvancedFilter, FilterOption } from '../common/AdvancedFilter';
import { Plus, Edit, Trash2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const mockWhitelistIPs = [
  { id: 1, ipAddress: '192.168.1.1', description: 'Gateway router', addedBy: 'admin', addedDate: '2024-01-15 10:30', status: 'active' },
  { id: 2, ipAddress: '10.0.0.1', description: 'Internal DNS server', addedBy: 'security', addedDate: '2024-01-14 15:20', status: 'active' },
  { id: 3, ipAddress: '172.16.0.10', description: 'Monitoring server', addedBy: 'admin', addedDate: '2024-01-13 09:15', status: 'active' },
  { id: 4, ipAddress: '203.162.4.100', description: 'VPN endpoint', addedBy: 'security', addedDate: '2024-01-12 14:45', status: 'inactive' },
];

export function WhitelistIPs() {
  const [whitelistIPs, setWhitelistIPs] = useState(mockWhitelistIPs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedIP, setSelectedIP] = useState<any>(null);
  const [formData, setFormData] = useState({
    ipAddress: '',
    description: '',
    addedBy: 'admin'
  });

  const filterOptions: FilterOption[] = [
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

  const filteredIPs = whitelistIPs.filter(ip => {
    const matchesSearch = ip.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ip.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filters.status || ip.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-500/10 text-green-500 border-green-500/20'
      : 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const handleAdd = () => {
    const newIP = {
      id: whitelistIPs.length + 1,
      ipAddress: formData.ipAddress,
      description: formData.description,
      addedBy: formData.addedBy,
      addedDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'active'
    };
    setWhitelistIPs([...whitelistIPs, newIP]);
    setIsDialogOpen(false);
    setFormData({ ipAddress: '', description: '', addedBy: 'admin' });
    toast.success('Thêm IP vào danh sách trắng thành công!');
  };

  const handleEdit = (ip: any) => {
    setSelectedIP(ip);
    setFormData({
      ipAddress: ip.ipAddress,
      description: ip.description,
      addedBy: ip.addedBy
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    setWhitelistIPs(whitelistIPs.map(ip => ip.id === selectedIP.id ? {
      ...ip,
      ipAddress: formData.ipAddress,
      description: formData.description,
      addedBy: formData.addedBy
    } : ip));
    setIsEditDialogOpen(false);
    setSelectedIP(null);
    setFormData({ ipAddress: '', description: '', addedBy: 'admin' });
    toast.success('Cập nhật IP thành công!');
  };

  const handleDeleteClick = (ip: any) => {
    setSelectedIP(ip);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    setWhitelistIPs(whitelistIPs.filter(ip => ip.id !== selectedIP.id));
    setIsDeleteDialogOpen(false);
    setSelectedIP(null);
    toast.success('Xóa IP khỏi danh sách trắng thành công!');
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Quản lý danh sách IP trắng</h1>
        <p className="text-muted-foreground">
          Quản lý danh sách địa chỉ IP được tin cậy trong hệ thống
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách IP trắng</CardTitle>
              <CardDescription>
                Tổng cộng {whitelistIPs.length} IP trong danh sách trắng
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-animate scale-hover">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm IP trắng
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Thêm IP vào danh sách trắng</DialogTitle>
                  <DialogDescription>
                    Thêm địa chỉ IP tin cậy mới
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="ipAddress">
                      Địa chỉ IP
                    </Label>
                    <Input 
                      id="ipAddress" 
                      placeholder="VD: 192.168.1.1" 
                      value={formData.ipAddress}
                      onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Mô tả
                    </Label>
                    <Textarea 
                      id="description" 
                      placeholder="Nhập mô tả cho IP này" 
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full" onClick={handleAdd}>Thêm vào danh sách trắng</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <AdvancedFilter
              searchPlaceholder="Tìm kiếm IP..."
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
                <TableHead>Địa chỉ IP</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Người thêm</TableHead>
                <TableHead>Ngày thêm</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIPs.map((ip, index) => (
                <TableRow key={ip.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                  <TableCell className="font-medium font-mono">{ip.ipAddress}</TableCell>
                  <TableCell>{ip.description}</TableCell>
                  <TableCell>{ip.addedBy}</TableCell>
                  <TableCell>{ip.addedDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(ip.status)}>
                      {ip.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </TableCell>
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
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa IP trắng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin IP trong danh sách trắng
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-ipAddress">
                Địa chỉ IP
              </Label>
              <Input 
                id="edit-ipAddress" 
                placeholder="VD: 192.168.1.1" 
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">
                Mô tả
              </Label>
              <Textarea 
                id="edit-description" 
                placeholder="Nhập mô tả cho IP này" 
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa IP <strong>{selectedIP?.ipAddress}</strong> khỏi danh sách trắng? 
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
