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
import { Plus, Edit, Trash2, Bell } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const mockAlertLevels = [
  { id: 1, level: 'low', name: 'Thấp', color: '#10b981', threshold: 20, action: 'Log only', status: 'active' },
  { id: 2, level: 'medium', name: 'Trung bình', color: '#f59e0b', threshold: 50, action: 'Send notification', status: 'active' },
  { id: 3, level: 'high', name: 'Cao', color: '#ef4444', threshold: 75, action: 'Send alert + Email', status: 'active' },
  { id: 4, level: 'critical', name: 'Nghiêm trọng', color: '#dc2626', threshold: 90, action: 'Immediate response', status: 'active' },
];

export function AlertLevels() {
  const [alertLevels, setAlertLevels] = useState(mockAlertLevels);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<any>(null);
  const [formData, setFormData] = useState({
    level: '',
    name: '',
    color: '#10b981',
    threshold: '',
    action: ''
  });

  const filterOptions: FilterOption[] = [
    {
      key: 'level',
      label: 'Mức độ',
      type: 'select',
      options: [
        { value: 'low', label: 'Thấp' },
        { value: 'medium', label: 'Trung bình' },
        { value: 'high', label: 'Cao' },
        { value: 'critical', label: 'Nghiêm trọng' }
      ]
    }
  ];

  const filteredLevels = alertLevels.filter(level => {
    const matchesSearch = level.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !filters.level || level.level === filters.level;
    return matchesSearch && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const handleAdd = () => {
    const newLevel = {
      id: alertLevels.length + 1,
      level: formData.level,
      name: formData.name,
      color: formData.color,
      threshold: parseInt(formData.threshold),
      action: formData.action,
      status: 'active'
    };
    setAlertLevels([...alertLevels, newLevel]);
    setIsDialogOpen(false);
    setFormData({ level: '', name: '', color: '#10b981', threshold: '', action: '' });
    toast.success('Thêm mức cảnh báo thành công!');
  };

  const handleEdit = (level: any) => {
    setSelectedLevel(level);
    setFormData({
      level: level.level,
      name: level.name,
      color: level.color,
      threshold: level.threshold.toString(),
      action: level.action
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    setAlertLevels(alertLevels.map(l => l.id === selectedLevel.id ? {
      ...l,
      level: formData.level,
      name: formData.name,
      color: formData.color,
      threshold: parseInt(formData.threshold),
      action: formData.action
    } : l));
    setIsEditDialogOpen(false);
    setSelectedLevel(null);
    setFormData({ level: '', name: '', color: '#10b981', threshold: '', action: '' });
    toast.success('Cập nhật mức cảnh báo thành công!');
  };

  const handleDeleteClick = (level: any) => {
    setSelectedLevel(level);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    setAlertLevels(alertLevels.filter(l => l.id !== selectedLevel.id));
    setIsDeleteDialogOpen(false);
    setSelectedLevel(null);
    toast.success('Xóa mức cảnh báo thành công!');
  };

  const AlertLevelForm = () => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="level">Mức độ</Label>
        <Select value={formData.level} onValueChange={(value:any) => setFormData({ ...formData, level: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn mức độ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Thấp</SelectItem>
            <SelectItem value="medium">Trung bình</SelectItem>
            <SelectItem value="high">Cao</SelectItem>
            <SelectItem value="critical">Nghiêm trọng</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Tên</Label>
        <Input 
          id="name" 
          placeholder="Nhập tên mức cảnh báo" 
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="threshold">Ngưỡng (%)</Label>
        <Input 
          id="threshold" 
          type="number"
          placeholder="VD: 50" 
          value={formData.threshold}
          onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="action">Hành động</Label>
        <Textarea 
          id="action" 
          placeholder="Nhập hành động khi đạt ngưỡng" 
          value={formData.action}
          onChange={(e) => setFormData({ ...formData, action: e.target.value })}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Danh mục mức cảnh báo</h1>
        <p className="text-muted-foreground">
          Quản lý các mức độ cảnh báo trong hệ thống
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách mức cảnh báo</CardTitle>
              <CardDescription>
                Tổng cộng {alertLevels.length} mức cảnh báo
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-animate scale-hover">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm mức cảnh báo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Thêm mức cảnh báo mới</DialogTitle>
                  <DialogDescription>
                    Tạo mức cảnh báo mới cho hệ thống
                  </DialogDescription>
                </DialogHeader>
                <AlertLevelForm />
                <DialogFooter>
                  <Button type="submit" className="w-full" onClick={handleAdd}>Thêm mức cảnh báo</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <AdvancedFilter
              searchPlaceholder="Tìm kiếm mức cảnh báo..."
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
                <TableHead>Mức độ</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Ngưỡng</TableHead>
                <TableHead>Hành động</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLevels.map((level, index) => (
                <TableRow key={level.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                  <TableCell>
                    <Badge variant="outline" className={getLevelColor(level.level)}>
                      {level.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{level.name}</TableCell>
                  <TableCell>{level.threshold}%</TableCell>
                  <TableCell>{level.action}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleEdit(level)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleDeleteClick(level)}>
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
            <DialogTitle>Chỉnh sửa mức cảnh báo</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin mức cảnh báo
            </DialogDescription>
          </DialogHeader>
          <AlertLevelForm />
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
              Bạn có chắc chắn muốn xóa mức cảnh báo <strong>{selectedLevel?.name}</strong>? 
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
