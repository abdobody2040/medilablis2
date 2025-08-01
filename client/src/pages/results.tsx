import { useState } from 'react';
import { ResultsEntry } from '@/components/results/results-entry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ClipboardCheck, FileText, AlertTriangle } from 'lucide-react';

export default function Results() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration
  const mockResults = [
    {
      id: '1',
      sampleId: 'LAB-20241215-001',
      patientName: 'John Martinez',
      testType: 'Complete Blood Count',
      status: 'completed',
      enteredBy: 'Dr. Sarah Chen',
      verifiedBy: 'Dr. Michael Roberts',
      enteredAt: '2024-12-15T14:30:00Z',
      verifiedAt: '2024-12-15T15:15:00Z',
      criticalValues: false,
    },
    {
      id: '2',
      sampleId: 'LAB-20241215-002',
      patientName: 'Emma Thompson',
      testType: 'Lipid Panel',
      status: 'pending_verification',
      enteredBy: 'Tech. Lisa Wang',
      verifiedBy: null,
      enteredAt: '2024-12-15T13:45:00Z',
      verifiedAt: null,
      criticalValues: true,
    },
    {
      id: '3',
      sampleId: 'LAB-20241215-003',
      patientName: 'Michael Chen',
      testType: 'Glucose Tolerance',
      status: 'in_progress',
      enteredBy: null,
      verifiedBy: null,
      enteredAt: null,
      verifiedAt: null,
      criticalValues: false,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="status-completed">Completed</Badge>;
      case 'pending_verification':
        return <Badge className="status-in-progress">Pending Verification</Badge>;
      case 'in_progress':
        return <Badge className="status-received">In Progress</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredResults = mockResults.filter(result =>
    searchQuery === '' ||
    result.sampleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.testType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Test Results
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test results entry, validation, and management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            {mockResults.length} test results
          </span>
        </div>
      </div>

      <Tabs defaultValue="entry" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="entry" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            Results Entry
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Manage Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entry" className="mt-6">
          <ResultsEntry />
        </TabsContent>

        <TabsContent value="manage" className="mt-6 space-y-6">
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by sample ID, patient name, or test type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {mockResults.filter(r => r.status === 'completed').length}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-green-100 dark:bg-green-900/20">
                    <ClipboardCheck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Pending Verification
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {mockResults.filter(r => r.status === 'pending_verification').length}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/20">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      In Progress
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {mockResults.filter(r => r.status === 'in_progress').length}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900/20">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Critical Values
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {mockResults.filter(r => r.criticalValues).length}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-red-100 dark:bg-red-900/20">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results List */}
          <Card>
            <CardHeader>
              <CardTitle>
                Test Results ({filteredResults.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredResults.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No results found</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {searchQuery 
                      ? 'Try adjusting your search criteria'
                      : 'Enter test results to get started'
                    }
                  </p>
                </div>
              ) : (
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
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Entered By
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Critical Values
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredResults.map((result) => (
                        <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4">
                            <span className="sample-id font-mono text-sm">
                              {result.sampleId}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="patient-name">
                              {result.patientName}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {result.testType}
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(result.status)}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {result.enteredBy || 'Not assigned'}
                          </td>
                          <td className="py-3 px-4">
                            {result.criticalValues ? (
                              <div className="flex items-center gap-1">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                <span className="text-red-600 text-sm font-medium">Yes</span>
                              </div>
                            ) : (
                              <span className="text-gray-500 text-sm">No</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                              {result.status === 'pending_verification' && (
                                <Button size="sm">
                                  Verify
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
