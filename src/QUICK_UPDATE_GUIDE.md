# Hướng Dẫn Nhanh: Cập Nhật Tất Cả Trang Sử Dụng API Services

## ✅ Đã hoàn thành
- ✅ Tạo 23 API services cho 23 trang
- ✅ Cấu hình TypeScript với path aliases
- ✅ Cập nhật UserManagement.tsx làm mẫu
- ✅ Tạo tài liệu hướng dẫn chi tiết

## 📋 Danh sách cần cập nhật (22 trang còn lại)

Mỗi trang cần 5 thay đổi đơn giản:

### Bước 1: Import service (thêm vào đầu file)
```typescript
import { useState, useEffect } from 'react';
import { [SERVICE_NAME] } from '../../services/api';
```

### Bước 2: Xóa mock data và thêm useEffect
```typescript
// XÓA dòng này:
const mockData = [...];

// THAY THẾ:
const [data, setData] = useState(mockData);

// BẰNG:
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    setLoading(true);
    const result = await [SERVICE_NAME].getAll();
    setData(result);
  } catch (error) {
    toast.error('Lỗi khi tải dữ liệu');
  } finally {
    setLoading(false);
  }
};
```

### Bước 3-5: Cập nhật CRUD functions

**handleAdd → async handleAdd**
```typescript
const handleAdd = async () => {
  try {
    const newItem = await [SERVICE_NAME].create(formData);
    setData([...data, newItem]);
    // ... rest remains same
    toast.success('Thêm thành công!');
  } catch (error) {
    toast.error('Lỗi khi thêm');
  }
};
```

**handleUpdate → async handleUpdate**
```typescript
const handleUpdate = async () => {
  try {
    const updatedItem = await [SERVICE_NAME].update(selectedItem.id, formData);
    setData(data.map(item => item.id === selectedItem.id ? updatedItem : item));
    // ... rest remains same
    toast.success('Cập nhật thành công!');
  } catch (error) {
    toast.error('Lỗi khi cập nhật');
  }
};
```

**handleDelete → async handleDelete**
```typescript
const handleDelete = async () => {
  try {
    await [SERVICE_NAME].delete(selectedItem.id);
    setData(data.filter(item => item.id !== selectedItem.id));
    // ... rest remains same
    toast.success('Xóa thành công!');
  } catch (error) {
    toast.error('Lỗi khi xóa');
  }
};
```

## 🗺️ Mapping Table - Copy & Paste Ready

| File | Service Import | Data State | Mock Var to Delete |
|------|----------------|------------|-------------------|
| `DeviceManagement.tsx` | `devicesService` | `devices` | `mockDevices` |
| `DeviceTypes.tsx` | `deviceTypesService` | `deviceTypes` | `mockDeviceTypes` |
| `ScenarioManagement.tsx` | `scenariosService` | `scenarios` | `mockScenarios` |
| `SoftwareVersions.tsx` | `softwareVersionsService` | `versions` | `mockVersions` |
| `LogAddresses.tsx` | `logAddressesService` | `logAddresses` | `mockLogAddresses` |
| `AccountPermissions.tsx` | `accountPermissionsService` | `permissions` | `mockPermissions` |
| `BlacklistIPs.tsx` | `blacklistIPsService` | `blacklistIPs` | `mockBlacklistIPs` |
| `WhitelistIPs.tsx` | `whitelistIPsService` | `whitelistIPs` | `mockWhitelistIPs` |
| `LogTypes.tsx` | `logTypesService` | `logTypes` | `mockLogTypes` |
| `LogList.tsx` | `logsService` | `logs` | `mockLogs` |
| `AlertLevels.tsx` | `alertLevelsService` | `alertLevels` | `mockAlertLevels` |
| `ScenarioLogs.tsx` | `scenarioLogsService` | `scenarioLogs` | `mockScenarioLogs` |
| `SystemParams.tsx` | `systemParamsService` | `params` | `mockParams` |
| `InsecureDevices.tsx` | `insecureDevicesService` | `devices` | `mockDevices` |
| `ResponseScenarios.tsx` | `responseScenariosService` | `scenarios` | `mockScenarios` |
| `FirewallConfigs.tsx` | `firewallConfigsService` | `configs` | `mockConfigs` |
| `SystemLogs.tsx` | `systemLogsService` | `logs` | `mockLogs` |
| `MalwareHashes.tsx` | `malwareHashesService` | `hashes` | `mockHashes` |
| `MalwareTypes.tsx` | `malwareTypesService` | `types` | `mockTypes` |
| `ErrorCodes.tsx` | `errorCodesService` | `codes` | `mockCodes` |
| `RegionManagement.tsx` | `regionManagementService` | `regions` | `mockRegions` |

## 📝 Ví dụ cụ thể: DeviceManagement.tsx

**Tìm và thay thế:**

1. **Import section:**
```typescript
// THÊM dòng này sau import { useState }:
import { useState, useEffect } from 'react';
import { devicesService } from '../../services/api';
```

2. **Xóa mock data:**
```typescript
// XÓA dòng này:
const mockDevices = [
  { id: 1, name: 'Server-001', ... },
  ...
];
```

3. **Thay state initialization:**
```typescript
// THAY:
const [devices, setDevices] = useState(mockDevices);

// BẰNG:
const [devices, setDevices] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchDevices();
}, []);

const fetchDevices = async () => {
  try {
    setLoading(true);
    const result = await devicesService.getAll();
    setDevices(result);
  } catch (error) {
    toast.error('Lỗi khi tải danh sách thiết bị');
  } finally {
    setLoading(false);
  }
};
```

4. **Cập nhật handleAdd:**
```typescript
const handleAdd = async () => {
  try {
    const newDevice = await devicesService.create(formData);
    setDevices([...devices, newDevice]);
    setIsDialogOpen(false);
    setFormData({ /* reset */ });
    toast.success('Thêm thiết bị thành công!');
  } catch (error) {
    toast.error('Lỗi khi thêm thiết bị');
  }
};
```

5. **Cập nhật handleUpdate:**
```typescript
const handleUpdate = async () => {
  try {
    const updatedDevice = await devicesService.update(selectedDevice.id, formData);
    setDevices(devices.map(d => d.id === selectedDevice.id ? updatedDevice : d));
    setIsEditDialogOpen(false);
    setSelectedDevice(null);
    setFormData({ /* reset */ });
    toast.success('Cập nhật thiết bị thành công!');
  } catch (error) {
    toast.error('Lỗi khi cập nhật thiết bị');
  }
};
```

6. **Cập nhật handleDelete:**
```typescript
const handleDelete = async () => {
  try {
    await devicesService.delete(selectedDevice.id);
    setDevices(devices.filter(d => d.id !== selectedDevice.id));
    setIsDeleteDialogOpen(false);
    setSelectedDevice(null);
    toast.success('Xóa thiết bị thành công!');
  } catch (error) {
    toast.error('Lỗi khi xóa thiết bị');
  }
};
```

## ⚡ Quick Checklist cho Mỗi File

- [ ] Import `useEffect` từ react
- [ ] Import service từ `../../services/api`
- [ ] Xóa mock data constant
- [ ] Thêm `loading` state
- [ ] Thêm `useEffect` và `fetchData` function
- [ ] Thêm `async` vào `handleAdd` và wrap trong try-catch
- [ ] Thêm `async` vào `handleUpdate` và wrap trong try-catch
- [ ] Thêm `async` vào `handleDelete` và wrap trong try-catch
- [ ] Test trang xem có hoạt động không

## 🎯 Lưu ý quan trọng

1. **Không thay đổi UI**: Chỉ thay đổi data fetching logic
2. **Giữ nguyên filter/search**: Chúng vẫn hoạt động với state
3. **Toast messages**: Đảm bảo có import toast
4. **formData reset**: Giữ nguyên logic reset hiện tại
5. **selectedItem variables**: Tên biến khác nhau cho mỗi page (xem mapping table)

## 🚀 Sẵn sàng chuyển sang Real API

Khi backend sẵn sàng, chỉ cần:
1. Mở file service tương ứng trong `/services/api/`
2. Uncomment các dòng API call thật
3. Comment/xóa mock data return
4. Cập nhật BASE_URL trong `axiosInstance.ts`

Ví dụ trong `users.service.ts`:
```typescript
async getAll(): Promise<User[]> {
  // Uncomment dòng này:
  const response = await axiosInstance.get(API_ENDPOINTS.USERS.LIST);
  return response.data;
  
  // Xóa/comment mock return:
  // return new Promise((resolve) => {
  //   setTimeout(() => resolve(mockUsers), 500);
  // });
}
```

## 📚 Tài liệu chi tiết

- `/services/api/README.md` - Overview và basic usage
- `/services/api/EXAMPLE_USAGE.md` - Ví dụ chi tiết
- `/services/api/UPDATE_GUIDE.md` - Pattern cập nhật
- `/BULK_UPDATE_INSTRUCTIONS.md` - Hướng dẫn cập nhật hàng loạt

**Good luck! 🎉**
