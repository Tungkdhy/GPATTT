import { Badge } from '../ui/badge';
import { DataTable } from '../common/DataTable';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const mockConfigs = [
  { id: 1, name: 'Standard Security', type: 'Inbound', protocol: 'TCP/UDP', ports: '80,443,22', action: 'allow', priority: 100, description: 'Cấu hình bảo mật chuẩn' },
  { id: 2, name: 'Block Malicious', type: 'Outbound', protocol: 'ALL', ports: '*', action: 'deny', priority: 1, description: 'Chặn kết nối độc hại' },
  { id: 3, name: 'Database Access', type: 'Inbound', protocol: 'TCP', ports: '3306,5432', action: 'allow', priority: 50, description: 'Cho phép truy cập database' },
  { id: 4, name: 'VPN Access', type: 'Inbound', protocol: 'UDP', ports: '1194', action: 'allow', priority: 75, description: 'Kết nối VPN' },
  { id: 5, name: 'Admin Management', type: 'Inbound', protocol: 'TCP', ports: '8080,9090', action: 'allow', priority: 25, description: 'Giao diện quản trị' },
];

const getActionColor = (action: string) => {
  switch (action) {
    case 'allow': return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'deny': return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'log': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const getActionText = (action: string) => {
  switch (action) {
    case 'allow': return 'Cho phép';
    case 'deny': return 'Từ chối';
    case 'log': return 'Ghi log';
    default: return 'Không xác định';
  }
};

const getTypeColor = (type: string) => {
  return type === 'Inbound' 
    ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    : 'bg-orange-500/10 text-orange-500 border-orange-500/20';
};

const columns = [
  {
    key: 'name',
    title: 'Tên cấu hình'
  },
  {
    key: 'type',
    title: 'Loại',
    render: (value: string) => (
      <Badge variant="outline" className={getTypeColor(value)}>
        {value}
      </Badge>
    )
  },
  {
    key: 'protocol',
    title: 'Protocol'
  },
  {
    key: 'ports',
    title: 'Cổng'
  },
  {
    key: 'action',
    title: 'Hành động',
    render: (value: string) => (
      <Badge variant="outline" className={getActionColor(value)}>
        {getActionText(value)}
      </Badge>
    )
  },
  {
    key: 'priority',
    title: 'Ưu tiên'
  },
  {
    key: 'description',
    title: 'Mô tả'
  }
];

const renderForm = () => (
  <div className="space-y-4 py-4">
    <div className="space-y-2">
      <Label htmlFor="config-name">
        Tên cấu hình
      </Label>
      <Input id="config-name" placeholder="Nhập tên cấu hình" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="config-type">
        Loại
      </Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Chọn loại" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="inbound">Inbound</SelectItem>
          <SelectItem value="outbound">Outbound</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="config-protocol">
        Protocol
      </Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Chọn protocol" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tcp">TCP</SelectItem>
          <SelectItem value="udp">UDP</SelectItem>
          <SelectItem value="tcp-udp">TCP/UDP</SelectItem>
          <SelectItem value="all">ALL</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="config-ports">
        Cổng
      </Label>
      <Input id="config-ports" placeholder="80,443,22 hoặc *" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="config-action">
        Hành động
      </Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Chọn hành động" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="allow">Cho phép</SelectItem>
          <SelectItem value="deny">Từ chối</SelectItem>
          <SelectItem value="log">Ghi log</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="config-priority">
        Ưu tiên
      </Label>
      <Input id="config-priority" type="number" placeholder="1-100" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="config-description">
        Mô tả
      </Label>
      <Textarea id="config-description" placeholder="Nhập mô tả" rows={3} />
    </div>
  </div>
);

export function FirewallConfigs() {
  return (
    <DataTable
      title="Quản lý loại cấu hình tường lửa"
      description="Quản lý các cấu hình và quy tắc tường lửa"
      data={mockConfigs}
      columns={columns}
      searchKey="name"
      onAdd={() => console.log('Add config')}
      onEdit={(record) => console.log('Edit config', record)}
      onDelete={(record) => console.log('Delete config', record)}
      onView={(record) => console.log('View config', record)}
      renderForm={renderForm}
    />
  );
}