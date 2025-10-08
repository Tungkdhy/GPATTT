import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';

// Base interface for common fields
interface BaseFirewallConfig {
  id: string;
  name: string;
  description: string;
  note: string;
  enable: boolean;
  created_by: string;
  updated_by: string | null;
  deleted_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by_user: {
    id: string;
    user_name: string;
    display_name: string;
  };
  updated_by_user: {
    id: string;
    user_name: string;
    display_name: string;
  } | null;
}

// ACL Rule interface
export interface AclRule extends BaseFirewallConfig {
  config_type: 'acl';
  action: 'allow' | 'deny' | 'log';
  action_direction: 'inbound' | 'outbound';
  protocol: string;
  from_ip: string;
  to_ip: string;
  from_ip_prefix: string;
  to_ip_prefix: string;
  from_ports: string;
  to_ports: string;
  priority: number;
  alias_type: null;
  ip: null;
  alias_type_category: null;
}

// IPSec Tunnel interface
export interface IpsecTunnel extends BaseFirewallConfig {
  config_type: 'ipsec';
  action: 'allow' | 'deny' | 'log';
  action_direction: 'both';
  protocol: 'esp' | 'ah';
  from_ip: string;
  to_ip: string;
  from_ip_prefix: string;
  to_ip_prefix: string;
  from_ports: null;
  to_ports: null;
  priority: number;
  alias_type: null;
  ip: null;
  alias_type_category: null;
}

// IP Alias interface
export interface IpAlias extends BaseFirewallConfig {
  config_type: 'alias';
  action: null;
  action_direction: null;
  protocol: null;
  from_ip: null;
  to_ip: null;
  from_ip_prefix: null;
  to_ip_prefix: null;
  from_ports: null;
  to_ports: null;
  priority: null;
  alias_type: string;
  ip: string;
  alias_type_category: {
    id: string;
    display_name: string;
  };
}

// Union type for all firewall config types
export type FirewallConfig = AclRule | IpsecTunnel | IpAlias;

// ACL Rule DTOs - exact structure from your data
export interface CreateAclRuleDto {
  name: string;
  action: "allow";
  action_direction: "inbound";
  protocol: "tcp";
  from_ip: string;
  to_ip: string;
  from_ip_prefix: string;
  to_ip_prefix: string;
  from_ports: string;
  to_ports: string;
  priority: number;
  enable: boolean;
  description: string;
  note: string;
}

export interface UpdateAclRuleDto extends Partial<CreateAclRuleDto> {}

// IPSec Tunnel DTOs - exact structure from your data
export interface CreateIpsecTunnelDto {
  name: string;
  action: "allow";
  action_direction: "both";
  protocol: "esp";
  from_ip: string;
  to_ip: string;
  from_ip_prefix: string;
  to_ip_prefix: string;
  priority: number;
  enable: boolean;
  description: string;
  note: string;
}

export interface UpdateIpsecTunnelDto extends Partial<CreateIpsecTunnelDto> {}

// IP Alias DTOs - exact structure from your data
export interface CreateIpAliasDto {
  name: string;
  alias_type: string;
  description: string;
  ip: string;
  note: string;
  enable: boolean;
}

export interface UpdateIpAliasDto extends Partial<CreateIpAliasDto> {}

// Union types for DTOs
export type CreateFirewallConfigDto = CreateAclRuleDto | CreateIpsecTunnelDto | CreateIpAliasDto;
export type UpdateFirewallConfigDto = UpdateAclRuleDto | UpdateIpsecTunnelDto | UpdateIpAliasDto;

export interface FirewallConfigsResponse {
  statusCode: string;
  message: string;
  data: {
    count: number;
    rows: FirewallConfig[];
  };
}

class FirewallConfigsService {
  // Get all configs from the main endpoint (as before)
  async getAll(pageSize: number = 10, pageIndex: number = 1): Promise<FirewallConfig[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.FIREWALL_CONFIGS.LIST, {
      params: { pageSize, pageIndex }
    });
    return response.data.data?.rows || [];
  }

  // ACL Rules methods
  async getAclRules(pageSize: number = 10, pageIndex: number = 1): Promise<AclRule[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.ACL_RULES.LIST, {
      params: { pageSize, pageIndex }
    });
    return response.data.data?.rows || [];
  }

  async getAclRuleById(id: string): Promise<AclRule> {
    const response = await axiosInstance.get(API_ENDPOINTS.ACL_RULES.GET(id));
    return response.data.data;
  }

  async createAclRule(data: CreateAclRuleDto): Promise<AclRule> {
    const response = await axiosInstance.post(API_ENDPOINTS.ACL_RULES.CREATE, data);
    return response.data.data;
  }

  async updateAclRule(id: string, data: UpdateAclRuleDto): Promise<AclRule> {
    const response = await axiosInstance.put(API_ENDPOINTS.ACL_RULES.UPDATE(id), data);
    return response.data.data;
  }

  async deleteAclRule(id: string): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.ACL_RULES.DELETE(id));
  }

  // IPSec Tunnels methods
  async getIpsecTunnels(pageSize: number = 10, pageIndex: number = 1): Promise<IpsecTunnel[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.IPSEC_TUNNELS.LIST, {
      params: { pageSize, pageIndex }
    });
    return response.data.data?.rows || [];
  }

  async getIpsecTunnelById(id: string): Promise<IpsecTunnel> {
    const response = await axiosInstance.get(API_ENDPOINTS.IPSEC_TUNNELS.GET(id));
    return response.data.data;
  }

  async createIpsecTunnel(data: CreateIpsecTunnelDto): Promise<IpsecTunnel> {
    const response = await axiosInstance.post(API_ENDPOINTS.IPSEC_TUNNELS.CREATE, data);
    return response.data.data;
  }

  async updateIpsecTunnel(id: string, data: UpdateIpsecTunnelDto): Promise<IpsecTunnel> {
    const response = await axiosInstance.put(API_ENDPOINTS.IPSEC_TUNNELS.UPDATE(id), data);
    return response.data.data;
  }

  async deleteIpsecTunnel(id: string): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.IPSEC_TUNNELS.DELETE(id));
  }

  // IP Aliases methods
  async getIpAliases(pageSize: number = 10, pageIndex: number = 1): Promise<IpAlias[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.IP_ALIASES.LIST, {
      params: { pageSize, pageIndex }
    });
    return response.data.data?.rows || [];
  }

  async getIpAliasById(id: string): Promise<IpAlias> {
    const response = await axiosInstance.get(API_ENDPOINTS.IP_ALIASES.GET(id));
    return response.data.data;
  }

  async createIpAlias(data: CreateIpAliasDto): Promise<IpAlias> {
    const response = await axiosInstance.post(API_ENDPOINTS.IP_ALIASES.CREATE, data);
    return response.data.data;
  }

  async updateIpAlias(id: string, data: UpdateIpAliasDto): Promise<IpAlias> {
    const response = await axiosInstance.put(API_ENDPOINTS.IP_ALIASES.UPDATE(id), data);
    return response.data.data;
  }

  async deleteIpAlias(id: string): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.IP_ALIASES.DELETE(id));
  }

  // Generic methods that determine the endpoint based on config type
  async create(data: CreateFirewallConfigDto): Promise<FirewallConfig> {
    // Determine endpoint based on data structure
    if ('alias_type' in data && 'ip' in data && !('action' in data)) {
      // IP Alias: has alias_type and ip, but no action
      return await this.createIpAlias(data as CreateIpAliasDto);
    } else if ('action_direction' in data && data.action_direction === 'both') {
      // IPSec Tunnel: has action_direction = "both"
      return await this.createIpsecTunnel(data as CreateIpsecTunnelDto);
    } else if ('action_direction' in data && data.action_direction === 'inbound') {
      // ACL Rule: has action_direction = "inbound"
      return await this.createAclRule(data as CreateAclRuleDto);
    } else {
      throw new Error('Cannot determine config type from data structure');
    }
  }

  async update(id: string, data: UpdateFirewallConfigDto): Promise<FirewallConfig> {
    // Determine endpoint based on data structure
    if ('alias_type' in data && 'ip' in data && !('action' in data)) {
      // IP Alias: has alias_type and ip, but no action
      return await this.updateIpAlias(id, data as UpdateIpAliasDto);
    } else if ('action_direction' in data && data.action_direction === 'both') {
      // IPSec Tunnel: has action_direction = "both"
      return await this.updateIpsecTunnel(id, data as UpdateIpsecTunnelDto);
    } else if ('action_direction' in data && data.action_direction === 'inbound') {
      // ACL Rule: has action_direction = "inbound"
      return await this.updateAclRule(id, data as UpdateAclRuleDto);
    } else {
      throw new Error('Cannot determine config type from data structure');
    }
  }

  async delete(id: string, configType: 'acl' | 'ipsec' | 'alias'): Promise<void> {
    switch (configType) {
      case 'acl':
        await this.deleteAclRule(id);
        break;
      case 'ipsec':
        await this.deleteIpsecTunnel(id);
        break;
      case 'alias':
        await this.deleteIpAlias(id);
        break;
      default:
        throw new Error(`Unknown config type: ${configType}`);
    }
  }
}

export const firewallConfigsService = new FirewallConfigsService();

// Helper functions to create sample data with exact structure
export const createSampleAclRule = (): CreateAclRuleDto => ({
  name: "ACL Rule 1",
  action: "allow",
  action_direction: "inbound",
  protocol: "tcp",
  from_ip: "192.168.1.0",
  to_ip: "10.0.0.1",
  from_ip_prefix: "192.168.1.0/24",
  to_ip_prefix: "10.0.0.0/8",
  from_ports: "80,443,8080,8443",
  to_ports: "80,443",
  priority: 100,
  enable: true,
  description: "Allow HTTP traffic from internal network",
  note: "Created for web server access"
});

export const createSampleIpsecTunnel = (): CreateIpsecTunnelDto => ({
  name: "IPSec Tunnel 1",
  action: "allow",
  action_direction: "both",
  protocol: "esp",
  from_ip: "192.168.1.1",
  to_ip: "203.0.113.1",
  from_ip_prefix: "192.168.1.0/24",
  to_ip_prefix: "203.0.113.0/24",
  priority: 200,
  enable: true,
  description: "Site-to-site VPN tunnel",
  note: "Encrypt traffic between offices"
});

export const createSampleIpAlias = (): CreateIpAliasDto => ({
  name: "Web Servers",
  alias_type: "a0927a81-708e-4693-a43d-37e376365562",
  description: "Group of web servers",
  ip: "192.168.1.10,192.168.1.11,192.168.1.12",
  note: "Internal web servers",
  enable: true
});
