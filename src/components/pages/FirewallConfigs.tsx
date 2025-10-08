import { Badge } from '../ui/badge';
import { DataTable } from '../common/DataTable';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { 
  firewallConfigsService, 
  FirewallConfig, 
  IpAlias
} from '../../services/api/firewallConfigs.service';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Type guard function
const isIpAlias = (config: FirewallConfig): config is IpAlias => config.config_type === 'alias';

const getActionColor = (action: string | null) => {
  if (!action) return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  switch (action.toLowerCase()) {
    case 'allow': return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'deny': return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'log': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const getActionText = (action: string | null) => {
  if (!action) return 'Không xác định';
  switch (action.toLowerCase()) {
    case 'allow': return 'Cho phép';
    case 'deny': return 'Từ chối';
    case 'log': return 'Ghi log';
    default: return 'Không xác định';
  }
};

const getConfigTypeColor = (configType: string) => {
  switch (configType.toLowerCase()) {
    case 'acl': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'ipsec': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    case 'alias': return 'bg-green-500/10 text-green-500 border-green-500/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const getConfigTypeText = (configType: string) => {
  switch (configType.toLowerCase()) {
    case 'acl': return 'ACL Rule';
    case 'ipsec': return 'IPSec Tunnel';
    case 'alias': return 'IP Alias';
    default: return configType;
  }
};

const getDirectionColor = (direction: string | null) => {
  if (!direction) return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  switch (direction.toLowerCase()) {
    case 'inbound': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'outbound': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    case 'both': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const getDirectionText = (direction: string | null) => {
  if (!direction) return 'Không xác định';
  switch (direction.toLowerCase()) {
    case 'inbound': return 'Inbound';
    case 'outbound': return 'Outbound';
    case 'both': return 'Both';
    default: return direction;
  }
};

const columns = [
  {
    key: 'name',
    title: 'Tên cấu hình'
  },
  {
    key: 'config_type',
    title: 'Loại',
    render: (value: string) => (
      <Badge variant="outline" className={getConfigTypeColor(value)}>
        {getConfigTypeText(value)}
      </Badge>
    )
  },
  {
    key: 'action_direction',
    title: 'Hướng',
    render: (value: string | null) => (
      <Badge variant="outline" className={getDirectionColor(value)}>
        {getDirectionText(value)}
      </Badge>
    )
  },
  {
    key: 'protocol',
    title: 'Protocol',
    render: (value: string | null) => value || '-'
  },
  {
    key: 'from_ports',
    title: 'Cổng nguồn',
    render: (value: string | null, record: FirewallConfig) => {
      if (isIpAlias(record)) return '-';
      return value || '-';
    }
  },
  {
    key: 'to_ports',
    title: 'Cổng đích',
    render: (value: string | null, record: FirewallConfig) => {
      if (isIpAlias(record)) return '-';
      return value || '-';
    }
  },
  {
    key: 'action',
    title: 'Hành động',
    render: (value: string | null) => (
      <Badge variant="outline" className={getActionColor(value)}>
        {getActionText(value)}
      </Badge>
    )
  },
  {
    key: 'priority',
    title: 'Ưu tiên'
  },
  {
    key: 'enable',
    title: 'Trạng thái',
    render: (value: boolean) => (
      <Badge variant="outline" className={value ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}>
        {value ? 'Kích hoạt' : 'Tắt'}
      </Badge>
    )
  },
  {
    key: 'ip',
    title: 'Danh sách IP',
    render: (value: string | null, record: FirewallConfig) => {
      if (isIpAlias(record)) return value || '-';
      return '-';
    }
  },
  {
    key: 'description',
    title: 'Mô tả'
  }
];

const renderForm = (formData: any, setFormData: (data: any) => void, selectedConfigType?: string, onConfigTypeChange?: (type: string) => void) => {
  console.log('Rendering form with selectedConfigType:', selectedConfigType);
  console.log('Current form data:', formData);
  
  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <div className="space-y-4 py-4">
      {/* Config type selector */}
      <div className="space-y-2">
        <Label htmlFor="config-type">
          Loại cấu hình *
        </Label>
        <Select 
          value={selectedConfigType || formData.config_type} 
          onValueChange={(value: string) => {
            onConfigTypeChange?.(value);
            updateFormData('config_type', value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại cấu hình" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="acl">ACL Rule</SelectItem>
            <SelectItem value="ipsec">IPSec Tunnel</SelectItem>
            <SelectItem value="alias">IP Alias</SelectItem>
          </SelectContent>
        </Select>
      </div>

    {/* Common fields for all types */}
    <div className="space-y-2">
      <Label htmlFor="config-name">
        Tên cấu hình *
      </Label>
      <Input 
        id="config-name" 
        placeholder="Nhập tên cấu hình" 
        value={formData.name || ''}
        onChange={(e) => updateFormData('name', e.target.value)}
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="config-description">
        Mô tả
      </Label>
      <Textarea 
        id="config-description" 
        placeholder="Nhập mô tả" 
        rows={2}
        value={formData.description || ''}
        onChange={(e) => updateFormData('description', e.target.value)}
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="config-note">
        Ghi chú
      </Label>
      <Textarea 
        id="config-note" 
        placeholder="Nhập ghi chú" 
        rows={2}
        value={formData.note || ''}
        onChange={(e) => updateFormData('note', e.target.value)}
      />
    </div>

    <div className="flex items-center space-x-2">
      <Switch 
        id="config-enable" 
        checked={formData.enable !== undefined ? formData.enable : true}
        onCheckedChange={(checked: boolean) => updateFormData('enable', checked)}
      />
      <Label htmlFor="config-enable">Kích hoạt cấu hình</Label>
    </div>

    {/* ACL Rule specific fields */}
    {selectedConfigType === 'acl' && (
      <>
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Cấu hình ACL Rule</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="acl-action">
                Hành động *
              </Label>
              <Select 
                value={formData.action || 'allow'}
                onValueChange={(value: string) => updateFormData('action', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allow">Allow</SelectItem>
                  <SelectItem value="deny">Deny</SelectItem>
                  <SelectItem value="log">Log</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="acl-direction">
                Hướng *
              </Label>
              <Select 
                value={formData.action_direction || 'inbound'}
                onValueChange={(value: string) => updateFormData('action_direction', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inbound">Inbound</SelectItem>
                  <SelectItem value="outbound">Outbound</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="acl-protocol">
              Protocol *
            </Label>
            <Select 
              value={formData.protocol || 'tcp'}
              onValueChange={(value: string) => updateFormData('protocol', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tcp">TCP</SelectItem>
                <SelectItem value="udp">UDP</SelectItem>
                <SelectItem value="all">ALL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="acl-from-ip">
                IP nguồn *
              </Label>
              <Input 
                id="acl-from-ip" 
                placeholder="192.168.1.0"
                value={formData.from_ip || ''}
                onChange={(e) => updateFormData('from_ip', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="acl-from-prefix">
                Prefix nguồn *
              </Label>
              <Input 
                id="acl-from-prefix" 
                placeholder="192.168.1.0/24"
                value={formData.from_ip_prefix || ''}
                onChange={(e) => updateFormData('from_ip_prefix', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="acl-to-ip">
                IP đích *
              </Label>
              <Input 
                id="acl-to-ip" 
                placeholder="10.0.0.1"
                value={formData.to_ip || ''}
                onChange={(e) => updateFormData('to_ip', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="acl-to-prefix">
                Prefix đích *
              </Label>
              <Input 
                id="acl-to-prefix" 
                placeholder="10.0.0.0/8"
                value={formData.to_ip_prefix || ''}
                onChange={(e) => updateFormData('to_ip_prefix', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="acl-from-ports">
                Cổng nguồn *
              </Label>
              <Input 
                id="acl-from-ports" 
                placeholder="80,443,8080,8443"
                value={formData.from_ports || ''}
                onChange={(e) => updateFormData('from_ports', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="acl-to-ports">
                Cổng đích *
              </Label>
              <Input 
                id="acl-to-ports" 
                placeholder="80,443"
                value={formData.to_ports || ''}
                onChange={(e) => updateFormData('to_ports', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="acl-priority">
              Ưu tiên *
            </Label>
            <Input 
              id="acl-priority" 
              type="number" 
              placeholder="100"
              value={formData.priority || ''}
              onChange={(e) => updateFormData('priority', e.target.value)}
            />
          </div>
        </div>
      </>
    )}

    {/* IPSec Tunnel specific fields */}
    {selectedConfigType === 'ipsec' && (
      <>
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Cấu hình IPSec Tunnel</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ipsec-action">
                Hành động *
              </Label>
              <Select 
                value={formData.action || 'allow'}
                onValueChange={(value: string) => updateFormData('action', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allow">Allow</SelectItem>
                  <SelectItem value="deny">Deny</SelectItem>
                  <SelectItem value="log">Log</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ipsec-direction">
                Hướng *
              </Label>
              <Select 
                value="both"
                onValueChange={(value: string) => updateFormData('action_direction', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="ipsec-protocol">
              Protocol *
            </Label>
            <Select 
              value={formData.protocol || 'esp'}
              onValueChange={(value: string) => updateFormData('protocol', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="esp">ESP</SelectItem>
                <SelectItem value="ah">AH</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="ipsec-from-ip">
                IP nguồn *
              </Label>
              <Input 
                id="ipsec-from-ip" 
                placeholder="192.168.1.1"
                value={formData.from_ip || ''}
                onChange={(e) => updateFormData('from_ip', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ipsec-from-prefix">
                Prefix nguồn *
              </Label>
              <Input 
                id="ipsec-from-prefix" 
                placeholder="192.168.1.0/24"
                value={formData.from_ip_prefix || ''}
                onChange={(e) => updateFormData('from_ip_prefix', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="ipsec-to-ip">
                IP đích *
              </Label>
              <Input 
                id="ipsec-to-ip" 
                placeholder="203.0.113.1"
                value={formData.to_ip || ''}
                onChange={(e) => updateFormData('to_ip', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ipsec-to-prefix">
                Prefix đích *
              </Label>
              <Input 
                id="ipsec-to-prefix" 
                placeholder="203.0.113.0/24"
                value={formData.to_ip_prefix || ''}
                onChange={(e) => updateFormData('to_ip_prefix', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="ipsec-priority">
              Ưu tiên *
            </Label>
            <Input 
              id="ipsec-priority" 
              type="number" 
              placeholder="200"
              value={formData.priority || ''}
              onChange={(e) => updateFormData('priority', e.target.value)}
            />
          </div>
        </div>
      </>
    )}

    {/* IP Alias specific fields */}
    {selectedConfigType === 'alias' && (
      <>
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Cấu hình IP Alias</h4>
          
          <div className="space-y-2">
            <Label htmlFor="alias-type">
              Loại Alias *
            </Label>
            <Input 
              id="alias-type" 
              placeholder="a0927a81-708e-4693-a43d-37e376365562"
              value={formData.alias_type || ''}
              onChange={(e) => updateFormData('alias_type', e.target.value)}
            />
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="alias-ip">
              Danh sách IP *
            </Label>
            <Input 
              id="alias-ip" 
              placeholder="192.168.1.10,192.168.1.11,192.168.1.12"
              value={formData.ip || ''}
              onChange={(e) => updateFormData('ip', e.target.value)}
            />
          </div>
        </div>
      </>
    )}
  </div>
  );
};

const renderEditForm = (record: FirewallConfig, formData: any, setFormData: (data: any) => void) => {
  console.log('Rendering edit form for record:', record);
  console.log('Current form data:', formData);
  
  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <div className="space-y-4 py-4">
      {/* Config type selector - disabled for edit */}
      <div className="space-y-2">
        <Label htmlFor="edit-config-type">
          Loại cấu hình *
        </Label>
        <Select 
          value={record?.config_type} 
          disabled
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="acl">ACL Rule</SelectItem>
            <SelectItem value="ipsec">IPSec Tunnel</SelectItem>
            <SelectItem value="alias">IP Alias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Common fields for all types */}
      <div className="space-y-2">
        <Label htmlFor="edit-config-name">
          Tên cấu hình *
        </Label>
        <Input 
          id="edit-config-name" 
          placeholder="Nhập tên cấu hình" 
          value={formData.name || ''}
          onChange={(e) => updateFormData('name', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-config-description">
          Mô tả
        </Label>
        <Textarea 
          id="edit-config-description" 
          placeholder="Nhập mô tả" 
          rows={2}
          value={formData.description || ''}
          onChange={(e) => updateFormData('description', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-config-note">
          Ghi chú
        </Label>
        <Textarea 
          id="edit-config-note" 
          placeholder="Nhập ghi chú" 
          rows={2}
          value={formData.note || ''}
          onChange={(e) => updateFormData('note', e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="edit-config-enable" 
          checked={formData.enable !== undefined ? formData.enable : true}
          onCheckedChange={(checked: boolean) => updateFormData('enable', checked)}
        />
        <Label htmlFor="edit-config-enable">Kích hoạt cấu hình</Label>
      </div>

      {/* ACL Rule specific fields */}
      {record?.config_type === 'acl' && (
        <>
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Cấu hình ACL Rule</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-acl-action">
                  Hành động *
                </Label>
                <Select 
                  value={formData.action || 'allow'}
                  onValueChange={(value: string) => updateFormData('action', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allow">Allow</SelectItem>
                    <SelectItem value="deny">Deny</SelectItem>
                    <SelectItem value="log">Log</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-acl-direction">
                  Hướng *
                </Label>
                <Select 
                  value={formData.action_direction || 'inbound'}
                  onValueChange={(value: string) => updateFormData('action_direction', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inbound">Inbound</SelectItem>
                    <SelectItem value="outbound">Outbound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="edit-acl-protocol">
                Protocol *
              </Label>
              <Select 
                value={formData.protocol || 'tcp'}
                onValueChange={(value: string) => updateFormData('protocol', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tcp">TCP</SelectItem>
                  <SelectItem value="udp">UDP</SelectItem>
                  <SelectItem value="all">ALL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-acl-from-ip">
                  IP nguồn *
                </Label>
                <Input 
                  id="edit-acl-from-ip" 
                  placeholder="192.168.1.0"
                  value={formData.from_ip || ''}
                  onChange={(e) => updateFormData('from_ip', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-acl-from-prefix">
                  Prefix nguồn *
                </Label>
                <Input 
                  id="edit-acl-from-prefix" 
                  placeholder="192.168.1.0/24"
                  value={formData.from_ip_prefix || ''}
                  onChange={(e) => updateFormData('from_ip_prefix', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-acl-to-ip">
                  IP đích *
                </Label>
                <Input 
                  id="edit-acl-to-ip" 
                  placeholder="10.0.0.1"
                  value={formData.to_ip || ''}
                  onChange={(e) => updateFormData('to_ip', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-acl-to-prefix">
                  Prefix đích *
                </Label>
                <Input 
                  id="edit-acl-to-prefix" 
                  placeholder="10.0.0.0/8"
                  value={formData.to_ip_prefix || ''}
                  onChange={(e) => updateFormData('to_ip_prefix', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-acl-from-ports">
                  Cổng nguồn *
                </Label>
                <Input 
                  id="edit-acl-from-ports" 
                  placeholder="80,443,8080,8443"
                  value={formData.from_ports || ''}
                  onChange={(e) => updateFormData('from_ports', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-acl-to-ports">
                  Cổng đích *
                </Label>
                <Input 
                  id="edit-acl-to-ports" 
                  placeholder="80,443"
                  value={formData.to_ports || ''}
                  onChange={(e) => updateFormData('to_ports', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="edit-acl-priority">
                Ưu tiên *
              </Label>
              <Input 
                id="edit-acl-priority" 
                type="number" 
                placeholder="100"
                value={formData.priority || ''}
                onChange={(e) => updateFormData('priority', e.target.value)}
              />
            </div>
          </div>
        </>
      )}

      {/* IPSec Tunnel specific fields */}
      {record?.config_type === 'ipsec' && (
        <>
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Cấu hình IPSec Tunnel</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-ipsec-action">
                  Hành động *
                </Label>
                <Select 
                  value={formData.action || 'allow'}
                  onValueChange={(value: string) => updateFormData('action', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allow">Allow</SelectItem>
                    <SelectItem value="deny">Deny</SelectItem>
                    <SelectItem value="log">Log</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ipsec-direction">
                  Hướng *
                </Label>
                <Select 
                  value="both"
                  disabled
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="edit-ipsec-protocol">
                Protocol *
              </Label>
              <Select 
                value={formData.protocol || 'esp'}
                onValueChange={(value: string) => updateFormData('protocol', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="esp">ESP</SelectItem>
                  <SelectItem value="ah">AH</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-ipsec-from-ip">
                  IP nguồn *
                </Label>
                <Input 
                  id="edit-ipsec-from-ip" 
                  placeholder="192.168.1.1"
                  value={formData.from_ip || ''}
                  onChange={(e) => updateFormData('from_ip', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ipsec-from-prefix">
                  Prefix nguồn *
                </Label>
                <Input 
                  id="edit-ipsec-from-prefix" 
                  placeholder="192.168.1.0/24"
                  value={formData.from_ip_prefix || ''}
                  onChange={(e) => updateFormData('from_ip_prefix', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-ipsec-to-ip">
                  IP đích *
                </Label>
                <Input 
                  id="edit-ipsec-to-ip" 
                  placeholder="203.0.113.1"
                  value={formData.to_ip || ''}
                  onChange={(e) => updateFormData('to_ip', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ipsec-to-prefix">
                  Prefix đích *
                </Label>
                <Input 
                  id="edit-ipsec-to-prefix" 
                  placeholder="203.0.113.0/24"
                  value={formData.to_ip_prefix || ''}
                  onChange={(e) => updateFormData('to_ip_prefix', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="edit-ipsec-priority">
                Ưu tiên *
              </Label>
              <Input 
                id="edit-ipsec-priority" 
                type="number" 
                placeholder="200"
                value={formData.priority || ''}
                onChange={(e) => updateFormData('priority', e.target.value)}
              />
            </div>
          </div>
        </>
      )}

      {/* IP Alias specific fields */}
      {record?.config_type === 'alias' && (
        <>
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Cấu hình IP Alias</h4>
            
            <div className="space-y-2">
              <Label htmlFor="edit-alias-type">
                Loại Alias *
              </Label>
              <Input 
                id="edit-alias-type" 
                placeholder="a0927a81-708e-4693-a43d-37e376365562"
                value={formData.alias_type || ''}
                onChange={(e) => updateFormData('alias_type', e.target.value)}
              />
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="edit-alias-ip">
                Danh sách IP *
              </Label>
              <Input 
                id="edit-alias-ip" 
                placeholder="192.168.1.10,192.168.1.11,192.168.1.12"
                value={formData.ip || ''}
                onChange={(e) => updateFormData('ip', e.target.value)}
              />
          </div>
        </div>
      </>
    )}
  </div>
  );
};

const renderViewForm = (record: FirewallConfig) => {
  console.log('Rendering view form for record:', record);
  
  if (!record) {
    return <div>Không có dữ liệu để hiển thị</div>;
  }
  
  return (
    <div className="space-y-6 py-4">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-500">Tên cấu hình</Label>
            <p className="text-sm">{record.name}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">Loại cấu hình</Label>
            <Badge variant="outline" className={getConfigTypeColor(record.config_type)}>
              {getConfigTypeText(record.config_type)}
            </Badge>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">Trạng thái</Label>
            <Badge variant="outline" className={record.enable ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}>
              {record.enable ? 'Kích hoạt' : 'Tắt'}
            </Badge>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">Ưu tiên</Label>
            <p className="text-sm">{record.priority || '-'}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-500">Mô tả</Label>
          <p className="text-sm">{record.description || '-'}</p>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-500">Ghi chú</Label>
          <p className="text-sm">{record.note || '-'}</p>
        </div>
      </div>

      {/* ACL Rule specific fields */}
      {record.config_type === 'acl' && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-semibold">Cấu hình ACL Rule</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Hành động</Label>
              <Badge variant="outline" className={getActionColor(record.action)}>
                {getActionText(record.action)}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Hướng</Label>
              <Badge variant="outline" className={getDirectionColor(record.action_direction)}>
                {getDirectionText(record.action_direction)}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Protocol</Label>
              <p className="text-sm">{record.protocol || '-'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Cổng nguồn</Label>
              <p className="text-sm">{record.from_ports || '-'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Cổng đích</Label>
              <p className="text-sm">{record.to_ports || '-'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">IP nguồn</Label>
              <p className="text-sm">{record.from_ip || '-'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Prefix nguồn</Label>
              <p className="text-sm">{record.from_ip_prefix || '-'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">IP đích</Label>
              <p className="text-sm">{record.to_ip || '-'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Prefix đích</Label>
              <p className="text-sm">{record.to_ip_prefix || '-'}</p>
            </div>
          </div>
        </div>
      )}

      {/* IPSec Tunnel specific fields */}
      {record.config_type === 'ipsec' && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-semibold">Cấu hình IPSec Tunnel</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Hành động</Label>
              <Badge variant="outline" className={getActionColor(record.action)}>
                {getActionText(record.action)}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Hướng</Label>
              <Badge variant="outline" className={getDirectionColor(record.action_direction)}>
                {getDirectionText(record.action_direction)}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Protocol</Label>
              <p className="text-sm">{record.protocol || '-'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">IP nguồn</Label>
              <p className="text-sm">{record.from_ip || '-'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Prefix nguồn</Label>
              <p className="text-sm">{record.from_ip_prefix || '-'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">IP đích</Label>
              <p className="text-sm">{record.to_ip || '-'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Prefix đích</Label>
              <p className="text-sm">{record.to_ip_prefix || '-'}</p>
            </div>
          </div>
        </div>
      )}

      {/* IP Alias specific fields */}
      {record.config_type === 'alias' && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-semibold">Cấu hình IP Alias</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Loại Alias</Label>
              <p className="text-sm">{record.alias_type || '-'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Danh sách IP</Label>
              <p className="text-sm">{record.ip || '-'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold">Thông tin hệ thống</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-500">Người tạo</Label>
            <p className="text-sm">{record.created_by_user?.display_name || record.created_by || '-'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">Ngày tạo</Label>
            <p className="text-sm">{record.created_at ? new Date(record.created_at).toLocaleString('vi-VN') : '-'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">Người cập nhật</Label>
            <p className="text-sm">{record.updated_by_user?.display_name || record.updated_by || '-'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">Ngày cập nhật</Label>
            <p className="text-sm">{record.updated_at ? new Date(record.updated_at).toLocaleString('vi-VN') : '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export function FirewallConfigs() {
  const [configs, setConfigs] = useState<FirewallConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConfigType, setSelectedConfigType] = useState<string>('acl');

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      setError(null);
      const configs = await firewallConfigsService.getAll(10, 1);
      setConfigs(configs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
      console.error('Error fetching firewall configs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleAdd = async (formData: any) => {
    try {
      console.log('Adding new firewall config with form data:', formData);
      console.log('Selected config type:', selectedConfigType);
      
      let result;
      
      // Create data and call specific endpoint based on selected config type
      switch (selectedConfigType) {
        case 'acl':
          const aclData = {
            name: formData.name || 'ACL Rule',
            action: formData.action || 'allow',
            action_direction: formData.action_direction || 'inbound',
            protocol: formData.protocol || 'tcp',
            from_ip: formData.from_ip || '192.168.1.0',
            to_ip: formData.to_ip || '10.0.0.1',
            from_ip_prefix: formData.from_ip_prefix || '192.168.1.0/24',
            to_ip_prefix: formData.to_ip_prefix || '10.0.0.0/8',
            from_ports: formData.from_ports || '80,443',
            to_ports: formData.to_ports || '80,443',
            priority: parseInt(formData.priority) || 100,
            enable: formData.enable !== undefined ? formData.enable : true,
            description: formData.description || '',
            note: formData.note || ''
          };
          console.log('Creating ACL Rule:', aclData);
          result = await firewallConfigsService.createAclRule(aclData);
          break;
        case 'ipsec':
          const ipsecData = {
            name: formData.name || 'IPSec Tunnel',
            action: formData.action || 'allow',
            action_direction: 'both' as const,
            protocol: formData.protocol || 'esp',
            from_ip: formData.from_ip || '192.168.1.1',
            to_ip: formData.to_ip || '203.0.113.1',
            from_ip_prefix: formData.from_ip_prefix || '192.168.1.0/24',
            to_ip_prefix: formData.to_ip_prefix || '203.0.113.0/24',
            priority: parseInt(formData.priority) || 200,
            enable: formData.enable !== undefined ? formData.enable : true,
            description: formData.description || '',
            note: formData.note || ''
          };
          console.log('Creating IPSec Tunnel:', ipsecData);
          result = await firewallConfigsService.createIpsecTunnel(ipsecData);
          break;
        case 'alias':
          const aliasData = {
            name: formData.name || 'IP Alias',
            alias_type: formData.alias_type || 'a0927a81-708e-4693-a43d-37e376365562',
            description: formData.description || '',
            ip: formData.ip || '192.168.1.10',
            note: formData.note || '',
            enable: formData.enable !== undefined ? formData.enable : true
          };
          console.log('Creating IP Alias:', aliasData);
          result = await firewallConfigsService.createIpAlias(aliasData);
          break;
        default:
          throw new Error(`Unknown config type: ${selectedConfigType}`);
      }
      
      console.log('Config created successfully:', result);
      
      // Show success toast
      toast.success('Tạo cấu hình thành công!', {
        description: `Đã tạo ${selectedConfigType === 'acl' ? 'ACL Rule' : selectedConfigType === 'ipsec' ? 'IPSec Tunnel' : 'IP Alias'} mới.`
      });
      
      // Refresh the list
      await fetchConfigs();
      console.log('Config list refreshed');
    } catch (err) {
      console.error('Error creating firewall config:', err);
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo cấu hình';
      setError(errorMessage);
      
      // Show error toast
      toast.error('Lỗi khi tạo cấu hình', {
        description: errorMessage
      });
    }
  };

  const handleEdit = async (record: FirewallConfig, formData: any) => {
    try {
      console.log('Editing firewall config:', record);
      console.log('Form data:', formData);
      
      // Create updated data and call specific endpoint based on config type
      if (record?.config_type === 'acl') {
        const updateData = {
          name: formData.name || record?.name,
          action: formData.action || record?.action,
          action_direction: formData.action_direction || record?.action_direction,
          protocol: formData.protocol || record?.protocol,
          from_ip: formData.from_ip || record?.from_ip,
          to_ip: formData.to_ip || record?.to_ip,
          from_ip_prefix: formData.from_ip_prefix || record?.from_ip_prefix,
          to_ip_prefix: formData.to_ip_prefix || record?.to_ip_prefix,
          from_ports: formData.from_ports || record?.from_ports,
          to_ports: formData.to_ports || record?.to_ports,
          priority: parseInt(formData.priority) || record?.priority,
          enable: formData.enable !== undefined ? formData.enable : record?.enable,
          description: formData.description || record?.description,
          note: formData.note || record?.note
        };
        await firewallConfigsService.updateAclRule(record?.id, updateData);
      } else if (record?.config_type === 'ipsec') {
        const updateData = {
          name: formData.name || record?.name,
          action: formData.action || record?.action,
          action_direction: 'both' as const,
          protocol: formData.protocol || record?.protocol,
          from_ip: formData.from_ip || record?.from_ip,
          to_ip: formData.to_ip || record?.to_ip,
          from_ip_prefix: formData.from_ip_prefix || record?.from_ip_prefix,
          to_ip_prefix: formData.to_ip_prefix || record?.to_ip_prefix,
          priority: parseInt(formData.priority) || record?.priority,
          enable: formData.enable !== undefined ? formData.enable : record?.enable,
          description: formData.description || record?.description,
          note: formData.note || record?.note
        };
        await firewallConfigsService.updateIpsecTunnel(record?.id, updateData);
      } else if (record?.config_type === 'alias') {
        const updateData = {
          name: formData.name || record?.name,
          alias_type: formData.alias_type || record?.alias_type,
          description: formData.description || record?.description,
          ip: formData.ip || record?.ip,
          note: formData.note || record?.note,
          enable: formData.enable !== undefined ? formData.enable : record?.enable
        };
        await firewallConfigsService.updateIpAlias(record?.id, updateData);
      }
      
      await fetchConfigs(); // Refresh the list
      console.log('Firewall config updated successfully');
      
      // Show success toast
      toast.success('Cập nhật cấu hình thành công!', {
        description: `Đã cập nhật ${record?.config_type === 'acl' ? 'ACL Rule' : record?.config_type === 'ipsec' ? 'IPSec Tunnel' : 'IP Alias'}.`
      });
    } catch (err) {
      console.error('Error updating firewall config:', err);
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật cấu hình';
      setError(errorMessage);
      
      // Show error toast
      toast.error('Lỗi khi cập nhật cấu hình', {
        description: errorMessage
      });
    }
  };

  const handleDelete = async (record: FirewallConfig) => {
    try {
      await firewallConfigsService.delete(record?.id, record?.config_type);
      await fetchConfigs(); // Refresh the list
      console.log('Firewall config deleted successfully');
      
      // Show success toast
      toast.success('Xóa cấu hình thành công!', {
        description: `Đã xóa ${record?.config_type === 'acl' ? 'ACL Rule' : record?.config_type === 'ipsec' ? 'IPSec Tunnel' : 'IP Alias'}.`
      });
    } catch (err) {
      console.error('Error deleting firewall config:', err);
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa cấu hình';
      setError(errorMessage);
      
      // Show error toast
      toast.error('Lỗi khi xóa cấu hình', {
        description: errorMessage
      });
    }
  };

  const handleView = (record: FirewallConfig) => {
    console.log('View firewall config:', record);
    // TODO: Implement view functionality
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchConfigs}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <DataTable
      title="Quản lý cấu hình tường lửa"
      description="Quản lý các cấu hình và quy tắc tường lửa bao gồm ACL, IPSec và IP Alias"
      data={configs}
      columns={columns}
      searchKey="name"
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onView={handleView}
      renderForm={(formData, setFormData) => renderForm(formData, setFormData, selectedConfigType, setSelectedConfigType)}
      renderEditForm={renderEditForm}
      renderViewForm={renderViewForm}
    />
  );
}