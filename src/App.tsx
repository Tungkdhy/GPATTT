import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { LoginForm } from './components/auth/LoginForm';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/pages/Dashboard';
import { UserManagement } from './components/pages/UserManagement';
import { AccountPermissions } from './components/pages/AccountPermissions';
import { SystemParams } from './components/pages/SystemParams';
import { DeviceManagement } from './components/pages/DeviceManagement';
import { InsecureDevices } from './components/pages/InsecureDevices';
import { DeviceTypes } from './components/pages/DeviceTypes';
import { BlacklistIPs } from './components/pages/BlacklistIPs';
import { WhitelistIPs } from './components/pages/WhitelistIPs';
import { ScenarioManagement } from './components/pages/ScenarioManagement';
import { ResponseScenarios } from './components/pages/ResponseScenarios';
import { SoftwareVersions } from './components/pages/SoftwareVersions';
import { FirewallConfigs } from './components/pages/FirewallConfigs';
import { FirewallConfigTypes } from './components/pages/FirewallConfigTypes';
import { LogTypes } from './components/pages/LogTypes';
import { LogList } from './components/pages/LogList';
import { ScenarioLogs } from './components/pages/ScenarioLogs';
import { SystemLogs } from './components/pages/SystemLogs';
import { LogAddresses } from './components/pages/LogAddresses';
import { MalwareHashes } from './components/pages/MalwareHashes';
import { MalwareTypes } from './components/pages/MalwareTypes';
import { AlertLevels } from './components/pages/AlertLevels';
import { ErrorCodes } from './components/pages/ErrorCodes';
import { RegionManagement } from './components/pages/RegionManagement';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthProvider } from './components/auth/AuthContext';
import { Action } from './components/pages/Action';
import { CategoryTypes } from './components/pages/CategoryType';
import { CloudManagers } from './components/pages/CloudManagers';
import { SystemBackup } from './components/pages/SystemBackup';
import { Scripts } from './components/pages/Scripts';
import { Alerts } from './components/pages/Alerts';

export default function App() {
  // Set dark theme on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/action" element={<Action />} />
                    <Route path="/account-permissions" element={<AccountPermissions />} />
                    <Route path="/system-params" element={<SystemParams />} />
                    <Route path="/devices" element={<DeviceManagement />} />
                    <Route path="/insecure-devices" element={<InsecureDevices />} />
                    <Route path="/device-types" element={<DeviceTypes />} />
                    <Route path="/blacklist-ips" element={<BlacklistIPs />} />
                    <Route path="/whitelist-ips" element={<WhitelistIPs />} />
                    <Route path="/scenarios" element={<ScenarioManagement />} />
                    <Route path="/response-scenarios" element={<ResponseScenarios />} />
                    <Route path="/software-versions" element={<SoftwareVersions />} />
                    <Route path="/firewall-configs" element={<FirewallConfigs />} />
                    <Route path="/firewall-config-types" element={<FirewallConfigTypes />} />
                    <Route path="/log-types" element={<LogTypes />} />
                    <Route path="/log-list" element={<LogList />} />
                    <Route path="/scenario-logs" element={<ScenarioLogs />} />
                    <Route path="/system-logs" element={<SystemLogs />} />
                    <Route path="/log-addresses" element={<LogAddresses />} />
                    <Route path="/malware-hashes" element={<MalwareHashes />} />
                    <Route path="/malware-types" element={<MalwareTypes />} />
                    <Route path="/scripts" element={<Scripts />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/alert-levels" element={<AlertLevels />} />
                    <Route path="/error-codes" element={<ErrorCodes />} />
                    <Route path="/regions" element={<RegionManagement />} />
                    <Route path="/category-type" element={<CategoryTypes />} />
                    <Route path="/cloud-managers" element={<CloudManagers />} />
                    <Route path="/system-backup" element={<SystemBackup />} />
                    {/* <Route path="/script-categories" element={<ScriptCategories />} /> */}
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}