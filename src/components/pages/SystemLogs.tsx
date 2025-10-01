import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { AdvancedFilter, FilterOption } from '../common/AdvancedFilter';
import { Eye, Download, Activity } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const mockSystemLogs = [
  { id: 1, timestamp: '2024-01-15 10:30:25', module: 'Authentication', event: 'User login', user: 'admin', severity: 'info', details: 'Successful login from 192.168.1.100' },
  { id: 2, timestamp: '2024-01-15 10:28:13', module: 'Database', event: 'Connection error', user: 'system', severity: 'critical', details: 'Failed to connect to primary database' },
  { id: 3, timestamp: '2024-01-15 10:25:45', module: 'Security', event: 'Firewall rule updated', user: 'security', severity: 'warning', details: 'Updated firewall configuration' },
  { id: 4, timestamp: '2024-01-15 10:20:11', module: 'System', event: 'Service restart', user: 'system', severity: 'info', details: 'Restarted monitoring service' },
  { id: 5, timestamp: '2024-01-15 10:15:33', module: 'Application', event: 'API error', user: 'api-service', severity: 'error', details: 'API endpoint returned 500 error' },
];

export function SystemLogs() {
  const [logs] = useState(mockSystemLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filterOptions: FilterOption[] = [
    {
      key: 'module',
      label: 'Module',
      type: 'select',
      options: [
        { value: 'Authentication', label: 'Authentication' },
        { value: 'Database', label: 'Database' },
        { value: 'Security', label: 'Security' },
        { value: 'System', label: 'System' },
        { value: 'Application', label: 'Application' }
      ]
    },
    {
      key: 'severity',
      label: 'Mức độ',
      type: 'select',
      options: [
        { value: 'info', label: 'Thông tin' },
        { value: 'warning', label: 'Cảnh báo' },
        { value: 'error', label: 'Lỗi' },
        { value: 'critical', label: 'Nghiêm trọng' }
      ]
    }
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = !filters.module || log.module === filters.module;
    const matchesSeverity = !filters.severity || log.severity === filters.severity;
    return matchesSearch && matchesModule && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'warning': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'error': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'Authentication': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Database': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'Security': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'System': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Application': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const handleViewDetail = (log: any) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
  };

  const handleExport = () => {
    toast.success('Đang xuất nhật ký hệ thống...');
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Nhật ký hệ thống</h1>
        <p className="text-muted-foreground">
          Xem và phân tích nhật ký hoạt động của hệ thống
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="stagger-item">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tổng logs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
          </CardContent>
        </Card>
        <Card className="stagger-item" style={{animationDelay: '0.1s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Lỗi</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {logs.filter(l => l.severity === 'error').length}
            </div>
          </CardContent>
        </Card>
        <Card className="stagger-item" style={{animationDelay: '0.2s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Nghiêm trọng</CardTitle>
            <Activity className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {logs.filter(l => l.severity === 'critical').length}
            </div>
          </CardContent>
        </Card>
        <Card className="stagger-item" style={{animationDelay: '0.3s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Cảnh báo</CardTitle>
            <Activity className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {logs.filter(l => l.severity === 'warning').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Nhật ký hệ thống</CardTitle>
              <CardDescription>
                Hiển thị {filteredLogs.length}/{logs.length} bản ghi
              </CardDescription>
            </div>
            <Button className="btn-animate scale-hover" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Xuất dữ liệu
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <AdvancedFilter
              searchPlaceholder="Tìm kiếm log..."
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              filterOptions={filterOptions}
              filters={filters}
              onFiltersChange={setFilters}
              onReset={() => setSearchTerm('')}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thời gian</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Sự kiện</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Mức độ</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log, index) => (
                <TableRow key={log.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                  <TableCell className="font-medium font-mono text-sm">{log.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getModuleColor(log.module)}>
                      {log.module}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.event}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getSeverityColor(log.severity)}>
                      {log.severity === 'info' ? 'Thông tin' :
                       log.severity === 'warning' ? 'Cảnh báo' :
                       log.severity === 'error' ? 'Lỗi' : 'Nghiêm trọng'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="scale-hover" onClick={() => handleViewDetail(log)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết nhật ký</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về sự kiện hệ thống
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Thời gian:</div>
                <div className="col-span-2 text-sm font-mono">{selectedLog.timestamp}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Module:</div>
                <div className="col-span-2">
                  <Badge variant="outline" className={getModuleColor(selectedLog.module)}>
                    {selectedLog.module}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Sự kiện:</div>
                <div className="col-span-2 text-sm">{selectedLog.event}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Người dùng:</div>
                <div className="col-span-2 text-sm">{selectedLog.user}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Mức độ:</div>
                <div className="col-span-2">
                  <Badge variant="outline" className={getSeverityColor(selectedLog.severity)}>
                    {selectedLog.severity === 'info' ? 'Thông tin' :
                     selectedLog.severity === 'warning' ? 'Cảnh báo' :
                     selectedLog.severity === 'error' ? 'Lỗi' : 'Nghiêm trọng'}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Chi tiết:</div>
                <div className="col-span-2 text-sm">{selectedLog.details}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
