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
  ClipboardCheck, 
  Save, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Calendar,
  TrendingUp,
  Target
} from 'lucide-react';
import { qualityControlApi, testTypesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function QualityControl() {
  const { toast } = useToast();

  const [qcForm, setQcForm] = useState({
    testTypeId: '',
    qcLevel: 'normal',
    lotNumber: '',
    expectedValue: '',
    tolerance: '',
    actualValue: '',
    comments: '',
  });

  // Fetch test types for the dropdown
  const { data: testTypes = [], isLoading: loadingTestTypes } = useQuery({
    queryKey: ['/api/test-types'],
    queryFn: testTypesApi.getTestTypes,
  });

  // Create QC entry mutation
  const createQCMutation = useMutation({
    mutationFn: qualityControlApi.createQC,
    onSuccess: (data) => {
      toast({
        title: "QC Entry Saved",
        description: `Quality control entry created successfully`,
      });

      // Reset form
      setQcForm({
        testTypeId: '',
        qcLevel: 'normal',
        lotNumber: '',
        expectedValue: '',
        tolerance: '',
        actualValue: '',
        comments: '',
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error.message || "Failed to save QC entry",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!qcForm.testTypeId || !qcForm.lotNumber || !qcForm.expectedValue || !qcForm.actualValue) {
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

    // Calculate pass/fail status
    const expected = parseFloat(qcForm.expectedValue);
    const actual = parseFloat(qcForm.actualValue);
    const tolerance = parseFloat(qcForm.tolerance);
    const passed = Math.abs(expected - actual) <= tolerance;

    const qcData = {
      testTypeId: qcForm.testTypeId,
      qcLevel: qcForm.qcLevel,
      lotNumber: qcForm.lotNumber,
      expectedValue: expected,
      tolerance: tolerance,
      actualValue: actual,
      passed,
      runBy: currentUser.id,
      comments: qcForm.comments || null,
    };

    createQCMutation.mutate(qcData);
  };

  // Mock recent QC data for display
  const mockRecentQC = [
    {
      id: '1',
      testType: 'Complete Blood Count',
      qcLevel: 'normal',
      lotNumber: 'QC-2024-001',
      expectedValue: 12.5,
      actualValue: 12.3,
      tolerance: 0.5,
      passed: true,
      runDateTime: '2024-12-15T08:00:00Z',
      runBy: 'Tech001',
    },
    {
      id: '2',
      testType: 'Glucose',
      qcLevel: 'high',
      lotNumber: 'QC-2024-002',
      expectedValue: 250.0,
      actualValue: 253.2,
      tolerance: 5.0,
      passed: true,
      runDateTime: '2024-12-15T08:15:00Z',
      runBy: 'Tech002',
    },
    {
      id: '3',
      testType: 'Cholesterol',
      qcLevel: 'normal',
      lotNumber: 'QC-2024-003',
      expectedValue: 180.0,
      actualValue: 195.2,
      tolerance: 10.0,
      passed: false,
      runDateTime: '2024-12-15T08:30:00Z',
      runBy: 'Tech001',
    },
  ];

  const getQCStatusBadge = (passed: boolean) => {
    return passed ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
        <CheckCircle className="h-3 w-3 mr-1" />
        Pass
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
        <XCircle className="h-3 w-3 mr-1" />
        Fail
      </Badge>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quality Control
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quality control testing and monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            QC Management
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* QC Entry Form */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                QC Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="testType">Test Type *</Label>
                    <Select 
                      value={qcForm.testTypeId} 
                      onValueChange={(value) => setQcForm(prev => ({ ...prev, testTypeId: value }))}
                      disabled={createQCMutation.isPending || loadingTestTypes}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select test type" />
                      </SelectTrigger>
                      <SelectContent>
                        {testTypes.map((testType: any) => (
                          <SelectItem key={testType.id} value={testType.id}>
                            {testType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="qcLevel">QC Level *</Label>
                    <Select 
                      value={qcForm.qcLevel} 
                      onValueChange={(value) => setQcForm(prev => ({ ...prev, qcLevel: value }))}
                      disabled={createQCMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lotNumber">Lot Number *</Label>
                    <Input
                      id="lotNumber"
                      required
                      value={qcForm.lotNumber}
                      onChange={(e) => setQcForm(prev => ({ ...prev, lotNumber: e.target.value }))}
                      placeholder="QC lot number"
                      disabled={createQCMutation.isPending}
                    />
                  </div>

                  <div>
                    <Label htmlFor="expectedValue">Expected Value *</Label>
                    <Input
                      id="expectedValue"
                      type="number"
                      step="0.01"
                      required
                      value={qcForm.expectedValue}
                      onChange={(e) => setQcForm(prev => ({ ...prev, expectedValue: e.target.value }))}
                      placeholder="Expected value"
                      disabled={createQCMutation.isPending}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tolerance">Tolerance *</Label>
                    <Input
                      id="tolerance"
                      type="number"
                      step="0.01"
                      required
                      value={qcForm.tolerance}
                      onChange={(e) => setQcForm(prev => ({ ...prev, tolerance: e.target.value }))}
                      placeholder="Acceptable tolerance"
                      disabled={createQCMutation.isPending}
                    />
                  </div>

                  <div>
                    <Label htmlFor="actualValue">Actual Value *</Label>
                    <Input
                      id="actualValue"
                      type="number"
                      step="0.01"
                      required
                      value={qcForm.actualValue}
                      onChange={(e) => setQcForm(prev => ({ ...prev, actualValue: e.target.value }))}
                      placeholder="Measured value"
                      disabled={createQCMutation.isPending}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="comments">Comments</Label>
                  <Textarea
                    id="comments"
                    value={qcForm.comments}
                    onChange={(e) => setQcForm(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="Additional notes or observations"
                    rows={3}
                    disabled={createQCMutation.isPending}
                  />
                </div>

                {/* QC Result Preview */}
                {qcForm.expectedValue && qcForm.actualValue && qcForm.tolerance && (
                  <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">QC Result Preview</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Expected:</span>
                        <div className="font-medium">{qcForm.expectedValue}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Actual:</span>
                        <div className="font-medium">{qcForm.actualValue}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <div>
                          {Math.abs(parseFloat(qcForm.expectedValue) - parseFloat(qcForm.actualValue)) <= parseFloat(qcForm.tolerance) ? (
                            <Badge className="bg-green-100 text-green-800">Pass</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">Fail</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={createQCMutation.isPending}
                    className="min-w-32"
                  >
                    {createQCMutation.isPending ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save QC Entry
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Recent QC Results */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent QC Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentQC.map((qc) => (
                  <div key={qc.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{qc.testType}</span>
                      {getQCStatusBadge(qc.passed)}
                    </div>
                    <div className="text-xs text-gray-500">
                      <div>Lot: {qc.lotNumber}</div>
                      <div>Level: {qc.qcLevel}</div>
                      <div>Expected: {qc.expectedValue}</div>
                      <div>Actual: {qc.actualValue}</div>
                      <div>By: {qc.runBy}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}