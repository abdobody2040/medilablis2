import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldCheck, AlertTriangle, CheckCircle, TrendingUp, Plus } from 'lucide-react';

export default function QualityControl() {
  const [qcForm, setQcForm] = useState({
    testType: '',
    qcLevel: '',
    lotNumber: '',
    expectedValue: '',
    actualValue: '',
    tolerance: '',
    comments: '',
  });

  // Mock data for demonstration
  const mockQcResults = [
    {
      id: '1',
      testType: 'Glucose',
      qcLevel: 'Level 1',
      lotNumber: 'QC-2024-001',
      expectedValue: 100,
      actualValue: 98.5,
      tolerance: 5,
      passed: true,
      runBy: 'Tech. Sarah Chen',
      runDateTime: '2024-12-15T08:30:00Z',
      comments: 'Within acceptable range',
    },
    {
      id: '2',
      testType: 'Cholesterol',
      qcLevel: 'Level 2',
      lotNumber: 'QC-2024-002',
      expectedValue: 200,
      actualValue: 215,
      tolerance: 10,
      passed: false,
      runBy: 'Tech. Michael Roberts',
      runDateTime: '2024-12-15T09:15:00Z',
      comments: 'Outside tolerance, reagent checked',
    },
    {
      id: '3',
      testType: 'Hemoglobin',
      qcLevel: 'Level 1',
      lotNumber: 'QC-2024-003',
      expectedValue: 12.5,
      actualValue: 12.3,
      tolerance: 0.5,
      passed: true,
      runBy: 'Tech. Lisa Wang',
      runDateTime: '2024-12-15T10:00:00Z',
      comments: 'Good precision',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('QC Entry:', qcForm);
    
    // Validate required fields
    if (!qcForm.testType || !qcForm.qcLevel || !qcForm.actualValue) {
      alert('Please fill in all required fields (Test Type, QC Level, and Actual Value)');
      return;
    }
    
    try {
      // Calculate pass/fail status based on tolerance
      const expectedVal = parseFloat(qcForm.expectedValue);
      const actualVal = parseFloat(qcForm.actualValue);
      const toleranceVal = parseFloat(qcForm.tolerance);
      
      let passed = true;
      let statusMessage = '';
      
      if (expectedVal && actualVal && toleranceVal) {
        const difference = Math.abs(expectedVal - actualVal);
        const toleranceRange = (expectedVal * toleranceVal) / 100;
        
        if (difference > toleranceRange) {
          passed = false;
          statusMessage = `Out of tolerance range. Difference: ${difference.toFixed(2)}, Allowed: ${toleranceRange.toFixed(2)}`;
        } else {
          statusMessage = `Within tolerance range. Difference: ${difference.toFixed(2)}, Allowed: ${toleranceRange.toFixed(2)}`;
        }
      }
      
      // Get first test type for demo (in real app, would select proper test type)
      const testTypes = await fetch('/api/test-types').then(res => res.json()).catch(() => []);
      const testTypeId = testTypes[0]?.id || 'demo-test-type-id';
      
      // Create QC entry data
      const qcData = {
        testTypeId,
        qcLevel: qcForm.qcLevel,
        lotNumber: qcForm.lotNumber,
        expectedValue: expectedVal || 0,
        tolerance: toleranceVal || 0,
        actualValue: actualVal,
        passed,
        runBy: 'current-user-id', // In real app, get from auth context
        comments: `${qcForm.comments} - ${statusMessage}`.trim()
      };
      
      // Save to database using API
      const { qualityControlApi } = await import('@/lib/api');
      const savedQc = await qualityControlApi.submit(qcData);
      
      console.log('QC Entry Saved to Database:', savedQc);
      
      // Show success message with database ID
      alert(`Quality Control Entry Saved!\n\n` +
        `Database ID: ${savedQc.id}\n` +
        `Test Type: ${qcForm.testType}\n` +
        `QC Level: ${qcForm.qcLevel}\n` +
        `Result: ${passed ? 'PASS' : 'FAIL'}\n` +
        `${statusMessage}\n\n` +
        `Entry has been permanently saved to the database.`);
      
      // Reset form
      setQcForm({
        testType: '',
        qcLevel: '',
        lotNumber: '',
        expectedValue: '',
        actualValue: '',
        tolerance: '',
        comments: '',
      });
      
    } catch (error) {
      console.error('QC submission error:', error);
      alert(`Failed to save QC entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getQcStatusBadge = (passed: boolean) => {
    return passed ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
        <CheckCircle className="h-3 w-3 mr-1" />
        Passed
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Failed
      </Badge>
    );
  };

  const calculateDeviation = (expected: number, actual: number) => {
    const deviation = ((actual - expected) / expected) * 100;
    return deviation.toFixed(2);
  };

  const passedCount = mockQcResults.filter(qc => qc.passed).length;
  const failedCount = mockQcResults.filter(qc => !qc.passed).length;
  const passRate = mockQcResults.length > 0 ? ((passedCount / mockQcResults.length) * 100).toFixed(1) : '0';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quality Control
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quality control monitoring and management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            {passRate}% pass rate today
          </span>
        </div>
      </div>

      {/* QC Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total QC Runs
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockQcResults.length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900/20">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Passed
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {passedCount}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Failed
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {failedCount}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-red-100 dark:bg-red-900/20">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pass Rate
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {passRate}%
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900/20">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="entry" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="entry" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            QC Entry
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            QC Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entry" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quality Control Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="testType">Test Type *</Label>
                    <Select value={qcForm.testType} onValueChange={(value) => setQcForm(prev => ({ ...prev, testType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select test type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="glucose">Glucose</SelectItem>
                        <SelectItem value="cholesterol">Cholesterol</SelectItem>
                        <SelectItem value="hemoglobin">Hemoglobin</SelectItem>
                        <SelectItem value="creatinine">Creatinine</SelectItem>
                        <SelectItem value="sodium">Sodium</SelectItem>
                        <SelectItem value="potassium">Potassium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="qcLevel">QC Level *</Label>
                    <Select value={qcForm.qcLevel} onValueChange={(value) => setQcForm(prev => ({ ...prev, qcLevel: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select QC level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="level1">Level 1 (Normal)</SelectItem>
                        <SelectItem value="level2">Level 2 (Abnormal)</SelectItem>
                        <SelectItem value="level3">Level 3 (Pathological)</SelectItem>
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
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tolerance">Tolerance (%) *</Label>
                    <Input
                      id="tolerance"
                      type="number"
                      step="0.1"
                      required
                      value={qcForm.tolerance}
                      onChange={(e) => setQcForm(prev => ({ ...prev, tolerance: e.target.value }))}
                      placeholder="Acceptable tolerance"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expectedValue">Expected Value *</Label>
                    <Input
                      id="expectedValue"
                      type="number"
                      step="0.01"
                      required
                      value={qcForm.expectedValue}
                      onChange={(e) => setQcForm(prev => ({ ...prev, expectedValue: e.target.value }))}
                      placeholder="Expected QC value"
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
                      placeholder="Measured QC value"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="comments">Comments</Label>
                  <Input
                    id="comments"
                    value={qcForm.comments}
                    onChange={(e) => setQcForm(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="Additional comments or observations"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      console.log('Clearing QC form...');
                      setQcForm({
                        testType: '',
                        qcLevel: '',
                        lotNumber: '',
                        expectedValue: '',
                        actualValue: '',
                        tolerance: '',
                        comments: '',
                      });
                    }}
                  >
                    Clear
                  </Button>
                  <Button type="submit">
                    Submit QC Result
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Test Type
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        QC Level
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Lot Number
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Expected
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Actual
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Deviation
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Run By
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Run Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {mockQcResults.map((qc) => (
                      <tr key={qc.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-4 font-medium">
                          {qc.testType}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {qc.qcLevel}
                        </td>
                        <td className="py-3 px-4 text-sm font-mono">
                          {qc.lotNumber}
                        </td>
                        <td className="py-3 px-4 text-sm test-result">
                          {qc.expectedValue}
                        </td>
                        <td className="py-3 px-4 text-sm test-result">
                          {qc.actualValue}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`${
                            Math.abs(parseFloat(calculateDeviation(qc.expectedValue, qc.actualValue))) > qc.tolerance
                              ? 'text-red-600 font-medium'
                              : 'text-green-600'
                          }`}>
                            {calculateDeviation(qc.expectedValue, qc.actualValue)}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {getQcStatusBadge(qc.passed)}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {qc.runBy}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(qc.runDateTime).toLocaleString()}
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
