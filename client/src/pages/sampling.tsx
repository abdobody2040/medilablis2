import { useState } from 'react';
import { useSamples } from '@/hooks/use-samples';
import { SampleForm } from '@/components/sampling/sample-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination } from '@/components/ui/pagination';
import { usePagination } from '@/hooks/use-pagination';
import { Search, TestTube, Beaker, ScanLine } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { SAMPLE_STATUSES } from '@/lib/constants';

export default function Sampling() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [pagination, paginationControls] = usePagination(50);
  
  const { samples, isLoading } = useSamples({
    page: pagination.page,
    limit: pagination.limit,
    status: statusFilter,
    sortBy,
    sortOrder,
  });

  // For client-side search filtering (we'll implement server-side search later)
  const filteredSamples = samples.filter(sample => {
    const matchesSearch = searchQuery === '' || 
      sample.sampleId.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = SAMPLE_STATUSES.find(s => s.value === status);
    if (!statusConfig) return null;
    
    return (
      <Badge className={`status-${status}`}>
        {statusConfig.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    return (
      <Badge className={`priority-${priority}`}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sample Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sample collection, tracking, and management
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <ScanLine className="h-4 w-4" />
            Scan Barcode
          </Button>
          <div className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500">
              {samples.length} samples total
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="collect" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="collect" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Collect Sample
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Manage Samples
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collect" className="mt-6">
          <SampleForm />
        </TabsContent>

        <TabsContent value="manage" className="mt-6 space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Sample Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by sample ID or patient name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  {SAMPLE_STATUSES.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Sample Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {SAMPLE_STATUSES.map(status => {
              const count = samples.filter(s => s.status === status.value).length;
              return (
                <Card key={status.value}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {status.label}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {count}
                        </p>
                      </div>
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center bg-${status.color}-100 dark:bg-${status.color}-900/20`}>
                        <TestTube className={`h-6 w-6 text-${status.color}-600`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Samples List */}
          <Card>
            <CardHeader>
              <CardTitle>
                Sample List ({filteredSamples.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSamples.length === 0 ? (
                <div className="text-center py-8">
                  <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No samples found</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Collect your first sample to get started'
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
                          Type
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Priority
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Collection Time
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredSamples.map((sample) => (
                        <tr key={sample.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4">
                            <span className="sample-id font-mono text-sm">
                              {sample.sampleId}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {sample.patient && (
                              <div>
                                <div className="patient-name">
                                  {sample.patient.firstName} {sample.patient.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {sample.patient.patientId}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {sample.sampleType}
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(sample.status)}
                          </td>
                          <td className="py-3 px-4">
                            {getPriorityBadge(sample.priority)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                            {formatDistanceToNow(new Date(sample.collectionDateTime), { addSuffix: true })}
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Add Pagination Controls */}
                  <div className="mt-6">
                    <Pagination 
                      pagination={pagination}
                      controls={paginationControls}
                      showPageSizeSelector={true}
                      pageSizeOptions={[25, 50, 100, 200]}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
