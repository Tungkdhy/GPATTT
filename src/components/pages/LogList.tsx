import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { AdvancedFilter, FilterOption } from '../common/AdvancedFilter';
import { Eye, Download, Search } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const mockLogs = [
  { id: 1, timestamp: '2024-01-15 10:30:25', type: 'AUTH', user: 'admin', ip: '192.168.1.100', action: 'Login successful', severity: 'info' },
  { id: 2, timestamp: '2024-01-15 10:28:13', type: 'ERROR', user: 'system', ip: '10.0.0.1', action: 'Database connection failed', severity: 'critical' },
  { id: 3, timestamp: '2024-01-15 10:25:45', type: 'SECURITY', user: 'security', ip: '172.16.0.25', action: 'Suspicious activity detected', severity: 'high' },
  { id: 4, timestamp: '2024-01-15 10:20:11', type: 'ACCESS', user: 'operator1', ip: '192.168.1.50', action: 'File accessed: config.xml', severity: 'info' },
  { id: 5, timestamp: '2024-01-15 10:15:33', type: 'AUTH', user: 'viewer1', ip: '192.168.1.75', action: 'Login failed - invalid password', severity: 'warning' },
];

export function LogList() {
  const [logs] = useState(mockLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filterOptions: FilterOption[] = [
    {
      key: 'type',
      label: 'Loại log',
      type: 'select',
      options: [
        { value: 'AUTH', label: 'Authentication' },
        { value: 'ERROR', label: 'Error' },
        { value: 'SECURITY', label: 'Security' },
        { value: 'ACCESS', label: 'Access' }
      ]
    },
    {
      key: 'severity',
      label: 'Mức độ',
      type: 'select',
      options: [
        { value: 'info', label: 'Thông tin' },
        { value: 'warning', label: 'Cảnh báo' },
        { value: 'high', label: 'Cao' },
        { value: 'critical', label: 'Nghiêm trọng' }
      ]
    }
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.includes(searchTerm);
    const matchesType = !filters.type || log.type === filters.type;
    const matchesSeverity = !filters.severity || log.severity === filters.severity;
    return matchesSearch && matchesType && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'warning': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'AUTH': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'ERROR': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'SECURITY': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'ACCESS': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const handleViewDetail = (log: any) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
  };

  const handleExport = () => {
    toast.success('Đang xuất dữ liệu log...');
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Danh sách log</h1>
        <p className="text-muted-foreground">
          Xem và tra cứu các bản ghi log hệ thống
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Logs hệ thống</CardTitle>
              <CardDescription>
                Hiển thị {filteredLogs.length}/{logs.length} bản ghi log
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
                <TableHead>Loại</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Hành động</TableHead>
                <TableHead>Mức độ</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log, index) => (
                <TableRow key={log.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                  <TableCell className="font-medium font-mono text-sm">{log.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeColor(log.type)}>
                      {log.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell className="font-mono">{log.ip}</TableCell>
                  <TableCell className="max-w-xs truncate">{log.action}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getSeverityColor(log.severity)}>
                      {log.severity === 'info' ? 'Thông tin' : 
                       log.severity === 'warning' ? 'Cảnh báo' :
                       log.severity === 'high' ? 'Cao' : 'Nghiêm trọng'}
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
            <DialogTitle>Chi tiết log</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về bản ghi log
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Thời gian:</div>
                <div className="col-span-2 text-sm font-mono">{selectedLog.timestamp}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Loại:</div>
                <div className="col-span-2">
                  <Badge variant="outline" className={getTypeColor(selectedLog.type)}>
                    {selectedLog.type}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Người dùng:</div>
                <div className="col-span-2 text-sm">{selectedLog.user}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Địa chỉ IP:</div>
                <div className="col-span-2 text-sm font-mono">{selectedLog.ip}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Mức độ:</div>
                <div className="col-span-2">
                  <Badge variant="outline" className={getSeverityColor(selectedLog.severity)}>
                    {selectedLog.severity === 'info' ? 'Thông tin' : 
                     selectedLog.severity === 'warning' ? 'Cảnh báo' :
                     selectedLog.severity === 'high' ? 'Cao' : 'Nghiêm trọng'}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Hành động:</div>
                <div className="col-span-2 text-sm">{selectedLog.action}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
