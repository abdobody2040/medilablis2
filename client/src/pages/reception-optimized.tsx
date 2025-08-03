import { useState } from 'react';
import { usePatients } from '@/hooks/use-patients';
import { PatientRegistration } from '@/components/reception/patient-registration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination } from '@/components/ui/pagination';
import { VirtualList } from '@/components/performance/virtual-list';
import { usePagination } from '@/hooks/use-pagination';
import { Search, UserPlus, Users, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ReceptionOptimized() {
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, paginationControls] = usePagination(25);
  const [useVirtualization, setUseVirtualization] = useState(false);
  
  const { patients, isLoading, createPatient, isCreating } = usePatients({
    page: pagination.page,
    limit: pagination.limit,
    search: searchQuery,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    paginationControls.goToPage(1); // Reset to first page when searching
  };

  const renderPatientRow = (patient: any, index: number) => (
    <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <td className="py-3 px-4">
        <div>
          <div className="patient-name font-medium text-gray-900 dark:text-white">
            {patient.firstName} {patient.lastName}
          </div>
          <div className="text-sm text-gray-500">
            {patient.patientId}
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
        {new Date(patient.dateOfBirth).toLocaleDateString()}
      </td>
      <td className="py-3 px-4">
        <Badge className={`gender-${patient.gender}`}>
          {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
        </Badge>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
        {patient.phoneNumber || 'N/A'}
      </td>
      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
        {patient.email || 'N/A'}
      </td>
      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
        {formatDistanceToNow(new Date(patient.createdAt), { addSuffix: true })}
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            View Details
          </Button>
          <Button variant="outline" size="sm">
            New Sample
          </Button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Patient Reception
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Patient registration and management
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="virtualization"
              checked={useVirtualization}
              onChange={(e) => setUseVirtualization(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="virtualization" className="text-sm text-gray-600 dark:text-gray-400">
              Use Virtualization (for 10k+ records)
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500">
              {patients.length} patients
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Patient Search
          </TabsTrigger>
          <TabsTrigger value="register" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Register Patient
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          {/* Search Controls */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search patients by name, ID, phone, or email..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  Advanced Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Patient List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Patient Directory
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="spinner mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading patients...</p>
                </div>
              ) : patients.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery ? 'No patients found matching your search' : 'No patients registered yet'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {useVirtualization && patients.length > 100 ? (
                    // Virtual scrolling for large datasets
                    <div className="overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 font-medium">Patient</th>
                            <th className="text-left py-3 px-4 font-medium">Date of Birth</th>
                            <th className="text-left py-3 px-4 font-medium">Gender</th>
                            <th className="text-left py-3 px-4 font-medium">Phone</th>
                            <th className="text-left py-3 px-4 font-medium">Email</th>
                            <th className="text-left py-3 px-4 font-medium">Registered</th>
                            <th className="text-left py-3 px-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                      </table>
                      <VirtualList
                        items={patients}
                        height={600}
                        itemHeight={80}
                        renderItem={(patient, index) => (
                          <table className="w-full">
                            <tbody>
                              {renderPatientRow(patient, index)}
                            </tbody>
                          </table>
                        )}
                        className="border border-gray-200 dark:border-gray-700 rounded-md"
                      />
                    </div>
                  ) : (
                    // Standard table view with pagination
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                              Patient
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                              Date of Birth
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                              Gender
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                              Phone
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                              Email
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                              Registered
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {patients.map((patient, index) => renderPatientRow(patient, index))}
                        </tbody>
                      </table>

                      {/* Pagination Controls */}
                      <div className="mt-6">
                        <Pagination 
                          pagination={pagination}
                          controls={paginationControls}
                          showPageSizeSelector={true}
                          pageSizeOptions={[10, 25, 50, 100]}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register" className="space-y-6">
          <PatientRegistration />
        </TabsContent>
      </Tabs>
    </div>
  );
}