import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Edit, Trash2, Search, Filter, X, ChevronDown, Eye, FileCode, Upload, XCircle, Download } from 'lucide-react';
import { toast } from 'sonner';
import scriptsService, { Script, CreateScriptDto } from '../../services/api/scripts.service';
import scriptCategoriesService, { ScriptCategory } from '../../services/api/scriptCategories.service';
import { useServerPagination } from '@/hooks/useServerPagination';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { TablePagination } from '../common/TablePagination';

export function ResponseScenarios() {
  const [reload, setReload] = useState(false);
  const [filters, setFilters] = useState<any>({
    script_name: '',
    rule_file_name: '',
    script_type_id: '',
    is_published: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [formData, setFormData] = useState<CreateScriptDto>({
    content: '',
    script_name: '',
    rule_file_name: '',
    script_type_id: '',
    is_published: false
  });
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [scriptTypes, setScriptTypes] = useState<ScriptCategory[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  // Load script types from API
  useEffect(() => {
    const loadScriptTypes = async () => {
      try {
        setLoadingTypes(true);
        const types = await scriptCategoriesService.getAll(1, 10000,{scope:"SCRIPT"});
        setScriptTypes(types.data.rows);
      } catch (error: any) {
        console.error('Error loading script types:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi tải danh sách loại kịch bản';
        toast.error(errorMessage);
      } finally {
        setLoadingTypes(false);
      }
    };

    loadScriptTypes();
  }, []);

  // Use server pagination hook with filters
  const {
    data: scripts,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    total,
    loading,
    setCurrentPage,
  } = useServerPagination(
    async (page, limit) => {
      const response = await scriptsService.getAll(page, limit, filters);
      return { rows: response.data.rows, count: response.data.count };
    },
    [reload, filters],
    { pageSize: 10, initialPage: 1 }
  );

  const handleAdd = async () => {
    try {
      if (!formData.script_name.trim()) {
        toast.error('Vui lòng nhập tên kịch bản');
        return;
      }
      if (!formData.rule_file_name.trim()) {
        toast.error('Vui lòng nhập tên file rule');
        return;
      }
      if (!formData.content.trim()) {
        toast.error('Vui lòng nhập nội dung kịch bản');
        return;
      }
      if (!formData.script_type_id) {
        toast.error('Vui lòng chọn loại kịch bản');
        return;
      }

      await scriptsService.create(formData);
      setIsDialogOpen(false);
      resetForm();
      toast.success('Thêm kịch bản thành công!');
      setReload(!reload);
    } catch (error: any) {
      console.error('Error creating script:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi thêm kịch bản';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (script: Script) => {
    setSelectedScript(script);
    setFormData({
      content: script.content,
      script_name: script.script_name,
      rule_file_name: script.rule_file_name,
      script_type_id: script.script_type_id,
      is_published: script.is_published
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    try {
      if (!formData.script_name.trim()) {
        toast.error('Vui lòng nhập tên kịch bản');
        return;
      }
      if (!formData.rule_file_name.trim()) {
        toast.error('Vui lòng nhập tên file rule');
        return;
      }
      if (!formData.content.trim()) {
        toast.error('Vui lòng nhập nội dung kịch bản');
        return;
      }

      if (!selectedScript) return;

      await scriptsService.update(selectedScript.id, formData);
      setIsEditDialogOpen(false);
      resetForm();
      setSelectedScript(null);
      toast.success('Cập nhật kịch bản thành công!');
      setReload(!reload);
    } catch (error: any) {
      console.error('Error updating script:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi cập nhật kịch bản';
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (script: Script) => {
    setSelectedScript(script);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (!selectedScript) return;

      await scriptsService.delete(selectedScript.id);
      setIsDeleteDialogOpen(false);
      setSelectedScript(null);
      toast.success('Xóa kịch bản thành công!');
      setReload(!reload);
    } catch (error: any) {
      console.error('Error deleting script:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi xóa kịch bản';
      toast.error(errorMessage);
    }
  };

  const handleViewDetails = (script: Script) => {
    setSelectedScript(script);
    setIsViewDialogOpen(true);
  };

  const handleTogglePublish = async (script: Script) => {
    try {
      const newPublishState = !script.is_published;
      await scriptsService.publish(script.id, newPublishState);
      
      toast.success(
        newPublishState 
          ? 'Đã xuất bản kịch bản thành công!' 
          : 'Đã hủy xuất bản kịch bản!'
      );
      setReload(!reload);
    } catch (error: any) {
      console.error('Error toggling publish state:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi thay đổi trạng thái xuất bản';
      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      content: '',
      script_name: '',
      rule_file_name: '',
      script_type_id: '',
      is_published: false
    });
  };

  const clearFilters = () => {
    setFilters({
      script_name: '',
      rule_file_name: '',
      script_type_id: '',
      is_published: ''
    });
  };

  const applyFilters = () => {
    setShowAdvancedFilter(false);
    setCurrentPage(1);
    setReload(!reload);
  };

  const handleExportCSV = async () => {
    try {
      toast.info('Đang xuất dữ liệu...');
      const params = {
        script_name: filters.script_name || undefined,
        rule_file_name: filters.rule_file_name || undefined,
        script_type_id: filters.script_type_id || undefined,
        is_published: filters.is_published || undefined,
      };
      
      const blob = await scriptsService.exportCSV(params, 1000);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `response-scenarios-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Đã xuất file CSV thành công!');
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi xuất dữ liệu';
      toast.error(errorMsg);
    }
  };
  
  const activeFiltersCount = Object.values(filters).filter(value => value !== '' && value !== undefined).length;

  const getScriptTypeName = (typeId: string) => {
    const type = scriptTypes.find(t => t.id === typeId);
    return type?.display_name || type?.value || 'N/A';
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Quản lý Kịch bản</h1>
        <p className="text-muted-foreground">
          Quản lý các kịch bản YARA rule và script trong hệ thống
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách Kịch bản</CardTitle>
              <CardDescription>
                Tổng cộng {total} kịch bản trong hệ thống
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV} className="scale-hover">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-animate scale-hover">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm Kịch bản
                  </Button>
                </DialogTrigger>
              <DialogContent className="overflow-hidden p-0" style={{ maxWidth: '900px', maxHeight: '90vh' }}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '90vh' }}>
                  <DialogHeader className="px-6 pt-6 pb-4 border-b">
                    <DialogTitle>Thêm kịch bản mới</DialogTitle>
                    <DialogDescription>
                      Thêm kịch bản YARA rule hoặc script mới vào hệ thống
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4 px-6 scroll-bar-1" style={{ overflowY: 'auto', flex: 1 }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="script_name">
                        Tên kịch bản <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="script_name"
                        placeholder="Nhập tên kịch bản"
                        value={formData.script_name}
                        onChange={(e) => setFormData({ ...formData, script_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rule_file_name">
                        Tên file rule <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="rule_file_name"
                        placeholder="Nhập tên file rule (vd: malware_detection.yar)"
                        value={formData.rule_file_name}
                        onChange={(e) => setFormData({ ...formData, rule_file_name: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="script_type_id">
                      Loại kịch bản <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.script_type_id || "none"} 
                      onValueChange={(value: string) => setFormData({ ...formData, script_type_id: value === "none" ? "" : value })}
                      disabled={loadingTypes}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loadingTypes ? "Đang tải..." : "Chọn loại kịch bản"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">-- Chọn loại --</SelectItem>
                        {scriptTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.display_name || type.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">
                      Nội dung kịch bản <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Nhập nội dung YARA rule hoặc script..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="font-mono text-sm"
                      style={{ minHeight: '300px' }}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked: boolean) => setFormData({ ...formData, is_published: checked })}
                    />
                    <Label htmlFor="is_published" className="cursor-pointer">
                      Xuất bản kịch bản
                    </Label>
                    </div>
                  </div>
                  <DialogFooter className="px-6 py-4 border-t bg-muted/20">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button type="submit" onClick={handleAdd}>
                      Thêm kịch bản
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filter Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên kịch bản..."
                value={filters.script_name}
                onChange={(e) => setFilters({ ...filters, script_name: e.target.value })}
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
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Tên file rule</Label>
                      <Input
                        placeholder="Tìm theo tên file..."
                        value={filters.rule_file_name}
                        onChange={(e) => setFilters({ ...filters, rule_file_name: e.target.value })}
                        className="h-8"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Loại kịch bản</Label>
                      <Select
                        value={filters.script_type_id || 'all'}
                        onValueChange={(value: string) => 
                          setFilters({ ...filters, script_type_id: value === 'all' ? '' : value })
                        }
                        disabled={loadingTypes}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder={loadingTypes ? "Đang tải..." : "Tất cả"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả</SelectItem>
                          {scriptTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.display_name || type.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Trạng thái xuất bản</Label>
                      <Select
                        value={filters.is_published?.toString() || 'all'}
                        onValueChange={(value: string) => 
                          setFilters({ ...filters, is_published: value === 'all' ? '' : value === 'true' })
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Tất cả" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả</SelectItem>
                          <SelectItem value="true">Đã xuất bản</SelectItem>
                          <SelectItem value="false">Chưa xuất bản</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />
                    <Button onClick={applyFilters} className="w-full">
                      Áp dụng bộ lọc
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên kịch bản</TableHead>
                <TableHead>Tên file rule</TableHead>
                <TableHead>Loại kịch bản</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Người tạo</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">Đang tải...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : scripts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                (scripts as Script[]).map((script: Script, index: number) => (
                  <TableRow key={script.id} className="stagger-item" style={{ animationDelay: `${index * 0.05}s` }}>
                    <TableCell className="font-medium">
                      <div className="max-w-[200px] truncate" title={script.script_name}>
                        {script.script_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <FileCode className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{script.rule_file_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {script.script_type_name || getScriptTypeName(script.script_type_id)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {script.is_published ? (
                        <Badge className="bg-green-500">Đã xuất bản</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100">Chưa xuất bản</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {script.created_by_name || 'N/A'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {script.created_at ? new Date(script.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <div className="flex items-center justify-end space-x-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="scale-hover" 
                                onClick={() => handleViewDetails(script)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Xem chi tiết</p>
                            </TooltipContent>
                          </Tooltip>

                          {script.is_published ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="scale-hover" 
                                  onClick={() => handleTogglePublish(script)}
                                >
                                  <XCircle className="h-4 w-4 text-orange-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Hủy xuất bản</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="scale-hover" 
                                  onClick={() => handleTogglePublish(script)}
                                >
                                  <Upload className="h-4 w-4 text-green-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Xuất bản kịch bản</p>
                              </TooltipContent>
                            </Tooltip>
                          )}

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="scale-hover" 
                                onClick={() => handleEdit(script)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Chỉnh sửa</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="scale-hover" 
                                onClick={() => handleDeleteClick(script)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Xóa kịch bản</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={total}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="overflow-hidden p-0" style={{ maxWidth: '900px', maxHeight: '90vh' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '90vh' }}>
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <DialogTitle>Chỉnh sửa Kịch bản</DialogTitle>
              <DialogDescription>Cập nhật thông tin kịch bản</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 px-6 scroll-bar-1" style={{ overflowY: 'auto', flex: 1 }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_script_name">
                  Tên kịch bản <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit_script_name"
                  placeholder="Nhập tên kịch bản"
                  value={formData.script_name}
                  onChange={(e) => setFormData({ ...formData, script_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_rule_file_name">
                  Tên file rule <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit_rule_file_name"
                  placeholder="Nhập tên file rule"
                  value={formData.rule_file_name}
                  onChange={(e) => setFormData({ ...formData, rule_file_name: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_script_type_id">
                Loại kịch bản <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.script_type_id || "none"} 
                onValueChange={(value: string) => setFormData({ ...formData, script_type_id: value === "none" ? "" : value })}
                disabled={loadingTypes}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingTypes ? "Đang tải..." : "Chọn loại kịch bản"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- Chọn loại --</SelectItem>
                  {scriptTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.display_name || type.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_content">
                Nội dung kịch bản <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="edit_content"
                placeholder="Nhập nội dung YARA rule hoặc script..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="font-mono text-sm"
                style={{ minHeight: '300px' }}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit_is_published"
                checked={formData.is_published}
                onCheckedChange={(checked: boolean) => setFormData({ ...formData, is_published: checked })}
              />
              <Label htmlFor="edit_is_published" className="cursor-pointer">
                Xuất bản kịch bản
              </Label>
              </div>
            </div>
            <DialogFooter className="px-6 py-4 border-t bg-muted/20">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" onClick={handleUpdate}>
                Cập nhật
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="overflow-hidden p-0" style={{ maxWidth: '900px', maxHeight: '80vh' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '80vh' }}>
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <DialogTitle>Chi tiết Kịch bản</DialogTitle>
              <DialogDescription>Xem thông tin chi tiết của kịch bản</DialogDescription>
            </DialogHeader>
            
            {selectedScript && (
              <div className="px-6 py-4 space-y-4 scroll-bar-1" style={{ overflowY: 'auto', flex: 1 }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Tên kịch bản</Label>
                    <div className="font-medium">{selectedScript.script_name}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Tên file rule</Label>
                    <div className="font-medium">{selectedScript.rule_file_name}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Loại kịch bản</Label>
                    <div>
                      <Badge variant="outline" className="text-xs">
                        {selectedScript.script_type_name || getScriptTypeName(selectedScript.script_type_id)}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Trạng thái</Label>
                    <div>
                      {selectedScript.is_published ? (
                        <Badge className="bg-green-500 text-xs">Đã xuất bản</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-xs">Chưa xuất bản</Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Ngày tạo</Label>
                    <div className="text-sm">
                      {selectedScript.created_at ? new Date(selectedScript.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Người tạo</Label>
                    <div className="text-sm">{selectedScript.created_by_name || 'N/A'}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Người cập nhật</Label>
                    <div className="text-sm">{selectedScript.updated_by_name || 'N/A'}</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground text-sm font-semibold">Nội dung kịch bản</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-2"
                            onClick={() => {
                              navigator.clipboard.writeText(selectedScript.content);
                              toast.success('Đã copy nội dung!');
                            }}
                          >
                            Copy
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy nội dung kịch bản</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="bg-slate-950 rounded-md border border-slate-800 p-4">
                    <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap">
{selectedScript.content}
                    </pre>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter className="px-6 py-4 border-t bg-muted/20">
              <Button onClick={() => setIsViewDialogOpen(false)}>
                Đóng
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa kịch bản <strong>{selectedScript?.script_name}</strong>? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

