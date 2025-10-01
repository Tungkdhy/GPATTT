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
import { Checkbox } from '../ui/checkbox';
import { AdvancedFilter, FilterOption } from '../common/AdvancedFilter';
import { Plus, Edit, Trash2, Play, Zap } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const mockScenarios = [
  { id: 1, name: 'DDoS Protection', trigger: 'Traffic threshold exceeded', actions: ['Block IP', 'Notify admin', 'Update firewall'], priority: 'high', autoExecute: true, status: 'active' },
  { id: 2, name: 'Malware Detection', trigger: 'Malware signature detected', actions: ['Quarantine file', 'Scan system', 'Alert security'], priority: 'critical', autoExecute: true, status: 'active' },
  { id: 3, name: 'Unauthorized Access', trigger: 'Failed login attempts > 5', actions: ['Lock account', 'Send email', 'Log event'], priority: 'high', autoExecute: false, status: 'active' },
  { id: 4, name: 'System Backup', trigger: 'Daily at 2:00 AM', actions: ['Backup database', 'Verify integrity', 'Upload to cloud'], priority: 'medium', autoExecute: true, status: 'inactive' },
];

export function ResponseScenarios() {
  const [scenarios, setScenarios] = useState(mockScenarios);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    trigger: '',
    actions: '',
    priority: '',
    autoExecute: false
  });

  const filterOptions: FilterOption[] = [
    {
      key: 'priority',
      label: 'Ưu tiên',
      type: 'select',
      options: [
        { value: 'low', label: 'Thấp' },
        { value: 'medium', label: 'Trung bình' },
        { value: 'high', label: 'Cao' },
        { value: 'critical', label: 'Nghiêm trọng' }
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

  const filteredScenarios = scenarios.filter(scenario => {
    const matchesSearch = scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.trigger.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !filters.priority || scenario.priority === filters.priority;
    const matchesStatus = !filters.status || scenario.status === filters.status;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const handleAdd = () => {
    const newScenario = {
      id: scenarios.length + 1,
      name: formData.name,
      trigger: formData.trigger,
      actions: formData.actions.split(',').map(a => a.trim()),
      priority: formData.priority,
      autoExecute: formData.autoExecute,
      status: 'active'
    };
    setScenarios([...scenarios, newScenario]);
    setIsDialogOpen(false);
    setFormData({ name: '', trigger: '', actions: '', priority: '', autoExecute: false });
    toast.success('Thêm kịch bản thành công!');
  };

  const handleEdit = (scenario: any) => {
    setSelectedScenario(scenario);
    setFormData({
      name: scenario.name,
      trigger: scenario.trigger,
      actions: scenario.actions.join(', '),
      priority: scenario.priority,
      autoExecute: scenario.autoExecute
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    setScenarios(scenarios.map(s => s.id === selectedScenario.id ? {
      ...s,
      name: formData.name,
      trigger: formData.trigger,
      actions: formData.actions.split(',').map(a => a.trim()),
      priority: formData.priority,
      autoExecute: formData.autoExecute
    } : s));
    setIsEditDialogOpen(false);
    setSelectedScenario(null);
    setFormData({ name: '', trigger: '', actions: '', priority: '', autoExecute: false });
    toast.success('Cập nhật kịch bản thành công!');
  };

  const handleDeleteClick = (scenario: any) => {
    setSelectedScenario(scenario);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    setScenarios(scenarios.filter(s => s.id !== selectedScenario.id));
    setIsDeleteDialogOpen(false);
    setSelectedScenario(null);
    toast.success('Xóa kịch bản thành công!');
  };

  const handleExecute = (scenario: any) => {
    toast.success(`Đang thực thi kịch bản: ${scenario.name}`);
  };

  const ScenarioForm = () => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Tên kịch bản</Label>
        <Input 
          id="name" 
          placeholder="VD: DDoS Protection" 
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="trigger">Điều kiện kích hoạt</Label>
        <Input 
          id="trigger" 
          placeholder="VD: Traffic threshold exceeded" 
          value={formData.trigger}
          onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="actions">Hành động (phân cách bằng dấu phẩy)</Label>
        <Textarea 
          id="actions" 
          placeholder="VD: Block IP, Notify admin, Update firewall" 
          value={formData.actions}
          onChange={(e) => setFormData({ ...formData, actions: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="priority">Độ ưu tiên</Label>
        <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn độ ưu tiên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Thấp</SelectItem>
            <SelectItem value="medium">Trung bình</SelectItem>
            <SelectItem value="high">Cao</SelectItem>
            <SelectItem value="critical">Nghiêm trọng</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox 
          id="autoExecute" 
          checked={formData.autoExecute}
          onCheckedChange={(checked) => setFormData({ ...formData, autoExecute: checked as boolean })}
        />
        <label htmlFor="autoExecute" className="text-sm cursor-pointer">
          Tự động thực thi khi kích hoạt
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Cấu hình kịch bản phản ứng</h1>
        <p className="text-muted-foreground">
          Quản lý các kịch bản tự động phản ứng với sự cố bảo mật
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách kịch bản</CardTitle>
              <CardDescription>
                Tổng cộng {scenarios.length} kịch bản phản ứng
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-animate scale-hover">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm kịch bản
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Thêm kịch bản mới</DialogTitle>
                  <DialogDescription>
                    Tạo kịch bản phản ứng tự động mới
                  </DialogDescription>
                </DialogHeader>
                <ScenarioForm />
                <DialogFooter>
                  <Button type="submit" className="w-full" onClick={handleAdd}>Thêm kịch bản</Button>
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
                <TableHead>Điều kiện kích hoạt</TableHead>
                <TableHead>Hành động</TableHead>
                <TableHead>Ưu tiên</TableHead>
                <TableHead>Tự động</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScenarios.map((scenario, index) => (
                <TableRow key={scenario.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                  <TableCell className="font-medium">{scenario.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{scenario.trigger}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {scenario.actions.slice(0, 2).map((action, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                      {scenario.actions.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{scenario.actions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getPriorityColor(scenario.priority)}>
                      {scenario.priority === 'low' ? 'Thấp' :
                       scenario.priority === 'medium' ? 'Trung bình' :
                       scenario.priority === 'high' ? 'Cao' : 'Nghiêm trọng'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {scenario.autoExecute ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        <Zap className="h-3 w-3 mr-1" />
                        Bật
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
                        Tắt
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="scale-hover" 
                        onClick={() => handleExecute(scenario)}
                        title="Thực thi ngay"
                      >
                        <Play className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleEdit(scenario)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleDeleteClick(scenario)}>
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
            <DialogTitle>Chỉnh sửa kịch bản</DialogTitle>
            <DialogDescription>
              Cập nhật cấu hình kịch bản phản ứng
            </DialogDescription>
          </DialogHeader>
          <ScenarioForm />
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
              Bạn có chắc chắn muốn xóa kịch bản <strong>{selectedScenario?.name}</strong>? 
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
