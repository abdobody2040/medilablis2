
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
import { 
  Send, 
  Package, 
  Save, 
  Truck, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  MapPin,
  Calendar
} from 'lucide-react';
import { outboundApi, samplesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function Outbound() {
  const { toast } = useToast();
  
  const [outboundForm, setOutboundForm] = useState({
    sampleId: '',
    referenceLabName: '',
    testRequested: '',
    trackingNumber: '',
    expectedReturnDate: '',
    notes: '',
  });

  // Fetch samples for selection
  const { data: samples = [], isLoading: loadingSamples } = useQuery({
    queryKey: ['/api/samples'],
    queryFn: () => samplesApi.getSamples({ limit: 100 }),
  });

  const { data: outboundSamples = [], isLoading: loadingOutbound, refetch: refetchOutbound } = useQuery({
    queryKey: ['/api/outbound'],
    queryFn: () => outboundApi.getOutboundSamples(),
  });

  // Create outbound sample mutation
  const createOutboundMutation = useMutation({
    mutationFn: outboundApi.createOutboundSample,
    onSuccess: () => {
      toast({
        title: "Outbound Sample Recorded",
        description: "Sample sent to reference lab successfully",
      });
      
      // Reset form
      setOutboundForm({
        sampleId: '',
        referenceLabName: '',
        testRequested: '',
        trackingNumber: '',
        expectedReturnDate: '',
        notes: '',
      });
      
      // Refetch outbound samples
      refetchOutbound();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Recording Failed",
        description: error.message || "Failed to record outbound sample",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!outboundForm.sampleId || !outboundForm.referenceLabName || !outboundForm.testRequested) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields",
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

    const outboundData = {
      sampleId: outboundForm.sampleId,
      referenceLabId: 'external-' + Date.now(), // Generate a reference lab ID
      referenceLabName: outboundForm.referenceLabName,
      testRequested: outboundForm.testRequested,
      sentBy: currentUser.id,
      trackingNumber: outboundForm.trackingNumber || null,
      expectedReturnDate: outboundForm.expectedReturnDate ? new Date(outboundForm.expectedReturnDate) : null,
      status: 'sent',
      notes: outboundForm.notes || null,
    };

    createOutboundMutation.mutate(outboundData);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            <Truck className="h-3 w-3 mr-1" />
            Sent
          </Badge>
        );
      case 'in_transit':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            <Clock className="h-3 w-3 mr-1" />
            In Transit
          </Badge>
        );
      case 'results_ready':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            Results Ready
          </Badge>
        );
      case 'returned':
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
            Returned
          </Badge>
        );
      case 'lost':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Lost
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Mock reference labs for the demo
  const referenceLabs = [
    'National Reference Laboratory',
    'Advanced Diagnostics Lab',
    'Specialty Testing Solutions',
    'Regional Medical Lab',
    'Expert Analysis Center',
    'Reference Toxicology Lab',
    'Genetic Testing Institute',
    'Pathology Reference Services',
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Outbound Samples
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track samples sent to reference laboratories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Send className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            Reference Lab Tracking
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Send Sample Form */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Send Sample to Reference Lab
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sample">Sample *</Label>
                    <Select 
                      value={outboundForm.sampleId} 
                      onValueChange={(value) => setOutboundForm(prev => ({ ...prev, sampleId: value }))}
                      disabled={createOutboundMutation.isPending || loadingSamples}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sample" />
                      </SelectTrigger>
                      <SelectContent>
                        {samples.map((sample: any) => (
                          <SelectItem key={sample.id} value={sample.id}>
                            {sample.sampleId} - {sample.patient?.firstName} {sample.patient?.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="referenceLabName">Reference Laboratory *</Label>
                    <Select 
                      value={outboundForm.referenceLabName} 
                      onValueChange={(value) => setOutboundForm(prev => ({ ...prev, referenceLabName: value }))}
                      disabled={createOutboundMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reference lab" />
                      </SelectTrigger>
                      <SelectContent>
                        {referenceLabs.map((lab) => (
                          <SelectItem key={lab} value={lab}>
                            {lab}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="testRequested">Test Requested *</Label>
                  <Input
                    id="testRequested"
                    required
                    value={outboundForm.testRequested}
                    onChange={(e) => setOutboundForm(prev => ({ ...prev, testRequested: e.target.value }))}
                    placeholder="e.g., Molecular Genetics Panel"
                    disabled={createOutboundMutation.isPending}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="trackingNumber">Tracking Number</Label>
                    <Input
                      id="trackingNumber"
                      value={outboundForm.trackingNumber}
                      onChange={(e) => setOutboundForm(prev => ({ ...prev, trackingNumber: e.target.value }))}
                      placeholder="Shipping tracking number"
                      disabled={createOutboundMutation.isPending}
                    />
                  </div>

                  <div>
                    <Label htmlFor="expectedReturnDate">Expected Return Date</Label>
                    <Input
                      id="expectedReturnDate"
                      type="date"
                      value={outboundForm.expectedReturnDate}
                      onChange={(e) => setOutboundForm(prev => ({ ...prev, expectedReturnDate: e.target.value }))}
                      disabled={createOutboundMutation.isPending}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={outboundForm.notes}
                    onChange={(e) => setOutboundForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Special instructions or additional information"
                    rows={3}
                    disabled={createOutboundMutation.isPending}
                  />
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={createOutboundMutation.isPending}
                    className="min-w-32"
                  >
                    {createOutboundMutation.isPending ? (
                      "Recording..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Record Outbound Sample
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Outbound Tracking */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Recent Outbound
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingOutbound ? (
                <div className="text-center text-sm text-gray-500">
                  Loading outbound samples...
                </div>
              ) : outboundSamples.length === 0 ? (
                <div className="text-center text-sm text-gray-500">
                  No outbound samples found
                </div>
              ) : (
                <div className="space-y-4">
                  {outboundSamples.slice(0, 5).map((outbound: any) => (
                    <div key={outbound.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{outbound.testRequested}</span>
                        {getStatusBadge(outbound.status)}
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {outbound.referenceLabName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Sent: {new Date(outbound.sentDateTime).toLocaleDateString()}
                        </div>
                        {outbound.trackingNumber && (
                          <div>Tracking: {outbound.trackingNumber}</div>
                        )}
                        {outbound.expectedReturnDate && (
                          <div>Expected: {new Date(outbound.expectedReturnDate).toLocaleDateString()}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full Outbound Table */}
      {outboundSamples.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>All Outbound Samples</CardTitle>
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
                      Reference Lab
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Test Requested
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Sent Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Tracking #
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Expected Return
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {outboundSamples.map((outbound: any) => (
                    <tr key={outbound.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">
                          {outbound.sampleId}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {outbound.referenceLabName}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">{outbound.testRequested}</div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(outbound.status)}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(outbound.sentDateTime).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm font-mono">
                        {outbound.trackingNumber || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {outbound.expectedReturnDate 
                          ? new Date(outbound.expectedReturnDate).toLocaleDateString()
                          : '-'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
