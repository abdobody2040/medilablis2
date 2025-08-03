import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings, TestTube, Bell, Database, Save } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export default function Setup() {
  const { user } = useAuthStore();
  const { toast } = useToast();

  // Lab Settings State
  const [labSettings, setLabSettings] = useState({
    labName: '',
    address: '',
    phone: '',
    email: '',
    licenseNumber: '',
    director: '',
    accreditation: '',
    logo: '',
  });

  // Test Configuration State
  const [testConfig, setTestConfig] = useState({
    defaultTurnaround: 24,
    urgentTurnaround: 4,
    statTurnaround: 1,
    autoApprove: false,
    requireVerification: true,
    enableCriticalAlerts: true,
    qcFrequency: 'daily',
  });

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: 7,
    enableAuditLog: true,
    sessionTimeout: 30,
    maxLoginAttempts: 3,
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    criticalAlerts: true,
    qcFailures: true,
    systemErrors: true,
    newResults: false,
    emailNotifications: true,
    smsNotifications: false,
  });

  // Fetch existing lab settings
  const { data: existingLabSettings, isLoading: labSettingsLoading } = useQuery({
    queryKey: ['/api/settings/lab'],
    queryFn: () => settingsApi.getLabSettings(),
  });

  // Load existing settings when available
  useEffect(() => {
    if (existingLabSettings) {
      setLabSettings(existingLabSettings);
    }
  }, [existingLabSettings]);

  // Save lab settings mutation
  const saveLabSettingsMutation = useMutation({
    mutationFn: (data: any) => settingsApi.saveLabSettings({ ...data, updatedBy: user?.id }),
    onSuccess: () => {
      toast({
        title: "Lab Settings Saved",
        description: "Laboratory settings have been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error.message,
      });
    },
  });

  // Save system setting mutation
  const saveSystemSettingMutation = useMutation({
    mutationFn: (data: any) => settingsApi.saveSystemSetting({ ...data, updatedBy: user?.id }),
    onSuccess: () => {
      toast({
        title: "System Settings Saved",
        description: "System settings have been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error.message,
      });
    },
  });

  const handleLabSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveLabSettingsMutation.mutate(labSettings);
  };

  const handleTestConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save each test config setting as individual system settings
    Object.entries(testConfig).forEach(([key, value]) => {
      saveSystemSettingMutation.mutate({
        settingKey: `test_config_${key}`,
        settingValue: JSON.stringify(value),
        category: 'test_configuration',
        description: `Test configuration: ${key}`,
      });
    });

    toast({
      title: "Test Configuration Saved",
      description: "Test configuration settings have been successfully updated.",
    });
  };

  const handleSystemSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save each system setting individually
    Object.entries(systemSettings).forEach(([key, value]) => {
      saveSystemSettingMutation.mutate({
        settingKey: `system_${key}`,
        settingValue: JSON.stringify(value),
        category: 'system',
        description: `System setting: ${key}`,
      });
    });

    toast({
      title: "System Settings Saved",
      description: "System settings have been successfully updated.",
    });
  };

  const handleNotificationSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save each notification setting individually
    Object.entries(notificationSettings).forEach(([key, value]) => {
      saveSystemSettingMutation.mutate({
        settingKey: `notification_${key}`,
        settingValue: JSON.stringify(value),
        category: 'notifications',
        description: `Notification setting: ${key}`,
      });
    });

    toast({
      title: "Notification Settings Saved",
      description: "Notification settings have been successfully updated.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Setup</h1>
        <p className="text-muted-foreground">
          Configure laboratory settings, test parameters, and system preferences
        </p>
      </div>

      <Tabs defaultValue="lab" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="lab" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Lab Settings
          </TabsTrigger>
          <TabsTrigger value="tests" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Test Config
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lab">
          <Card>
            <CardHeader>
              <CardTitle>Laboratory Information</CardTitle>
              <CardDescription>
                Configure basic laboratory information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLabSettingsSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="labName">Laboratory Name *</Label>
                    <Input
                      id="labName"
                      value={labSettings.labName}
                      onChange={(e) => setLabSettings(prev => ({ ...prev, labName: e.target.value }))}
                      placeholder="Enter laboratory name"
                      required
                      disabled={saveLabSettingsMutation.isPending}
                    />
                  </div>

                  <div>
                    <Label htmlFor="director">Laboratory Director</Label>
                    <Input
                      id="director"
                      value={labSettings.director}
                      onChange={(e) => setLabSettings(prev => ({ ...prev, director: e.target.value }))}
                      placeholder="Dr. Jane Smith"
                      disabled={saveLabSettingsMutation.isPending}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={labSettings.address}
                    onChange={(e) => setLabSettings(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Laboratory address"
                    disabled={saveLabSettingsMutation.isPending}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={labSettings.phone}
                      onChange={(e) => setLabSettings(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                      disabled={saveLabSettingsMutation.isPending}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={labSettings.email}
                      onChange={(e) => setLabSettings(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="contact@laboratory.com"
                      disabled={saveLabSettingsMutation.isPending}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={labSettings.licenseNumber}
                      onChange={(e) => setLabSettings(prev => ({ ...prev, licenseNumber: e.target.value }))}
                      placeholder="LAB-2023-001"
                      disabled={saveLabSettingsMutation.isPending}
                    />
                  </div>

                  <div>
                    <Label htmlFor="accreditation">Accreditation</Label>
                    <Select
                      value={labSettings.accreditation}
                      onValueChange={(value) => setLabSettings(prev => ({ ...prev, accreditation: value }))}
                      disabled={saveLabSettingsMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select accreditation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iso15189">ISO 15189</SelectItem>
                        <SelectItem value="cap">CAP</SelectItem>
                        <SelectItem value="clia">CLIA</SelectItem>
                        <SelectItem value="jci">JCI</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="logo">Laboratory Logo URL</Label>
                  <Input
                    id="logo"
                    value={labSettings.logo}
                    onChange={(e) => setLabSettings(prev => ({ ...prev, logo: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                    disabled={saveLabSettingsMutation.isPending}
                  />
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={saveLabSettingsMutation.isPending || labSettingsLoading}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saveLabSettingsMutation.isPending ? 'Saving...' : 'Save Lab Settings'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
              <CardDescription>
                Configure default test parameters and processing settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTestConfigSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="defaultTurnaround">Default TAT (hours)</Label>
                    <Input
                      id="defaultTurnaround"
                      type="number"
                      value={testConfig.defaultTurnaround}
                      onChange={(e) => setTestConfig(prev => ({ ...prev, defaultTurnaround: parseInt(e.target.value) }))}
                      min="1"
                      max="168"
                      disabled={saveSystemSettingMutation.isPending}
                    />
                  </div>

                  <div>
                    <Label htmlFor="urgentTurnaround">Urgent TAT (hours)</Label>
                    <Input
                      id="urgentTurnaround"
                      type="number"
                      value={testConfig.urgentTurnaround}
                      onChange={(e) => setTestConfig(prev => ({ ...prev, urgentTurnaround: parseInt(e.target.value) }))}
                      min="1"
                      max="48"
                      disabled={saveSystemSettingMutation.isPending}
                    />
                  </div>

                  <div>
                    <Label htmlFor="statTurnaround">STAT TAT (hours)</Label>
                    <Input
                      id="statTurnaround"
                      type="number"
                      value={testConfig.statTurnaround}
                      onChange={(e) => setTestConfig(prev => ({ ...prev, statTurnaround: parseInt(e.target.value) }))}
                      min="0.5"
                      max="12"
                      step="0.5"
                      disabled={saveSystemSettingMutation.isPending}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoApprove">Auto-approve Normal Results</Label>
                      <p className="text-sm text-gray-500">Automatically approve results within normal ranges</p>
                    </div>
                    <Switch
                      id="autoApprove"
                      checked={testConfig.autoApprove}
                      onCheckedChange={(checked) => setTestConfig(prev => ({ ...prev, autoApprove: checked }))}
                      disabled={saveSystemSettingMutation.isPending}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireVerification">Require Result Verification</Label>
                      <p className="text-sm text-gray-500">All results must be verified before release</p>
                    </div>
                    <Switch
                      id="requireVerification"
                      checked={testConfig.requireVerification}
                      onCheckedChange={(checked) => setTestConfig(prev => ({ ...prev, requireVerification: checked }))}
                      disabled={saveSystemSettingMutation.isPending}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableCriticalAlerts">Critical Value Alerts</Label>
                      <p className="text-sm text-gray-500">Send immediate alerts for critical values</p>
                    </div>
                    <Switch
                      id="enableCriticalAlerts"
                      checked={testConfig.enableCriticalAlerts}
                      onCheckedChange={(checked) => setTestConfig(prev => ({ ...prev, enableCriticalAlerts: checked }))}
                      disabled={saveSystemSettingMutation.isPending}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="qcFrequency">QC Frequency</Label>
                  <Select
                    value={testConfig.qcFrequency}
                    onValueChange={(value) => setTestConfig(prev => ({ ...prev, qcFrequency: value }))}
                    disabled={saveSystemSettingMutation.isPending}
                  >
                    <SelectTrigger>
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

                <Separator />

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={saveSystemSettingMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saveSystemSettingMutation.isPending ? 'Saving...' : 'Save Test Configuration'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings and security parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSystemSettingsSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoBackup">Automatic Backups</Label>
                      <p className="text-sm text-gray-500">Enable automatic database backups</p>
                    </div>
                    <Switch
                      id="autoBackup"
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoBackup: checked }))}
                      disabled={saveSystemSettingMutation.isPending}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableAuditLog">Enable Audit Logging</Label>
                      <p className="text-sm text-gray-500">Track all user actions and system events</p>
                    </div>
                    <Switch
                      id="enableAuditLog"
                      checked={systemSettings.enableAuditLog}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, enableAuditLog: checked }))}
                      disabled={saveSystemSettingMutation.isPending}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={systemSettings.sessionTimeout}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                      min="5"
                      max="480"
                      disabled={saveSystemSettingMutation.isPending}
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={systemSettings.maxLoginAttempts}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                      min="1"
                      max="10"
                      disabled={saveSystemSettingMutation.isPending}
                    />
                  </div>

                  <div>
                    <Label htmlFor="retentionPeriod">Backup Retention (years)</Label>
                    <Input
                      id="retentionPeriod"
                      type="number"
                      value={systemSettings.retentionPeriod}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, retentionPeriod: parseInt(e.target.value) }))}
                      min="1"
                      max="50"
                      disabled={saveSystemSettingMutation.isPending}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select
                    value={systemSettings.backupFrequency}
                    onValueChange={(value) => setSystemSettings(prev => ({ ...prev, backupFrequency: value }))}
                    disabled={saveSystemSettingMutation.isPending}
                  >
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

                <Separator />

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={saveSystemSettingMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saveSystemSettingMutation.isPending ? 'Saving...' : 'Save System Settings'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure system notifications and alert settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationSettingsSubmit} className="space-y-6">
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
                        disabled={saveSystemSettingMutation.isPending}
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
                        disabled={saveSystemSettingMutation.isPending}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="systemErrors">System Errors</Label>
                        <p className="text-sm text-gray-500">System and equipment errors</p>
                      </div>
                      <Switch
                        id="systemErrors"
                        checked={notificationSettings.systemErrors}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, systemErrors: checked }))}
                        disabled={saveSystemSettingMutation.isPending}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="newResults">New Results Available</Label>
                        <p className="text-sm text-gray-500">Notify when results are ready</p>
                      </div>
                      <Switch
                        id="newResults"
                        checked={notificationSettings.newResults}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, newResults: checked }))}
                        disabled={saveSystemSettingMutation.isPending}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Delivery Methods</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <p className="text-sm text-gray-500">Send notifications via email</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                        disabled={saveSystemSettingMutation.isPending}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="smsNotifications">SMS Notifications</Label>
                        <p className="text-sm text-gray-500">Send critical alerts via SMS</p>
                      </div>
                      <Switch
                        id="smsNotifications"
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))}
                        disabled={saveSystemSettingMutation.isPending}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={saveSystemSettingMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saveSystemSettingMutation.isPending ? 'Saving...' : 'Save Notification Settings'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}