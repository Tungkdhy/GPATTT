import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';
import { Plus, Search, Edit, Trash2, Eye, Filter, X, ChevronDown, Copy } from 'lucide-react';

interface Column {
  key: string;
  title: string;
  render?: (value: any, record: any) => React.ReactNode;
  filterable?: boolean;
  filterType?: 'text' | 'select' | 'date';
  filterOptions?: { value: string; label: string }[];
}

interface DataTableProps {
  title: string;
  description: string;
  data: any[];
  columns: Column[];
  onAdd?: (formData?: any) => void;
  onEdit?: (record: any, formData?: any) => void;
  onDelete?: (record: any) => void;
  onView?: (record: any) => void;
  onDuplicate?: (record: any) => void;
  searchKey?: string;
  renderForm?: (formData: any, setFormData: (data: any) => void) => React.ReactNode;
  renderEditForm?: (record: any, formData: any, setFormData: (data: any) => void) => React.ReactNode;
  renderViewForm?: (record: any) => React.ReactNode;
  headerActions?: React.ReactNode;
}

export function DataTable({
  title,
  description,
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  searchKey = 'name',
  renderForm,
  renderEditForm,
  renderViewForm,
  headerActions
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [viewingRecord, setViewingRecord] = useState<any>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [editFormData, setEditFormData] = useState<any>({});

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isDialogOpen || isEditDialogOpen || isViewDialogOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDialogOpen, isEditDialogOpen, isViewDialogOpen]);

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const handleEditClick = (record: any) => {
    setEditingRecord(record);
    // Pre-fill edit form with record data
    setEditFormData({
      name: record.name || '',
      description: record.description || '',
      note: record.note || '',
      enable: record.enable !== undefined ? record.enable : true,
      config_type: record.config_type || 'acl',
      // ACL fields
      action: record.action || 'allow',
      action_direction: record.action_direction || 'inbound',
      protocol: record.protocol || 'tcp',
      from_ip: record.from_ip || '',
      to_ip: record.to_ip || '',
      from_ip_prefix: record.from_ip_prefix || '',
      to_ip_prefix: record.to_ip_prefix || '',
      from_ports: record.from_ports || '',
      to_ports: record.to_ports || '',
      priority: record.priority || '',
      // Alias fields
      alias_type: record.alias_type || '',
      ip: record.ip || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleViewClick = (record: any) => {
    setViewingRecord(record);
    setIsViewDialogOpen(true);
  };

  const getFilteredData = () => {
    let filtered = data.filter(item =>
      item[searchKey]?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply advanced filters
    Object.keys(filters).forEach(key => {
      const filterValue = filters[key];
      if (filterValue && filterValue !== 'all') {
        filtered = filtered.filter(item => {
          const itemValue = item[key];
          if (typeof itemValue === 'string') {
            return itemValue.toLowerCase().includes(filterValue.toLowerCase());
          }
          return itemValue === filterValue;
        });
      }
    });

    return filtered;
  };

  const filteredData = getFilteredData();
  const activeFiltersCount = Object.values(filters).filter(value => value && value !== 'all').length;

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>
                Tổng cộng {data.length} bản ghi
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {headerActions}
              {onAdd && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="btn-animate scale-hover">
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm mới
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Thêm mới</DialogTitle>
                      <DialogDescription>
                        Tạo bản ghi mới
                      </DialogDescription>
                    </DialogHeader>
                    {renderForm && renderForm(formData, setFormData)}
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setIsDialogOpen(false);
                        setFormData({});
                      }}>
                        Hủy
                      </Button>
                      <Button type="submit" onClick={() => {
                        onAdd?.(formData);
                        setIsDialogOpen(false);
                        setFormData({});
                      }}>Tạo</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardHeader>
        
        {/* Edit Dialog */}
        {renderEditForm && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Chỉnh sửa</DialogTitle>
                <DialogDescription>
                  Cập nhật thông tin bản ghi
                </DialogDescription>
              </DialogHeader>
              {renderEditForm(editingRecord, editFormData, setEditFormData)}
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditFormData({});
                  setEditingRecord(null);
                }}>
                  Hủy
                </Button>
                <Button type="submit" onClick={() => {
                  onEdit?.(editingRecord, editFormData);
                  setIsEditDialogOpen(false);
                  setEditFormData({});
                  setEditingRecord(null);
                }}>Cập nhật</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {/* View Dialog */}
        {renderViewForm && (
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Chi tiết cấu hình</DialogTitle>
                <DialogDescription>
                  Thông tin chi tiết của bản ghi
                </DialogDescription>
              </DialogHeader>
              {renderViewForm(viewingRecord)}
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsViewDialogOpen(false);
                  setViewingRecord(null);
                }}>
                  Đóng
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm input-focus"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Popover open={showAdvancedFilter} onOpenChange={setShowAdvancedFilter}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="relative btn-animate scale-hover">
                    <Filter className="h-4 w-4 mr-2" />
                    Bộ lọc
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs badge-bounce">
                        {activeFiltersCount}
                      </Badge>
                    )}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Bộ lọc nâng cao</h4>
                      {activeFiltersCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="h-8 px-2"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Xóa tất cả
                        </Button>
                      )}
                    </div>
                    <Separator />
                    
                    {columns
                      .filter(col => col.filterable)
                      .map((column) => (
                        <div key={column.key} className="space-y-2">
                          <Label className="text-sm font-medium">{column.title}</Label>
                          {column.filterType === 'select' && column.filterOptions ? (
                            <Select
                              value={filters[column.key] || 'all'}
                              onValueChange={(value:any) => updateFilter(column.key, value)}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Tất cả" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                {column.filterOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              placeholder={`Lọc theo ${column.title.toLowerCase()}`}
                              value={filters[column.key] || ''}
                              onChange={(e) => updateFilter(column.key, e.target.value)}
                              className="h-8"
                            />
                          )}
                        </div>
                      ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key}>{column.title}</TableHead>
                ))}
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((record, index) => (
                <TableRow key={record.id || index} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className="max-w-xs">
                      <div className="truncate">
                        {column.render 
                          ? column.render(record[column.key], record)
                          : record[column.key]
                        }
                      </div>
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {onView && (
                        <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleViewClick(record)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {onDuplicate && (
                        <Button variant="ghost" size="sm" className="scale-hover" onClick={() => onDuplicate(record)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleEditClick(record)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button variant="ghost" size="sm" className="scale-hover" onClick={() => onDelete(record)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}