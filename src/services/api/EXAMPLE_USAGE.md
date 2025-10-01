# Ví dụ Sử dụng API Services

## Ví dụ 1: UserManagement Component

Đây là ví dụ cách refactor UserManagement component để sử dụng API service:

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

  // ... rest of component
}
```

## Ví dụ 2: DeviceManagement với useApi Hook

```typescript
import { useState, useEffect } from 'react';
import { devicesService } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { toast } from 'sonner@2.0.3';

export function DeviceManagement() {
  // Sử dụng useApi hook
  const { 
    data: devices, 
    loading, 
    execute: fetchDevices 
  } = useApi(devicesService.getAll, {
    onError: (error) => toast.error('Lỗi khi tải danh sách thiết bị')
  });

  const {
    execute: createDevice,
    loading: creating
  } = useApi(devicesService.create, {
    onSuccess: () => {
      toast.success('Thêm thiết bị thành công!');
      fetchDevices(); // Refresh list
      setIsDialogOpen(false);
    },
    onError: () => toast.error('Lỗi khi thêm thiết bị')
  });

  const {
    execute: updateDevice,
    loading: updating
  } = useApi(devicesService.update, {
    onSuccess: () => {
      toast.success('Cập nhật thiết bị thành công!');
      fetchDevices(); // Refresh list
      setIsEditDialogOpen(false);
    },
    onError: () => toast.error('Lỗi khi cập nhật thiết bị')
  });

  const {
    execute: deleteDevice,
    loading: deleting
  } = useApi(devicesService.delete, {
    onSuccess: () => {
      toast.success('Xóa thiết bị thành công!');
      fetchDevices(); // Refresh list
      setIsDeleteDialogOpen(false);
    },
    onError: () => toast.error('Lỗi khi xóa thiết bị')
  });

  // Load data on mount
  useEffect(() => {
    fetchDevices();
  }, []);

  const handleAdd = () => {
    createDevice(formData);
  };

  const handleUpdate = () => {
    updateDevice(selectedDevice.id, formData);
  };

  const handleDelete = () => {
    deleteDevice(selectedDevice.id);
  };

  // ... rest of component
}
```

## Ví dụ 3: Sử dụng với React Query (Optional)

Nếu muốn sử dụng React Query để cache và manage state tốt hơn:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { devicesService } from '../../services/api';
import { toast } from 'sonner@2.0.3';

export function DeviceManagement() {
  const queryClient = useQueryClient();

  // Fetch devices
  const { data: devices, isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: devicesService.getAll
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: devicesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Thêm thiết bị thành công!');
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error('Lỗi khi thêm thiết bị');
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      devicesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Cập nhật thiết bị thành công!');
      setIsEditDialogOpen(false);
    },
    onError: () => {
      toast.error('Lỗi khi cập nhật thiết bị');
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: devicesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Xóa thiết bị thành công!');
      setIsDeleteDialogOpen(false);
    },
    onError: () => {
      toast.error('Lỗi khi xóa thiết bị');
    }
  });

  const handleAdd = () => {
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    updateMutation.mutate({ 
      id: selectedDevice.id, 
      data: formData 
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(selectedDevice.id);
  };

  // ... rest of component
}
```

## Ví dụ 4: Error Handling Chi tiết

```typescript
const handleCreate = async () => {
  try {
    const newDevice = await devicesService.create(formData);
    setDevices([...devices, newDevice]);
    toast.success('Thêm thiết bị thành công!');
  } catch (error: any) {
    // Handle specific error codes
    if (error.response?.status === 409) {
      toast.error('Thiết bị với IP này đã tồn tại');
    } else if (error.response?.status === 422) {
      // Validation errors
      const errors = error.response.data.errors;
      Object.keys(errors).forEach(key => {
        toast.error(`${key}: ${errors[key]}`);
      });
    } else if (error.response?.status >= 500) {
      toast.error('Lỗi server, vui lòng thử lại sau');
    } else {
      toast.error('Có lỗi xảy ra khi thêm thiết bị');
    }
  }
};
```

## Ví dụ 5: Loading States

```typescript
export function DeviceManagement() {
  const [loading, setLoading] = useState({
    list: false,
    create: false,
    update: false,
    delete: false
  });

  const handleAdd = async () => {
    try {
      setLoading(prev => ({ ...prev, create: true }));
      const newDevice = await devicesService.create(formData);
      setDevices([...devices, newDevice]);
      toast.success('Thêm thiết bị thành công!');
    } catch (error) {
      toast.error('Lỗi khi thêm thiết bị');
    } finally {
      setLoading(prev => ({ ...prev, create: false }));
    }
  };

  return (
    <div>
      {/* Show loading spinner */}
      {loading.list && <Spinner />}
      
      {/* Disable button while creating */}
      <Button 
        onClick={handleAdd} 
        disabled={loading.create}
      >
        {loading.create ? 'Đang tạo...' : 'Thêm thiết bị'}
      </Button>
    </div>
  );
}
```

## Best Practices

1. **Always handle errors**: Wrap API calls trong try-catch
2. **Show loading states**: Hiển thị loading indicator khi fetching
3. **Toast notifications**: Thông báo cho user về success/error
4. **Refresh data**: Refresh list sau khi create/update/delete
5. **Validation**: Validate form data trước khi gọi API
6. **Type safety**: Sử dụng TypeScript interfaces
7. **Cleanup**: Reset form và close dialogs sau khi success
