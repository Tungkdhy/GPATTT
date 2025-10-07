# Hướng dẫn sử dụng Script Categories

## Tổng quan
Component Script Categories được tạo để quản lý các danh mục kịch bản với API endpoint:
```
GET {{base_url}}/api/v1/category?scope=SCRIPT&pageSize={{pageSize}}&pageIndex={{pageIndex}}
```

## Cấu trúc dữ liệu

### Response từ API
```json
{
    "statusCode": "10000",
    "message": "success",
    "data": {
        "count": 66,
        "rows": [
            {
                "id": "a9be4aa3-f798-459c-b3df-0db110915f7d",
                "category_type_id": "15895c5e-5a4d-463a-8645-c5b368447d26",
                "display_name": "DELETE",
                "value": "DELETE",
                "description": "DELETE",
                "is_default": false,
                "is_active": true,
                "data": null,
                "created_by_user": null
            }
        ]
    }
}
```

### Dữ liệu tạo mới/cập nhật
```json
{
    "category_type_id": "15895c5e-5a4d-463a-8645-c5b368447d26",
    "display_name": "TEST CAT",
    "value": "TEST CAT",
    "data": {
        "type": "bruteforce",
        "status": "Thấp"
    }
}
```

## Tính năng

### 1. Hiển thị danh sách
- Hiển thị tất cả danh mục kịch bản với phân trang
- Hiển thị thông tin: tên hiển thị, giá trị, mô tả, loại danh mục, trạng thái mặc định, trạng thái hoạt động, dữ liệu bổ sung

### 2. Thêm mới
- Form thêm mới với các trường:
  - ID Loại danh mục
  - Tên hiển thị
  - Giá trị
  - Mô tả
  - Dữ liệu bổ sung (key-value pairs)

### 3. Chỉnh sửa
- Form chỉnh sửa tương tự form thêm mới
- Tự động điền dữ liệu hiện tại

### 4. Xóa
- Xác nhận trước khi xóa
- Hiển thị tên danh mục trong dialog xác nhận

### 5. Quản lý dữ liệu bổ sung
- Thêm/xóa các cặp key-value
- Hiển thị preview dữ liệu JSON
- Hỗ trợ dữ liệu phức tạp như `{"type": "bruteforce", "status": "Thấp"}`

## Cách sử dụng

1. Truy cập menu "Danh mục kịch bản Script" trong sidebar
2. Xem danh sách các danh mục hiện có
3. Sử dụng nút "Thêm danh mục" để tạo mới
4. Click vào icon Edit để chỉnh sửa
5. Click vào icon Trash để xóa (có xác nhận)

## API Endpoints

- `GET /api/v1/category?scope=SCRIPT` - Lấy danh sách
- `POST /api/v1/category` - Tạo mới
- `PUT /api/v1/category/{id}` - Cập nhật
- `DELETE /api/v1/category/{id}` - Xóa

## Lưu ý

- Component sử dụng `useServerPagination` hook để xử lý phân trang
- Dữ liệu được validate trước khi gửi API
- Có thông báo toast cho các hành động thành công/thất bại
- Hỗ trợ responsive design
