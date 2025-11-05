import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { 
  Monitor, 
  Shield, 
  AlertTriangle, 
  Activity,
  FileText,
  Database,
  Lock,
  Code,
  CheckCircle2,
  XCircle,
  Calendar,
  RefreshCw
} from 'lucide-react';
// @ts-ignore
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

import scenariosService from '@/services/api/scenarios.service';
import devicesService from '@/services/api/devices.service';
import scriptsService from '@/services/api/scripts.service';
import { logsService, alertsService, axiosInstance } from '@/services/api';

interface DashboardStats {
  scenarios: number;
  devices: number;
  malware: number;
  blacklistIPs: number;
  logs: number;
  logProgress: number;
  alerts: {
    total: number;
    typeBreakdown?: Array<{
      type: string;
      count: number;
    }>;
    type_breakdown?: Array<{
      type: string;
      count: number;
    }>;
    severityBreakdown?: Array<{
      severity: string;
      count: number;
    }>;
    severity_breakdown?: Array<{
      severity: string;
      count: number;
    }>;
    processedBreakdown?: Array<{
      status: string;
      count: number;
    }>;
    processed_breakdown?: Array<{
      status: string;
      count: number;
    }>;
  };
  scripts: {
    total: number;
    published: number;
    unpublished: number;
  };
  scenarioStats: {
    total: number;
    active: number;
    inactive: number;
  };
  deviceStats: {
    total: number;
    statusBreakdown: {
      active: number;
      offline: number;
      warning: number;
    };
  };
}

interface TimeRange {
  start_date: string;
  end_date: string;
  label: string;
}

interface SyncStatus {
  alert_sync: {
    isRunning: boolean;
    config: {
      batchSize: number;
      syncIntervalMinutes: number;
      maxRetries: number;
      retryDelayMs: number;
    };
  };
  command_polling: {
    isPolling: boolean;
    config: {
      pollIntervalSeconds: number;
      maxConcurrentCommands: number;
      defaultTimeoutSeconds: number;
    };
    pendingCount: number;
  };
}

// Helper function to get default dates (3 months ago to today)
const getDefaultDates = () => {
  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);
  
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  return {
    startDate: formatDate(threeMonthsAgo),
    endDate: formatDate(today)
  };
};

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    scenarios: 0,
    devices: 0,
    malware: 0,
    blacklistIPs: 0,
    logs: 0,
    logProgress: 0,
    alerts: {
      total: 0,
      typeBreakdown: [],
      severityBreakdown: [],
      processedBreakdown: []
    },
    scripts: {
      total: 0,
      published: 0,
      unpublished: 0
    },
    scenarioStats: {
      total: 0,
      active: 0,
      inactive: 0
    },
    deviceStats: {
      total: 0,
      statusBreakdown: {
        active: 0,
        offline: 0,
        warning: 0
      }
    }
  });
  const [loading, setLoading] = useState(true);
  const [deviceStartDate, setDeviceStartDate] = useState<string>(() => {
    const { startDate } = getDefaultDates();
    return startDate;
  });
  const [deviceEndDate, setDeviceEndDate] = useState<string>(() => {
    const { endDate } = getDefaultDates();
    return endDate;
  });
  const [scriptStartDate, setScriptStartDate] = useState<string>(() => {
    const { startDate } = getDefaultDates();
    return startDate;
  });
  const [scriptEndDate, setScriptEndDate] = useState<string>(() => {
    const { endDate } = getDefaultDates();
    return endDate;
  });
  const [refreshing, setRefreshing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    alert_sync: {
      isRunning: false,
      config: {
        batchSize: 100,
        syncIntervalMinutes: 1,
        maxRetries: 3,
        retryDelayMs: 5000
      }
    },
    command_polling: {
      isPolling: false,
      config: {
        pollIntervalSeconds: 30,
        maxConcurrentCommands: 50,
        defaultTimeoutSeconds: 300
      },
      pendingCount: 0
    }
  });
  console.log(stats);

  // Helper function to get time range from dates
  const getTimeRangeFromDates = (startDate?: string, endDate?: string): TimeRange => {
    if (startDate && endDate) {
      return {
        start_date: startDate,
        end_date: endDate,
        label: `${new Date(startDate).toLocaleDateString('vi-VN')} - ${new Date(endDate).toLocaleDateString('vi-VN')}`
      };
    }
    return {
      start_date: '',
      end_date: '',
      label: 'Tất cả'
    };
  };
  
  const fetchSyncStatus = async () => {
    try {
      const response = await axiosInstance.get('/cloud-management/sync/status');
      if (response.data?.data) {
        setSyncStatus(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching sync status:', error);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      
      // Get time ranges from dates
      const deviceTimeRange = getTimeRangeFromDates(deviceStartDate, deviceEndDate);
      const scriptTimeRange = getTimeRangeFromDates(scriptStartDate, scriptEndDate);
      
      // Fetch summary statistics and other detailed stats
      const [summaryRes, logsRes, scriptsRes, scenarioStatsRes, deviceStatsRes, alertsRes] = await Promise.all([
        // Summary statistics endpoint
        axiosInstance.get('/dashboard/summary/statistics').catch(() => ({
          statusCode: '500',
          message: 'Error',
          data: {
            period: null,
            summary: {
              scripts_count: 0,
              managed_devices_count: 0,
              malware_count: 0,
              blacklist_ips_count: 0,
              alerts_count: 0
            }
          }
        })),
        logsService.getAll({ pageSize: 1, pageIndex: 1 }).catch(() => ({ data: { count: 0, rows: [] } })),
        scriptsService.getStatistics(
          scriptTimeRange.start_date || undefined, 
          scriptTimeRange.end_date || undefined
        ).catch(() => ({ data: { summary: { total_scripts: 0, published_scripts: 0, unpublished_scripts: 0 } } })),
        scenariosService.getStatistics().catch(() => ({
          statusCode: '500',
          message: 'Error',
          data: {
            period: null,
            summary: {
              total_scenarios: 0,
              active_scenarios: 0,
              inactive_scenarios: 0
            }
          }
        })),
        devicesService.getStatistics(
          deviceTimeRange.start_date || undefined, 
          deviceTimeRange.end_date || undefined
        ).catch(() => ({
          statusCode: '500',
          message: 'Error',
          data: {
            period: null,
            summary: {
              total_devices: 0,
              status_breakdown: []
            }
          }
        })),
        alertsService.getStatistics(
          deviceTimeRange.start_date || undefined, 
          deviceTimeRange.end_date || undefined
        ).catch(() => ({
          statusCode: '500',
          message: 'Error',
          data: {
            period: null,
            summary: {
              total_alerts: 0,
              type_breakdown: [],
              severity_breakdown: [],
              processed_breakdown: []
            }
          }
        }))
      ]);
      console.log('Summary data:', summaryRes);
      console.log('Scripts data:', scriptsRes);
      
      // Process device status breakdown
      const statusBreakdown = deviceStatsRes.data?.summary?.status_breakdown || [];
      const deviceStatusStats = {
        active: 0,
        offline: 0,
        warning: 0
      };
      
      statusBreakdown.forEach((item: any) => {
        switch (item.device_status) {
          case 'active':
            deviceStatusStats.active = parseInt(item.count);
            break;
          case 'offline':
            deviceStatusStats.offline = parseInt(item.count);
            break;
          case 'warning':
            deviceStatusStats.warning = parseInt(item.count);
            break;
        }
      });

        setStats({
          scenarios: summaryRes.data?.data?.summary?.scripts_count || 0,
          devices: summaryRes.data?.data?.summary?.managed_devices_count || 0,
          malware: summaryRes.data?.data?.summary?.malware_count  || 0,
          blacklistIPs: summaryRes.data?.data?.summary?.blacklist_ips_count || 0,
          logs: logsRes.data?.count || 0,
          logProgress: (logsRes.data?.count || 0) > 0 ? 85 : 0,
        alerts: {
          total: alertsRes.data?.summary?.total_alerts || 0,
          typeBreakdown: (alertsRes.data?.summary?.type_breakdown || []).map((item: any) => ({
            type: item.type,
            count: parseInt(item.count) || 0
          })),
          type_breakdown: (alertsRes.data?.summary?.type_breakdown || []).map((item: any) => ({
            type: item.type,
            count: parseInt(item.count) || 0
          })),
          severityBreakdown: (alertsRes.data?.summary?.severity_breakdown || []).map((item: any) => ({
            severity: item.severity,
            count: parseInt(item.count) || 0
          })),
          severity_breakdown: (alertsRes.data?.summary?.severity_breakdown || []).map((item: any) => ({
            severity: item.severity,
            count: parseInt(item.count) || 0
          })),
          processedBreakdown: (alertsRes.data?.summary?.processed_breakdown || []).map((item: any) => ({
            status: item.status,
            count: parseInt(item.count) || 0
          })),
          processed_breakdown: (alertsRes.data?.summary?.processed_breakdown || []).map((item: any) => ({
            status: item.status,
            count: parseInt(item.count) || 0
          }))
        },
        scripts: {
          total: summaryRes.data?.summary?.scripts_count || scriptsRes.data?.summary?.total_scripts || 0,
          published: scriptsRes.data?.summary?.published_scripts || 0,
          unpublished: scriptsRes.data?.summary?.unpublished_scripts || 0
        },
        scenarioStats: {
          total: scenarioStatsRes.data?.summary?.total_scenarios || 0,
          active: scenarioStatsRes.data?.summary?.active_scenarios || 0,
          inactive: scenarioStatsRes.data?.summary?.inactive_scenarios || 0
        },
        deviceStats: {
          total: deviceStatsRes.data?.summary?.total_devices || 0,
          statusBreakdown: deviceStatusStats
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchSyncStatus();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
      fetchSyncStatus();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle date changes with validation
  const handleDeviceStartDateChange = (date: string) => {
    setDeviceStartDate(date);
    // If end date is before new start date, clear it
    if (date && deviceEndDate && deviceEndDate < date) {
      setDeviceEndDate('');
    } else if (date && deviceEndDate) {
      fetchStats();
    }
  };

  const handleDeviceEndDateChange = (date: string) => {
    setDeviceEndDate(date);
    if (deviceStartDate && date && date >= deviceStartDate) {
      fetchStats();
    }
  };
  console.log(stats);
  
  const handleScriptStartDateChange = (date: string) => {
    setScriptStartDate(date);
    // If end date is before new start date, clear it
    if (date && scriptEndDate && scriptEndDate < date) {
      setScriptEndDate('');
    } else if (date && scriptEndDate) {
      fetchStats();
    }
  };

  const handleScriptEndDateChange = (date: string) => {
    setScriptEndDate(date);
    if (scriptStartDate && date && date >= scriptStartDate) {
      fetchStats();
    }
  };

  const handleRefresh = () => {
    fetchStats();
    fetchSyncStatus();
  };

  // Simple Date Input Component (like AdvancedFilter)
  const DateInput = ({ 
    value, 
    onChange, 
    placeholder = "Chọn ngày",
    label
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label: string;
  }) => {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">{label}</label>
        <div className="relative group">
          <input
            type="date"
            placeholder={placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 w-full bg-muted/50 border-muted-foreground/20 text-foreground w-full placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 hover:border-muted-foreground/40 cursor-pointer"
            style={{
              colorScheme: 'dark',
              WebkitAppearance: 'none',
              MozAppearance: 'textfield'
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Tổng quan hệ thống quản trị và giám sát
        </p>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-4 w-full">
        <Card className="card-hover stagger-item flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kịch bản phản ứng</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground bounce-soft" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats.scenarios.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Kịch bản đang hoạt động
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover stagger-item flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thiết bị</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground bounce-soft" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats.devices.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Thiết bị được quản lý
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover stagger-item flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mã độc</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground bounce-soft" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats.malware.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Hash mã độc phát hiện
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover stagger-item flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IP Blacklist</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground bounce-soft" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats.blacklistIPs.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              IP trong danh sách đen
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover stagger-item flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số log</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground bounce-soft" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats.alerts.total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Log hệ thống
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* System Status */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Trạng thái hệ thống</CardTitle>
            <CardDescription>
              Giám sát các thành phần chính của hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Kịch bản phản ứng</span>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                {stats.scenarios} kịch bản
              </Badge>
            </div>
            <Progress value={stats.scenarios > 0 ? 100 : 0} className="h-2" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4" />
                <span>Thiết bị giám sát</span>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                {stats.devices} thiết bị
              </Badge>
            </div>
            <Progress value={stats.devices > 0 ? 100 : 0} className="h-2" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Phát hiện mã độc</span>
              </div>
              <Badge variant="outline" className={stats.malware > 100 ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"}>
                {stats.malware} hash
              </Badge>
            </div>
            <Progress value={stats.malware > 0 ? 100 : 0} className="h-2" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <span>IP Blacklist</span>
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                {stats.blacklistIPs} IP
              </Badge>
            </div>
            <Progress value={stats.blacklistIPs > 0 ? 100 : 0} className="h-2" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Tải dữ liệu nhật ký</span>
              </div>
              <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                {stats.logProgress}%
              </Badge>
            </div>
            <Progress value={stats.logProgress} className="h-2" />
            

           
          </CardContent>
        </Card>

        {/* Statistics Summary */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Tổng quan thống kê</CardTitle>
            <CardDescription>
              Thông tin chi tiết về hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Kịch bản phản ứng</p>
                <p className="text-xs text-muted-foreground">
                  {loading ? 'Đang tải...' : `${stats.scenarios} kịch bản đã cấu hình`}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Thiết bị</p>
                <p className="text-xs text-muted-foreground">
                  {loading ? 'Đang tải...' : `${stats.devices} thiết bị đang được giám sát`}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Mã độc</p>
                <p className="text-xs text-muted-foreground">
                  {loading ? 'Đang tải...' : `${stats.malware} hash mã độc được phát hiện`}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">IP Blacklist</p>
                <p className="text-xs text-muted-foreground">
                  {loading ? 'Đang tải...' : `${stats.blacklistIPs} IP trong danh sách đen`}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nhật ký hệ thống</p>
                <p className="text-xs text-muted-foreground">
                  {loading ? 'Đang tải...' : `${stats.logs.toLocaleString()} bản ghi nhật ký`}
                </p>
              </div>
            </div>
            

            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Trạng thái tải log:</span>
                <span className="font-medium">{stats.logProgress}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scripts Statistics */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Stats Cards Section */}
       
          <Card className="card-hover col-span-4 ">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Thống kê kịch bản phản ứng</CardTitle>
                  <CardDescription>
                    Thông tin chi tiết về kịch bản phản ứng
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <DateInput
                    label="Từ ngày"
                    value={scriptStartDate}
                    onChange={handleScriptStartDateChange}
                  />
                  <DateInput
                    label="Đến ngày"
                    value={scriptEndDate}
                    onChange={handleScriptEndDateChange}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="h-8 w-8 p-0 ml-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 hover:from-blue-500/20 hover:to-blue-600/20 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Code className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Tổng số kịch bản</p>
                      <p className="text-xs text-muted-foreground">Tất cả scripts trong hệ thống</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-500">{stats.scripts.total}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 hover:from-green-500/20 hover:to-green-600/20 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Đã xuất bản</p>
                      <p className="text-xs text-muted-foreground">Kịch bản đang hoạt động</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-500">{stats.scripts.published}</p>
                    <p className="text-xs text-muted-foreground">
                      {stats.scripts.total > 0 ? ((stats.scripts.published / stats.scripts.total) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 hover:from-yellow-500/20 hover:to-yellow-600/20 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-yellow-500/20">
                      <XCircle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Chưa xuất bản</p>
                      <p className="text-xs text-muted-foreground">Scripts chờ triển khai</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-yellow-500">{stats.scripts.unpublished}</p>
                    <p className="text-xs text-muted-foreground">
                      {stats.scripts.total > 0 ? ((stats.scripts.unpublished / stats.scripts.total) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>

                {/* Summary */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-500/10 to-gray-600/10 border border-gray-500/20">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gray-500/20">
                      <Activity className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Tỷ lệ triển khai</p>
                      <p className="text-xs text-muted-foreground">Tổng quan hiệu suất</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-500">
                      {stats.scripts.total > 0 ? ((stats.scripts.published / stats.scripts.total) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
      

        {/* Chart Section */}
        <Card className="col-span-3 card-hover">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Biểu đồ phân bổ</CardTitle>
                <CardDescription>
                  Phân bổ kịch bản theo trạng thái xuất bản
                </CardDescription>
              </div>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{getTimeRangeFromDates(scriptStartDate, scriptEndDate).label}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <Pie
                data={{
                  labels: ['Đã xuất bản', 'Chưa xuất bản'],
                  datasets: [
                    {
                      data: [stats.scripts.published, stats.scripts.unpublished],
                      backgroundColor: ['#10b981', '#f59e0b'],
                      borderWidth: 2,
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { 
                      position: 'bottom' as const,
                      labels: {
                        padding: 10,
                        font: {
                          size: 10,
                          weight: 'bold' as const,
                        },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        color: '#e2e8f0',
                        boxWidth: 8,
                        boxHeight: 8,
                      },
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: '#fff',
                      bodyColor: '#fff',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderWidth: 1,
                      padding: 12,
                    },
                  },
                  layout: {
                    padding: {
                      bottom: 5,
                    },
                  },
                }}
                style={{ height: 240, width: '100%' }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Statistics */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Stats Cards Section */}
       
          <Card className="card-hover col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Thống kê thiết bị quản lý</CardTitle>
                  <CardDescription>
                    Thông tin chi tiết về trạng thái thiết bị
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <DateInput
                    label="Từ ngày"
                    value={deviceStartDate}
                    onChange={handleDeviceStartDateChange}
                  />
                  <DateInput
                    label="Đến ngày"
                    value={deviceEndDate}
                    onChange={handleDeviceEndDateChange}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="h-8 w-8 p-0 ml-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 hover:from-blue-500/20 hover:to-blue-600/20 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Monitor className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Tổng số thiết bị</p>
                      <p className="text-xs text-muted-foreground">Tất cả thiết bị được quản lý</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-500">{stats.deviceStats.total}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 hover:from-green-500/20 hover:to-green-600/20 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Hoạt động</p>
                      <p className="text-xs text-muted-foreground">Thiết bị đang online</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-500">{stats.deviceStats.statusBreakdown.active}</p>
                    <p className="text-xs text-muted-foreground">
                      {stats.deviceStats.total > 0 ? ((stats.deviceStats.statusBreakdown.active / stats.deviceStats.total) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 hover:from-yellow-500/20 hover:to-yellow-600/20 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-yellow-500/20">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Cảnh báo</p>
                      <p className="text-xs text-muted-foreground">Thiết bị có vấn đề</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-yellow-500">{stats.deviceStats.statusBreakdown.warning}</p>
                    <p className="text-xs text-muted-foreground">
                      {stats.deviceStats.total > 0 ? ((stats.deviceStats.statusBreakdown.warning / stats.deviceStats.total) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 hover:from-red-500/20 hover:to-red-600/20 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-red-500/20">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Offline</p>
                      <p className="text-xs text-muted-foreground">Thiết bị không phản hồi</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-red-500">{stats.deviceStats.statusBreakdown.offline}</p>
                    <p className="text-xs text-muted-foreground">
                      {stats.deviceStats.total > 0 ? ((stats.deviceStats.statusBreakdown.offline / stats.deviceStats.total) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Summary */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-500/10 to-gray-600/10 border border-gray-500/20">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gray-500/20">
                      <Activity className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Tỷ lệ hoạt động</p>
                      <p className="text-xs text-muted-foreground">Tổng quan hiệu suất</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-500">
                      {stats.deviceStats.total > 0 ? ((stats.deviceStats.statusBreakdown.active / stats.deviceStats.total) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
       

        {/* Chart Section */}
        <Card className="col-span-3 card-hover">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Biểu đồ phân bổ</CardTitle>
                <CardDescription>
                  Phân bổ thiết bị theo trạng thái hoạt động
                </CardDescription>
              </div>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{getTimeRangeFromDates(deviceStartDate, deviceEndDate).label}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <Pie
                data={{
                  labels: ['Hoạt động', 'Cảnh báo', 'Offline'],
                  datasets: [
                    {
                      data: [
                        stats.deviceStats.statusBreakdown.active,
                        stats.deviceStats.statusBreakdown.warning,
                        stats.deviceStats.statusBreakdown.offline,
                      ],
                      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                      borderWidth: 2,
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { 
                      position: 'bottom' as const,
                      labels: {
                        padding: 10,
                        font: {
                          size: 10,
                          weight: 'bold' as const,
                        },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        color: '#e2e8f0',
                        boxWidth: 8,
                        boxHeight: 8,
                      },
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: '#fff',
                      bodyColor: '#fff',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderWidth: 1,
                      padding: 12,
                    },
                  },
                  layout: {
                    padding: {
                      bottom: 5,
                    },
                  },
                }}
                style={{ height: 240, width: '100%' }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Statistics */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Alerts Stats Cards Section */}
        <Card className="card-hover col-span-4">
          <CardHeader>
            <CardTitle className="text-lg">Thống kê cảnh báo hệ thống</CardTitle>
            <CardDescription>
              Thông tin chi tiết về các loại cảnh báo và mức độ nghiêm trọng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 hover:from-red-500/20 hover:to-red-600/20 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-red-500/20">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Tổng số cảnh báo</p>
                    <p className="text-xs text-muted-foreground">Tất cả cảnh báo hệ thống</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-red-500">{stats.alerts.total}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 hover:from-orange-500/20 hover:to-orange-600/20 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-orange-500/20">
                    <Shield className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Cảnh báo cao</p>
                    <p className="text-xs text-muted-foreground">Mức độ nghiêm trọng cao</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-orange-500">
                    {(stats.alerts.severityBreakdown || stats.alerts.severity_breakdown || []).find(s => s.severity === 'high')?.count || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 hover:from-yellow-500/20 hover:to-yellow-600/20 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-yellow-500/20">
                    <Activity className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Chưa xử lý</p>
                    <p className="text-xs text-muted-foreground">Cảnh báo đang chờ xử lý</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-yellow-500">
                    {(stats.alerts.processedBreakdown || stats.alerts.processed_breakdown || []).find(p => p.status === 'unprocessed')?.count || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 hover:from-green-500/20 hover:to-green-600/20 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Đã xử lý</p>
                    <p className="text-xs text-muted-foreground">Cảnh báo đã được xử lý</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-500">
                    {(stats.alerts.processedBreakdown || stats.alerts.processed_breakdown || []).find(p => p.status === 'processed')?.count || 0}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Chart Section */}
        <Card className="col-span-3 card-hover">
          <CardHeader>
            <CardTitle>Phân bổ theo loại</CardTitle>
            <CardDescription>
              Các loại cảnh báo phổ biến nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              {(() => {
                const alertTypeBreakdown = (stats.alerts.typeBreakdown || stats.alerts.type_breakdown) || [];
                const hasData = alertTypeBreakdown.length > 0;
                
                // Prepare chart data
                const chartData = hasData 
                  ? alertTypeBreakdown.slice(0, 6).map(item => ({
                      name: item.type.replace(/_/g, ' '),
                      value: item.count,
                      color: getAlertTypeColor(item.type),
                      type: item.type
                    }))
                  : [
                      { name: 'AI MALWARE DETECT', value: 307, color: '#ef4444', type: 'AI_MALWARE_DETECT' },
                      { name: 'TCP CONNECT SCAN', value: 40, color: '#f97316', type: 'TCP_CONNECT_SCAN' },
                      { name: 'SYN SCAN', value: 20, color: '#eab308', type: 'SYN_SCAN' },
                      { name: 'BRUTE FORCE', value: 2, color: '#8b5cf6', type: 'BRUTE_FORCE' },
                      { name: 'HIGH USAGE', value: 2, color: '#06b6d4', type: 'HIGH_USAGE' },
                      { name: 'WEIRD FLAG SCAN', value: 1, color: '#84cc16', type: 'WEIRD_FLAG_SCAN' }
                    ];

                if (!hasData && stats.alerts.total === 0) {
                  return (
                    <div className="flex items-center justify-center h-[240px] text-muted-foreground">
                      <div className="text-center">
                        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium">Không có dữ liệu cảnh báo</p>
                        <p className="text-sm">Dữ liệu sẽ hiển thị khi có cảnh báo mới</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <Pie
                    data={{
                      labels: chartData.map(item => item.name),
                      datasets: [
                        {
                          data: chartData.map(item => item.value),
                          backgroundColor: chartData.map(item => item.color),
                          borderWidth: 2,
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { 
                          position: 'bottom' as const,
                          labels: {
                            padding: 10,
                            font: {
                              size: 9,
                              weight: 'bold' as const,
                            },
                            usePointStyle: true,
                            pointStyle: 'circle',
                            color: '#e2e8f0',
                            boxWidth: 6,
                            boxHeight: 6,
                          },
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          titleColor: '#fff',
                          bodyColor: '#fff',
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          borderWidth: 1,
                          padding: 12,
                          callbacks: {
                            label: function(context: any) {
                              const label = context.label || '';
                              const value = context.parsed || 0;
                              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                              const percentage = ((value / total) * 100).toFixed(1);
                              return `${label}: ${value.toLocaleString()} (${percentage}%)`;
                            },
                          },
                        },
                      },
                      layout: {
                        padding: {
                          bottom: 5,
                        },
                      },
                    }}
                    style={{ height: 240, width: '100%' }}
                  />
                );
              })()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Status Monitoring */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Sync Status Cards Section */}
        <Card className="card-hover col-span-4">
          <CardHeader>
            <CardTitle className="text-lg">Giám sát gửi dữ liệu định kỳ</CardTitle>
            <CardDescription>
              Trạng thái đồng bộ dữ liệu và polling lệnh
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 hover:from-blue-500/20 hover:to-blue-600/20 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Activity className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Đồng bộ cảnh báo</p>
                    <p className="text-xs text-muted-foreground">
                      {syncStatus.alert_sync.isRunning ? 'Đang chạy' : 'Đã dừng'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`w-3 h-3 rounded-full ${syncStatus.alert_sync.isRunning ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {syncStatus.alert_sync.config.syncIntervalMinutes} phút
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 hover:from-green-500/20 hover:to-green-600/20 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <RefreshCw className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Command Polling</p>
                    <p className="text-xs text-muted-foreground">
                      {syncStatus.command_polling.isPolling ? 'Đang polling' : 'Đã dừng'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`w-3 h-3 rounded-full ${syncStatus.command_polling.isPolling ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {syncStatus.command_polling.pendingCount} pending
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Database className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Cấu hình đồng bộ cảnh báo</p>
                    <p className="text-xs text-muted-foreground">Thông số đồng bộ cảnh báo</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Batch Size:</span>
                    <span className="font-medium">{syncStatus.alert_sync.config.batchSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Retries:</span>
                    <span className="font-medium">{syncStatus.alert_sync.config.maxRetries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Retry Delay:</span>
                    <span className="font-medium">{syncStatus.alert_sync.config.retryDelayMs}ms</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-lg bg-orange-500/20">
                    <Code className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Cấu hình Command Polling</p>
                    <p className="text-xs text-muted-foreground">Thông số polling lệnh</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Poll Interval:</span>
                    <span className="font-medium">{syncStatus.command_polling.config.pollIntervalSeconds}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Concurrent:</span>
                    <span className="font-medium">{syncStatus.command_polling.config.maxConcurrentCommands}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timeout:</span>
                    <span className="font-medium">{syncStatus.command_polling.config.defaultTimeoutSeconds}s</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sync Status Chart Section */}
        <Card className="col-span-3 card-hover">
          <CardHeader>
            <CardTitle>Trạng thái hệ thống</CardTitle>
            <CardDescription>
              Tổng quan hoạt động đồng bộ dữ liệu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${syncStatus.alert_sync.isRunning ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-medium">Alert Sync</span>
                </div>
                <Badge variant={syncStatus.alert_sync.isRunning ? "default" : "secondary"}>
                  {syncStatus.alert_sync.isRunning ? 'Hoạt động' : 'Dừng'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${syncStatus.command_polling.isPolling ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-medium">Command Polling</span>
                </div>
                <Badge variant={syncStatus.command_polling.isPolling ? "default" : "secondary"}>
                  {syncStatus.command_polling.isPolling ? 'Hoạt động' : 'Dừng'}
                </Badge>
              </div>

              <div className="pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {syncStatus.command_polling.pendingCount}
                  </p>
                  <p className="text-sm text-muted-foreground">Lệnh đang chờ xử lý</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cập nhật lần cuối:</span>
                  <span className="font-medium">{new Date().toLocaleTimeString('vi-VN')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

// Helper function to get color for alert types
const getAlertTypeColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    'AI_MALWARE_DETECT': '#ef4444',
    'TCP_CONNECT_SCAN': '#f97316',
    'SYN_SCAN': '#eab308',
    'BRUTE_FORCE': '#8b5cf6',
    'HIGH_USAGE': '#06b6d4',
    'WEIRD_FLAG_SCAN': '#84cc16'
  };
  return colors[type] || '#6b7280';
};