import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Send, Package, Truck, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Outbound() {
  const [outboundForm, setOutboundForm] = useState({
    sampleId: '',
    referenceLabName: '',
    testRequested: '',
    trackingNumber: '',
    expectedReturnDate: '',
    notes: '',
  });

  // Mock data for demonstration
  const mockOutboundSamples = [
    {
      id: '1',
      sampleId: 'LAB-20241215-001',
      patientName: 'John Martinez',
      referenceLabName: 'Advanced Diagnostics Lab',
      testRequested: 'Genetic Testing - BRCA1/BRCA2',
      status: 'sent',
      sentDateTime: '2024-12-14T10:30:00Z',
      trackingNumber: 'TR-2024-001',
      expectedReturnDate: '2024-12-20T10:30:00Z',
      sentBy: 'Tech. Sarah Chen',
      notes: 'Urgent genetic screening requested by oncologist',
    },
    {
      id: '2',
      sampleId: 'LAB-20241215-002',
      patientName: 'Emma Thompson',
      referenceLabName: 'Specialty Immunology Center',
      testRequested: 'Flow Cytometry Panel',
      status: 'in_transit',
      sentDateTime: '2024-12-13T14:15:00Z',
      trackingNumber: 'TR-2024-002',
      expectedReturnDate: '2024-12-18T14:15:00Z',
      sentBy: 'Dr. Michael Roberts',
      notes: 'Special handling required - keep at 4°C',
    },
    {
      id: '3',
      sampleId: 'LAB-20241215-003',
      patientName: 'Michael Chen',
      referenceLabName: 'Molecular Pathology Lab',
      testRequested: 'Next Generation Sequencing',
      status: 'received_by_lab',
      sentDateTime: '2024-12-12T09:00:00Z',
      trackingNumber: 'TR-2024-003',
      expectedReturnDate: '2024-12-19T09:00:00Z',
      sentBy: 'Tech. Lisa Wang',
      notes: 'Sample for research study protocol #2024-NGS-15',
    },
    {
      id: '4',
      sampleId: 'LAB-20241215-004',
      patientName: 'Sarah Wilson',
      referenceLabName: 'Reference Toxicology Lab',
      testRequested: 'Heavy Metal Analysis',
      status: 'results_ready',
      sentDateTime: '2024-12-10T11:20:00Z',
      trackingNumber: 'TR-2024-004',
      expectedReturnDate: '2024-12-17T11:20:00Z',
      sentBy: 'Dr. Robert Kim',
      notes: 'Environmental exposure screening',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Outbound sample:', outboundForm);
    
    // Reset form
    setOutboundForm({
      sampleId: '',
      referenceLabName: '',
      testRequested: '',
      trackingNumber: '',
      expectedReturnDate: '',
      notes: '',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            <Send className="h-3 w-3 mr-1" />
            Sent
          </Badge>
        );
      case 'in_transit':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            <Truck className="h-3 w-3 mr-1" />
            In Transit
          </Badge>
        );
      case 'received_by_lab':
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
            <Package className="h-3 w-3 mr-1" />
            Received by Lab
          </Badge>
        );
      case 'results_ready':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            Results Ready
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusCounts = () => {
    return {
      sent: mockOutboundSamples.filter(s => s.status === 'sent').length,
      in_transit: mockOutboundSamples.filter(s => s.status === 'in_transit').length,
      received_by_lab: mockOutboundSamples.filter(s => s.status === 'received_by_lab').length,
      results_ready: mockOutboundSamples.filter(s => s.status === 'results_ready').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Outbound Samples
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Inter-laboratory sample management and tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Send className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            {mockOutboundSamples.length} samples sent to reference labs
          </span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Sent
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {statusCounts.sent}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900/20">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  In Transit
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {statusCounts.in_transit}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/20">
                <Truck className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  At Reference Lab
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {statusCounts.received_by_lab}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-purple-100 dark:bg-purple-900/20">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Results Ready
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {statusCounts.results_ready}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="send" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send Sample
          </TabsTrigger>
          <TabsTrigger value="track" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Track Samples
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send Sample to Reference Laboratory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sampleId">Sample ID *</Label>
                    <Input
                      id="sampleId"
                      required
                      value={outboundForm.sampleId}
                      onChange={(e) => setOutboundForm(prev => ({ ...prev, sampleId: e.target.value }))}
                      placeholder="Enter sample ID"
                      className="sample-id"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="trackingNumber">Tracking Number</Label>
                    <Input
                      id="trackingNumber"
                      value={outboundForm.trackingNumber}
                      onChange={(e) => setOutboundForm(prev => ({ ...prev, trackingNumber: e.target.value }))}
                      placeholder="Courier tracking number"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="referenceLabName">Reference Laboratory *</Label>
                  <Select 
                    value={outboundForm.referenceLabName} 
                    onValueChange={(value) => setOutboundForm(prev => ({ ...prev, referenceLabName: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select reference laboratory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="advanced-diagnostics">Advanced Diagnostics Lab</SelectItem>
                      <SelectItem value="specialty-immunology">Specialty Immunology Center</SelectItem>
                      <SelectItem value="molecular-pathology">Molecular Pathology Lab</SelectItem>
                      <SelectItem value="reference-toxicology">Reference Toxicology Lab</SelectItem>
                      <SelectItem value="genetics-center">Genetics Testing Center</SelectItem>
                      <SelectItem value="infectious-disease">Infectious Disease Reference Lab</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="testRequested">Test Requested *</Label>
                  <Input
                    id="testRequested"
                    required
                    value={outboundForm.testRequested}
                    onChange={(e) => setOutboundForm(prev => ({ ...prev, testRequested: e.target.value }))}
                    placeholder="Specific test or panel requested"
                  />
                </div>

                <div>
                  <Label htmlFor="expectedReturnDate">Expected Return Date</Label>
                  <Input
                    id="expectedReturnDate"
                    type="datetime-local"
                    value={outboundForm.expectedReturnDate}
                    onChange={(e) => setOutboundForm(prev => ({ ...prev, expectedReturnDate: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={outboundForm.notes}
                    onChange={(e) => setOutboundForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Special handling instructions, clinical notes, or other relevant information"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline">
                    Clear
                  </Button>
                  <Button type="submit">
                    Send Sample
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="track" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Outbound Sample Tracking</CardTitle>
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
                        Reference Lab
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Test Requested
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Tracking
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Sent
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Expected Return
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {mockOutboundSamples.map((sample) => (
                      <tr key={sample.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-4">
                          <span className="sample-id font-mono text-sm">
                            {sample.sampleId}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="patient-name">
                            {sample.patientName}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {sample.referenceLabName}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {sample.testRequested}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(sample.status)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {sample.trackingNumber}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {formatDistanceToNow(new Date(sample.sentDateTime), { addSuffix: true })}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(sample.expectedReturnDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                console.log(`Viewing details for sample: ${sample.sampleId}`);
                                alert(`Viewing details for sample ${sample.sampleId}`);
                              }}
                            >
                              View Details
                            </Button>
                            {sample.status === 'results_ready' && (
                              <Button 
                                size="sm"
                                onClick={() => {
                                  console.log(`Importing results for sample: ${sample.sampleId}`);
                                  alert(`Importing results for sample ${sample.sampleId}`);
                                }}
                              >
                                Import Results
                              </Button>
                            )}
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
      </Tabs>
    </div>
  );
}
