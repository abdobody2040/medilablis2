import { useState, useEffect } from 'react';
import { useSamples } from '@/hooks/use-samples';
import { usePatients } from '@/hooks/use-patients';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, TestTube, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SAMPLE_STATUSES, TEST_PRIORITIES } from '@/lib/constants';

export function SampleForm() {
  const { createSample, isCreating } = useSamples();
  const { searchPatients } = usePatients();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const [form, setForm] = useState({
    sampleId: '',
    patientId: '',
    sampleType: '',
    containerType: '',
    volume: '',
    unit: 'ml',
    collectionDateTime: '',
    priority: 'routine',
    comments: '',
    storageLocation: '',
    barcode: '',
  });

  const [patientSearch, setPatientSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const generateSampleId = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const sequence = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `LAB-${year}${month}${day}-${sequence}`;
  };

  const generateBarcode = () => {
    const timestamp = Date.now().toString();
    return `BC${timestamp.slice(-8)}`;
  };

  useEffect(() => {
    if (!form.sampleId) {
      setForm(prev => ({ ...prev, sampleId: generateSampleId() }));
    }
    if (!form.barcode) {
      setForm(prev => ({ ...prev, barcode: generateBarcode() }));
    }
  }, []);

  const handlePatientSearch = async () => {
    if (patientSearch.trim()) {
      try {
        const results = await searchPatients(patientSearch);
        setSearchResults(results);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Search failed",
          description: "Could not search for patients",
        });
      }
    }
  };

  const selectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setForm(prev => ({ ...prev, patientId: patient.id }));
    setSearchResults([]);
    setPatientSearch(`${patient.firstName} ${patient.lastName} (${patient.patientId})`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating sample:', form);

    try {
      // Get current user from localStorage for collectedBy field
      // const currentUser = JSON.parse(localStorage.getItem('user') || '{}'); // localStorage is not available in server components

      const sampleData = {
        ...form,
        collectedBy: user?.id || 'default-user-id', //currentUser.id || 'default-user-id',
        collectionDateTime: new Date(form.collectionDateTime),
        receivedDateTime: new Date(),
        volume: form.volume ? parseFloat(form.volume) : null,
        status: 'received' as const,
        priority: form.priority as 'routine' | 'urgent' | 'stat' | 'critical',
        unit: 'ml', // Default unit
      };

      createSample(sampleData, {
        onSuccess: () => {
          setForm({
            sampleId: generateSampleId(),
            patientId: '',
            sampleType: '',
            containerType: '',
            volume: '',
            unit: 'ml',
            collectionDateTime: '',
            priority: 'routine',
            comments: '',
            storageLocation: '',
            barcode: generateBarcode(),
          });
          setSelectedPatient(null);
          setPatientSearch('');
          toast({
            title: "Sample created successfully",
            description: `Sample ${form.sampleId} has been registered.`,
          });
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error creating sample",
            description: error.message || "Failed to create sample",
          });
        }
      });

    } catch (error) {
      console.error('Sample creation error:', error);
      toast({
        variant: "destructive",
        title: "Sample creation error",
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Sample Collection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sample Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sampleId">Sample ID</Label>
              <Input
                id="sampleId"
                value={form.sampleId}
                onChange={(e) => setForm(prev => ({ ...prev, sampleId: e.target.value }))}
                className="sample-id"
                disabled={isCreating}
              />
            </div>

            <div>
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={form.barcode}
                onChange={(e) => setForm(prev => ({ ...prev, barcode: e.target.value }))}
                className="sample-id"
                disabled={isCreating}
              />
            </div>
          </div>

          {/* Patient Selection */}
          <div className="space-y-2">
            <Label htmlFor="patientSearch">Patient *</Label>
            <div className="flex gap-2">
              <Input
                id="patientSearch"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder="Search by name or patient ID"
                disabled={isCreating}
              />
              <Button type="button" onClick={handlePatientSearch} disabled={isCreating} variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="border rounded-md max-h-40 overflow-y-auto">
                {searchResults.map((patient) => (
                  <div
                    key={patient.id}
                    className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => selectPatient(patient)}
                  >
                    <div className="font-medium">{patient.firstName} {patient.lastName}</div>
                    <div className="text-sm text-gray-500">ID: {patient.patientId}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sample Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sampleType">Sample Type *</Label>
              <Select value={form.sampleType} onValueChange={(value) => setForm(prev => ({ ...prev, sampleType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sample type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blood">Blood</SelectItem>
                  <SelectItem value="urine">Urine</SelectItem>
                  <SelectItem value="serum">Serum</SelectItem>
                  <SelectItem value="plasma">Plasma</SelectItem>
                  <SelectItem value="csf">Cerebrospinal Fluid</SelectItem>
                  <SelectItem value="tissue">Tissue</SelectItem>
                  <SelectItem value="swab">Swab</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="containerType">Container Type</Label>
              <Select value={form.containerType} onValueChange={(value) => setForm(prev => ({ ...prev, containerType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select container" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tube-edta">EDTA Tube</SelectItem>
                  <SelectItem value="tube-serum">Serum Tube</SelectItem>
                  <SelectItem value="tube-heparin">Heparin Tube</SelectItem>
                  <SelectItem value="container-sterile">Sterile Container</SelectItem>
                  <SelectItem value="cup-urine">Urine Cup</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="volume">Volume</Label>
              <Input
                id="volume"
                type="number"
                step="0.1"
                value={form.volume}
                onChange={(e) => setForm(prev => ({ ...prev, volume: e.target.value }))}
                placeholder="0.0"
                disabled={isCreating}
              />
            </div>

            <div>
              <Label htmlFor="unit">Unit</Label>
              <Select value={form.unit} onValueChange={(value) => setForm(prev => ({ ...prev, unit: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="ul">μl</SelectItem>
                  <SelectItem value="l">l</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="mg">mg</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={form.priority} onValueChange={(value) => setForm(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEST_PRIORITIES.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="collectionDateTime">Collection Date & Time *</Label>
              <Input
                id="collectionDateTime"
                type="datetime-local"
                required
                value={form.collectionDateTime}
                onChange={(e) => setForm(prev => ({ ...prev, collectionDateTime: e.target.value }))}
                disabled={isCreating}
              />
            </div>

            <div>
              <Label htmlFor="storageLocation">Storage Location</Label>
              <Input
                id="storageLocation"
                value={form.storageLocation}
                onChange={(e) => setForm(prev => ({ ...prev, storageLocation: e.target.value }))}
                placeholder="e.g., Refrigerator A, Shelf 2"
                disabled={isCreating}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              value={form.comments}
              onChange={(e) => setForm(prev => ({ ...prev, comments: e.target.value }))}
              placeholder="Additional notes about the sample"
              rows={3}
              disabled={isCreating}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setForm({
                  sampleId: generateSampleId(),
                  patientId: '',
                  sampleType: '',
                  containerType: '',
                  volume: '',
                  unit: 'ml',
                  collectionDateTime: '',
                  priority: 'routine',
                  comments: '',
                  storageLocation: '',
                  barcode: generateBarcode(),
                });
                setSelectedPatient(null);
                setPatientSearch('');
              }}
              disabled={isCreating}
            >
              Clear
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Sample
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}