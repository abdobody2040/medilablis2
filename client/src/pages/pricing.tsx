import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, DollarSign, Package, Edit, Trash2, Plus } from 'lucide-react';

export default function Pricing() {
  const [testPricing, setTestPricing] = useState({
    testCode: '',
    testName: '',
    category: '',
    basePrice: '',
    insurancePrice: '',
    cashPrice: '',
    description: '',
    isActive: true,
  });

  const [packageForm, setPackageForm] = useState({
    packageName: '',
    description: '',
    totalPrice: '',
    discountPercent: '',
    isActive: true,
    tests: [] as string[],
  });

  // Mock pricing data
  const mockTestPricing = [
    {
      id: '1',
      testCode: 'CBC',
      testName: 'Complete Blood Count',
      category: 'Hematology',
      basePrice: 45.00,
      insurancePrice: 35.00,
      cashPrice: 40.00,
      isActive: true,
      description: 'Complete blood count with differential',
    },
    {
      id: '2',
      testCode: 'BMP',
      testName: 'Basic Metabolic Panel',
      category: 'Chemistry',
      basePrice: 65.00,
      insurancePrice: 50.00,
      cashPrice: 58.00,
      isActive: true,
      description: 'Glucose, BUN, creatinine, electrolytes',
    },
    {
      id: '3',
      testCode: 'LIP',
      testName: 'Lipid Panel',
      category: 'Chemistry',
      basePrice: 75.00,
      insurancePrice: 60.00,
      cashPrice: 68.00,
      isActive: true,
      description: 'Total cholesterol, HDL, LDL, triglycerides',
    },
    {
      id: '4',
      testCode: 'TSH',
      testName: 'Thyroid Stimulating Hormone',
      category: 'Endocrinology',
      basePrice: 55.00,
      insurancePrice: 42.00,
      cashPrice: 48.00,
      isActive: true,
      description: 'TSH level for thyroid function',
    },
  ];

  const mockPackages = [
    {
      id: '1',
      packageName: 'Health Screening Package',
      description: 'Comprehensive health screening for annual checkups',
      tests: ['CBC', 'BMP', 'LIP', 'TSH'],
      individualTotal: 240.00,
      packagePrice: 180.00,
      discountPercent: 25,
      isActive: true,
    },
    {
      id: '2',
      packageName: 'Cardiac Risk Assessment',
      description: 'Tests to assess cardiovascular risk factors',
      tests: ['LIP', 'BMP'],
      individualTotal: 140.00,
      packagePrice: 115.00,
      discountPercent: 18,
      isActive: true,
    },
    {
      id: '3',
      packageName: 'Basic Wellness Panel',
      description: 'Essential tests for general wellness monitoring',
      tests: ['CBC', 'BMP'],
      individualTotal: 110.00,
      packagePrice: 90.00,
      discountPercent: 18,
      isActive: false,
    },
  ];

  const handleTestPricingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating test pricing:', testPricing);
    
    // Reset form
    setTestPricing({
      testCode: '',
      testName: '',
      category: '',
      basePrice: '',
      insurancePrice: '',
      cashPrice: '',
      description: '',
      isActive: true,
    });
  };

  const handlePackageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating package:', packageForm);
    
    // Reset form
    setPackageForm({
      packageName: '',
      description: '',
      totalPrice: '',
      discountPercent: '',
      isActive: true,
      tests: [],
    });
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
        Active
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
        Inactive
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      'Hematology': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'Chemistry': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'Endocrinology': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'Microbiology': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'Immunology': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    };

    return (
      <Badge className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {category}
      </Badge>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Pricing Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage test pricing, packages, and billing configurations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            {mockTestPricing.length} tests configured
          </span>
        </div>
      </div>

      {/* Pricing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Tests
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {mockTestPricing.length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900/20">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Packages
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {mockPackages.filter(p => p.isActive).length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-green-100 dark:bg-green-900/20">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg Test Price
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  ${(mockTestPricing.reduce((sum, test) => sum + test.basePrice, 0) / mockTestPricing.length).toFixed(0)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-orange-100 dark:bg-orange-900/20">
                <CreditCard className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Max Discount
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.max(...mockPackages.map(p => p.discountPercent))}%
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-purple-100 dark:bg-purple-900/20">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tests" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tests" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Test Pricing
          </TabsTrigger>
          <TabsTrigger value="packages" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Test Packages
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing Config
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="mt-6 space-y-6">
          {/* Add New Test Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Test Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTestPricingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="testCode">Test Code *</Label>
                    <Input
                      id="testCode"
                      required
                      value={testPricing.testCode}
                      onChange={(e) => setTestPricing(prev => ({ ...prev, testCode: e.target.value }))}
                      placeholder="e.g., CBC"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="testName">Test Name *</Label>
                    <Input
                      id="testName"
                      required
                      value={testPricing.testName}
                      onChange={(e) => setTestPricing(prev => ({ ...prev, testName: e.target.value }))}
                      placeholder="Full test name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={testPricing.category} onValueChange={(value) => setTestPricing(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hematology">Hematology</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                        <SelectItem value="Microbiology">Microbiology</SelectItem>
                        <SelectItem value="Immunology">Immunology</SelectItem>
                        <SelectItem value="Pathology">Pathology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="basePrice">Base Price *</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      step="0.01"
                      required
                      value={testPricing.basePrice}
                      onChange={(e) => setTestPricing(prev => ({ ...prev, basePrice: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="insurancePrice">Insurance Price</Label>
                    <Input
                      id="insurancePrice"
                      type="number"
                      step="0.01"
                      value={testPricing.insurancePrice}
                      onChange={(e) => setTestPricing(prev => ({ ...prev, insurancePrice: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cashPrice">Cash Price</Label>
                    <Input
                      id="cashPrice"
                      type="number"
                      step="0.01"
                      value={testPricing.cashPrice}
                      onChange={(e) => setTestPricing(prev => ({ ...prev, cashPrice: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={testPricing.description}
                    onChange={(e) => setTestPricing(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Test description and details"
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={testPricing.isActive}
                    onCheckedChange={(checked) => setTestPricing(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Test is active</Label>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline">
                    Clear
                  </Button>
                  <Button type="submit">
                    Add Test Pricing
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Test Pricing List */}
          <Card>
            <CardHeader>
              <CardTitle>Test Pricing List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Test Code
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Test Name
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Base Price
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Insurance
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Cash
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {mockTestPricing.map((test) => (
                      <tr key={test.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-4">
                          <span className="font-mono font-medium">
                            {test.testCode}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {test.testName}
                        </td>
                        <td className="py-3 px-4">
                          {getCategoryBadge(test.category)}
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          ${test.basePrice.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          ${test.insurancePrice.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          ${test.cashPrice.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(test.isActive)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                console.log(`Editing test: ${test.testName}`);
                                alert(`Editing test: ${test.testName}`);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => {
                                console.log(`Deleting test: ${test.testName}`);
                                if (confirm(`Are you sure you want to delete ${test.testName}?`)) {
                                  alert(`Test ${test.testName} deleted!`);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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

        <TabsContent value="packages" className="mt-6 space-y-6">
          {/* Package List */}
          <Card>
            <CardHeader>
              <CardTitle>Test Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockPackages.map((pkg) => (
                  <Card key={pkg.id} className="border-2">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{pkg.packageName}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {pkg.description}
                          </p>
                        </div>
                        {getStatusBadge(pkg.isActive)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Included Tests:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {pkg.tests.map((test) => (
                            <Badge key={test} variant="outline" className="text-xs">
                              {test}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Individual Total:</span>
                          <span className="line-through text-gray-500">
                            ${pkg.individualTotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>Package Price:</span>
                          <span className="text-green-600">
                            ${pkg.packagePrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Discount:</span>
                          <span className="text-green-600 font-medium">
                            {pkg.discountPercent}% OFF
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Payment Methods</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { method: 'Cash', enabled: true },
                        { method: 'Credit Card', enabled: true },
                        { method: 'Debit Card', enabled: true },
                        { method: 'Insurance', enabled: true },
                        { method: 'Check', enabled: false },
                        { method: 'Bank Transfer', enabled: true },
                      ].map((item) => (
                        <div key={item.method} className="flex items-center justify-between">
                          <span>{item.method}</span>
                          <Switch defaultChecked={item.enabled} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Billing Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Default Payment Terms (days)</Label>
                        <Input type="number" defaultValue="30" className="mt-1" />
                      </div>
                      <div>
                        <Label>Late Fee Percentage</Label>
                        <Input type="number" step="0.1" defaultValue="1.5" className="mt-1" />
                      </div>
                      <div>
                        <Label>Tax Rate (%)</Label>
                        <Input type="number" step="0.01" defaultValue="8.25" className="mt-1" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked />
                        <Label>Auto-generate invoice numbers</Label>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end">
                  <Button>
                    Save Configuration
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
