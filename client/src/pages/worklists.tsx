import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListChecks, Plus, Filter, Calendar, User } from 'lucide-react';

export default function Worklists() {
  const [selectedWorklist, setSelectedWorklist] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  // Mock data for demonstration
  const mockWorklists = [
    {
      id: '1',
      name: 'Morning Blood Chemistry',
      description: 'All blood chemistry tests for morning shift',
      department: 'chemistry',
      assignedTo: 'Dr. Sarah Chen',
      itemCount: 15,
      completedCount: 8,
      priority: 'routine',
      dueDate: '2024-12-15T10:00:00Z',
    },
    {
      id: '2',
      name: 'Urgent Hematology',
      description: 'Critical hematology tests requiring immediate attention',
      department: 'hematology',
      assignedTo: 'Tech. Michael Roberts',
      itemCount: 5,
      completedCount: 2,
      priority: 'urgent',
      dueDate: '2024-12-15T14:00:00Z',
    },
    {
      id: '3',
      name: 'Microbiology Cultures',
      description: 'Culture and sensitivity tests',
      department: 'microbiology',
      assignedTo: 'Dr. Lisa Wang',
      itemCount: 12,
      completedCount: 12,
      priority: 'routine',
      dueDate: '2024-12-15T16:00:00Z',
    },
  ];

  const mockWorklistItems = [
    {
      id: '1',
      sampleId: 'LAB-20241215-001',
      patientName: 'John Martinez',
      testType: 'Glucose',
      priority: 'routine',
      status: 'completed',
      assignedTo: 'Tech. Alice Johnson',
      estimatedTime: '15 min',
    },
    {
      id: '2',
      sampleId: 'LAB-20241215-002',
      patientName: 'Emma Thompson',
      testType: 'Cholesterol Panel',
      priority: 'urgent',
      status: 'in_progress',
      assignedTo: 'Tech. Bob Wilson',
      estimatedTime: '30 min',
    },
    {
      id: '3',
      sampleId: 'LAB-20241215-003',
      patientName: 'Michael Chen',
      testType: 'HbA1c',
      priority: 'stat',
      status: 'pending',
      assignedTo: 'Tech. Carol Davis',
      estimatedTime: '20 min',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="status-completed">Completed</Badge>;
      case 'in_progress':
        return <Badge className="status-in-progress">In Progress</Badge>;
      case 'pending':
        return <Badge className="status-received">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    return <Badge className={`priority-${priority}`}>{priority.toUpperCase()}</Badge>;
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const filteredWorklists = mockWorklists.filter(worklist =>
    filterDepartment === 'all' || worklist.department === filterDepartment
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Worklists
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize and manage laboratory work assignments
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Worklist
          </Button>
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500">
              {mockWorklists.length} active worklists
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            Worklist Overview
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Worklist Items
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Department Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Worklists
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="hematology">Hematology</SelectItem>
                    <SelectItem value="microbiology">Microbiology</SelectItem>
                    <SelectItem value="immunology">Immunology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Worklists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorklists.map((worklist) => {
              const progress = getProgressPercentage(worklist.completedCount, worklist.itemCount);
              
              return (
                <Card key={worklist.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{worklist.name}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {worklist.description}
                        </p>
                      </div>
                      {getPriorityBadge(worklist.priority)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{worklist.completedCount}/{worklist.itemCount} ({progress}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>Assigned to: {worklist.assignedTo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Due: {new Date(worklist.dueDate).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          worklist.department === 'chemistry' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                          worklist.department === 'hematology' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                          worklist.department === 'microbiology' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                        }`}>
                          {worklist.department.charAt(0).toUpperCase() + worklist.department.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          console.log(`Viewing details for worklist: ${worklist.name}`);
                          alert(`Viewing details for ${worklist.name}`);
                        }}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          console.log(`Starting work on: ${worklist.name}`);
                          alert(`Starting work on ${worklist.name}`);
                        }}
                      >
                        Start Work
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="items" className="mt-6 space-y-6">
          {/* Worklist Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Worklist</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedWorklist} onValueChange={setSelectedWorklist}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a worklist to view items" />
                </SelectTrigger>
                <SelectContent>
                  {mockWorklists.map((worklist) => (
                    <SelectItem key={worklist.id} value={worklist.id}>
                      {worklist.name} ({worklist.itemCount} items)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Worklist Items */}
          {selectedWorklist && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Worklist Items
                  {(() => {
                    const worklist = mockWorklists.find(w => w.id === selectedWorklist);
                    return worklist ? ` - ${worklist.name}` : '';
                  })()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Sample ID
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Patient
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Test Type
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Priority
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Assigned To
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Est. Time
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {mockWorklistItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4">
                            <span className="sample-id font-mono text-sm">
                              {item.sampleId}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="patient-name">
                              {item.patientName}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {item.testType}
                          </td>
                          <td className="py-3 px-4">
                            {getPriorityBadge(item.priority)}
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(item.status)}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {item.assignedTo}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                            {item.estimatedTime}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              {item.status === 'pending' && (
                                <Button 
                                  size="sm"
                                  onClick={() => {
                                    console.log(`Starting work on item: ${item.sampleId}`);
                                    alert(`Work Started!\n\n` +
                                      `Sample ID: ${item.sampleId}\n` +
                                      `Patient: ${item.patientName}\n` +
                                      `Test: ${item.testType}\n` +
                                      `Status: In Progress\n` +
                                      `Started: ${new Date().toLocaleString()}`);
                                  }}
                                >
                                  Start
                                </Button>
                              )}
                              {item.status === 'in_progress' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    console.log(`Completing work on item: ${item.sampleId}`);
                                    if (confirm(`Mark ${item.sampleId} as complete?`)) {
                                      alert(`Work Completed!\n\n` +
                                        `Sample ID: ${item.sampleId}\n` +
                                        `Patient: ${item.patientName}\n` +
                                        `Test: ${item.testType}\n` +
                                        `Status: Completed\n` +
                                        `Completed: ${new Date().toLocaleString()}`);
                                    }
                                  }}
                                >
                                  Complete
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  console.log(`Viewing details for item: ${item.sampleId}`);
                                  alert(`Work Item Details:\n\n` +
                                    `Sample ID: ${item.sampleId}\n` +
                                    `Patient: ${item.patientName}\n` +
                                    `Test Type: ${item.testType}\n` +
                                    `Priority: ${item.priority}\n` +
                                    `Status: ${item.status}\n` +
                                    `Received: ${item.receivedAt}\n` +
                                    `Location: ${item.location}`);
                                }}
                              >
                                View
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
