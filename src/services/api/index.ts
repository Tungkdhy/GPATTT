// Export axios instance
export { default as axiosInstance } from './axiosInstance';

// Export endpoints
export { API_ENDPOINTS } from './endpoints';

// Export services
export { default as usersService } from './users.service';
export { default as devicesService } from './devices.service';
export { default as managedDevicesService } from './managedDevices.service';
export { default as deviceTypesService } from './deviceTypes.service';
export { default as scenariosService } from './scenarios.service';
export { default as softwareVersionsService } from './softwareVersions.service';
export { default as logAddressesService } from './logAddresses.service';
export { default as accountPermissionsService } from './accountPermissions.service';
export { default as blacklistIPsService } from './blacklistIPs.service';
export { default as whitelistIPsService } from './whitelistIPs.service';
export { default as logTypesService } from './logTypes.service';
export { logsService } from './logs.service';
export { default as alertLevelsService } from './alertLevels.service';
export { default as scenarioLogsService } from './scenarioLogs.service';
export { default as authService } from './auth.service';
export { default as roleService } from './role.service';
export { default as actionService } from './action.service';
export { default as categoryService } from './category.service';
export { default as categoryTypeService } from './categoryType.service';
export { scriptCategoriesService } from './scriptCategories.service';
export { default as parametersService } from './params.service';
export { default as malwareTypesService } from './malwareTypes.service';
export { default as managerVersionsService } from './managerVersions.service';
export { default as cloudManagersService } from './cloudManagers.service';
// parametersService
// Export all services from allServices.ts
export {
  systemParamsService,
  insecureDevicesService,
  responseScenariosService,
  firewallConfigsService,
  systemLogsService,
  malwareHashesService,
  // malwareTypesService,
  errorCodesService,
  regionManagementService
} from './allServices';

// Export types
export type { User, CreateUserDto, UpdateUserDto } from './users.service';
export type { Device, CreateDeviceDto, UpdateDeviceDto } from './devices.service';
export type { 
  ManagedDevice, 
  CreateManagedDeviceDto, 
  UpdateManagedDeviceDto,
  ManagedDevicesResponse 
} from './managedDevices.service';
export type { DeviceType, CreateDeviceTypeDto, UpdateDeviceTypeDto } from './deviceTypes.service';
export type { Scenario, CreateScenarioDto, UpdateScenarioDto } from './scenarios.service';
export type { SoftwareVersion, CreateSoftwareVersionDto, UpdateSoftwareVersionDto } from './softwareVersions.service';
export type { LogAddress, CreateLogAddressDto, UpdateLogAddressDto } from './logAddresses.service';
export type { AccountPermission, CreateAccountPermissionDto, UpdateAccountPermissionDto } from './accountPermissions.service';
export type { BlacklistIP, CreateBlacklistIPDto, UpdateBlacklistIPDto } from './blacklistIPs.service';
export type { WhitelistIP, CreateWhitelistIPDto, UpdateWhitelistIPDto } from './whitelistIPs.service';
export type { LogType as LogTypeEntity, CreateLogTypeDto, UpdateLogTypeDto } from './logTypes.service';
export type { Log, LogsResponse, LogsParams, LogUser, LogType } from './logs.service';
export type { AlertLevel, CreateAlertLevelDto, UpdateAlertLevelDto } from './alertLevels.service';
export type { ScenarioLog, CreateScenarioLogDto, UpdateScenarioLogDto } from './scenarioLogs.service';
export type { 
  ManagerVersionItem, 
  ManagerVersionsListResponse, 
  CreateManagerVersionDto, 
  UpdateManagerVersionDto 
} from './managerVersions.service';
export type { 
  CloudManager, 
  CreateCloudManagerDto, 
  UpdateCloudManagerDto 
} from './cloudManagers.service';
export type { 
  ScriptCategory, 
  CreateScriptCategoryDto, 
  UpdateScriptCategoryDto,
  ScriptCategoryResponse
} from './scriptCategories.service';
// export type { 
//   MalwareType, 
//   CreateMalwareTypeDto, 
//   UpdateMalwareTypeDto 
// } from './malwareTypes.service';

// Export types from allServices.ts
export type {
  SystemParam,
  CreateSystemParamDto,
  UpdateSystemParamDto,
  InsecureDevice,
  CreateInsecureDeviceDto,
  UpdateInsecureDeviceDto,
  ResponseScenario,
  CreateResponseScenarioDto,
  UpdateResponseScenarioDto,
  FirewallConfig,
  CreateFirewallConfigDto,
  UpdateFirewallConfigDto,
  SystemLog,
  CreateSystemLogDto,
  UpdateSystemLogDto,
  MalwareType,
  CreateMalwareTypeDto,
  UpdateMalwareTypeDto,
  ErrorCode,
  CreateErrorCodeDto,
  UpdateErrorCodeDto,
  Region,
  CreateRegionDto,
  UpdateRegionDto
} from './allServices';

// Export malware hash types from separate file
export type {
  MalwareHashWithType,
  MalwareHashItem,
  CreateMalwareHashDto,
  UpdateMalwareHashDto
} from './malwareHashes.service';
