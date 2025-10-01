import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AdvancedFilter, FilterOption } from '../common/AdvancedFilter';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const mockLogAddresses = [
  { id: 1, name: 'Main Log Server', address: '192.168.1.100', port: 514, protocol: 'UDP', type: 'Syslog', status: 'active', description: 'Server log chính' },
  { id: 2, name: 'Security Log Server', address: '192.168.1.101', port: 6514, protocol: 'TCP', type: 'Syslog-TLS', status: 'active', description: 'Log bảo mật encrypted' },
  { id: 3, name: 'Backup Log Server', address: '192.168.1.102', port: 514, protocol: 'UDP', type: 'Syslog', status: 'inactive', description: 'Server log dự phòng' },
  { id: 4, name: 'Cloud Log Service', address: 'logs.example.com', port: 443, protocol: 'HTTPS', type: 'API', status: 'active', description: 'Dịch vụ log trên cloud' },
  { id: 5, name: 'Local File System', address: '/var/log/security', port: 0, protocol: 'FILE', type: 'Local', status: 'active', description: 'Lưu log cục bộ' },
];

const getStatusColor = (status: string) => {
  return status === 'active' 
    ? 'bg-green-500/10 text-green-500 border-green-500/20'
    : 'bg-gray-500/10 text-gray-500 border-gray-500/20';
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Syslog': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'Syslog-TLS': return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'API': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    case 'Local': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

export function LogAddresses() {
  const [logAddresses, setLogAddresses] = useState(mockLogAddresses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    port: '',
    protocol: '',
    type: '',
    description: ''
  });

  const filterOptions: FilterOption[] = [
    {
      key: 'type',
      label: 'Loại',
      type: 'select',
      options: [
        { value: 'Syslog', label: 'Syslog' },
        { value: 'Syslog-TLS', label: 'Syslog-TLS' },
        { value: 'API', label: 'API' },
        { value: 'Local', label: 'Local' }
      ]
    },
    {
      key: 'protocol',
      label: 'Protocol',
      type: 'select',
      options: [
        { value: 'UDP', label: 'UDP' },
        { value: 'TCP', label: 'TCP' },
        { value: 'HTTPS', label: 'HTTPS' },
        { value: 'FILE', label: 'FILE' }
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

  const filteredData = logAddresses.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filters.type || item.type === filters.type;
    const matchesProtocol = !filters.protocol || item.protocol === filters.protocol;
    const matchesStatus = !filters.status || item.status === filters.status;
    return matchesSearch && matchesType && matchesProtocol && matchesStatus;
  });

  const handleAdd = () => {
    const newItem = {
      id: logAddresses.length + 1,
      ...formData,
      port: parseInt(formData.port) || 0,
      status: 'active'
    };
    setLogAddresses([...logAddresses, newItem]);
    setIsDialogOpen(false);
    setFormData({ name: '', address: '', port: '', protocol: '', type: '', description: '' });
    toast.success('Thêm địa chỉ log thành công!');
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      address: item.address,
      port: item.port.toString(),
      protocol: item.protocol,
      type: item.type,
      description: item.description
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    setLogAddresses(logAddresses.map(item => item.id === selectedItem.id ? {
      ...item,
      ...formData,
      port: parseInt(formData.port) || 0
    } : item));
    setIsEditDialogOpen(false);
    setSelectedItem(null);
    setFormData({ name: '', address: '', port: '', protocol: '', type: '', description: '' });
    toast.success('Cập nhật địa chỉ log thành công!');
  };

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    setLogAddresses(logAddresses.filter(item => item.id !== selectedItem.id));
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
    toast.success('Xóa địa chỉ log thành công!');
  };

  const renderForm = (data: typeof formData, onChange: (data: typeof formData) => void) => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="log-name">Tên</Label>
        <Input 
          id="log-name" 
          placeholder="Nhập tên" 
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="log-address">Địa chỉ</Label>
        <Input 
          id="log-address" 
          placeholder="IP hoặc domain" 
          value={data.address}
          onChange={(e) => onChange({ ...data, address: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="log-port">Cổng</Label>
        <Input 
          id="log-port" 
          type="number" 
          placeholder="514, 6514, 443..." 
          value={data.port}
          onChange={(e) => onChange({ ...data, port: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="log-protocol">Protocol</Label>
        <Select value={data.protocol} onValueChange={(value) => onChange({ ...data, protocol: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn protocol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UDP">UDP</SelectItem>
            <SelectItem value="TCP">TCP</SelectItem>
            <SelectItem value="HTTPS">HTTPS</SelectItem>
            <SelectItem value="FILE">FILE</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="log-type">Loại</Label>
        <Select value={data.type} onValueChange={(value) => onChange({ ...data, type: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Syslog">Syslog</SelectItem>
            <SelectItem value="Syslog-TLS">Syslog-TLS</SelectItem>
            <SelectItem value="API">API</SelectItem>
            <SelectItem value="Local">Local</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="log-description">Mô tả</Label>
        <Input 
          id="log-description" 
          placeholder="Nhập mô tả" 
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Quản lý địa chỉ lưu log</h1>
        <p className="text-muted-foreground">
          Quản lý các địa chỉ và máy chủ lưu trữ log hệ thống
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách địa chỉ log</CardTitle>
              <CardDescription>
                Tổng cộng {logAddresses.length} địa chỉ
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-animate scale-hover">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Thêm địa chỉ log mới</DialogTitle>
                  <DialogDescription>
                    Tạo địa chỉ lưu log mới
                  </DialogDescription>
                </DialogHeader>
                {renderForm(formData, setFormData)}
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
              searchPlaceholder="Tìm kiếm địa chỉ log..."
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
                <TableHead>Tên</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Cổng</TableHead>
                <TableHead>Protocol</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={item.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.address}</TableCell>
                  <TableCell>{item.port === 0 ? 'N/A' : item.port}</TableCell>
                  <TableCell>{item.protocol}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeColor(item.type)}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {item.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{item.description}</TableCell>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa địa chỉ log</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin địa chỉ log
            </DialogDescription>
          </DialogHeader>
          {renderForm(formData, setFormData)}
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
              Bạn có chắc chắn muốn xóa địa chỉ log <strong>{selectedItem?.name}</strong>? 
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
