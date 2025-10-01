import { Badge } from '../ui/badge';
import { DataTable } from '../common/DataTable';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const mockRegions = [
  { 
    id: 1, 
    name: 'Miền Bắc', 
    code: 'MB', 
    type: 'Geographic', 
    status: 'active',
    deviceCount: 145,
    description: 'Khu vực miền Bắc Việt Nam',
    parentRegion: null,
    timezone: 'UTC+7'
  },
  { 
    id: 2, 
    name: 'Hà Nội', 
    code: 'HN', 
    type: 'Administrative', 
    status: 'active',
    deviceCount: 89,
    description: 'Thành phố Hà Nội',
    parentRegion: 'Miền Bắc',
    timezone: 'UTC+7'
  },
  { 
    id: 3, 
    name: 'Datacenter HN-01', 
    code: 'DC-HN01', 
    type: 'Facility', 
    status: 'active',
    deviceCount: 56,
    description: 'Trung tâm dữ liệu Hà Nội 01',
    parentRegion: 'Hà Nội',
    timezone: 'UTC+7'
  },
  { 
    id: 4, 
    name: 'Miền Nam', 
    code: 'MN', 
    type: 'Geographic', 
    status: 'active',
    deviceCount: 201,
    description: 'Khu vực miền Nam Việt Nam',
    parentRegion: null,
    timezone: 'UTC+7'
  },
  { 
    id: 5, 
    name: 'TP. Hồ Chí Minh', 
    code: 'HCM', 
    type: 'Administrative', 
    status: 'active',
    deviceCount: 156,
    description: 'Thành phố Hồ Chí Minh',
    parentRegion: 'Miền Nam',
    timezone: 'UTC+7'
  },
  { 
    id: 6, 
    name: 'Office Floor 1', 
    code: 'OF-F1', 
    type: 'Building', 
    status: 'maintenance',
    deviceCount: 23,
    description: 'Tầng 1 tòa nhà văn phòng',
    parentRegion: 'TP. Hồ Chí Minh',
    timezone: 'UTC+7'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'inactive': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    case 'maintenance': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'Hoạt động';
    case 'inactive': return 'Không hoạt động';
    case 'maintenance': return 'Bảo trì';
    default: return 'Không xác định';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Geographic': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'Administrative': return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'Facility': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    case 'Building': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const columns = [
  {
    key: 'name',
    title: 'Tên khu vực'
  },
  {
    key: 'code',
    title: 'Mã khu vực',
    render: (value: string) => (
      <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
        {value}
      </code>
    )
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
    key: 'status',
    title: 'Trạng thái',
    render: (value: string) => (
      <Badge variant="outline" className={getStatusColor(value)}>
        {getStatusText(value)}
      </Badge>
    )
  },
  {
    key: 'deviceCount',
    title: 'Số thiết bị'
  },
  {
    key: 'parentRegion',
    title: 'Khu vực cha',
    render: (value: string | null) => value || 'Không có'
  },
  {
    key: 'description',
    title: 'Mô tả'
  }
];

const renderForm = () => (
  <div className="space-y-4 py-4">
    <div className="space-y-2">
      <Label htmlFor="region-name">
        Tên khu vực
      </Label>
      <Input id="region-name" placeholder="Nhập tên khu vực" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="region-code">
        Mã khu vực
      </Label>
      <Input id="region-code" placeholder="VD: HN, HCM" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="region-type">
        Loại khu vực
      </Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Chọn loại khu vực" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="geographic">Geographic</SelectItem>
          <SelectItem value="administrative">Administrative</SelectItem>
          <SelectItem value="facility">Facility</SelectItem>
          <SelectItem value="building">Building</SelectItem>
          <SelectItem value="floor">Floor</SelectItem>
          <SelectItem value="room">Room</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="region-status">
        Trạng thái
      </Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Chọn trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Hoạt động</SelectItem>
          <SelectItem value="inactive">Không hoạt động</SelectItem>
          <SelectItem value="maintenance">Bảo trì</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="parent-region">
        Khu vực cha
      </Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Chọn khu vực cha (tùy chọn)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Không có</SelectItem>
          <SelectItem value="mien-bac">Miền Bắc</SelectItem>
          <SelectItem value="mien-nam">Miền Nam</SelectItem>
          <SelectItem value="ha-noi">Hà Nội</SelectItem>
          <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="region-timezone">
        Múi giờ
      </Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Chọn múi giờ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="utc+7">UTC+7 (Việt Nam)</SelectItem>
          <SelectItem value="utc+0">UTC+0 (GMT)</SelectItem>
          <SelectItem value="utc+8">UTC+8</SelectItem>
          <SelectItem value="utc+9">UTC+9</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="region-description">
        Mô tả
      </Label>
      <Textarea id="region-description" placeholder="Nhập mô tả" rows={3} />
    </div>
  </div>
);

export function RegionManagement() {
  return (
    <DataTable
      title="Danh mục khu vực"
      description="Quản lý phân chia địa lý và khu vực của hệ thống"
      data={mockRegions}
      columns={columns}
      searchKey="name"
      onAdd={() => console.log('Add region')}
      onEdit={(record) => console.log('Edit region', record)}
      onDelete={(record) => console.log('Delete region', record)}
      onView={(record) => console.log('View region', record)}
      renderForm={renderForm}
    />
  );
}