import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AdvancedFilter, FilterOption } from '../common/AdvancedFilter';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const mockDeviceTypes = [
  { 
    id: 1, 
    name: 'Server', 
    category: 'Infrastructure', 
    manufacturer: 'Various', 
    monitoring: 'enabled',
    ports: '22,80,443,3389',
    description: 'Máy chủ vật lý hoặc ảo hóa',
    specifications: 'CPU, RAM, Storage monitoring'
  },
  { 
    id: 2, 
    name: 'Firewall', 
    category: 'Security', 
    manufacturer: 'Fortinet, Cisco', 
    monitoring: 'enabled',
    ports: '443,8080',
    description: 'Thiết bị tường lửa bảo mật mạng',
    specifications: 'Throughput, Connection tracking'
  },
  { 
    id: 3, 
    name: 'Switch', 
    category: 'Network', 
    manufacturer: 'Cisco, HP', 
    monitoring: 'enabled',
    ports: '23,80,161',
    description: 'Thiết bị chuyển mạch Layer 2/3',
    specifications: 'Port status, VLAN, Bandwidth'
  },
  { 
    id: 4, 
    name: 'Router', 
    category: 'Network', 
    manufacturer: 'Cisco, Juniper', 
    monitoring: 'enabled',
    ports: '22,23,80,161',
    description: 'Thiết bị định tuyến mạng',
    specifications: 'Routing table, Interface status'
  },
  { 
    id: 5, 
    name: 'Workstation', 
    category: 'Endpoint', 
    manufacturer: 'Dell, HP, Lenovo', 
    monitoring: 'disabled',
    ports: '3389,5900',
    description: 'Máy tính làm việc của người dùng',
    specifications: 'OS version, Antivirus status'
  },
  { 
    id: 6, 
    name: 'IP Camera', 
    category: 'IoT', 
    manufacturer: 'Hikvision, Dahua', 
    monitoring: 'enabled',
    ports: '80,554,8000',
    description: 'Camera IP giám sát',
    specifications: 'Video stream, Motion detection'
  }
];

const getMonitoringColor = (monitoring: string) => {
  return monitoring === 'enabled' 
    ? 'bg-green-500/10 text-green-500 border-green-500/20'
    : 'bg-gray-500/10 text-gray-500 border-gray-500/20';
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Infrastructure': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'Security': return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'Network': return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'Endpoint': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    case 'IoT': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

export function DeviceTypes() {
  const [deviceTypes, setDeviceTypes] = useState(mockDeviceTypes);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    manufacturer: '',
    monitoring: '',
    ports: '',
    description: '',
    specifications: ''
  });

  const filterOptions: FilterOption[] = [
    {
      key: 'category',
      label: 'Danh mục',
      type: 'select',
      options: [
        { value: 'Infrastructure', label: 'Infrastructure' },
        { value: 'Security', label: 'Security' },
        { value: 'Network', label: 'Network' },
        { value: 'Endpoint', label: 'Endpoint' },
        { value: 'IoT', label: 'IoT' }
      ]
    },
    {
      key: 'monitoring',
      label: 'Giám sát',
      type: 'select',
      options: [
        { value: 'enabled', label: 'Bật' },
        { value: 'disabled', label: 'Tắt' }
      ]
    }
  ];

  const filteredData = deviceTypes.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filters.category || item.category === filters.category;
    const matchesMonitoring = !filters.monitoring || item.monitoring === filters.monitoring;
    return matchesSearch && matchesCategory && matchesMonitoring;
  });

  const handleAdd = () => {
    const newItem = {
      id: deviceTypes.length + 1,
      ...formData
    };
    setDeviceTypes([...deviceTypes, newItem]);
    setIsDialogOpen(false);
    setFormData({ name: '', category: '', manufacturer: '', monitoring: '', ports: '', description: '', specifications: '' });
    toast.success('Thêm loại thiết bị thành công!');
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      manufacturer: item.manufacturer,
      monitoring: item.monitoring,
      ports: item.ports,
      description: item.description,
      specifications: item.specifications
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    setDeviceTypes(deviceTypes.map(item => item.id === selectedItem.id ? {
      ...item,
      ...formData
    } : item));
    setIsEditDialogOpen(false);
    setSelectedItem(null);
    setFormData({ name: '', category: '', manufacturer: '', monitoring: '', ports: '', description: '', specifications: '' });
    toast.success('Cập nhật loại thiết bị thành công!');
  };

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    setDeviceTypes(deviceTypes.filter(item => item.id !== selectedItem.id));
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
    toast.success('Xóa loại thiết bị thành công!');
  };

  const renderForm = (data: typeof formData, onChange: (data: typeof formData) => void) => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="device-type-name">Tên loại thiết bị</Label>
        <Input 
          id="device-type-name" 
          placeholder="Nhập tên loại thiết bị" 
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="device-category">Danh mục</Label>
        <Select value={data.category} onValueChange={(value) => onChange({ ...data, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Infrastructure">Infrastructure</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
            <SelectItem value="Network">Network</SelectItem>
            <SelectItem value="Endpoint">Endpoint</SelectItem>
            <SelectItem value="IoT">IoT</SelectItem>
            <SelectItem value="Storage">Storage</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="device-manufacturer">Nhà sản xuất</Label>
        <Input 
          id="device-manufacturer" 
          placeholder="VD: Cisco, HP" 
          value={data.manufacturer}
          onChange={(e) => onChange({ ...data, manufacturer: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="device-monitoring">Giám sát mặc định</Label>
        <Select value={data.monitoring} onValueChange={(value) => onChange({ ...data, monitoring: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn trạng thái giám sát" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enabled">Bật</SelectItem>
            <SelectItem value="disabled">Tắt</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="device-ports">Cổng mặc định</Label>
        <Input 
          id="device-ports" 
          placeholder="22,80,443" 
          value={data.ports}
          onChange={(e) => onChange({ ...data, ports: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="device-description">Mô tả</Label>
        <Textarea 
          id="device-description" 
          placeholder="Nhập mô tả" 
          rows={2} 
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="device-specifications">Thông số giám sát</Label>
        <Textarea 
          id="device-specifications" 
          placeholder="Các thông số cần giám sát" 
          rows={2} 
          value={data.specifications}
          onChange={(e) => onChange({ ...data, specifications: e.target.value })}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Quản lý loại thiết bị</h1>
        <p className="text-muted-foreground">
          Quản lý và phân loại các loại thiết bị trong hệ thống mạng
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách loại thiết bị</CardTitle>
              <CardDescription>
                Tổng cộng {deviceTypes.length} loại thiết bị
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
                  <DialogTitle>Thêm loại thiết bị mới</DialogTitle>
                  <DialogDescription>
                    Tạo loại thiết bị mới
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
              searchPlaceholder="Tìm kiếm loại thiết bị..."
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
                <TableHead>Tên loại thiết bị</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Nhà sản xuất</TableHead>
                <TableHead>Giám sát</TableHead>
                <TableHead>Cổng mặc định</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={item.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.manufacturer}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getMonitoringColor(item.monitoring)}>
                      {item.monitoring === 'enabled' ? 'Bật' : 'Tắt'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <code className="px-2 py-1 bg-muted rounded text-sm">
                      {item.ports}
                    </code>
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
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa loại thiết bị</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin loại thiết bị
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
              Bạn có chắc chắn muốn xóa loại thiết bị <strong>{selectedItem?.name}</strong>? 
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
