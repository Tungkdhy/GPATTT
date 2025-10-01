import { Badge } from '../ui/badge';
import { DataTable } from '../common/DataTable';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const mockErrorCodes = [
  { 
    id: 1, 
    code: 'SEC001', 
    name: 'Authentication Failed', 
    category: 'Security', 
    severity: 'high', 
    module: 'Auth Module',
    description: 'Xác thực người dùng thất bại',
    solution: 'Kiểm tra thông tin đăng nhập'
  },
  { 
    id: 2, 
    code: 'NET002', 
    name: 'Connection Timeout', 
    category: 'Network', 
    severity: 'medium', 
    module: 'Network Module',
    description: 'Kết nối mạng bị timeout',
    solution: 'Kiểm tra kết nối mạng và cấu hình firewall'
  },
  { 
    id: 3, 
    code: 'DB003', 
    name: 'Database Connection Error', 
    category: 'Database', 
    severity: 'critical', 
    module: 'Database Module',
    description: 'Không thể kết nối đến cơ sở dữ liệu',
    solution: 'Kiểm tra trạng thái database server'
  },
  { 
    id: 4, 
    code: 'SYS004', 
    name: 'Memory Overflow', 
    category: 'System', 
    severity: 'high', 
    module: 'System Monitor',
    description: 'Bộ nhớ hệ thống bị tràn',
    solution: 'Giải phóng bộ nhớ hoặc tăng RAM'
  },
  { 
    id: 5, 
    code: 'FW005', 
    name: 'Firewall Rule Violation', 
    category: 'Security', 
    severity: 'medium', 
    module: 'Firewall Module',
    description: 'Vi phạm quy tắc tường lửa',
    solution: 'Xem xét và cập nhật quy tắc firewall'
  },
  { 
    id: 6, 
    code: 'LOG006', 
    name: 'Log Write Failed', 
    category: 'System', 
    severity: 'low', 
    module: 'Log Module',
    description: 'Không thể ghi log vào file',
    solution: 'Kiểm tra quyền ghi file và dung lượng ổ đĩa'
  }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const getSeverityText = (severity: string) => {
  switch (severity) {
    case 'critical': return 'Nghiêm trọng';
    case 'high': return 'Cao';
    case 'medium': return 'Trung bình';
    case 'low': return 'Thấp';
    default: return 'Không xác định';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Security': return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'Network': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'Database': return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'System': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const columns = [
  {
    key: 'code',
    title: 'Mã lỗi',
    render: (value: string) => (
      <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
        {value}
      </code>
    )
  },
  {
    key: 'name',
    title: 'Tên lỗi'
  },
  {
    key: 'category',
    title: 'Danh mục',
    render: (value: string) => (
      <Badge variant="outline" className={getCategoryColor(value)}>
        {value}
      </Badge>
    )
  },
  {
    key: 'severity',
    title: 'Mức độ nghiêm trọng',
    render: (value: string) => (
      <Badge variant="outline" className={getSeverityColor(value)}>
        {getSeverityText(value)}
      </Badge>
    )
  },
  {
    key: 'module',
    title: 'Module'
  },
  {
    key: 'description',
    title: 'Mô tả'
  },
  {
    key: 'solution',
    title: 'Giải pháp'
  }
];

const renderForm = () => (
  <div className="space-y-4 py-4">
    <div className="space-y-2">
      <Label htmlFor="error-code">
        Mã lỗi
      </Label>
      <Input id="error-code" placeholder="VD: SEC001" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="error-name">
        Tên lỗi
      </Label>
      <Input id="error-name" placeholder="Nhập tên lỗi" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="error-category">
        Danh mục
      </Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Chọn danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="security">Security</SelectItem>
          <SelectItem value="network">Network</SelectItem>
          <SelectItem value="database">Database</SelectItem>
          <SelectItem value="system">System</SelectItem>
          <SelectItem value="application">Application</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="error-severity">
        Mức độ nghiêm trọng
      </Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Chọn mức độ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="critical">Nghiêm trọng</SelectItem>
          <SelectItem value="high">Cao</SelectItem>
          <SelectItem value="medium">Trung bình</SelectItem>
          <SelectItem value="low">Thấp</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="error-module">
        Module
      </Label>
      <Input id="error-module" placeholder="VD: Auth Module" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="error-description">
        Mô tả
      </Label>
      <Textarea id="error-description" placeholder="Nhập mô tả" rows={2} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="error-solution">
        Giải pháp
      </Label>
      <Textarea id="error-solution" placeholder="Nhập giải pháp" rows={2} />
    </div>
  </div>
);

export function ErrorCodes() {
  return (
    <DataTable
      title="Quản lý mã lỗi"
      description="Quản lý các mã lỗi và giải pháp xử lý trong hệ thống"
      data={mockErrorCodes}
      columns={columns}
      searchKey="code"
      onAdd={() => console.log('Add error code')}
      onEdit={(record) => console.log('Edit error code', record)}
      onDelete={(record) => console.log('Delete error code', record)}
      onView={(record) => console.log('View error code', record)}
      renderForm={renderForm}
    />
  );
}