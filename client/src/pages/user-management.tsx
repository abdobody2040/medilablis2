import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Users, UserPlus, Shield, Settings, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { USER_ROLES } from '@/lib/constants';

export default function UserManagement() {
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    password: '',
    confirmPassword: '',
    isActive: true,
  });

  const [rolePermissions, setRolePermissions] = useState({
    role: '',
    permissions: {
      dashboard: { view: false, edit: false },
      reception: { view: false, edit: false },
      sampling: { view: false, edit: false },
      results: { view: false, edit: false, verify: false },
      worklists: { view: false, edit: false },
      qc: { view: false, edit: false },
      outbound: { view: false, edit: false },
      reports: { view: false, edit: false },
      financial: { view: false, edit: false },
      users: { view: false, edit: false },
      pricing: { view: false, edit: false },
      setup: { view: false, edit: false },
    },
  });

  // Mock user data
  const mockUsers = [
    {
      id: '1',
      username: 'dr.chen',
      email: 'sarah.chen@medlab.com',
      firstName: 'Sarah',
      lastName: 'Chen',
      role: 'lab_manager',
      isActive: true,
      lastLogin: '2024-12-15T08:30:00Z',
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      username: 'tech.roberts',
      email: 'michael.roberts@medlab.com',
      firstName: 'Michael',
      lastName: 'Roberts',
      role: 'technician',
      isActive: true,
      lastLogin: '2024-12-15T07:45:00Z',
      createdAt: '2024-02-20T14:30:00Z',
    },
    {
      id: '3',
      username: 'rec.wang',
      email: 'lisa.wang@medlab.com',
      firstName: 'Lisa',
      lastName: 'Wang',
      role: 'receptionist',
      isActive: true,
      lastLogin: '2024-12-14T16:20:00Z',
      createdAt: '2024-03-10T09:15:00Z',
    },
    {
      id: '4',
      username: 'dr.kim',
      email: 'robert.kim@medlab.com',
      firstName: 'Robert',
      lastName: 'Kim',
      role: 'doctor',
      isActive: false,
      lastLogin: '2024-12-10T11:00:00Z',
      createdAt: '2024-01-25T13:45:00Z',
    },
  ];

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating user:', userForm);
    
    // Reset form
    setUserForm({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      role: '',
      password: '',
      confirmPassword: '',
      isActive: true,
    });
  };

  const handlePermissionChange = (module: string, permission: string, value: boolean) => {
    setRolePermissions(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...prev.permissions[module as keyof typeof prev.permissions],
          [permission]: value,
        },
      },
    }));
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = USER_ROLES.find(r => r.value === role);
    const colors = {
      admin: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      lab_manager: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      technician: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      receptionist: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      doctor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    };

    return (
      <Badge className={colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {roleConfig?.label || role}
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
        Active
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
        Inactive
      </Badge>
    );
  };

  const getRoleStats = () => {
    const stats = USER_ROLES.map(role => ({
      ...role,
      count: mockUsers.filter(user => user.role === role.value).length,
    }));
    
    return stats;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage users, roles, and permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            {mockUsers.length} total users
          </span>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {getRoleStats().map((role) => (
          <Card key={role.value}>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {role.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {role.count}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Manage Users
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Create User
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Role Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        User
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Role
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Last Login
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Created
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              @{user.username}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {user.email}
                        </td>
                        <td className="py-3 px-4">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(user.isActive)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true })}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
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

        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Create New User
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUserSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      required
                      value={userForm.firstName}
                      onChange={(e) => setUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="First name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      required
                      value={userForm.lastName}
                      onChange={(e) => setUserForm(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      required
                      value={userForm.username}
                      onChange={(e) => setUserForm(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Username"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={userForm.email}
                      onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Email address"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Select value={userForm.role} onValueChange={(value) => setUserForm(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={userForm.password}
                      onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Password"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      value={userForm.confirmPassword}
                      onChange={(e) => setUserForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm password"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={userForm.isActive}
                    onCheckedChange={(checked) => setUserForm(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">User is active</Label>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      console.log('Cancelling user creation...');
                      setUserForm({
                        username: '',
                        email: '',
                        firstName: '',
                        lastName: '',
                        role: 'technician',
                        password: '',
                        confirmPassword: '',
                        isActive: true,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create User
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role-Based Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="roleSelect">Select Role</Label>
                  <Select 
                    value={rolePermissions.role} 
                    onValueChange={(value) => setRolePermissions(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Choose a role to configure" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {rolePermissions.role && (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium">Module</th>
                          <th className="text-center py-3 px-4 font-medium">View</th>
                          <th className="text-center py-3 px-4 font-medium">Edit</th>
                          <th className="text-center py-3 px-4 font-medium">Special</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {Object.entries(rolePermissions.permissions).map(([module, perms]) => (
                          <tr key={module}>
                            <td className="py-3 px-4 font-medium capitalize">
                              {module.replace('_', ' ')}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Switch
                                checked={perms.view}
                                onCheckedChange={(checked) => handlePermissionChange(module, 'view', checked)}
                              />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Switch
                                checked={perms.edit}
                                onCheckedChange={(checked) => handlePermissionChange(module, 'edit', checked)}
                              />
                            </td>
                            <td className="py-3 px-4 text-center">
                              {module === 'results' && (
                                <div className="flex items-center justify-center gap-2">
                                  <span className="text-xs">Verify</span>
                                  <Switch
                                    checked={(perms as any).verify || false}
                                    onCheckedChange={(checked) => handlePermissionChange(module, 'verify', checked)}
                                  />
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {rolePermissions.role && (
                  <div className="flex justify-end space-x-4">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        console.log('Resetting permissions to default...');
                        alert('Permissions reset to default!');
                      }}
                    >
                      Reset to Default
                    </Button>
                    <Button
                      onClick={() => {
                        console.log('Saving permissions...');
                        alert('Permissions saved successfully!');
                      }}
                    >
                      Save Permissions
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
