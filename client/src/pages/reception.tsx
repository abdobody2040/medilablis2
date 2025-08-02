import { useState } from 'react';
import { usePatients } from '@/hooks/use-patients';
import { PatientRegistration } from '@/components/reception/patient-registration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, UserPlus, Users, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Reception() {
  const { patients, searchPatients, isLoading } = usePatients();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const results = await searchPatients(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
      }
    }
  };

  const formatGender = (gender: string) => {
    switch (gender) {
      case 'male': return 'Male';
      case 'female': return 'Female';
      case 'other': return 'Other';
      default: return 'Not specified';
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reception
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Patient registration and management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            {patients.length} patients registered
          </span>
        </div>
      </div>

      <Tabs defaultValue="register" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="register" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Register Patient
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Patients
          </TabsTrigger>
        </TabsList>

        <TabsContent value="register" className="mt-6">
          <PatientRegistration />
        </TabsContent>

        <TabsContent value="search" className="mt-6 space-y-6">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Patient Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name, patient ID, phone, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} disabled={isLoading}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Search Results ({searchResults.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchResults.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white patient-name">
                              {patient.firstName} {patient.lastName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {patient.patientId}
                            </p>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <div>Age: {calculateAge(patient.dateOfBirth)} years</div>
                            <div>Gender: {formatGender(patient.gender)}</div>
                          </div>
                          {patient.phoneNumber && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Phone: {patient.phoneNumber}
                            </div>
                          )}
                          {patient.email && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Email: {patient.email}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {formatDistanceToNow(new Date(patient.createdAt), { addSuffix: true })}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Patients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patients.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No patients found</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Register your first patient to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {patients.slice(0, 10).map((patient: any) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white patient-name">
                              {patient.firstName} {patient.lastName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {patient.patientId}
                            </p>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <div>Age: {calculateAge(patient.dateOfBirth)} years</div>
                            <div>Gender: {formatGender(patient.gender)}</div>
                          </div>
                          {patient.phoneNumber && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Phone: {patient.phoneNumber}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {formatDistanceToNow(new Date(patient.createdAt), { addSuffix: true })}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
