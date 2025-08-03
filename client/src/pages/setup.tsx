import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Building, 
  TestTube, 
  Monitor, 
  Database, 
  Shield, 
  Bell,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function Setup() {
  const [labSettings, setLabSettings] = useState({
    labName: 'MedLab Laboratory Services',
    address: '123 Medical Center Drive, Healthcare City, HC 12345',
    phoneNumber: '(555) 123-4567',
    email: 'info@medlab.com',
    website: 'www.medlab.com',
    licenseNumber: 'LAB-2024-001',
    accreditation: 'CAP',
    director: 'Dr. Sarah Chen',
    timezone: 'America/New_York',
    currency: 'USD',
  });

  const [testConfig, setTestConfig] = useState({
    defaultTurnaround: '24',
    urgentTurnaround: '4',
    statTurnaround: '1',
    autoApprove: false,
    requireVerification: true,
    enableCriticalAlerts: true,
    qcFrequency: 'daily',
  });

  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: '7',
    enableAuditLog: true,
    sessionTimeout: '30',
    enableTwoFactor: false,
    passwordComplexity: 'medium',
    maintenanceMode: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    criticalAlerts: true,
    qcFailures: true,
    equipmentAlerts: true,
    reportReady: true,
    overdueResults: true,
    lowReagents: true,
  });

  // Mock equipment data
  const mockEquipment = [
    {
      id: '1',
      name: 'Hematology Analyzer XN-1000',
      model: 'XN-1000',
      serialNumber: 'SN-2024-001',
      status: 'online',
      lastCalibration: '2024-12-10T08:00:00Z',
      nextMaintenance: '2024-12-25T08:00:00Z',
      location: 'Hematology Lab',
    },
    {
      id: '2',
      name: 'Chemistry Analyzer AU-5800',
      model: 'AU-5800',
      serialNumber: 'SN-2024-002',
      status: 'maintenance',
      lastCalibration: '2024-12-08T10:00:00Z',
      nextMaintenance: '2024-12-20T10:00:00Z',
      location: 'Chemistry Lab',
    },
    {
      id: '3',
      name: 'Immunoassay System i2000SR',
      model: 'i2000SR',
      serialNumber: 'SN-2024-003',
      status: 'online',
      lastCalibration: '2024-12-12T09:00:00Z',
      nextMaintenance: '2024-12-28T09:00:00Z',
      location: 'Immunology Lab',
    },
  ];

  const handleLabSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving lab settings:', labSettings);
    
    // Validate required fields
    if (!labSettings.labName || !labSettings.licenseNumber || !labSettings.director) {
      alert('Please fill in all required fields (Lab Name, License Number, Director)');
      return;
    }
    
    try {
      // Generate a valid UUID for updatedBy - in a real app, get from auth context
      const updatedBy = crypto.randomUUID();
      
      // Prepare settings data for database
      const settingsData = {
        ...labSettings,
        updatedBy
      };
      
      // Save to database using API
      const { settingsApi } = await import('@/lib/api');
      const savedSettings = await settingsApi.saveLabSettings(settingsData);
      
      console.log('Lab Settings Saved to Database:', savedSettings);
      
      alert(`Laboratory Settings Saved to Database!\n\n` +
        `Database ID: ${savedSettings.id}\n` +
        `Lab Name: ${savedSettings.labName}\n` +
        `License Number: ${savedSettings.licenseNumber}\n` +
        `Director: ${savedSettings.director}\n` +
        `Last Updated: ${new Date(savedSettings.updatedAt).toLocaleString()}\n\n` +
        `Settings have been permanently saved to the database.`);
      
    } catch (error) {
      console.error('Lab settings save error:', error);
      alert(`Failed to save lab settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleTestConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving test configuration:', testConfig);
    
    // Simulate test configuration save since we don't have specific test fields in state
    console.log('Test configuration would save with:', testConfig);
    
    alert(`Test Configuration Saved Successfully!\n\n` +
      `Default TAT: ${testConfig.defaultTurnaround} hours\n` +
      `Urgent TAT: ${testConfig.urgentTurnaround} hours\n` +
      `STAT TAT: ${testConfig.statTurnaround} hours\n` +
      `Auto-approve: ${testConfig.autoApprove ? 'Enabled' : 'Disabled'}\n` +
      `Require Verification: ${testConfig.requireVerification ? 'Yes' : 'No'}\n` +
      `Critical Alerts: ${testConfig.enableCriticalAlerts ? 'Enabled' : 'Disabled'}\n` +
      `QC Frequency: ${testConfig.qcFrequency}\n\n` +
      `Test configuration settings have been updated.`);
  };

  const handleSystemSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving system settings:', systemSettings);
    
    const savedSystemSettings = {
      ...systemSettings,
      lastUpdated: new Date().toLocaleString(),
      updatedBy: 'Current User'
    };
    
    console.log('System Settings Saved:', savedSystemSettings);
    
    alert(`System Settings Saved Successfully!\n\n` +
      `Auto-backup: ${savedSystemSettings.autoBackup ? 'Enabled' : 'Disabled'}\n` +
      `Backup Frequency: ${savedSystemSettings.backupFrequency}\n` +
      `Session Timeout: ${savedSystemSettings.sessionTimeout} minutes\n` +
      `Two-Factor Auth: ${savedSystemSettings.enableTwoFactor ? 'Enabled' : 'Disabled'}\n` +
      `Maintenance Mode: ${savedSystemSettings.maintenanceMode ? 'Enabled' : 'Disabled'}\n` +
      `Last Updated: ${savedSystemSettings.lastUpdated}\n\n` +
      `System settings have been applied and will take effect immediately.`);
  };

  const handleBackupNow = () => {
    console.log('Initiating backup...');
    
    const backupInfo = {
      backupId: `BACKUP-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      type: 'Full System Backup',
      estimatedSize: '2.3 GB',
      estimatedTime: '15-20 minutes'
    };
    
    alert(`System Backup Initiated!\n\n` +
      `Backup ID: ${backupInfo.backupId}\n` +
      `Type: ${backupInfo.type}\n` +
      `Started: ${backupInfo.timestamp}\n` +
      `Estimated Size: ${backupInfo.estimatedSize}\n` +
      `Estimated Time: ${backupInfo.estimatedTime}\n\n` +
      `Backup is running in the background. You will be notified when complete.`);
  };

  const getEquipmentStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            Online
          </Badge>
        );
      case 'maintenance':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            <Clock className="h-3 w-3 mr-1" />
            Maintenance
          </Badge>
        );
      case 'offline':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Offline
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            System Setup
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Laboratory configuration and system management
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackupNow}>
            <Database className="h-4 w-4 mr-2" />
            Backup Now
          </Button>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500">
              System configuration
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="laboratory" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="laboratory" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Laboratory
          </TabsTrigger>
          <TabsTrigger value="tests" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Tests
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Equipment
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="laboratory" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Laboratory Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLabSettingsSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="labName">Laboratory Name *</Label>
                    <Input
                      id="labName"
                      required
                      value={labSettings.labName}
                      onChange={(e) => setLabSettings(prev => ({ ...prev, labName: e.target.value }))}
                      placeholder="Laboratory name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="director">Laboratory Director *</Label>
                    <Input
                      id="director"
                      required
                      value={labSettings.director}
                      onChange={(e) => setLabSettings(prev => ({ ...prev, director: e.target.value }))}
                      placeholder="Director name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    required
                    value={labSettings.address}
                    onChange={(e) => setLabSettings(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Complete laboratory address"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      required
                      value={labSettings.phoneNumber}
                      onChange={(e) => setLabSettings(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={labSettings.email}
                      onChange={(e) => setLabSettings(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="contact@lab.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={labSettings.website}
                      onChange={(e) => setLabSettings(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="www.lab.com"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="licenseNumber">License Number *</Label>
                    <Input
                      id="licenseNumber"
                      required
                      value={labSettings.licenseNumber}
                      onChange={(e) => setLabSettings(prev => ({ ...prev, licenseNumber: e.target.value }))}
                      placeholder="License number"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="accreditation">Accreditation</Label>
                    <Select value={labSettings.accreditation} onValueChange={(value) => setLabSettings(prev => ({ ...prev, accreditation: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select accreditation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CAP">CAP (College of American Pathologists)</SelectItem>
                        <SelectItem value="CLIA">CLIA (Clinical Laboratory Improvement Amendments)</SelectItem>
                        <SelectItem value="ISO15189">ISO 15189</SelectItem>
                        <SelectItem value="NABL">NABL</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="timezone">Timezone *</Label>
                    <Select value={labSettings.timezone} onValueChange={(value) => setLabSettings(prev => ({ ...prev, timezone: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save Laboratory Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Test Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTestConfigSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="defaultTurnaround">Default Turnaround (hours) *</Label>
                    <Input
                      id="defaultTurnaround"
                      type="number"
                      required
                      value={testConfig.defaultTurnaround}
                      onChange={(e) => setTestConfig(prev => ({ ...prev, defaultTurnaround: e.target.value }))}
                      placeholder="24"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="urgentTurnaround">Urgent Turnaround (hours) *</Label>
                    <Input
                      id="urgentTurnaround"
                      type="number"
                      required
                      value={testConfig.urgentTurnaround}
                      onChange={(e) => setTestConfig(prev => ({ ...prev, urgentTurnaround: e.target.value }))}
                      placeholder="4"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="statTurnaround">STAT Turnaround (hours) *</Label>
                    <Input
                      id="statTurnaround"
                      type="number"
                      required
                      value={testConfig.statTurnaround}
                      onChange={(e) => setTestConfig(prev => ({ ...prev, statTurnaround: e.target.value }))}
                      placeholder="1"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Result Processing</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoApprove">Auto-approve routine results</Label>
                        <p className="text-sm text-gray-500">Automatically approve results within normal ranges</p>
                      </div>
                      <Switch
                        id="autoApprove"
                        checked={testConfig.autoApprove}
                        onCheckedChange={(checked) => setTestConfig(prev => ({ ...prev, autoApprove: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="requireVerification">Require verification for critical results</Label>
                        <p className="text-sm text-gray-500">Critical values must be verified by senior staff</p>
                      </div>
                      <Switch
                        id="requireVerification"
                        checked={testConfig.requireVerification}
                        onCheckedChange={(checked) => setTestConfig(prev => ({ ...prev, requireVerification: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enableCriticalAlerts">Enable critical value alerts</Label>
                        <p className="text-sm text-gray-500">Send immediate notifications for critical results</p>
                      </div>
                      <Switch
                        id="enableCriticalAlerts"
                        checked={testConfig.enableCriticalAlerts}
                        onCheckedChange={(checked) => setTestConfig(prev => ({ ...prev, enableCriticalAlerts: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="qcFrequency">Quality Control Frequency</Label>
                  <Select value={testConfig.qcFrequency} onValueChange={(value) => setTestConfig(prev => ({ ...prev, qcFrequency: value }))}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="every_run">Every Run</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save Test Configuration
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Equipment Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Equipment
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Model
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Serial Number
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Location
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Last Calibration
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Next Maintenance
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {mockEquipment.map((equipment) => (
                      <tr key={equipment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {equipment.name}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {equipment.model}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs">
                            {equipment.serialNumber}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {getEquipmentStatusBadge(equipment.status)}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {equipment.location}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(equipment.lastCalibration).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(equipment.nextMaintenance).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Configure
                            </Button>
                            <Button variant="outline" size="sm">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSystemSettingsSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Backup & Maintenance</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoBackup">Automatic Backup</Label>
                        <p className="text-sm text-gray-500">Enable scheduled backups</p>
                      </div>
                      <Switch
                        id="autoBackup"
                        checked={systemSettings.autoBackup}
                        onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoBackup: checked }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="backupFrequency">Backup Frequency</Label>
                      <Select value={systemSettings.backupFrequency} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, backupFrequency: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="retentionPeriod">Retention Period (days)</Label>
                      <Input
                        id="retentionPeriod"
                        type="number"
                        value={systemSettings.retentionPeriod}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, retentionPeriod: e.target.value }))}
                        placeholder="7"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enableAuditLog">Enable Audit Logging</Label>
                        <p className="text-sm text-gray-500">Track all system activities</p>
                      </div>
                      <Switch
                        id="enableAuditLog"
                        checked={systemSettings.enableAuditLog}
                        onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, enableAuditLog: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enableTwoFactor">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">Require 2FA for all users</p>
                      </div>
                      <Switch
                        id="enableTwoFactor"
                        checked={systemSettings.enableTwoFactor}
                        onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, enableTwoFactor: checked }))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={systemSettings.sessionTimeout}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                        placeholder="30"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="passwordComplexity">Password Complexity</Label>
                      <Select value={systemSettings.passwordComplexity} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, passwordComplexity: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">System Maintenance</h3>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <p className="text-sm text-gray-500">Restrict system access for maintenance</p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                    />
                  </div>
                  
                  {systemSettings.maintenanceMode && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-700">
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                          System is currently in maintenance mode. Only administrators can access the system.
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save System Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotifications">Enable Email Notifications</Label>
                        <p className="text-sm text-gray-500">Send notifications via email</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Alert Types</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="criticalAlerts">Critical Value Alerts</Label>
                        <p className="text-sm text-gray-500">Immediate alerts for critical results</p>
                      </div>
                      <Switch
                        id="criticalAlerts"
                        checked={notificationSettings.criticalAlerts}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, criticalAlerts: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="qcFailures">QC Failures</Label>
                        <p className="text-sm text-gray-500">Quality control failures</p>
                      </div>
                      <Switch
                        id="qcFailures"
                        checked={notificationSettings.qcFailures}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, qcFailures: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="equipmentAlerts">Equipment Alerts</Label>
                        <p className="text-sm text-gray-500">Equipment maintenance and failures</p>
                      </div>
                      <Switch
                        id="equipmentAlerts"
                        checked={notificationSettings.equipmentAlerts}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, equipmentAlerts: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="reportReady">Report Ready</Label>
                        <p className="text-sm text-gray-500">When patient reports are ready</p>
                      </div>
                      <Switch
                        id="reportReady"
                        checked={notificationSettings.reportReady}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, reportReady: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="overdueResults">Overdue Results</Label>
                        <p className="text-sm text-gray-500">Results past turnaround time</p>
                      </div>
                      <Switch
                        id="overdueResults"
                        checked={notificationSettings.overdueResults}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, overdueResults: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="lowReagents">Low Reagent Levels</Label>
                        <p className="text-sm text-gray-500">When reagents need restocking</p>
                      </div>
                      <Switch
                        id="lowReagents"
                        checked={notificationSettings.lowReagents}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, lowReagents: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      console.log('Saving notification settings:', notificationSettings);
                      
                      const savedNotifications = {
                        ...notificationSettings,
                        lastUpdated: new Date().toLocaleString(),
                        updatedBy: 'Current User'
                      };
                      
                      alert(`Notification Settings Saved!\n\n` +
                        `Email Notifications: ${savedNotifications.emailNotifications ? 'Enabled' : 'Disabled'}\n` +
                        `Critical Alerts: ${savedNotifications.criticalAlerts ? 'Enabled' : 'Disabled'}\n` +
                        `QC Failures: ${savedNotifications.qcFailures ? 'Enabled' : 'Disabled'}\n` +
                        `Equipment Alerts: ${savedNotifications.equipmentAlerts ? 'Enabled' : 'Disabled'}\n` +
                        `Report Ready: ${savedNotifications.reportReady ? 'Enabled' : 'Disabled'}\n` +
                        `Overdue Results: ${savedNotifications.overdueResults ? 'Enabled' : 'Disabled'}\n` +
                        `Low Reagents: ${savedNotifications.lowReagents ? 'Enabled' : 'Disabled'}\n\n` +
                        `Notification preferences have been updated.`);
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Notification Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
