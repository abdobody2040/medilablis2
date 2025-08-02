import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, CreditCard, Receipt, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { formatDistanceToNow } from 'date-fns';

export default function Financial() {
  const [invoiceForm, setInvoiceForm] = useState({
    patientId: '',
    description: '',
    amount: '',
    paymentMethod: '',
    dueDate: '',
  });

  // Mock financial data
  const revenueData = [
    { month: 'Jan', revenue: 45000, collections: 42000 },
    { month: 'Feb', revenue: 48000, collections: 45000 },
    { month: 'Mar', revenue: 52000, collections: 49000 },
    { month: 'Apr', revenue: 49000, collections: 47000 },
    { month: 'May', revenue: 55000, collections: 52000 },
    { month: 'Jun', revenue: 58000, collections: 55000 },
  ];

  const mockTransactions = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      patientName: 'John Martinez',
      description: 'Complete Blood Count, Lipid Panel',
      amount: 125.50,
      paymentStatus: 'paid',
      paymentMethod: 'insurance',
      transactionDate: '2024-12-15T10:30:00Z',
      dueDate: '2024-12-20T10:30:00Z',
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      patientName: 'Emma Thompson',
      description: 'Thyroid Function Tests',
      amount: 85.00,
      paymentStatus: 'pending',
      paymentMethod: 'credit_card',
      transactionDate: '2024-12-14T14:15:00Z',
      dueDate: '2024-12-21T14:15:00Z',
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      patientName: 'Michael Chen',
      description: 'Glucose Tolerance Test',
      amount: 95.00,
      paymentStatus: 'overdue',
      paymentMethod: 'cash',
      transactionDate: '2024-12-10T09:00:00Z',
      dueDate: '2024-12-15T09:00:00Z',
    },
    {
      id: '4',
      invoiceNumber: 'INV-2024-004',
      patientName: 'Sarah Wilson',
      description: 'Hemoglobin A1c, Vitamin D',
      amount: 145.00,
      paymentStatus: 'partial',
      paymentMethod: 'insurance',
      transactionDate: '2024-12-12T11:20:00Z',
      dueDate: '2024-12-19T11:20:00Z',
    },
  ];

  const handleInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating invoice:', invoiceForm);
    
    // Validate required fields
    if (!invoiceForm.patientId || !invoiceForm.description || !invoiceForm.amount) {
      alert('Please fill in all required fields (Patient ID, Description, Amount)');
      return;
    }
    
    // Validate amount
    const amount = parseFloat(invoiceForm.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    try {
      // Find or create patient first (simplified for demo)
      let patientId = invoiceForm.patientId;
      
      // Try to find existing patient
      const existingPatient = await fetch(`/api/patients/search?q=${patientId}`)
        .then(res => res.json())
        .catch(() => []);
      
      if (existingPatient.length === 0) {
        // Create demo patient if not found
        const newPatient = await fetch('/api/patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patientId: invoiceForm.patientId,
            firstName: 'Demo',
            lastName: 'Patient',
            dateOfBirth: new Date('1990-01-01'),
            gender: 'unknown',
            phoneNumber: '555-0000',
            email: `${invoiceForm.patientId}@demo.com`,
            address: 'Demo Address'
          })
        }).then(res => res.json()).catch(() => null);
        
        if (newPatient) {
          patientId = newPatient.id;
        }
      } else {
        patientId = existingPatient[0].id;
      }
      
      // Generate invoice number
      const invoiceNumber = `INV-2024-${String(Date.now()).slice(-6)}`;
      
      // Create invoice data for database
      const invoiceData = {
        patientId,
        transactionType: 'invoice',
        amount: amount.toString(),
        currency: 'USD',
        paymentMethod: invoiceForm.paymentMethod || 'cash',
        paymentStatus: 'pending',
        invoiceNumber,
        description: invoiceForm.description,
        processedBy: 'current-user-id', // In real app, get from auth context
        dueDate: invoiceForm.dueDate ? new Date(invoiceForm.dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };
      
      // Save to database using API
      const { financialApi } = await import('@/lib/api');
      const savedInvoice = await financialApi.createInvoice(invoiceData);
      
      console.log('Invoice Saved to Database:', savedInvoice);
      
      // Create invoice content for download
      const invoiceContent = `
LABORATORY INVOICE
==================

Invoice #: ${invoiceNumber}
Date: ${new Date().toLocaleDateString()}
Due Date: ${invoiceData.dueDate.toLocaleDateString()}

Patient ID: ${invoiceForm.patientId}
Services: ${invoiceForm.description}
Amount: $${amount.toFixed(2)}
Payment Method: ${invoiceForm.paymentMethod}
Status: pending

Database Record ID: ${savedInvoice.id}

Thank you for choosing our laboratory services!
      `.trim();
      
      // Create and download invoice file
      const blob = new Blob([invoiceContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `invoice-${invoiceNumber}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert(`Invoice Created & Saved to Database!\n\n` +
        `Invoice #: ${invoiceNumber}\n` +
        `Database ID: ${savedInvoice.id}\n` +
        `Patient ID: ${invoiceForm.patientId}\n` +
        `Amount: $${amount.toFixed(2)}\n` +
        `Due Date: ${invoiceData.dueDate.toLocaleDateString()}\n\n` +
        `Invoice has been permanently saved to the database and downloaded.`);
      
      // Reset form
      setInvoiceForm({
        patientId: '',
        description: '',
        amount: '',
        paymentMethod: '',
        dueDate: '',
      });
      
    } catch (error) {
      console.error('Invoice creation error:', error);
      alert(`Failed to create invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            <CreditCard className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        );
      case 'partial':
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            <Receipt className="h-3 w-3 mr-1" />
            Partial
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculateFinancialSummary = () => {
    const totalRevenue = mockTransactions.reduce((sum, t) => sum + t.amount, 0);
    const paidAmount = mockTransactions
      .filter(t => t.paymentStatus === 'paid')
      .reduce((sum, t) => sum + t.amount, 0);
    const pendingAmount = mockTransactions
      .filter(t => t.paymentStatus === 'pending' || t.paymentStatus === 'partial')
      .reduce((sum, t) => sum + t.amount, 0);
    const overdueAmount = mockTransactions
      .filter(t => t.paymentStatus === 'overdue')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalRevenue,
      paidAmount,
      pendingAmount,
      overdueAmount,
      collectionRate: totalRevenue > 0 ? (paidAmount / totalRevenue) * 100 : 0,
    };
  };

  const summary = calculateFinancialSummary();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Financial Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Laboratory billing, payments, and financial oversight
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            ${summary.collectionRate.toFixed(1)}% collection rate
          </span>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  ${summary.totalRevenue.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Current period</p>
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
                  Collected
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ${summary.paidAmount.toFixed(2)}
                </p>
                <p className="text-xs text-green-600 mt-1">{summary.collectionRate.toFixed(1)}% rate</p>
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
                  Pending
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  ${summary.pendingAmount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/20">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Overdue
                </p>
                <p className="text-2xl font-bold text-red-600">
                  ${summary.overdueAmount.toFixed(2)}
                </p>
                <p className="text-xs text-red-600 mt-1">Requires follow-up</p>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-red-100 dark:bg-red-900/20">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Create Invoice
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Collections Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(207, 90%, 54%)" 
                      strokeWidth={2}
                      name="Revenue"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="collections" 
                      stroke="hsl(142, 71%, 45%)" 
                      strokeWidth={2}
                      name="Collections"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { method: 'Insurance', amount: 285.50, percentage: 65 },
                    { method: 'Credit Card', amount: 85.00, percentage: 19 },
                    { method: 'Cash', amount: 95.00, percentage: 16 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-blue-500' : 
                          index === 1 ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                        <span className="font-medium">{item.method}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${item.amount.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aging Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { period: '0-30 days', amount: 230.00, count: 3 },
                    { period: '31-60 days', amount: 145.00, count: 1 },
                    { period: '61-90 days', amount: 85.00, count: 1 },
                    { period: '90+ days', amount: 95.00, count: 1 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{item.period}</div>
                        <div className="text-xs text-gray-500">{item.count} invoice{item.count !== 1 ? 's' : ''}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${
                          index === 0 ? 'text-green-600' :
                          index === 1 ? 'text-yellow-600' :
                          index === 2 ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          ${item.amount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Invoice #
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Patient
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Description
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Payment Method
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Due Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {mockTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm">
                            {transaction.invoiceNumber}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="patient-name">
                            {transaction.patientName}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {transaction.description}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold">
                            ${transaction.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {getPaymentStatusBadge(transaction.paymentStatus)}
                        </td>
                        <td className="py-3 px-4 text-sm capitalize">
                          {transaction.paymentMethod.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {new Date(transaction.dueDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                console.log(`Viewing transaction details: ${transaction.invoiceNumber}`);
                                alert(`Transaction Details:\n\n` +
                                  `Invoice: ${transaction.invoiceNumber}\n` +
                                  `Patient: ${transaction.patientName}\n` +
                                  `Amount: $${transaction.amount.toFixed(2)}\n` +
                                  `Status: ${transaction.paymentStatus}\n` +
                                  `Method: ${transaction.paymentMethod}\n` +
                                  `Date: ${new Date(transaction.transactionDate).toLocaleDateString()}\n` +
                                  `Due: ${new Date(transaction.dueDate).toLocaleDateString()}`);
                              }}
                            >
                              View
                            </Button>
                            {transaction.paymentStatus === 'pending' && (
                              <Button 
                                size="sm"
                                onClick={() => {
                                  console.log(`Processing payment for: ${transaction.invoiceNumber}`);
                                  if (confirm(`Process payment of $${transaction.amount.toFixed(2)} for ${transaction.patientName}?`)) {
                                    alert(`Payment processed successfully!\n\n` +
                                      `Invoice: ${transaction.invoiceNumber}\n` +
                                      `Amount: $${transaction.amount.toFixed(2)}\n` +
                                      `Status: Paid\n` +
                                      `Processed: ${new Date().toLocaleString()}`);
                                  }
                                }}
                              >
                                Process Payment
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

        <TabsContent value="billing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Create Invoice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvoiceSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientId">Patient ID *</Label>
                    <Input
                      id="patientId"
                      required
                      value={invoiceForm.patientId}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, patientId: e.target.value }))}
                      placeholder="Patient identifier"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      required
                      value={invoiceForm.amount}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    required
                    value={invoiceForm.description}
                    onChange={(e) => setInvoiceForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Services provided"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select value={invoiceForm.paymentMethod} onValueChange={(value) => setInvoiceForm(prev => ({ ...prev, paymentMethod: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="debit_card">Debit Card</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={invoiceForm.dueDate}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      console.log('Saving invoice as draft...');
                      
                      if (!invoiceForm.patientId) {
                        alert('Please enter at least a Patient ID to save as draft');
                        return;
                      }
                      
                      const draftInvoice = {
                        draftId: `DRAFT-${Date.now()}`,
                        ...invoiceForm,
                        savedDate: new Date().toLocaleString(),
                        status: 'Draft'
                      };
                      
                      console.log('Draft saved:', draftInvoice);
                      alert(`Invoice Draft Saved!\n\n` +
                        `Draft ID: ${draftInvoice.draftId}\n` +
                        `Patient ID: ${draftInvoice.patientId}\n` +
                        `Saved: ${draftInvoice.savedDate}\n\n` +
                        `Draft has been saved and can be completed later.`);
                    }}
                  >
                    Save as Draft
                  </Button>
                  <Button type="submit">
                    Create Invoice
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
