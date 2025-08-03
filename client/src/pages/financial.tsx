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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  CreditCard, 
  FileText, 
  Save, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Receipt,
  TrendingUp
} from 'lucide-react';
import { financialApi, patientsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function Financial() {
  const { toast } = useToast();

  const [invoiceForm, setInvoiceForm] = useState({
    patientId: '',
    description: '',
    amount: '',
    paymentMethod: 'cash',
    dueDate: '',
  });

  const [paymentForm, setPaymentForm] = useState({
    invoiceNumber: '',
    status: 'paid',
  });

  // Fetch patients for invoice creation
  const { data: patients = [], isLoading: loadingPatients } = useQuery({
    queryKey: ['/api/patients'],
    queryFn: () => patientsApi.getPatients({ limit: 100 }),
  });

  // Create invoice mutation
  const createInvoiceMutation = useMutation({
    mutationFn: financialApi.createInvoice,
    onSuccess: (data) => {
      toast({
        title: "Invoice Created",
        description: `Invoice ${data.invoiceNumber} created successfully`,
      });

      // Reset form
      setInvoiceForm({
        patientId: '',
        description: '',
        amount: '',
        paymentMethod: 'cash',
        dueDate: '',
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Invoice Creation Failed",
        description: error.message || "Failed to create invoice",
      });
    },
  });

  // Process payment mutation
  const processPaymentMutation = useMutation({
    mutationFn: financialApi.processPayment,
    onSuccess: () => {
      toast({
        title: "Payment Processed",
        description: "Payment status updated successfully",
      });

      // Reset form
      setPaymentForm({
        invoiceNumber: '',
        status: 'paid',
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Payment Processing Failed",
        description: error.message || "Failed to process payment",
      });
    },
  });

  const handleInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!invoiceForm.patientId || !invoiceForm.description || !invoiceForm.amount) {
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

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}`;

    // Calculate due date (default 30 days from now if not specified)
    const dueDate = invoiceForm.dueDate 
      ? new Date(invoiceForm.dueDate)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const invoiceData = {
      patientId: invoiceForm.patientId,
      invoiceNumber,
      transactionType: 'service',
      amount: parseFloat(invoiceForm.amount),
      currency: 'USD',
      paymentMethod: invoiceForm.paymentMethod,
      paymentStatus: 'pending',
      description: invoiceForm.description,
      processedBy: currentUser.id,
      dueDate,
    };

    createInvoiceMutation.mutate(invoiceData);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentForm.invoiceNumber || !paymentForm.status) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    const paymentData = {
      invoiceNumber: paymentForm.invoiceNumber,
      status: paymentForm.status,
      userId: currentUser.id || 'system',
    };

    processPaymentMutation.mutate(paymentData);
  };

  // Mock transaction data for display
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
            <Clock className="h-3 w-3 mr-1" />
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
            Partial
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Financial Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Invoice generation and payment processing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            Financial Operations
          </span>
        </div>
      </div>

      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Create Invoice
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Process Payment
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Transactions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Create Invoice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvoiceSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patient">Patient *</Label>
                    <Select 
                      value={invoiceForm.patientId} 
                      onValueChange={(value) => setInvoiceForm(prev => ({ ...prev, patientId: value }))}
                      disabled={createInvoiceMutation.isPending || loadingPatients}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient: any) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.firstName} {patient.lastName} ({patient.patientId})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount (USD) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      required
                      value={invoiceForm.amount}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                      disabled={createInvoiceMutation.isPending}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    required
                    value={invoiceForm.description}
                    onChange={(e) => setInvoiceForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Services provided (e.g., Complete Blood Count, Lipid Panel)"
                    rows={3}
                    disabled={createInvoiceMutation.isPending}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select 
                      value={invoiceForm.paymentMethod} 
                      onValueChange={(value) => setInvoiceForm(prev => ({ ...prev, paymentMethod: value }))}
                      disabled={createInvoiceMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                      disabled={createInvoiceMutation.isPending}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={createInvoiceMutation.isPending}
                    className="min-w-32"
                  >
                    {createInvoiceMutation.isPending ? (
                      "Creating..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Create Invoice
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Process Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                    <Input
                      id="invoiceNumber"
                      required
                      value={paymentForm.invoiceNumber}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                      placeholder="INV-2024-001"
                      disabled={processPaymentMutation.isPending}
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Payment Status *</Label>
                    <Select 
                      value={paymentForm.status} 
                      onValueChange={(value) => setPaymentForm(prev => ({ ...prev, status: value }))}
                      disabled={processPaymentMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="partial">Partial Payment</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={processPaymentMutation.isPending}
                    className="min-w-32"
                  >
                    {processPaymentMutation.isPending ? (
                      "Processing..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Payment
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
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
                        Method
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Due Date
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
                          <div className="font-medium text-gray-900 dark:text-white">
                            {transaction.patientName}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                            {transaction.description}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">
                            ${transaction.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {getPaymentStatusBadge(transaction.paymentStatus)}
                        </td>
                        <td className="py-3 px-4 text-sm capitalize">
                          {transaction.paymentMethod.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(transaction.dueDate).toLocaleDateString()}
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