import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ClipboardCheck, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResultParameter {
  id: string;
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag: string;
}

export function ResultsEntry() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    sampleId: '',
    testType: '',
    results: [] as ResultParameter[],
    comments: '',
    technician: '',
  });

  const [currentResult, setCurrentResult] = useState({
    parameter: '',
    value: '',
    unit: '',
    referenceRange: '',
    flag: 'N',
  });

  const addResult = () => {
    if (currentResult.parameter && currentResult.value) {
      const newResult: ResultParameter = {
        id: Date.now().toString(),
        name: currentResult.parameter,
        value: currentResult.value,
        unit: currentResult.unit,
        referenceRange: currentResult.referenceRange,
        flag: currentResult.flag,
      };

      setForm(prev => ({
        ...prev,
        results: [...prev.results, newResult]
      }));

      setCurrentResult({
        parameter: '',
        value: '',
        unit: '',
        referenceRange: '',
        flag: 'N',
      });
    }
  };

  const removeResult = (id: string) => {
    setForm(prev => ({
      ...prev,
      results: prev.results.filter(r => r.id !== id)
    }));
  };

  const getFlagColor = (flag: string) => {
    switch (flag) {
      case 'H': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'L': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'A': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    }
  };

  const getFlagLabel = (flag: string) => {
    switch (flag) {
      case 'H': return 'High';
      case 'L': return 'Low';
      case 'A': return 'Abnormal';
      default: return 'Normal';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that all required fields are filled
    if (!form.sampleId || !form.testType || form.results.length === 0) {
      alert('Please fill in all required fields and add at least one result.');
      return;
    }

    // Validate that all results have values
    const incompleteResults = form.results.some(result => !result.value.trim());
    if (incompleteResults) {
      alert('Please enter values for all test parameters.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user for enteredBy field
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

      const resultData = {
        sampleId: form.sampleId,
        testType: form.testType,
        results: form.results,
        comments: form.comments,
        enteredBy: currentUser.id || 'unknown',
        technician: form.technician,
      };

      const response = await fetch('/api/results/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(resultData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to save results' }));
        throw new Error(errorData.error || 'Failed to save results');
      }

      const result = await response.json();
      console.log('Results submitted successfully:', result);
      alert(`Results saved successfully for sample ${form.sampleId}!`);

      // Reset form
      setForm({
        sampleId: '',
        testType: '',
        results: [],
        comments: '',
        technician: '',
      });
    } catch (error) {
      console.error('Failed to save results:', error);
      alert(`Failed to save results: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5" />
          Test Results Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sample Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sampleId">Sample ID *</Label>
              <Input
                id="sampleId"
                required
                value={form.sampleId}
                onChange={(e) => setForm(prev => ({ ...prev, sampleId: e.target.value }))}
                placeholder="Enter sample ID"
                className="sample-id"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="testType">Test Type *</Label>
              <Select value={form.testType} onValueChange={(value) => setForm(prev => ({ ...prev, testType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cbc">Complete Blood Count</SelectItem>
                  <SelectItem value="bmp">Basic Metabolic Panel</SelectItem>
                  <SelectItem value="lipid">Lipid Panel</SelectItem>
                  <SelectItem value="liver">Liver Function Tests</SelectItem>
                  <SelectItem value="thyroid">Thyroid Function Tests</SelectItem>
                  <SelectItem value="glucose">Glucose Tolerance Test</SelectItem>
                  <SelectItem value="urinalysis">Urinalysis</SelectItem>
                  <SelectItem value="culture">Culture & Sensitivity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Result Entry */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Test Parameters</h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <div>
                <Label htmlFor="parameter">Parameter</Label>
                <Input
                  id="parameter"
                  value={currentResult.parameter}
                  onChange={(e) => setCurrentResult(prev => ({ ...prev, parameter: e.target.value }))}
                  placeholder="Parameter name"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  value={currentResult.value}
                  onChange={(e) => setCurrentResult(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Result value"
                  className="test-result"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={currentResult.unit}
                  onChange={(e) => setCurrentResult(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="Unit"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="referenceRange">Reference Range</Label>
                <Input
                  id="referenceRange"
                  value={currentResult.referenceRange}
                  onChange={(e) => setCurrentResult(prev => ({ ...prev, referenceRange: e.target.value }))}
                  placeholder="Normal range"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="flag">Flag</Label>
                <Select value={currentResult.flag} onValueChange={(value) => setCurrentResult(prev => ({ ...prev, flag: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="N">Normal</SelectItem>
                    <SelectItem value="H">High</SelectItem>
                    <SelectItem value="L">Low</SelectItem>
                    <SelectItem value="A">Abnormal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-5 flex justify-end">
                <Button type="button" onClick={addResult} disabled={isSubmitting}>
                  Add Parameter
                </Button>
              </div>
            </div>
          </div>

          {/* Results Display */}
          {form.results.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Entered Results</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium">Parameter</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Value</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Unit</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Reference Range</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Flag</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {form.results.map((result) => (
                      <tr key={result.id}>
                        <td className="px-4 py-2 text-sm font-medium">{result.name}</td>
                        <td className="px-4 py-2 text-sm test-result">{result.value}</td>
                        <td className="px-4 py-2 text-sm">{result.unit}</td>
                        <td className="px-4 py-2 text-sm">{result.referenceRange}</td>
                        <td className="px-4 py-2">
                          <Badge className={getFlagColor(result.flag)}>
                            {getFlagLabel(result.flag)}
                          </Badge>
                        </td>
                        <td className="px-4 py-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeResult(result.id)}
                            disabled={isSubmitting}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="technician">Technician</Label>
              <Input
                id="technician"
                value={form.technician}
                onChange={(e) => setForm(prev => ({ ...prev, technician: e.target.value }))}
                placeholder="Technician name"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              value={form.comments}
              onChange={(e) => setForm(prev => ({ ...prev, comments: e.target.value }))}
              placeholder="Additional comments or observations"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {/* Critical Values Alert */}
          {form.results.some(r => r.flag === 'H' || r.flag === 'A') && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-700">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-800 dark:text-red-400">
                Critical values detected. Please verify results and notify physician immediately.
              </span>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setForm({
                sampleId: '',
                testType: '',
                results: [],
                comments: '',
                technician: '',
              })}
              disabled={isSubmitting}
            >
              Clear
            </Button>
            <Button type="submit" disabled={isSubmitting || form.results.length === 0}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Results
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}