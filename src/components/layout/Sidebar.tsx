import {
  LayoutDashboard,
  Users,
  Settings,
  Monitor,
  FileText,
  Package,
  Shield,
  Server,
  Hash,
  Bug,
  AlertTriangle,
  Cpu,
  MapPin,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Key,
  List,
  Bell,
  Activity,
  Zap,
  ShieldCheck,
  Database
} from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  // === TRANG CHỦ ===
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },

  // === QUẢN LÝ NGƯỜI DÙNG & PHÂN QUYỀN ===
  {
    id: 'user-management',
    label: 'Quản lý người dùng',
    icon: Users,
    path: '#',
    children: [
      { id: 'users', label: 'Danh sách người dùng', icon: Users, path: '/users' },
      { id: 'account-permissions', label: 'Quyền tài khoản', icon: Key, path: '/account-permissions' },
      { id: 'action', label: 'Danh sách hành động', icon: ShieldCheck, path: '/action' },
    ]
  },

  // === QUẢN LÝ THIẾT BỊ ===
  {
    id: 'device-management',
    label: 'Quản lý thiết bị',
    icon: Monitor,
    path: '#',
    children: [
      { id: 'devices', label: 'Danh sách thiết bị', icon: Monitor, path: '/devices' },
      { id: 'device-types', label: 'Loại thiết bị', icon: Cpu, path: '/device-types' },
      { id: 'insecure-devices', label: 'Thiết bị mất an toàn', icon: ShieldAlert, path: '/insecure-devices' },
    ]
  },

  // === BẢO MẬT & TƯỜNG LỬA ===
  {
    id: 'security-management',
    label: 'Bảo mật & Tường lửa',
    icon: Shield,
    path: '#',
    children: [
      { id: 'firewall-configs', label: 'Cấu hình tường lửa', icon: Shield, path: '/firewall-configs' },
      { id: 'firewall-config-types', label: 'Loại cấu hình tường lửa', icon: Shield, path: '/firewall-config-types' },
      { id: 'blacklist-ips', label: 'Danh sách IP đen', icon: ShieldAlert, path: '/blacklist-ips' },
      { id: 'whitelist-ips', label: 'Danh sách IP trắng', icon: ShieldCheck, path: '/whitelist-ips' },
     
    ]
  },

  // === QUẢN LÝ KỊCH BẢN ===
  {
    id: 'scenario-management',
    label: 'Quản lý kịch bản',
    icon: FileText,
    path: '#',
    children: [
      { id: 'scenarios', label: 'Danh mục kịch bản', icon: FileText, path: '/scenarios' },
      { id: 'response-scenarios', label: 'Kịch bản phản ứng', icon: Zap, path: '/response-scenarios' },
    ]
  },

  // === QUẢN LÝ LOG ===
  {
    id: 'log-management',
    label: 'Quản lý Log',
    icon: FileText,
    path: '#',
    children: [
      { id: 'log-types', label: 'Danh mục loại log', icon: List, path: '/log-types' },
      { id: 'log-list', label: 'Danh sách log', icon: FileText, path: '/log-list' },
      { id: 'scenario-logs', label: 'Log kịch bản', icon: Activity, path: '/scenario-logs' },
      { id: 'system-logs', label: 'Nhật ký hệ thống', icon: Activity, path: '/system-logs' },
      { id: 'log-addresses', label: 'Địa chỉ lưu log', icon: Server, path: '/cloud-managers' },
      // { id: 'cloud-managers', label: 'Quản lý địa chỉ lưu log', icon: Cloud, path: '/cloud-managers' },
    ]
  },

  // === QUẢN LÝ MÃ ĐỘC ===
  {
    id: 'malware-management',
    label: 'Quản lý mã độc',
    icon: Bug,
    path: '#',
    children: [
      { id: 'malware-hashes', label: 'Mã hash mã độc', icon: Hash, path: '/malware-hashes' },
      { id: 'malware-types', label: 'Loại mã độc', icon: Bug, path: '/malware-types' },
      { id: 'peripheral-devices', label: 'Thiết bị ngoại vi', icon: Monitor, path: '/peripheral-devices' },
      // { id: 'scripts', label: 'Kịch bản YARA', icon: FileText, path: '/scripts' },
    ]
  },

  // === QUẢN LÝ CẢNH BÁO ===
  {
    id: 'alert-management',
    label: 'Quản lý cảnh báo',
    icon: Bell,
    path: '#',
    children: [
      { id: 'alerts', label: 'Danh sách cảnh báo', icon: AlertTriangle, path: '/alerts' },
      { id: 'alert-levels', label: 'Mức cảnh báo', icon: Bell, path: '/alert-levels' },
      { id: 'error-codes', label: 'Mã lỗi', icon: AlertTriangle, path: '/error-codes' },
    ]
  },

  // === CẤU HÌNH HỆ THỐNG ===
  {
    id: 'system-config',
    label: 'Cấu hình hệ thống',
    icon: Settings,
    path: '#',
    children: [
      { id: 'system-params', label: 'Tham số hệ thống', icon: Settings, path: '/system-params' },
      { id: 'software-versions', label: 'Phiên bản phần mềm', icon: Package, path: '/software-versions' },
      { id: 'category-type', label: 'Loại danh mục', icon: List, path: '/category-type' },
      { id: 'regions', label: 'Danh mục khu vực', icon: MapPin, path: '/regions' },
      { id: 'cloud-authentication', label: 'Xác thực Cloud', icon: Key, path: '/cloud-authentication' },
      { id: 'system-backup', label: 'Sao lưu & Phục hồi', icon: Database, path: '/system-backup' },
    ]
  },
];

export function Sidebar() {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['security-management', 'log-management']);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const Icon = item.icon;
    const isExpanded = expandedMenus.includes(item.id);
    const isActive = location.pathname === item.path || (item.children?.some(child => child.path === location.pathname));
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={`w-full justify-start h-10 px-3 menu-item btn-animate ${isActive ? 'active' : ''} ${level > 0 ? 'ml-4 w-[calc(100%-1rem)]' : ''}`}
          onClick={() => {
            if (hasChildren) {
              toggleMenu(item.id);
            } else {
              navigate(item.path);
            }
          }}
        >
          <Icon className="mr-3 h-4 w-4 shrink-0" />
          <span className="text-sm flex-1 text-left overflow-hidden whitespace-nowrap text-ellipsis">
            {item.label}
          </span>
          {hasChildren && (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0" />
            )
          )}
        </Button>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex h-16 items-center border-b border-sidebar-border px-6 bg-sidebar">
        <Shield className="h-8 w-8 text-sidebar-primary" />
        <span className="ml-2 text-lg font-semibold text-sidebar-foreground truncate">
          Hệ thống quản trị
        </span>
      </div>
      <div style={{
        height: "93vh",
        overflow: "auto",
      }} className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border scroll-bar-1">
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {menuItems.map((item) => renderMenuItem(item))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}