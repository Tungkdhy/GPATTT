# API Services Documentation

## Cấu trúc

```
/services/api/
├── axiosInstance.ts       # Axios instance với interceptors
├── endpoints.ts           # API endpoint constants
├── index.ts              # Export tất cả services
├── users.service.ts      # User API service
├── devices.service.ts    # Device API service
└── ...                   # Các services khác
```

## Cấu hình

### Environment Variables

Tạo file `.env` ở root project:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Axios Instance

Axios instance đã được cấu hình với:
- Base URL từ environment variable
- Timeout: 10 seconds
- Authorization header tự động từ localStorage
- Error handling cho 401, 403, 500 errors

## Sử dụng API Services

### 1. Import service

```typescript
import { usersService, devicesService } from '../../services/api';
```

### 2. Sử dụng trong component

#### Cách 1: Sử dụng trực tiếp

```typescript
import { usersService } from '../../services/api';
import { toast } from 'sonner@2.0.3';

const MyComponent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await usersService.getAll();
        setUsers(data);
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreate = async (userData) => {
    try {
      const newUser = await usersService.create(userData);
      setUsers([...users, newUser]);
      toast.success('Tạo người dùng thành công!');
    } catch (error) {
      toast.error('Lỗi khi tạo người dùng');
    }
  };

  // ...
};
```

#### Cách 2: Sử dụng với useApi hook

```typescript
import { usersService } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { toast } from 'sonner@2.0.3';

const MyComponent = () => {
  const { data, loading, error, execute } = useApi(usersService.getAll, {
    onSuccess: (data) => toast.success('Tải dữ liệu thành công'),
    onError: (error) => toast.error('Lỗi khi tải dữ liệu')
  });

  useEffect(() => {
    execute();
  }, []);

  // ...
};
```

## API Methods

Mỗi service có các methods chuẩn:

### getAll()
Lấy danh sách tất cả records

```typescript
const users = await usersService.getAll();
```

### getById(id)
Lấy thông tin một record theo ID

```typescript
const user = await usersService.getById(1);
```

### create(data)
Tạo record mới

```typescript
const newUser = await usersService.create({
  username: 'john',
  email: 'john@example.com',
  role: 'Admin',
  password: 'password123'
});
```

### update(id, data)
Cập nhật record

```typescript
const updatedUser = await usersService.update(1, {
  email: 'newemail@example.com'
});
```

### delete(id)
Xóa record

```typescript
await usersService.delete(1);
```

## Chuyển từ Mock sang Real API

Khi backend API đã sẵn sàng, uncomment các dòng API thực và comment các dòng mock:

```typescript
// Before (Mock)
async getAll(): Promise<User[]> {
  try {
    // const response = await axiosInstance.get(API_ENDPOINTS.USERS.LIST);
    // return response.data;
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUsers), 500);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// After (Real API)
async getAll(): Promise<User[]> {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.USERS.LIST);
    return response.data;
    
    // return new Promise((resolve) => {
    //   setTimeout(() => resolve(mockUsers), 500);
    // });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}
```

## Error Handling

Axios instance tự động xử lý một số lỗi:

- **401 Unauthorized**: Tự động logout và redirect về trang login
- **403 Forbidden**: Log error
- **500+ Server Error**: Log error

Bạn có thể bắt và xử lý thêm các lỗi khác trong component:

```typescript
try {
  await usersService.create(data);
} catch (error) {
  if (error.response?.status === 409) {
    toast.error('Username đã tồn tại');
  } else if (error.response?.status === 422) {
    toast.error('Dữ liệu không hợp lệ');
  } else {
    toast.error('Có lỗi xảy ra');
  }
}
```

## Thêm Service Mới

1. Tạo file service mới trong `/services/api/`
2. Copy template từ một service hiện có
3. Thay đổi mock data và types
4. Export trong `/services/api/index.ts`

Ví dụ:

```typescript
// /services/api/newModule.service.ts
import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';

const mockData = [
  // ... mock data
];

export interface NewModule {
  id: number;
  name: string;
  // ... other fields
}

class NewModuleService {
  async getAll(): Promise<NewModule[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData), 500);
    });
  }
  
  // ... other methods
}

export default new NewModuleService();
```

## Best Practices

1. **Luôn xử lý lỗi**: Wrap API calls trong try-catch
2. **Show loading state**: Hiển thị loading khi đang fetch data
3. **Toast notifications**: Thông báo success/error cho người dùng
4. **Type safety**: Sử dụng TypeScript types cho request/response
5. **Reusable hooks**: Sử dụng useApi hook để giảm boilerplate code
