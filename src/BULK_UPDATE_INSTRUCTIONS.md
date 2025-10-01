# Hướng dẫn cập nhật HÀNG LOẠT tất cả các trang

## Danh sách các thay đổi cần thực hiện cho MỖI trang

### Bước 1: Cập nhật imports (Ở đầu file)

**THAY THẾ:**
```typescript
import { useState } from 'react';
```

**BẰNG:**
```typescript
import { useState, useEffect } from 'react';
import { [SERVICE_NAME] } from '../../services/api';
```

Note: Sử dụng relative path `../../services/api` từ thư mục `/components/pages/`

### Bước 2: Xóa mock data và thêm logic fetch

**XÓA:**
```typescript
const mockData = [...];
```

**THAY THẾ state initialization:**
```typescript
const [data, setData] = useState(mockData);
```

**BẰNG:**
```typescript
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

### Bước 3: Cập nhật handleAdd

**THAY THẾ toàn bộ hàm handleAdd:**
```typescript
const handleAdd = async () => {
  try {
    const newItem = await [SERVICE_NAME].create(formData);
    setData([...data, newItem]);
    setIsDialogOpen(false);
    setFormData(/* reset object */);
    toast.success('Thêm thành công!');
  } catch (error) {
    toast.error('Lỗi khi thêm');
  }
};
```

### Bước 4: Cập nhật handleUpdate

**THAY THẾ toàn bộ hàm handleUpdate:**
```typescript
const handleUpdate = async () => {
  try {
    const updatedItem = await [SERVICE_NAME].update(selectedItem.id, formData);
    setData(data.map(item => item.id === selectedItem.id ? updatedItem : item));
    setIsEditDialogOpen(false);
    setSelectedItem(null);
    setFormData(/* reset object */);
    toast.success('Cập nhật thành công!');
  } catch (error) {
    toast.error('Lỗi khi cập nhật');
  }
};
```

### Bước 5: Cập nhật handleDelete

**THAY THẾ toàn bộ hàm handleDelete:**
```typescript
const handleDelete = async () => {
  try {
    await [SERVICE_NAME].delete(selectedItem.id);
    setData(data.filter(item => item.id !== selectedItem.id));
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
    toast.success('Xóa thành công!');
  } catch (error) {
    toast.error('Lỗi khi xóa');
  }
};
```

## MAPPING CHI TIẾT cho từng trang

| File Path | Mock Variable | State Variable | Service Import | Selected Variable |
|-----------|---------------|----------------|----------------|-------------------|
| `/components/pages/UserManagement.tsx` | `mockUsers` | `users` | `usersService` | `selectedUser` |
| `/components/pages/DeviceManagement.tsx` | `mockDevices` | `devices` | `devicesService` | `selectedDevice` |
| `/components/pages/DeviceTypes.tsx` | `mockDeviceTypes` | `deviceTypes` | `deviceTypesService` | `selectedDeviceType` |
| `/components/pages/ScenarioManagement.tsx` | `mockScenarios` | `scenarios` | `scenariosService` | `selectedScenario` |
| `/components/pages/SoftwareVersions.tsx` | `mockVersions` | `versions` | `softwareVersionsService` | `selectedVersion` |
| `/components/pages/LogAddresses.tsx` | `mockLogAddresses` | `logAddresses` | `logAddressesService` | `selectedLogAddress` |
| `/components/pages/AccountPermissions.tsx` | `mockPermissions` | `permissions` | `accountPermissionsService` | `selectedPermission` |
| `/components/pages/BlacklistIPs.tsx` | `mockBlacklistIPs` | `blacklistIPs` | `blacklistIPsService` | `selectedIP` |
| `/components/pages/WhitelistIPs.tsx` | `mockWhitelistIPs` | `whitelistIPs` | `whitelistIPsService` | `selectedIP` |
| `/components/pages/LogTypes.tsx` | `mockLogTypes` | `logTypes` | `logTypesService` | `selectedLogType` |
| `/components/pages/LogList.tsx` | `mockLogs` | `logs` | `logsService` | `selectedLog` |
| `/components/pages/AlertLevels.tsx` | `mockAlertLevels` | `alertLevels` | `alertLevelsService` | `selectedLevel` |
| `/components/pages/ScenarioLogs.tsx` | `mockScenarioLogs` | `scenarioLogs` | `scenarioLogsService` | `selectedLog` |
| `/components/pages/SystemParams.tsx` | `mockParams` | `params` | `systemParamsService` | `selectedParam` |
| `/components/pages/InsecureDevices.tsx` | `mockDevices` | `devices` | `insecureDevicesService` | `selectedDevice` |
| `/components/pages/ResponseScenarios.tsx` | `mockScenarios` | `scenarios` | `responseScenariosService` | `selectedScenario` |
| `/components/pages/FirewallConfigs.tsx` | `mockConfigs` | `configs` | `firewallConfigsService` | `selectedConfig` |
| `/components/pages/SystemLogs.tsx` | `mockLogs` | `logs` | `systemLogsService` | `selectedLog` |
| `/components/pages/MalwareHashes.tsx` | `mockHashes` | `hashes` | `malwareHashesService` | `selectedHash` |
| `/components/pages/MalwareTypes.tsx` | `mockTypes` | `types` | `malwareTypesService` | `selectedType` |
| `/components/pages/ErrorCodes.tsx` | `mockCodes` | `codes` | `errorCodesService` | `selectedCode` |
| `/components/pages/RegionManagement.tsx` | `mockRegions` | `regions` | `regionManagementService` | `selectedRegion` |

## Template Code cho Mỗi Trang

Sử dụng template này và thay thế các placeholder:
- `[DATA_VAR]` = state variable (e.g., users, devices)
- `[SERVICE_NAME]` = service name (e.g., usersService)
- `[SELECTED_VAR]` = selected variable (e.g., selectedUser)

```typescript
import { useState, useEffect } from 'react';
import { [SERVICE_NAME] } from '../../services/api';
// ... other imports

export function ComponentName() {
  const [[DATA_VAR], set[DATA_VAR]] = useState([]);
  const [loading, setLoading] = useState(false);
  // ... other states

  useEffect(() => {
    fetch[DATA_VAR]();
  }, []);

  const fetch[DATA_VAR] = async () => {
    try {
      setLoading(true);
      const result = await [SERVICE_NAME].getAll();
      set[DATA_VAR](result);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const newItem = await [SERVICE_NAME].create(formData);
      set[DATA_VAR]([[DATA_VAR], newItem]);
      setIsDialogOpen(false);
      setFormData(/* reset */);
      toast.success('Thêm thành công!');
    } catch (error) {
      toast.error('Lỗi khi thêm');
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedItem = await [SERVICE_NAME].update([SELECTED_VAR].id, formData);
      set[DATA_VAR]([DATA_VAR].map(item => item.id === [SELECTED_VAR].id ? updatedItem : item));
      setIsEditDialogOpen(false);
      set[SELECTED_VAR](null);
      setFormData(/* reset */);
      toast.success('Cập nhật thành công!');
    } catch (error) {
      toast.error('Lỗi khi cập nhật');
    }
  };

  const handleDelete = async () => {
    try {
      await [SERVICE_NAME].delete([SELECTED_VAR].id);
      set[DATA_VAR]([DATA_VAR].filter(item => item.id !== [SELECTED_VAR].id));
      setIsDeleteDialogOpen(false);
      set[SELECTED_VAR](null);
      toast.success('Xóa thành công!');
    } catch (error) {
      toast.error('Lỗi khi xóa');
    }
  };

  // ... rest of component
}
```

## Checklist cho MỖI trang

- [ ] Import useEffect và service
- [ ] Xóa mock data constant
- [ ] Thêm loading state
- [ ] Thêm useEffect + fetchData
- [ ] Cập nhật handleAdd thành async
- [ ] Cập nhật handleUpdate thành async
- [ ] Cập nhật handleDelete thành async
- [ ] Test CRUD operations

## Lưu ý

1. **Không thay đổi UI code** - Chỉ thay đổi data fetching và CRUD logic
2. **Giữ nguyên filter và search logic** - Chúng vẫn hoạt động với state
3. **Kiểm tra toast imports** - Đảm bảo có import toast từ sonner
4. **formData reset** - Giữ nguyên logic reset formData hiện tại
