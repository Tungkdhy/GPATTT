# Hướng dẫn Cập nhật Components để Sử dụng API Services

## Pattern chung để cập nhật

### 1. Import service và thêm useEffect

**Thay thế:**
```typescript
import { useState } from 'react';

const mockData = [
  // ... mock data
];

export function ComponentName() {
  const [data, setData] = useState(mockData);
```

**Bằng:**
```typescript
import { useState, useEffect } from 'react';
import { serviceNameService } from '../../services/api';
import { toast } from 'sonner@2.0.3';

export function ComponentName() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await serviceNameService.getAll();
      setData(result);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };
```

### 2. Cập nhật hàm handleAdd

**Thay thế:**
```typescript
const handleAdd = () => {
  const newItem = {
    id: data.length + 1,
    ...formData,
    // other fields
  };
  setData([...data, newItem]);
  setIsDialogOpen(false);
  setFormData(/* reset */);
  toast.success('Thêm thành công!');
};
```

**Bằng:**
```typescript
const handleAdd = async () => {
  try {
    const newItem = await serviceNameService.create(formData);
    setData([...data, newItem]);
    setIsDialogOpen(false);
    setFormData(/* reset */);
    toast.success('Thêm thành công!');
  } catch (error) {
    toast.error('Lỗi khi thêm');
  }
};
```

### 3. Cập nhật hàm handleUpdate

**Thay thế:**
```typescript
const handleUpdate = () => {
  setData(data.map(item => 
    item.id === selectedItem.id ? { ...item, ...formData } : item
  ));
  setIsEditDialogOpen(false);
  setSelectedItem(null);
  setFormData(/* reset */);
  toast.success('Cập nhật thành công!');
};
```

**Bằng:**
```typescript
const handleUpdate = async () => {
  try {
    const updatedItem = await serviceNameService.update(selectedItem.id, formData);
    setData(data.map(item => 
      item.id === selectedItem.id ? updatedItem : item
    ));
    setIsEditDialogOpen(false);
    setSelectedItem(null);
    setFormData(/* reset */);
    toast.success('Cập nhật thành công!');
  } catch (error) {
    toast.error('Lỗi khi cập nhật');
  }
};
```

### 4. Cập nhật hàm handleDelete

**Thay thế:**
```typescript
const handleDelete = () => {
  setData(data.filter(item => item.id !== selectedItem.id));
  setIsDeleteDialogOpen(false);
  setSelectedItem(null);
  toast.success('Xóa thành công!');
};
```

**Bằng:**
```typescript
const handleDelete = async () => {
  try {
    await serviceNameService.delete(selectedItem.id);
    setData(data.filter(item => item.id !== selectedItem.id));
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
    toast.success('Xóa thành công!');
  } catch (error) {
    toast.error('Lỗi khi xóa');
  }
};
```

### 5. Thêm loading state vào UI (Optional nhưng recommended)

```typescript
// Trong return statement
{loading ? (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
) : (
  <Table>
    {/* ... table content */}
  </Table>
)}
```

## Mapping Services cho từng Page

| Page Component | Service Name |
|---------------|--------------|
| UserManagement | usersService |
| DeviceManagement | devicesService |
| DeviceTypes | deviceTypesService |
| ScenarioManagement | scenariosService |
| SoftwareVersions | softwareVersionsService |
| LogAddresses | logAddressesService |
| AccountPermissions | accountPermissionsService |
| BlacklistIPs | blacklistIPsService |
| WhitelistIPs | whitelistIPsService |
| LogTypes | logTypesService |
| LogList | logsService |
| AlertLevels | alertLevelsService |
| ScenarioLogs | scenarioLogsService |
| SystemParams | systemParamsService |
| InsecureDevices | insecureDevicesService |
| ResponseScenarios | responseScenariosService |
| FirewallConfigs | firewallConfigsService |
| SystemLogs | systemLogsService |
| MalwareHashes | malwareHashesService |
| MalwareTypes | malwareTypesService |
| ErrorCodes | errorCodesService |
| RegionManagement | regionManagementService |

## Ví dụ đầy đủ: UserManagement

```typescript
import { useState, useEffect } from 'react';
import { usersService } from '../../services/api';
import { toast } from 'sonner@2.0.3';
// ... other imports

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    password: ''
  });

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersService.getAll();
      setUsers(data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const newUser = await usersService.create(formData);
      setUsers([...users, newUser]);
      setIsDialogOpen(false);
      setFormData({ username: '', email: '', role: '', password: '' });
      toast.success('Thêm người dùng thành công!');
    } catch (error) {
      toast.error('Lỗi khi thêm người dùng');
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedUser = await usersService.update(selectedUser.id, {
        username: formData.username,
        email: formData.email,
        role: formData.role
      });
      
      setUsers(users.map(u => u.id === selectedUser.id ? updatedUser : u));
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      setFormData({ username: '', email: '', role: '', password: '' });
      toast.success('Cập nhật người dùng thành công!');
    } catch (error) {
      toast.error('Lỗi khi cập nhật người dùng');
    }
  };

  const handleDelete = async () => {
    try {
      await usersService.delete(selectedUser.id);
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      toast.success('Xóa người dùng thành công!');
    } catch (error) {
      toast.error('Lỗi khi xóa người dùng');
    }
  };

  // ... rest of component (UI remains the same)
}
```

## Lưu ý quan trọng

1. **Xóa mockData constants**: Xóa tất cả `const mockData = [...]` ở đầu file
2. **Import service từ đúng path**: `import { serviceNameService } from '../../services/api';`
3. **Khởi tạo state với array rỗng**: `const [data, setData] = useState([]);`
4. **Thêm useEffect để fetch data**: Luôn fetch data khi component mount
5. **Wrap async functions trong try-catch**: Để handle errors properly
6. **Toast notifications**: Hiển thị thông báo success/error cho user
7. **Loading state**: Thêm loading state để improve UX (optional nhưng recommended)

## Cách áp dụng nhanh

1. Mở file component cần update
2. Tìm `const mockData = [...]` và xóa
3. Import service tương ứng từ bảng mapping
4. Thêm useEffect và fetchData function
5. Cập nhật handleAdd, handleUpdate, handleDelete thành async
6. Test lại các chức năng CRUD
