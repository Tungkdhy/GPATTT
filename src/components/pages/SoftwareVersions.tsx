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

const mockVersions = [
  { id: 1, name: 'Security Agent', version: '2.1.0', type: 'Agent', status: 'stable', releaseDate: '2024-01-15', description: 'Phiên bản ổn định với cải tiến bảo mật' },
  { id: 2, name: 'Firewall Manager', version: '1.5.2', type: 'Manager', status: 'beta', releaseDate: '2024-01-10', description: 'Phiên bản beta với tính năng mới' },
  { id: 3, name: 'Log Collector', version: '3.0.1', type: 'Service', status: 'deprecated', releaseDate: '2023-12-20', description: 'Phiên bản cũ, sẽ ngừng hỗ trợ' },
  { id: 4, name: 'Network Monitor', version: '1.2.5', type: 'Monitor', status: 'stable', releaseDate: '2024-01-05', description: 'Phiên bản ổn định cho giám sát mạng' },
  { id: 5, name: 'Threat Detection', version: '4.0.0', type: 'Engine', status: 'stable', releaseDate: '2024-01-12', description: 'Phiên bản mới với AI detection' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'stable': return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'beta': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'deprecated': return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'alpha': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'stable': return 'Ổn định';
    case 'beta': return 'Beta';
    case 'deprecated': return 'Ngừng hỗ trợ';
    case 'alpha': return 'Alpha';
    default: return 'Không xác định';
  }
};

export function SoftwareVersions() {
  const [versions, setVersions] = useState(mockVersions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    version: '',
    type: '',
    status: '',
    releaseDate: '',
    description: ''
  });

  const filterOptions: FilterOption[] = [
    {
      key: 'type',
      label: 'Loại',
      type: 'select',
      options: [
        { value: 'Agent', label: 'Agent' },
        { value: 'Manager', label: 'Manager' },
        { value: 'Service', label: 'Service' },
        { value: 'Monitor', label: 'Monitor' },
        { value: 'Engine', label: 'Engine' }
      ]
    },
    {
      key: 'status',
      label: 'Trạng thái',
      type: 'select',
      options: [
        { value: 'stable', label: 'Ổn định' },
        { value: 'beta', label: 'Beta' },
        { value: 'alpha', label: 'Alpha' },
        { value: 'deprecated', label: 'Ngừng hỗ trợ' }
      ]
    }
  ];

  const filteredData = versions.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filters.type || item.type === filters.type;
    const matchesStatus = !filters.status || item.status === filters.status;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAdd = () => {
    const newItem = {
      id: versions.length + 1,
      ...formData
    };
    setVersions([...versions, newItem]);
    setIsDialogOpen(false);
    setFormData({ name: '', version: '', type: '', status: '', releaseDate: '', description: '' });
    toast.success('Thêm phiên bản phần mềm thành công!');
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      version: item.version,
      type: item.type,
      status: item.status,
      releaseDate: item.releaseDate,
      description: item.description
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    setVersions(versions.map(item => item.id === selectedItem.id ? {
      ...item,
      ...formData
    } : item));
    setIsEditDialogOpen(false);
    setSelectedItem(null);
    setFormData({ name: '', version: '', type: '', status: '', releaseDate: '', description: '' });
    toast.success('Cập nhật phiên bản phần mềm thành công!');
  };

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    setVersions(versions.filter(item => item.id !== selectedItem.id));
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
    toast.success('Xóa phiên bản phần mềm thành công!');
  };

  const renderForm = (data: typeof formData, onChange: (data: typeof formData) => void) => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="software-name">Tên phần mềm</Label>
        <Input 
          id="software-name" 
          placeholder="Nhập tên phần mềm" 
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="software-version">Phiên bản</Label>
        <Input 
          id="software-version" 
          placeholder="x.y.z" 
          value={data.version}
          onChange={(e) => onChange({ ...data, version: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="software-type">Loại</Label>
        <Select value={data.type} onValueChange={(value) => onChange({ ...data, type: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại phần mềm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Agent">Agent</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
            <SelectItem value="Service">Service</SelectItem>
            <SelectItem value="Monitor">Monitor</SelectItem>
            <SelectItem value="Engine">Engine</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="software-status">Trạng thái</Label>
        <Select value={data.status} onValueChange={(value) => onChange({ ...data, status: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stable">Ổn định</SelectItem>
            <SelectItem value="beta">Beta</SelectItem>
            <SelectItem value="alpha">Alpha</SelectItem>
            <SelectItem value="deprecated">Ngừng hỗ trợ</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="release-date">Ngày phát hành</Label>
        <Input 
          id="release-date" 
          type="date" 
          value={data.releaseDate}
          onChange={(e) => onChange({ ...data, releaseDate: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="software-description">Mô tả</Label>
        <Textarea 
          id="software-description" 
          placeholder="Nhập mô tả" 
          rows={3} 
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
        />
      </div>
    </div>
  );

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
                Tổng cộng {versions.length} phiên bản
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
                  <DialogTitle>Thêm phiên bản mới</DialogTitle>
                  <DialogDescription>
                    Tạo phiên bản phần mềm mới
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
                <TableHead>Tên phần mềm</TableHead>
                <TableHead>Phiên bản</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày phát hành</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={item.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.version}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {getStatusText(item.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.releaseDate}</TableCell>
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
            <DialogTitle>Chỉnh sửa phiên bản</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin phiên bản
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
              Bạn có chắc chắn muốn xóa phiên bản <strong>{selectedItem?.name} v{selectedItem?.version}</strong>? 
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
