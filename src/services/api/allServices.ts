// This file exports all remaining services
// systemParams, insecureDevices, responseScenarios, firewallConfigs, systemLogs, malwareHashes, malwareTypes, errorCodes, regionManagement

import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';
import { logsService } from './logs.service';

// ============= SYSTEM PARAMS SERVICE =============
const mockSystemParams = [
  { id: 1, name: 'session_timeout', value: '3600', category: 'Security', type: 'integer', description: 'Session timeout in seconds' },
  { id: 2, name: 'max_login_attempts', value: '5', category: 'Security', type: 'integer', description: 'Maximum login attempts before lockout' },
  { id: 3, name: 'log_retention_days', value: '90', category: 'System', type: 'integer', description: 'Number of days to retain logs' },
  { id: 4, name: 'alert_email', value: 'admin@example.com', category: 'Notification', type: 'string', description: 'Email for system alerts' },
];

export interface SystemParam {
  id: number;
  name: string;
  value: string;
  category: string;
  type: string;
  description: string;
}

export interface CreateSystemParamDto {
  name: string;
  value: string;
  category: string;
  type: string;
  description: string;
}

export interface UpdateSystemParamDto {
  name?: string;
  value?: string;
  category?: string;
  type?: string;
  description?: string;
}

class SystemParamsService {
  async getAll(): Promise<SystemParam[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockSystemParams), 500);
    });
  }

  async getById(id: number): Promise<SystemParam> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const param = mockSystemParams.find(p => p.id === id);
        if (param) {
          resolve(param);
        } else {
          reject(new Error('System param not found'));
        }
      }, 300);
    });
  }

  async create(data: CreateSystemParamDto): Promise<SystemParam> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newParam: SystemParam = {
          id: mockSystemParams.length + 1,
          ...data
        };
        resolve(newParam);
      }, 500);
    });
  }

  async update(id: number, data: UpdateSystemParamDto): Promise<SystemParam> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const param = mockSystemParams.find(p => p.id === id);
        if (param) {
          const updatedParam = { ...param, ...data };
          resolve(updatedParam);
        } else {
          reject(new Error('System param not found'));
        }
      }, 500);
    });
  }

  async delete(id: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  }
}

export const systemParamsService = new SystemParamsService();

// ============= INSECURE DEVICES SERVICE =============
const mockInsecureDevices = [
  { id: 1, deviceName: 'Workstation-05', ip: '192.168.1.55', vulnerability: 'Outdated OS', severity: 'high', detectedDate: '2024-01-15 10:00', status: 'unresolved' },
  { id: 2, deviceName: 'Server-003', ip: '192.168.1.13', vulnerability: 'Missing security patch', severity: 'critical', detectedDate: '2024-01-14 15:30', status: 'investigating' },
  { id: 3, deviceName: 'Router-Branch', ip: '10.0.10.1', vulnerability: 'Weak password', severity: 'medium', detectedDate: '2024-01-13 09:15', status: 'resolved' },
];

export interface InsecureDevice {
  id: number;
  deviceName: string;
  ip: string;
  vulnerability: string;
  severity: string;
  detectedDate: string;
  status: string;
}

export interface CreateInsecureDeviceDto {
  deviceName: string;
  ip: string;
  vulnerability: string;
  severity: string;
}

export interface UpdateInsecureDeviceDto {
  deviceName?: string;
  ip?: string;
  vulnerability?: string;
  severity?: string;
  status?: string;
}

class InsecureDevicesService {
  async getAll(): Promise<InsecureDevice[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockInsecureDevices), 500);
    });
  }

  async getById(id: number): Promise<InsecureDevice> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const device = mockInsecureDevices.find(d => d.id === id);
        if (device) {
          resolve(device);
        } else {
          reject(new Error('Insecure device not found'));
        }
      }, 300);
    });
  }

  async create(data: CreateInsecureDeviceDto): Promise<InsecureDevice> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDevice: InsecureDevice = {
          id: mockInsecureDevices.length + 1,
          ...data,
          detectedDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
          status: 'unresolved'
        };
        resolve(newDevice);
      }, 500);
    });
  }

  async update(id: number, data: UpdateInsecureDeviceDto): Promise<InsecureDevice> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const device = mockInsecureDevices.find(d => d.id === id);
        if (device) {
          const updatedDevice = { ...device, ...data };
          resolve(updatedDevice);
        } else {
          reject(new Error('Insecure device not found'));
        }
      }, 500);
    });
  }

  async delete(id: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  }
}

export const insecureDevicesService = new InsecureDevicesService();

// ============= RESPONSE SCENARIOS SERVICE =============
const mockResponseScenarios = [
  { id: 1, name: 'Isolate Infected Device', trigger: 'Malware Detected', actions: 'Quarantine device, Block network access', priority: 'critical', autoResponse: 'enabled', description: 'Automatically isolate infected devices' },
  { id: 2, name: 'Block Malicious IP', trigger: 'DDoS Attack', actions: 'Add to blacklist, Update firewall', priority: 'high', autoResponse: 'enabled', description: 'Block attacking IP addresses' },
  { id: 3, name: 'Alert Admin', trigger: 'High CPU Usage', actions: 'Send email, Log event', priority: 'medium', autoResponse: 'disabled', description: 'Notify administrator of resource issues' },
];

export interface ResponseScenario {
  id: number;
  name: string;
  trigger: string;
  actions: string;
  priority: string;
  autoResponse: string;
  description: string;
}

export interface CreateResponseScenarioDto {
  name: string;
  trigger: string;
  actions: string;
  priority: string;
  autoResponse: string;
  description: string;
}

export interface UpdateResponseScenarioDto {
  name?: string;
  trigger?: string;
  actions?: string;
  priority?: string;
  autoResponse?: string;
  description?: string;
}

class ResponseScenariosService {
  async getAll(): Promise<ResponseScenario[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockResponseScenarios), 500);
    });
  }

  async getById(id: number): Promise<ResponseScenario> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const scenario = mockResponseScenarios.find(s => s.id === id);
        if (scenario) {
          resolve(scenario);
        } else {
          reject(new Error('Response scenario not found'));
        }
      }, 300);
    });
  }

  async create(data: CreateResponseScenarioDto): Promise<ResponseScenario> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newScenario: ResponseScenario = {
          id: mockResponseScenarios.length + 1,
          ...data
        };
        resolve(newScenario);
      }, 500);
    });
  }

  async update(id: number, data: UpdateResponseScenarioDto): Promise<ResponseScenario> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const scenario = mockResponseScenarios.find(s => s.id === id);
        if (scenario) {
          const updatedScenario = { ...scenario, ...data };
          resolve(updatedScenario);
        } else {
          reject(new Error('Response scenario not found'));
        }
      }, 500);
    });
  }

  async delete(id: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  }
}

export const responseScenariosService = new ResponseScenariosService();

// ============= FIREWALL CONFIGS SERVICE =============
// Export firewallConfigsService from separate file
export { firewallConfigsService } from './firewallConfigs.service';

// ============= SYSTEM LOGS SERVICE =============
const mockSystemLogs = [
  { id: 1, timestamp: '2024-01-15 12:35:00', module: 'Authentication', action: 'User Login', user: 'admin', result: 'success', ip: '192.168.1.100', details: 'Admin logged in successfully' },
  { id: 2, timestamp: '2024-01-15 12:30:00', module: 'Device Management', action: 'Device Updated', user: 'operator1', result: 'success', ip: '192.168.1.101', details: 'Updated Server-001 configuration' },
  { id: 3, timestamp: '2024-01-15 12:25:00', module: 'Firewall', action: 'Rule Modified', user: 'security', result: 'success', ip: '192.168.1.102', details: 'Modified firewall rule #5' },
];

export interface SystemLog {
  id: number;
  timestamp: string;
  module: string;
  action: string;
  user: string;
  result: string;
  ip: string;
  details: string;
}

export interface CreateSystemLogDto {
  module: string;
  action: string;
  user: string;
  result: string;
  ip: string;
  details: string;
}

export interface UpdateSystemLogDto {
  module?: string;
  action?: string;
  user?: string;
  result?: string;
  ip?: string;
  details?: string;
}

class SystemLogsService {
  async getAll(): Promise<SystemLog[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockSystemLogs), 500);
    });
  }

  async getById(id: number): Promise<SystemLog> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const log = mockSystemLogs.find(l => l.id === id);
        if (log) {
          resolve(log);
        } else {
          reject(new Error('System log not found'));
        }
      }, 300);
    });
  }

  async create(data: CreateSystemLogDto): Promise<SystemLog> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newLog: SystemLog = {
          id: mockSystemLogs.length + 1,
          timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
          ...data
        };
        resolve(newLog);
      }, 500);
    });
  }

  async update(id: number, data: UpdateSystemLogDto): Promise<SystemLog> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const log = mockSystemLogs.find(l => l.id === id);
        if (log) {
          const updatedLog = { ...log, ...data };
          resolve(updatedLog);
        } else {
          reject(new Error('System log not found'));
        }
      }, 500);
    });
  }

  async delete(id: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  }
}

export const systemLogsService = new SystemLogsService();

// ============= MALWARE HASHES SERVICE =============
// Export malwareHashesService from separate file
export { default as malwareHashesService } from './malwareHashes.service';

// ============= MALWARE TYPES SERVICE =============
const mockMalwareTypes = [
  { id: 1, name: 'Trojan', category: 'Malicious Software', severity: 'critical', detection: 'Signature-based', countermeasure: 'Quarantine and remove', description: 'Malware disguised as legitimate software' },
  { id: 2, name: 'Ransomware', category: 'Extortion', severity: 'critical', detection: 'Behavioral analysis', countermeasure: 'Isolate and restore from backup', description: 'Encrypts files and demands payment' },
  { id: 3, name: 'Spyware', category: 'Data Theft', severity: 'high', detection: 'Heuristic scan', countermeasure: 'Remove and change credentials', description: 'Secretly monitors user activity' },
  { id: 4, name: 'Adware', category: 'Unwanted Software', severity: 'low', detection: 'Signature-based', countermeasure: 'Uninstall', description: 'Displays unwanted advertisements' },
];

export interface MalwareType {
  id: number;
  name: string;
  category: string;
  severity: string;
  detection: string;
  countermeasure: string;
  description: string;
}

export interface CreateMalwareTypeDto {
  name: string;
  category: string;
  severity: string;
  detection: string;
  countermeasure: string;
  description: string;
}

export interface UpdateMalwareTypeDto {
  name?: string;
  category?: string;
  severity?: string;
  detection?: string;
  countermeasure?: string;
  description?: string;
}

class MalwareTypesService {
  async getAll(): Promise<MalwareType[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockMalwareTypes), 500);
    });
  }

  async getById(id: number): Promise<MalwareType> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const type = mockMalwareTypes.find(t => t.id === id);
        if (type) {
          resolve(type);
        } else {
          reject(new Error('Malware type not found'));
        }
      }, 300);
    });
  }

  async create(data: CreateMalwareTypeDto): Promise<MalwareType> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newType: MalwareType = {
          id: mockMalwareTypes.length + 1,
          ...data
        };
        resolve(newType);
      }, 500);
    });
  }

  async update(id: number, data: UpdateMalwareTypeDto): Promise<MalwareType> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const type = mockMalwareTypes.find(t => t.id === id);
        if (type) {
          const updatedType = { ...type, ...data };
          resolve(updatedType);
        } else {
          reject(new Error('Malware type not found'));
        }
      }, 500);
    });
  }

  async delete(id: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  }
}

export const malwareTypesService = new MalwareTypesService();

// ============= ERROR CODES SERVICE =============
const mockErrorCodes = [
  { id: 1, code: 'ERR_001', name: 'Authentication Failed', category: 'Security', severity: 'high', message: 'Invalid username or password', resolution: 'Check credentials and try again' },
  { id: 2, code: 'ERR_002', name: 'Connection Timeout', category: 'Network', severity: 'medium', message: 'Unable to connect to remote server', resolution: 'Check network connectivity' },
  { id: 3, code: 'ERR_003', name: 'Database Error', category: 'System', severity: 'critical', message: 'Failed to execute database query', resolution: 'Contact database administrator' },
  { id: 4, code: 'ERR_004', name: 'File Not Found', category: 'System', severity: 'low', message: 'Requested file does not exist', resolution: 'Verify file path and permissions' },
];

export interface ErrorCode {
  id: number;
  code: string;
  name: string;
  category: string;
  severity: string;
  message: string;
  resolution: string;
}

export interface CreateErrorCodeDto {
  code: string;
  name: string;
  category: string;
  severity: string;
  message: string;
  resolution: string;
}

export interface UpdateErrorCodeDto {
  code?: string;
  name?: string;
  category?: string;
  severity?: string;
  message?: string;
  resolution?: string;
}

class ErrorCodesService {
  async getAll(): Promise<ErrorCode[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockErrorCodes), 500);
    });
  }

  async getById(id: number): Promise<ErrorCode> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const errorCode = mockErrorCodes.find(e => e.id === id);
        if (errorCode) {
          resolve(errorCode);
        } else {
          reject(new Error('Error code not found'));
        }
      }, 300);
    });
  }

  async create(data: CreateErrorCodeDto): Promise<ErrorCode> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newErrorCode: ErrorCode = {
          id: mockErrorCodes.length + 1,
          ...data
        };
        resolve(newErrorCode);
      }, 500);
    });
  }

  async update(id: number, data: UpdateErrorCodeDto): Promise<ErrorCode> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const errorCode = mockErrorCodes.find(e => e.id === id);
        if (errorCode) {
          const updatedErrorCode = { ...errorCode, ...data };
          resolve(updatedErrorCode);
        } else {
          reject(new Error('Error code not found'));
        }
      }, 500);
    });
  }

  async delete(id: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  }
}

export const errorCodesService = new ErrorCodesService();

// ============= REGION MANAGEMENT SERVICE =============
const mockRegions = [
  { id: 1, name: 'Hà Nội', code: 'HN', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', devices: 150, status: 'active' },
  { id: 2, name: 'TP. Hồ Chí Minh', code: 'HCM', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', devices: 200, status: 'active' },
  { id: 3, name: 'Đà Nẵng', code: 'DN', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', devices: 80, status: 'active' },
  { id: 4, name: 'Singapore', code: 'SG', country: 'Singapore', timezone: 'Asia/Singapore', devices: 120, status: 'inactive' },
];

export interface Region {
  id: number;
  name: string;
  code: string;
  country: string;
  timezone: string;
  devices: number;
  status: string;
}

export interface CreateRegionDto {
  name: string;
  code: string;
  country: string;
  timezone: string;
  devices: number;
}

export interface UpdateRegionDto {
  name?: string;
  code?: string;
  country?: string;
  timezone?: string;
  devices?: number;
  status?: string;
}

class RegionManagementService {
  async getAll(): Promise<Region[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockRegions), 500);
    });
  }

  async getById(id: number): Promise<Region> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const region = mockRegions.find(r => r.id === id);
        if (region) {
          resolve(region);
        } else {
          reject(new Error('Region not found'));
        }
      }, 300);
    });
  }

  async create(data: CreateRegionDto): Promise<Region> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRegion: Region = {
          id: mockRegions.length + 1,
          ...data,
          status: 'active'
        };
        resolve(newRegion);
      }, 500);
    });
  }

  async update(id: number, data: UpdateRegionDto): Promise<Region> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const region = mockRegions.find(r => r.id === id);
        if (region) {
          const updatedRegion = { ...region, ...data };
          resolve(updatedRegion);
        } else {
          reject(new Error('Region not found'));
        }
      }, 500);
    });
  }

  async delete(id: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  }
}

export const regionManagementService = new RegionManagementService();

// Export the logs service
export { logsService };
