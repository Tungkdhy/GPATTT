import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Calendar as CalendarComponent } from '../ui/calendar';
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
  RefreshCw,
  Bug,
  Virus
} from 'lucide-react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

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
  const [deviceStartDate, setDeviceStartDate] = useState<Date | undefined>(undefined);
  const [deviceEndDate, setDeviceEndDate] = useState<Date | undefined>(undefined);
  const [scriptStartDate, setScriptStartDate] = useState<Date | undefined>(undefined);
  const [scriptEndDate, setScriptEndDate] = useState<Date | undefined>(undefined);
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
  const getTimeRangeFromDates = (startDate?: Date, endDate?: Date): TimeRange => {
    if (startDate && endDate) {
      return {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        label: `${startDate.toLocaleDateString('vi-VN')} - ${endDate.toLocaleDateString('vi-VN')}`
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
  const handleDeviceStartDateChange = (date: Date | undefined) => {
    setDeviceStartDate(date);
    // If end date is before new start date, clear it
    if (date && deviceEndDate && deviceEndDate < date) {
      setDeviceEndDate(undefined);
    } else if (date && deviceEndDate) {
      fetchStats();
    }
  };

  const handleDeviceEndDateChange = (date: Date | undefined) => {
    setDeviceEndDate(date);
    if (deviceStartDate && date && date >= deviceStartDate) {
      fetchStats();
    }
  };
  console.log(stats);
  
  const handleScriptStartDateChange = (date: Date | undefined) => {
    setScriptStartDate(date);
    // If end date is before new start date, clear it
    if (date && scriptEndDate && scriptEndDate < date) {
      setScriptEndDate(undefined);
    } else if (date && scriptEndDate) {
      fetchStats();
    }
  };

  const handleScriptEndDateChange = (date: Date | undefined) => {
    setScriptEndDate(date);
    if (scriptStartDate && date && date >= scriptStartDate) {
      fetchStats();
    }
  };

  const handleRefresh = () => {
    fetchStats();
    fetchSyncStatus();
  };

  // Custom Date Input Component
  const CustomDateInput = ({ 
    date, 
    onDateChange, 
    placeholder = "dd/mm/yyyy",
    minDate,
    maxDate,
    isEndDate = false
  }: {
    date: Date | undefined;
    onDateChange: (date: Date | undefined) => void;
    placeholder?: string;
    minDate?: Date;
    maxDate?: Date;
    isEndDate?: boolean;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');


    const formatDateForInput = (date: Date | undefined) => {
      if (!date) return '';
      return date.toISOString().split('T')[0];
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);
      
      // Try to parse the date
      if (value.length === 10) {
        const dateObj = new Date(value);
        if (!isNaN(dateObj.getTime())) {
          onDateChange(dateObj);
        }
      } else if (value === '') {
        onDateChange(undefined);
      }
    };

    const handleDateSelect = (selectedDate: Date) => {
      onDateChange(selectedDate);
      setInputValue(formatDateForInput(selectedDate));
      setIsOpen(false);
    };

    const getDisabledDates = (date: Date) => {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (date > today) return true;
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      
      return false;
    };

    // Update input value when date changes externally
    useEffect(() => {
      if (date) {
        setInputValue(formatDateForInput(date));
      } else {
        setInputValue('');
      }
    }, [date]);

    return (
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-44 h-9 px-3 py-2 text-sm border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            isEndDate && date && minDate && date < minDate 
              ? 'border-red-500 text-red-500' 
              : 'border-gray-300'
          }`}
          onFocus={() => setIsOpen(true)}
        />
        
        {isOpen && (
          <div className="absolute top-full left-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={getDisabledDates}
              className="rounded-md"
            />
          </div>
        )}
        
        {isEndDate && date && minDate && date < minDate && (
          <div className="mt-1 text-xs text-red-500">
            Ngày kết thúc phải sau ngày bắt đầu
          </div>
        )}
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
            <Progress value={stats.devices > 0 ? 95 : 0} className="h-2" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Phát hiện mã độc</span>
              </div>
              <Badge variant="outline" className={stats.malware > 100 ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"}>
                {stats.malware} hash
              </Badge>
            </div>
            <Progress value={stats.malware > 0 ? 88 : 0} className="h-2" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <span>IP Blacklist</span>
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                {stats.blacklistIPs} IP
              </Badge>
            </div>
            <Progress value={stats.blacklistIPs > 0 ? 75 : 0} className="h-2" />
            
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
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 min-w-[35px]">Từ:</span>
                    <CustomDateInput
                      date={scriptStartDate}
                      onDateChange={handleScriptStartDateChange}
                      placeholder="dd/mm/yyyy"
                      maxDate={scriptEndDate}
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 min-w-[35px]">Đến:</span>
                    <CustomDateInput
                      date={scriptEndDate}
                      onDateChange={handleScriptEndDateChange}
                      placeholder="dd/mm/yyyy"
                      minDate={scriptStartDate}
                      isEndDate={true}
                    />
                  </div>
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
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Đã xuất bản', value: stats.scripts.published, color: '#10b981' },
                      { name: 'Chưa xuất bản', value: stats.scripts.unpublished, color: '#f59e0b' }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    innerRadius={30}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={5}
                  >
                    {[
                      { name: 'Đã xuất bản', value: stats.scripts.published, color: '#10b981' },
                      { name: 'Chưa xuất bản', value: stats.scripts.unpublished, color: '#f59e0b' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    wrapperStyle={{ paddingTop: '15px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
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
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 min-w-[35px]">Từ:</span>
                    <CustomDateInput
                      date={deviceStartDate}
                      onDateChange={handleDeviceStartDateChange}
                      placeholder="dd/mm/yyyy"
                      maxDate={deviceEndDate}
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 min-w-[35px]">Đến:</span>
                    <CustomDateInput
                      date={deviceEndDate}
                      onDateChange={handleDeviceEndDateChange}
                      placeholder="dd/mm/yyyy"
                      minDate={deviceStartDate}
                      isEndDate={true}
                    />
                  </div>
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
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Hoạt động', value: stats.deviceStats.statusBreakdown.active, color: '#10b981' },
                      { name: 'Cảnh báo', value: stats.deviceStats.statusBreakdown.warning, color: '#f59e0b' },
                      { name: 'Offline', value: stats.deviceStats.statusBreakdown.offline, color: '#ef4444' }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    innerRadius={30}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={5}
                  >
                    {[
                      { name: 'Hoạt động', value: stats.deviceStats.statusBreakdown.active, color: '#10b981' },
                      { name: 'Cảnh báo', value: stats.deviceStats.statusBreakdown.warning, color: '#f59e0b' },
                      { name: 'Offline', value: stats.deviceStats.statusBreakdown.offline, color: '#ef4444' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    wrapperStyle={{ paddingTop: '15px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
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
            <div className="h-[280px]">
              {((stats.alerts.typeBreakdown || stats.alerts.type_breakdown) || []).length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={(stats.alerts.typeBreakdown || stats.alerts.type_breakdown || []).slice(0, 6).map(item => ({
                      name: item.type.replace(/_/g, ' '),
                      value: item.count,
                      color: getAlertTypeColor(item.type)
                    })).length > 0 ? (stats.alerts.typeBreakdown || stats.alerts.type_breakdown || []).slice(0, 6).map(item => ({
                      name: item.type.replace(/_/g, ' '),
                      value: item.count,
                      color: getAlertTypeColor(item.type)
                    })) : [
                      { name: 'AI MALWARE DETECT', value: 307, color: '#ef4444' },
                      { name: 'TCP CONNECT SCAN', value: 40, color: '#f97316' },
                      { name: 'SYN SCAN', value: 20, color: '#eab308' },
                      { name: 'BRUTE FORCE', value: 2, color: '#8b5cf6' },
                      { name: 'HIGH USAGE', value: 2, color: '#06b6d4' },
                      { name: 'WEIRD FLAG SCAN', value: 1, color: '#84cc16' }
                    ]}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                    interval={0}
                  />
                  <YAxis 
                    fontSize={12}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip 
                    formatter={(value: any) => [value.toLocaleString(), 'Số lượng cảnh báo']}
                    labelFormatter={(label) => `Loại: ${label}`}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    labelStyle={{
                      color: '#374151',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[6, 6, 0, 0]}
                    maxBarSize={80}
                    fill="#ef4444"
                  >
                    {((stats.alerts.typeBreakdown || stats.alerts.type_breakdown) || []).slice(0, 6).map((item, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getAlertTypeColor(item.type)}
                        stroke={getAlertTypeColor(item.type)}
                        strokeWidth={2}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">Không có dữ liệu cảnh báo</p>
                    <p className="text-sm">Dữ liệu sẽ hiển thị khi có cảnh báo mới</p>
                  </div>
                </div>
              )}
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
                    <p className="font-medium text-sm">Alert Sync</p>
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
                    <p className="font-medium text-sm">Cấu hình Alert Sync</p>
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