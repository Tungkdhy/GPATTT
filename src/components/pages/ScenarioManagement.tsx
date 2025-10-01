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

const mockScenarios = [
  { id: 1, name: 'Phát hiện mã độc', description: 'Kịch bản phát hiện và xử lý mã độc', category: 'Security', priority: 'high', status: 'active', created: '2024-01-10' },
  { id: 2, name: 'Tấn công DDoS', description: 'Phát hiện và ngăn chặn tấn công DDoS', category: 'Network', priority: 'critical', status: 'active', created: '2024-01-08' },
  { id: 3, name: 'Login bất thường', description: 'Phát hiện hoạt động đăng nhập bất thường', category: 'Security', priority: 'medium', status: 'inactive', created: '2024-01-05' },
  { id: 4, name: 'Sử dụng tài nguyên cao', description: 'Giám sát sử dụng CPU/RAM cao', category: 'Performance', priority: 'low', status: 'active', created: '2024-01-03' },
  { id: 5, name: 'Truy cập trái phép', description: 'Phát hiện truy cập không được phép', category: 'Security', priority: 'high', status: 'active', created: '2024-01-01' },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'critical': return 'Nghiêm trọng';
    case 'high': return 'Cao';
    case 'medium': return 'Trung bình';
    case 'low': return 'Thấp';
    default: return 'Không xác định';
  }
};

const getStatusColor = (status: string) => {
  return status === 'active' 
    ? 'bg-green-500/10 text-green-500 border-green-500/20'
    : 'bg-gray-500/10 text-gray-500 border-gray-500/20';
};

export function ScenarioManagement() {
  const [scenarios, setScenarios] = useState(mockScenarios);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    priority: ''
  });

  const filterOptions: FilterOption[] = [
    {
      key: 'category',
      label: 'Danh mục',
      type: 'select',
      options: [
        { value: 'Security', label: 'Security' },
        { value: 'Network', label: 'Network' },
        { value: 'Performance', label: 'Performance' },
        { value: 'System', label: 'System' }
      ]
    },
    {
      key: 'priority',
      label: 'Mức độ ưu tiên',
      type: 'select',
      options: [
        { value: 'critical', label: 'Nghiêm trọng' },
        { value: 'high', label: 'Cao' },
        { value: 'medium', label: 'Trung bình' },
        { value: 'low', label: 'Thấp' }
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

  const filteredData = scenarios.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filters.category || item.category === filters.category;
    const matchesPriority = !filters.priority || item.priority === filters.priority;
    const matchesStatus = !filters.status || item.status === filters.status;
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const handleAdd = () => {
    const newItem = {
      id: scenarios.length + 1,
      ...formData,
      status: 'active',
      created: new Date().toISOString().slice(0, 10)
    };
    setScenarios([...scenarios, newItem]);
    setIsDialogOpen(false);
    setFormData({ name: '', description: '', category: '', priority: '' });
    toast.success('Thêm kịch bản thành công!');
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      priority: item.priority
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    setScenarios(scenarios.map(item => item.id === selectedItem.id ? {
      ...item,
      ...formData
    } : item));
    setIsEditDialogOpen(false);
    setSelectedItem(null);
    setFormData({ name: '', description: '', category: '', priority: '' });
    toast.success('Cập nhật kịch bản thành công!');
  };

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    setScenarios(scenarios.filter(item => item.id !== selectedItem.id));
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
    toast.success('Xóa kịch bản thành công!');
  };

  const renderForm = (data: typeof formData, onChange: (data: typeof formData) => void) => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="scenario-name">Tên kịch bản</Label>
        <Input 
          id="scenario-name" 
          placeholder="Nhập tên kịch bản" 
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="scenario-description">Mô tả</Label>
        <Textarea 
          id="scenario-description" 
          placeholder="Nhập mô tả" 
          rows={3} 
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="scenario-category">Danh mục</Label>
        <Select value={data.category} onValueChange={(value) => onChange({ ...data, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Security">Security</SelectItem>
            <SelectItem value="Network">Network</SelectItem>
            <SelectItem value="Performance">Performance</SelectItem>
            <SelectItem value="System">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="scenario-priority">Mức độ ưu tiên</Label>
        <Select value={data.priority} onValueChange={(value) => onChange({ ...data, priority: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn mức độ ưu tiên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="critical">Nghiêm trọng</SelectItem>
            <SelectItem value="high">Cao</SelectItem>
            <SelectItem value="medium">Trung bình</SelectItem>
            <SelectItem value="low">Thấp</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Danh mục kịch bản</h1>
        <p className="text-muted-foreground">
          Quản lý các kịch bản phát hiện và xử lý sự cố bảo mật
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách kịch bản</CardTitle>
              <CardDescription>
                Tổng cộng {scenarios.length} kịch bản
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
                  <DialogTitle>Thêm kịch bản mới</DialogTitle>
                  <DialogDescription>
                    Tạo kịch bản mới
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
              searchPlaceholder="Tìm kiếm kịch bản..."
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
                <TableHead>Tên kịch bản</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Mức độ ưu tiên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={item.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getPriorityColor(item.priority)}>
                      {getPriorityText(item.priority)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {item.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.created}</TableCell>
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
            <DialogTitle>Chỉnh sửa kịch bản</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin kịch bản
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
              Bạn có chắc chắn muốn xóa kịch bản <strong>{selectedItem?.name}</strong>? 
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
