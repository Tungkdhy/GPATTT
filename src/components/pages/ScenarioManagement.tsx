import { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { AdvancedFilter, FilterOption } from '../common/AdvancedFilter';
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import categoryService from '../../services/api/category.service';
import categoryTypeService from '../../services/api/categoryType.service';
import { useServerPagination } from '../../hooks/useServerPagination';
import { TablePagination } from '../common/TablePagination';

// TypeScript interfaces
interface Category {
  id: string;
  category_type_id: string;
  display_name: string;
  value: string;
  description: string;
  is_default: boolean;
  is_active: boolean;
  data: any;
  created_by_user: string | null;
}

interface CategoryType {
  id: string;
  name: string;
  display_name: string;
  description: string;
  scope: string;
}

interface CreateCategoryDto {
  category_type_id: string;
  display_name: string;
  value: string;
  data?: any;
}



const getStatusColor = (status: string) => {
  return status === 'active' 
    ? 'bg-green-500/10 text-green-500 border-green-500/20'
    : 'bg-gray-500/10 text-gray-500 border-gray-500/20';
};

export function ScenarioManagement() {
  const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateCategoryDto>({
    category_type_id: '72ef7742-15dd-4fab-878b-de96c9136ef5',
    display_name: '',
    value: '',
    data: {}
  });

  // Fetch function for useServerPagination
  const fetchCategories = async (page: number, limit: number, params: any) => {
    const response = await categoryService.getAllFormat(page, limit, { scope: 'SCRIPT', ...params });
    return response;
  };

  // Use server pagination hook
  const {
    data: categories,
    currentPage,
    totalPages,
    total,
    loading,
    setCurrentPage,
    pageSize,
    refresh
  } = useServerPagination<Category>(
    fetchCategories,
    [searchTerm, filters], // dependencies
    { pageSize: 10, initialPage: 1 },
    { 
      scope: 'SCRIPT', 
      ...filters,
     // Add search term to server params
    }
  );

  // Fetch category types
  const fetchCategoryTypes = async () => {
    try {
      const response = await categoryTypeService.getAll(1, 1000);
      setCategoryTypes(response.rows || []);
    } catch (error) {
      console.error('Error fetching category types:', error);
      toast.error('Lỗi khi tải danh sách loại danh mục');
    }
  };

  // Load category types on component mount
  useEffect(() => {
    fetchCategoryTypes();
  }, []);

  const filterOptions: FilterOption[] = [
    {
      key: 'category_type_id',
      label: 'Loại danh mục',
      type: 'select',
      options: categoryTypes.map(type => ({
        value: type.id,
        label: type.display_name
      }))
    },
    {
      key: 'is_active',
      label: 'Trạng thái',
      type: 'select',
      options: [
        { value: 'true', label: 'Hoạt động' },
        { value: 'false', label: 'Không hoạt động' }
      ]
    }
  ];

  // Since we're using server-side pagination, we don't need client-side filtering
  // The filtering is handled by the server through the useServerPagination hook
  const filteredData = categories;

  const handleAdd = async () => {
    try {
      setIsSubmitting(true);
      await categoryService.create(formData);
      toast.success('Thêm danh mục thành công!');
      setIsDialogOpen(false);
      setFormData({ category_type_id: '72ef7742-15dd-4fab-878b-de96c9136ef5', display_name: '', value: '', data: {} });
      // Force refresh data
      refresh();
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Lỗi khi thêm danh mục');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: Category) => {
    if (!item.id) {
      toast.error('Không thể chỉnh sửa: ID không hợp lệ');
      return;
    }
    
    console.log('Editing category with ID:', item.id);
    setSelectedItem(item);
    setFormData({
      category_type_id: "72ef7742-15dd-4fab-878b-de96c9136ef5",
      display_name: item.display_name,
      value: item.value,
      data: item.data || {}
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedItem || !selectedItem.id) {
      toast.error('Không thể cập nhật: ID không hợp lệ');
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log('Updating category with ID:', selectedItem.id);
      await categoryService.update(selectedItem.id, formData);
      toast.success('Cập nhật danh mục thành công!');
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      setFormData({ category_type_id: '72ef7742-15dd-4fab-878b-de96c9136ef5', display_name: '', value: '', data: {} });
      // Force refresh data
      refresh();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Lỗi khi cập nhật danh mục');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (item: Category) => {
    if (!item.id) {
      toast.error('Không thể xóa: ID không hợp lệ');
      return;
    }
    
    console.log('Preparing to delete category with ID:', item.id);
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedItem || !selectedItem.id) {
      toast.error('Không thể xóa: ID không hợp lệ');
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log('Deleting category with ID:', selectedItem.id);
      await categoryService.delete(selectedItem.id);
      toast.success('Xóa danh mục thành công!');
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      // Force refresh data
      refresh();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Lỗi khi xóa danh mục');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = (data: typeof formData, onChange: (data: typeof formData) => void) => (
    <div className="space-y-4 py-4">
      {/* <div className="space-y-2">
        <Label htmlFor="category-type">Loại danh mục</Label>
        <Select 
          value={data.category_type_id} 
          onValueChange={(value: string) => onChange({ ...data, category_type_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại danh mục" />
          </SelectTrigger>
          <SelectContent>
            {categoryTypes.map(type => (
              <SelectItem key={type.id} value={type.id}>
                {type.display_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}
      <div className="space-y-2">
        <Label htmlFor="display-name">Tên hiển thị</Label>
        <Input 
          id="display-name" 
          placeholder="Nhập tên hiển thị" 
          value={data.display_name}
          onChange={(e) => onChange({ ...data, display_name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="value">Giá trị</Label>
        <Input 
          id="value" 
          placeholder="Nhập giá trị" 
          value={data.value}
          onChange={(e) => onChange({ ...data, value: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="data-type">Loại dữ liệu</Label>
        <Input 
          id="data-type" 
          placeholder="Nhập loại dữ liệu (ví dụ: bruteforce)" 
          value={data.data?.type || ''}
          onChange={(e) => onChange({ 
            ...data, 
            data: { ...data.data, type: e.target.value }
          })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="data-status">Mức độ</Label>
        <Input 
          id="data-status" 
          placeholder="Nhập trạng thái (ví dụ: Thấp)" 
          value={data.data?.status || ''}
          onChange={(e) => onChange({ 
            ...data, 
            data: { ...data.data, status: e.target.value }
          })}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Danh mục kịch bản</h1>
        <p className="text-muted-foreground">
          Quản lý các danh mục kịch bản
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách danh mục</CardTitle>
              <CardDescription>
                Tổng cộng {total} danh mục
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="btn-animate scale-hover"
                onClick={refresh}
                disabled={loading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={(open: boolean) => {
                setIsDialogOpen(open);
                if (open) {
                  // Clear form when opening dialog
                  setFormData({ 
                    category_type_id: '72ef7742-15dd-4fab-878b-de96c9136ef5', 
                    display_name: '', 
                    value: '', 
                    data: {} 
                  });
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="btn-animate scale-hover">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm mới
                  </Button>
                </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Thêm danh mục mới</DialogTitle>
                  <DialogDescription>
                    Tạo danh mục mới cho kịch bản
                  </DialogDescription>
                </DialogHeader>
                {renderForm(formData, setFormData)}
                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    onClick={handleAdd}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Đang thêm...' : 'Thêm'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <AdvancedFilter
              searchPlaceholder="Tìm kiếm danh mục..."
              searchValue={searchTerm}
              onSearchChange={(value) => {
                setSearchTerm(value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              filterOptions={filterOptions}
              filters={filters}
              onFiltersChange={(newFilters) => {
                setFilters(newFilters);
                setCurrentPage(1); // Reset to first page when filtering
              }}
              onReset={() => {
                setSearchTerm('');
                setFilters({});
                setCurrentPage(1);
              }}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên hiển thị</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Loại dữ liệu</TableHead>
                <TableHead>Mức độ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Mặc định</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">Đang tải...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={item.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                    <TableCell className="font-medium">{item.display_name}</TableCell>
                    <TableCell>{item.value}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                    <TableCell>
                      {item.data?.type && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                          {item.data.type}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.data?.status ? (
                        <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                          {item.data.status}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(item.is_active ? 'active' : 'inactive')}>
                        {item.is_active ? 'Hoạt động' : 'Không hoạt động'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={item.is_default ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}>
                        {item.is_default ? 'Mặc định' : 'Không'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="scale-hover" 
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="scale-hover" 
                          onClick={() => handleDeleteClick(item)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="mt-4">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              startIndex={(currentPage - 1) * pageSize}
              endIndex={Math.min(currentPage * pageSize, total)}
              totalItems={total}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin danh mục
            </DialogDescription>
          </DialogHeader>
          {renderForm(formData, setFormData)}
          <DialogFooter>
            <Button 
              type="submit" 
              className="w-full" 
              onClick={handleUpdate}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục <strong>{selectedItem?.display_name}</strong> (ID: {selectedItem?.id})? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
