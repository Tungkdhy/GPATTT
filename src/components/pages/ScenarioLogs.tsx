import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { AdvancedFilter, FilterOption } from '../common/AdvancedFilter';
import { Eye, Download, Filter } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const mockScenarioLogs = [
  { id: 1, timestamp: '2024-01-15 10:30:25', scenarioName: 'DDoS Protection', status: 'executed', result: 'success', blockedIPs: 25, duration: '2.5s' },
  { id: 2, timestamp: '2024-01-15 10:28:13', scenarioName: 'Firewall Rule Update', status: 'executed', result: 'success', blockedIPs: 0, duration: '1.2s' },
  { id: 3, timestamp: '2024-01-15 10:25:45', scenarioName: 'Malware Scan', status: 'executing', result: 'pending', blockedIPs: 5, duration: '45.3s' },
  { id: 4, timestamp: '2024-01-15 10:20:11', scenarioName: 'Port Scan Detection', status: 'executed', result: 'failed', blockedIPs: 3, duration: '3.1s' },
  { id: 5, timestamp: '2024-01-15 10:15:33', scenarioName: 'Intrusion Prevention', status: 'executed', result: 'success', blockedIPs: 12, duration: '5.8s' },
];

export function ScenarioLogs() {
  const [logs] = useState(mockScenarioLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filterOptions: FilterOption[] = [
    {
      key: 'status',
      label: 'Trạng thái',
      type: 'select',
      options: [
        { value: 'executed', label: 'Đã thực thi' },
        { value: 'executing', label: 'Đang thực thi' },
        { value: 'failed', label: 'Thất bại' }
      ]
    },
    {
      key: 'result',
      label: 'Kết quả',
      type: 'select',
      options: [
        { value: 'success', label: 'Thành công' },
        { value: 'failed', label: 'Thất bại' },
        { value: 'pending', label: 'Đang chờ' }
      ]
    }
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.scenarioName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filters.status || log.status === filters.status;
    const matchesResult = !filters.result || log.result === filters.result;
    return matchesSearch && matchesStatus && matchesResult;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'executed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'executing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'failed': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'success': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'failed': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const handleViewDetail = (log: any) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
  };

  const handleExport = () => {
    toast.success('Đang xuất dữ liệu log kịch bản...');
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Hiển thị log kịch bản</h1>
        <p className="text-muted-foreground">
          Theo dõi và phân tích log thực thi các kịch bản bảo mật
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Log kịch bản</CardTitle>
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
              searchPlaceholder="Tìm kiếm kịch bản..."
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
                <TableHead>Tên kịch bản</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Kết quả</TableHead>
                <TableHead>IP bị chặn</TableHead>
                <TableHead>Thời gian thực thi</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log, index) => (
                <TableRow key={log.id} className="stagger-item" style={{animationDelay: `${index * 0.05}s`}}>
                  <TableCell className="font-medium font-mono text-sm">{log.timestamp}</TableCell>
                  <TableCell className="font-medium">{log.scenarioName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(log.status)}>
                      {log.status === 'executed' ? 'Đã thực thi' : 
                       log.status === 'executing' ? 'Đang thực thi' : 'Thất bại'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getResultColor(log.result)}>
                      {log.result === 'success' ? 'Thành công' : 
                       log.result === 'failed' ? 'Thất bại' : 'Đang chờ'}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.blockedIPs}</TableCell>
                  <TableCell className="font-mono">{log.duration}</TableCell>
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
            <DialogTitle>Chi tiết log kịch bản</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về thực thi kịch bản
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Thời gian:</div>
                <div className="col-span-2 text-sm font-mono">{selectedLog.timestamp}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Kịch bản:</div>
                <div className="col-span-2 text-sm font-medium">{selectedLog.scenarioName}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Trạng thái:</div>
                <div className="col-span-2">
                  <Badge variant="outline" className={getStatusColor(selectedLog.status)}>
                    {selectedLog.status === 'executed' ? 'Đã thực thi' : 
                     selectedLog.status === 'executing' ? 'Đang thực thi' : 'Thất bại'}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Kết quả:</div>
                <div className="col-span-2">
                  <Badge variant="outline" className={getResultColor(selectedLog.result)}>
                    {selectedLog.result === 'success' ? 'Thành công' : 
                     selectedLog.result === 'failed' ? 'Thất bại' : 'Đang chờ'}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">IP bị chặn:</div>
                <div className="col-span-2 text-sm">{selectedLog.blockedIPs} địa chỉ</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm text-muted-foreground">Thời gian:</div>
                <div className="col-span-2 text-sm font-mono">{selectedLog.duration}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
