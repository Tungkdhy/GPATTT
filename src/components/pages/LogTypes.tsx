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
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const mockLogTypes = [
  { id: 1, code: 'AUTH', name: 'Authentication Log', description: 'Logs related to user authentication', severity: 'info', status: 'active' },
  { id: 2, code: 'ERROR', name: 'Error Log', description: 'System error logs', severity: 'critical', status: 'active' },
  { id: 3, code: 'ACCESS', name: 'Access Log', description: 'Resource access logs', severity: 'info', status: 'active' },
  { id: 4, code: 'SECURITY', name: 'Security Log', description: 'Security event logs', severity: 'high', status: 'active' },
];

export function LogTypes() {
  const [logTypes, setLogTypes] = useState(mockLogTypes);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLogType, setSelectedLogType] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    severity: ''
  });

  const filterOptions: FilterOption[] = [
    {
      key: 'severity',
      label: 'Mức độ',
      type: 'select',
      options: [
        { value: 'info', label: 'Thông tin' },
        { value: 'warning', label: 'Cảnh báo' },
        { value: 'high', label: 'Cao' },
        { value: 'critical', label: 'Nghiêm trọng' }
      ]
    }
  ];

  const filteredLogTypes = logTypes.filter(log => {
    const matchesSearch = log.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = !filters.severity || log.severity === filters.severity;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'warning': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const handleAdd = () => {
    const newLogType = {
      id: logTypes.length + 1,
      code: formData.code,
      name: formData.name,
      description: formData.description,
      severity: formData.severity,
      status: 'active'
    };
    setLogTypes([...logTypes, newLogType]);
    setIsDialogOpen(false);
    setFormData({ code: '', name: '', description: '', severity: '' });
    toast.success('Thêm loại log thành công!');
  };

  const handleEdit = (logType: any) => {
    setSelectedLogType(logType);
    setFormData({
      code: logType.code,
      name: logType.name,
      description: logType.description,
      severity: logType.severity
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    setLogTypes(logTypes.map(log => log.id === selectedLogType.id ? {
      ...log,
      code: formData.code,
      name: formData.name,
      description: formData.description,
      severity: formData.severity
    } : log));
    setIsEditDialogOpen(false);
    setSelectedLogType(null);
    setFormData({ code: '', name: '', description: '', severity: '' });
    toast.success('Cập nhật loại log thành công!');
  };

  const handleDeleteClick = (logType: any) => {
    setSelectedLogType(logType);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    setLogTypes(logTypes.filter(log => log.id !== selectedLogType.id));
    setIsDeleteDialogOpen(false);
    setSelectedLogType(null);
    toast.success('Xóa loại log thành công!');
  };

  const LogTypeForm = () => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="code">Mã loại log</Label>
        <Input 
          id="code" 
          placeholder="VD: AUTH" 
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Tên loại log</Label>
        <Input 
          id="name" 
          placeholder="Nhập tên loại log" 
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea 
          id="description" 
          placeholder="Nhập mô tả" 
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="severity">Mức độ</Label>
        <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn mức độ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="info">Thông tin</SelectItem>
            <SelectItem value="warning">Cảnh báo</SelectItem>
            <SelectItem value="high">Cao</SelectItem>
            <SelectItem value="critical">Nghiêm trọng</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Danh mục loại log</h1>
        <p className="text-muted-foreground">
          Quản lý các loại log trong hệ thống
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách loại log</CardTitle>
              <CardDescription>
                Tổng cộng {logTypes.length} loại log
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-animate scale-hover">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm loại log
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Thêm loại log mới</DialogTitle>
                  <DialogDescription>
                    Tạo loại log mới cho hệ thống
                  </DialogDescription>
                </DialogHeader>
                <LogTypeForm />
                <DialogFooter>
                  <Button type="submit" className="w-full" onClick={handleAdd}>Thêm loại log</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <AdvancedFilter
              searchPlaceholder="Tìm kiếm loại log..."
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
                <TableHead>Mã</TableHead>
                <TableHead>Tên loại log</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Mức độ</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogTypes.map((logType, index) => (
                <TableRow key={logType.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                  <TableCell className="font-medium font-mono">{logType.code}</TableCell>
                  <TableCell>{logType.name}</TableCell>
                  <TableCell>{logType.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getSeverityColor(logType.severity)}>
                      {logType.severity === 'info' ? 'Thông tin' : 
                       logType.severity === 'warning' ? 'Cảnh báo' :
                       logType.severity === 'high' ? 'Cao' : 'Nghiêm trọng'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleEdit(logType)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleDeleteClick(logType)}>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa loại log</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin loại log
            </DialogDescription>
          </DialogHeader>
          <LogTypeForm />
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
              Bạn có chắc chắn muốn xóa loại log <strong>{selectedLogType?.name}</strong>? 
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
