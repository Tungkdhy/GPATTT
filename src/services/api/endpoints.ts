// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },

  // Users
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
    GET: (id: number) => `/users/${id}`,
  },

  // Devices
  DEVICES: {
    LIST: '/devices',
    CREATE: '/devices',
    UPDATE: (id: number) => `/devices/${id}`,
    DELETE: (id: number) => `/devices/${id}`,
    GET: (id: number) => `/devices/${id}`,
  },

  // Device Types
  DEVICE_TYPES: {
    LIST: '/device-types',
    CREATE: '/device-types',
    UPDATE: (id: number) => `/device-types/${id}`,
    DELETE: (id: number) => `/device-types/${id}`,
    GET: (id: number) => `/device-types/${id}`,
  },

  // Scenarios
  SCENARIOS: {
    LIST: '/scenarios',
    CREATE: '/scenarios',
    UPDATE: (id: number) => `/scenarios/${id}`,
    DELETE: (id: number) => `/scenarios/${id}`,
    GET: (id: number) => `/scenarios/${id}`,
  },

  // Software Versions
  SOFTWARE_VERSIONS: {
    LIST: '/software-versions',
    CREATE: '/software-versions',
    UPDATE: (id: number) => `/software-versions/${id}`,
    DELETE: (id: number) => `/software-versions/${id}`,
    GET: (id: number) => `/software-versions/${id}`,
  },

  // Manager Versions
  MANAGER_VERSIONS: {
    LIST: '/manager-versions',
    CREATE: '/manager-versions',
    UPDATE: (id: string | number) => `/manager-versions/${id}`,
    DELETE: (id: string | number) => `/manager-versions/${id}`,
    GET: (id: string | number) => `/manager-versions/${id}`,
  },

  // Log Addresses
  LOG_ADDRESSES: {
    LIST: '/log-addresses',
    CREATE: '/log-addresses',
    UPDATE: (id: number) => `/log-addresses/${id}`,
    DELETE: (id: number) => `/log-addresses/${id}`,
    GET: (id: number) => `/log-addresses/${id}`,
  },

  // Blacklist IPs
  BLACKLIST_IPS: {
    LIST: '/blacklist-ips',
    CREATE: '/blacklist-ips',
    UPDATE: (id: number) => `/blacklist-ips/${id}`,
    DELETE: (id: number) => `/blacklist-ips/${id}`,
    GET: (id: number) => `/blacklist-ips/${id}`,
  },

  // Whitelist IPs
  WHITELIST_IPS: {
    LIST: '/whitelist-ips',
    CREATE: '/whitelist-ips',
    UPDATE: (id: number) => `/whitelist-ips/${id}`,
    DELETE: (id: number) => `/whitelist-ips/${id}`,
    GET: (id: number) => `/whitelist-ips/${id}`,
  },

  // Account Permissions
  ACCOUNT_PERMISSIONS: {
    LIST: '/account-permissions',
    CREATE: '/account-permissions',
    UPDATE: (id: number) => `/account-permissions/${id}`,
    DELETE: (id: number) => `/account-permissions/${id}`,
    GET: (id: number) => `/account-permissions/${id}`,
  },

  // Log Types
  LOG_TYPES: {
    LIST: '/log-types',
    CREATE: '/log-types',
    UPDATE: (id: number) => `/log-types/${id}`,
    DELETE: (id: number) => `/log-types/${id}`,
    GET: (id: number) => `/log-types/${id}`,
  },

  // Logs
  LOGS: {
    LIST: '/logs',
    CREATE: '/logs',
    UPDATE: (id: number) => `/logs/${id}`,
    DELETE: (id: number) => `/logs/${id}`,
    GET: (id: number) => `/logs/${id}`,
  },

  // Alert Levels
  ALERT_LEVELS: {
    LIST: '/alert-levels',
    CREATE: '/alert-levels',
    UPDATE: (id: number) => `/alert-levels/${id}`,
    DELETE: (id: number) => `/alert-levels/${id}`,
    GET: (id: number) => `/alert-levels/${id}`,
  },

  // Scenario Logs
  SCENARIO_LOGS: {
    LIST: '/scenario-logs',
    CREATE: '/scenario-logs',
    UPDATE: (id: number) => `/scenario-logs/${id}`,
    DELETE: (id: number) => `/scenario-logs/${id}`,
    GET: (id: number) => `/scenario-logs/${id}`,
  },

  // Insecure Devices
  INSECURE_DEVICES: {
    LIST: '/insecure-devices',
    CREATE: '/insecure-devices',
    UPDATE: (id: number) => `/insecure-devices/${id}`,
    DELETE: (id: number) => `/insecure-devices/${id}`,
    GET: (id: number) => `/insecure-devices/${id}`,
  },

  // System Logs
  SYSTEM_LOGS: {
    LIST: '/system-logs',
    CREATE: '/system-logs',
    UPDATE: (id: number) => `/system-logs/${id}`,
    DELETE: (id: number) => `/system-logs/${id}`,
    GET: (id: number) => `/system-logs/${id}`,
  },

  // Response Scenarios
  RESPONSE_SCENARIOS: {
    LIST: '/response-scenarios',
    CREATE: '/response-scenarios',
    UPDATE: (id: number) => `/response-scenarios/${id}`,
    DELETE: (id: number) => `/response-scenarios/${id}`,
    GET: (id: number) => `/response-scenarios/${id}`,
  },

  // Cloud Managers
  CLOUD_MANAGERS: {
    LIST: '/cloud-managers',
    CREATE: '/cloud-managers',
    UPDATE: (id: string) => `/cloud-managers/${id}`,
    DELETE: (id: string) => `/cloud-managers/${id}`,
    GET: (id: string) => `/cloud-managers/${id}`,
  },

  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_ACTIVITIES: '/dashboard/recent-activities',
  },
};
