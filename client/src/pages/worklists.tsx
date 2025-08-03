
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ListTodo, 
  Plus, 
  Save, 
  Users, 
  CheckCircle, 
  Clock,
  Filter,
  Search,
  Calendar
} from 'lucide-react';
import { worklistsApi, usersApi, testTypesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function Worklists() {
  const { toast } = useToast();
  
  const [worklistForm, setWorklistForm] = useState({
    name: '',
    description: '',
    assignedTo: '',
    criteria: {
      testTypes: [] as string[],
      priority: 'all',
      sampleTypes: [] as string[],
      dateRange: 'today',
    },
  });

  // Fetch data for form options
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['/api/users'],
    queryFn: () => usersApi.getUsers({ limit: 50 }),
  });

  const { data: testTypes = [], isLoading: loadingTestTypes } = useQuery({
    queryKey: ['/api/test-types'],
    queryFn: testTypesApi.getTestTypes,
  });

  const { data: worklists = [], isLoading: loadingWorklists, refetch: refetchWorklists } = useQuery({
    queryKey: ['/api/worklists'],
    queryFn: () => worklistsApi.getWorklists(),
  });

  // Create worklist mutation
  const createWorklistMutation = useMutation({
    mutationFn: worklistsApi.createWorklist,
    onSuccess: () => {
      toast({
        title: "Worklist Created",
        description: "Worklist created successfully",
      });
      
      // Reset form
      setWorklistForm({
        name: '',
        description: '',
        assignedTo: '',
        criteria: {
          testTypes: [],
          priority: 'all',
          sampleTypes: [],
          dateRange: 'today',
        },
      });
      
      // Refetch worklists
      refetchWorklists();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: error.message || "Failed to create worklist",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!worklistForm.name) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter a worklist name",
      });
      return;
    }

    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!currentUser.id) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please log in to continue",
      });
      return;
    }

    const worklistData = {
      name: worklistForm.name,
      description: worklistForm.description || null,
      criteria: worklistForm.criteria,
      assignedTo: worklistForm.assignedTo || null,
      createdBy: currentUser.id,
      isActive: true,
    };

    createWorklistMutation.mutate(worklistData);
  };

  const handleTestTypeChange = (testTypeId: string, checked: boolean) => {
    setWorklistForm(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        testTypes: checked 
          ? [...prev.criteria.testTypes, testTypeId]
          : prev.criteria.testTypes.filter(id => id !== testTypeId)
      }
    }));
  };

  const handleSampleTypeChange = (sampleType: string, checked: boolean) => {
    setWorklistForm(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        sampleTypes: checked 
          ? [...prev.criteria.sampleTypes, sampleType]
          : prev.criteria.sampleTypes.filter(type => type !== sampleType)
      }
    }));
  };

  const sampleTypes = ['blood', 'urine', 'serum', 'plasma', 'saliva', 'tissue', 'other'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Worklists
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage laboratory worklists
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            Worklist Management
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Create Worklist Form */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Worklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Worklist Name *</Label>
                    <Input
                      id="name"
                      required
                      value={worklistForm.name}
                      onChange={(e) => setWorklistForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Morning Chemistry"
                      disabled={createWorklistMutation.isPending}
                    />
                  </div>

                  <div>
                    <Label htmlFor="assignedTo">Assign To</Label>
                    <Select 
                      value={worklistForm.assignedTo} 
                      onValueChange={(value) => setWorklistForm(prev => ({ ...prev, assignedTo: value }))}
                      disabled={createWorklistMutation.isPending || loadingUsers}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {users.map((user: any) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.firstName} {user.lastName} ({user.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={worklistForm.description}
                    onChange={(e) => setWorklistForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional description of this worklist"
                    rows={3}
                    disabled={createWorklistMutation.isPending}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Worklist Criteria</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select 
                        value={worklistForm.criteria.priority} 
                        onValueChange={(value) => setWorklistForm(prev => ({ 
                          ...prev, 
                          criteria: { ...prev.criteria, priority: value }
                        }))}
                        disabled={createWorklistMutation.isPending}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priorities</SelectItem>
                          <SelectItem value="routine">Routine</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="stat">STAT</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="dateRange">Date Range</Label>
                      <Select 
                        value={worklistForm.criteria.dateRange} 
                        onValueChange={(value) => setWorklistForm(prev => ({ 
                          ...prev, 
                          criteria: { ...prev.criteria, dateRange: value }
                        }))}
                        disabled={createWorklistMutation.isPending}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="yesterday">Yesterday</SelectItem>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="all">All Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Test Types</Label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3 max-h-40 overflow-y-auto border rounded-lg p-3">
                      {loadingTestTypes ? (
                        <div className="col-span-full text-center text-sm text-gray-500">
                          Loading test types...
                        </div>
                      ) : (
                        testTypes.map((testType: any) => (
                          <div key={testType.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`test-${testType.id}`}
                              checked={worklistForm.criteria.testTypes.includes(testType.id)}
                              onCheckedChange={(checked) => handleTestTypeChange(testType.id, checked as boolean)}
                              disabled={createWorklistMutation.isPending}
                            />
                            <Label 
                              htmlFor={`test-${testType.id}`} 
                              className="text-sm font-normal cursor-pointer"
                            >
                              {testType.name}
                            </Label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Sample Types</Label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {sampleTypes.map((sampleType) => (
                        <div key={sampleType} className="flex items-center space-x-2">
                          <Checkbox
                            id={`sample-${sampleType}`}
                            checked={worklistForm.criteria.sampleTypes.includes(sampleType)}
                            onCheckedChange={(checked) => handleSampleTypeChange(sampleType, checked as boolean)}
                            disabled={createWorklistMutation.isPending}
                          />
                          <Label 
                            htmlFor={`sample-${sampleType}`} 
                            className="text-sm font-normal cursor-pointer capitalize"
                          >
                            {sampleType}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={createWorklistMutation.isPending}
                    className="min-w-32"
                  >
                    {createWorklistMutation.isPending ? (
                      "Creating..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Create Worklist
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Existing Worklists */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListTodo className="h-5 w-5" />
                Active Worklists
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingWorklists ? (
                <div className="text-center text-sm text-gray-500">
                  Loading worklists...
                </div>
              ) : worklists.length === 0 ? (
                <div className="text-center text-sm text-gray-500">
                  No worklists found
                </div>
              ) : (
                <div className="space-y-4">
                  {worklists.map((worklist: any) => (
                    <div key={worklist.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{worklist.name}</span>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      {worklist.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {worklist.description}
                        </p>
                      )}
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Created: {new Date(worklist.createdAt).toLocaleDateString()}</div>
                        {worklist.assignedTo && (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Assigned
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Filter className="h-3 w-3" />
                          {Object.values(worklist.criteria || {}).filter(Boolean).length} filters
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
