import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  TrendingUp, 
  BarChart3, 
  Download, 
  Calendar, 
  Filter,
  Search,
  Users,
  TestTube,
  Clock,
  CheckCircle
} from 'lucide-react';
import { reportsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function Reports() {
  const { toast } = useToast();

  const [reportForm, setReportForm] = useState({
    reportType: 'daily_summary',
    title: '',
    startDate: '',
    endDate: '',
    format: 'pdf',
    filters: {
      testTypes: [] as string[],
      departments: [] as string[],
      priority: 'all',
    },
  });

  const [trendAnalysis, setTrendAnalysis] = useState({
    period: 'monthly',
    metrics: 'sample_volume',
    startDate: '',
    endDate: '',
  });

  // Fetch existing reports
  const { data: reports = [], isLoading: loadingReports, refetch: refetchReports } = useQuery({
    queryKey: ['/api/reports'],
    queryFn: () => reportsApi.getReports(),
  });

  // Generate report mutation
  const generateReportMutation = useMutation({
    mutationFn: reportsApi.generateReport,
    onSuccess: (data) => {
      toast({
        title: "Report Generated",
        description: `Report "${data.title}" is being generated`,
      });

      // Reset form
      setReportForm({
        reportType: 'daily_summary',
        title: '',
        startDate: '',
        endDate: '',
        format: 'pdf',
        filters: {
          testTypes: [],
          departments: [],
          priority: 'all',
        },
      });

      // Refetch reports
      refetchReports();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Report Generation Failed",
        description: error.message || "Failed to generate report",
      });
    },
  });

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!reportForm.title || !reportForm.startDate || !reportForm.endDate) {
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

    const reportData = {
      reportType: reportForm.reportType,
      title: reportForm.title,
      filters: {
        startDate: reportForm.startDate,
        endDate: reportForm.endDate,
        ...reportForm.filters,
      },
      generatedBy: currentUser.id,
      format: reportForm.format,
      status: 'generating',
    };

    generateReportMutation.mutate(reportData);
  };

  const handleTrendAnalysis = async () => {
    // Validate trend analysis parameters
    if (!trendAnalysis.startDate || !trendAnalysis.endDate) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select start and end dates for trend analysis",
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

    const trendReportData = {
      reportType: 'trend_analysis',
      title: `Trend Analysis - ${trendAnalysis.metrics} (${trendAnalysis.period})`,
      filters: {
        startDate: trendAnalysis.startDate,
        endDate: trendAnalysis.endDate,
        period: trendAnalysis.period,
        metrics: trendAnalysis.metrics,
      },
      generatedBy: currentUser.id,
      format: 'pdf',
      status: 'generating',
    };

    generateReportMutation.mutate(trendReportData);

    toast({
      title: "Trend Analysis Started",
      description: `Generating ${trendAnalysis.period} trend analysis for ${trendAnalysis.metrics}`,
    });
  };

  const getReportStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ready
          </Badge>
        );
      case 'generating':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            <Clock className="h-3 w-3 mr-1" />
            Generating
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const reportTypes = [
    { value: 'daily_summary', label: 'Daily Summary' },
    { value: 'weekly_summary', label: 'Weekly Summary' },
    { value: 'monthly_summary', label: 'Monthly Summary' },
    { value: 'test_volume', label: 'Test Volume Report' },
    { value: 'turnaround_time', label: 'Turnaround Time Analysis' },
    { value: 'quality_metrics', label: 'Quality Metrics' },
    { value: 'financial_summary', label: 'Financial Summary' },
    { value: 'user_activity', label: 'User Activity Report' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate reports and analyze laboratory data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            Report Generation
          </span>
        </div>
      </div>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trend Analysis
          </TabsTrigger>
          <TabsTrigger value="existing" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Existing Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generate New Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReportSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reportType">Report Type *</Label>
                    <Select 
                      value={reportForm.reportType} 
                      onValueChange={(value) => setReportForm(prev => ({ ...prev, reportType: value }))}
                      disabled={generateReportMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="format">Format *</Label>
                    <Select 
                      value={reportForm.format} 
                      onValueChange={(value) => setReportForm(prev => ({ ...prev, format: value }))}
                      disabled={generateReportMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Report Title *</Label>
                  <Input
                    id="title"
                    required
                    value={reportForm.title}
                    onChange={(e) => setReportForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., December 2024 Lab Summary"
                    disabled={generateReportMutation.isPending}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      required
                      value={reportForm.startDate}
                      onChange={(e) => setReportForm(prev => ({ ...prev, startDate: e.target.value }))}
                      disabled={generateReportMutation.isPending}
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      required
                      value={reportForm.endDate}
                      onChange={(e) => setReportForm(prev => ({ ...prev, endDate: e.target.value }))}
                      disabled={generateReportMutation.isPending}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Report Filters</h3>

                  <div>
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select 
                      value={reportForm.filters.priority} 
                      onValueChange={(value) => setReportForm(prev => ({ 
                        ...prev, 
                        filters: { ...prev.filters, priority: value }
                      }))}
                      disabled={generateReportMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="stat">STAT</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={generateReportMutation.isPending}
                    className="min-w-32"
                  >
                    {generateReportMutation.isPending ? (
                      "Generating..."
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trend Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="period">Analysis Period</Label>
                    <Select 
                      value={trendAnalysis.period} 
                      onValueChange={(value) => setTrendAnalysis(prev => ({ ...prev, period: value }))}
                      disabled={generateReportMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="metrics">Metrics</Label>
                    <Select 
                      value={trendAnalysis.metrics} 
                      onValueChange={(value) => setTrendAnalysis(prev => ({ ...prev, metrics: value }))}
                      disabled={generateReportMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sample_volume">Sample Volume</SelectItem>
                        <SelectItem value="test_volume">Test Volume</SelectItem>
                        <SelectItem value="turnaround_time">Turnaround Time</SelectItem>
                        <SelectItem value="quality_metrics">Quality Metrics</SelectItem>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="user_activity">User Activity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="trendStartDate">Start Date</Label>
                    <Input
                      id="trendStartDate"
                      type="date"
                      value={trendAnalysis.startDate}
                      onChange={(e) => setTrendAnalysis(prev => ({ ...prev, startDate: e.target.value }))}
                      disabled={generateReportMutation.isPending}
                    />
                  </div>

                  <div>
                    <Label htmlFor="trendEndDate">End Date</Label>
                    <Input
                      id="trendEndDate"
                      type="date"
                      value={trendAnalysis.endDate}
                      onChange={(e) => setTrendAnalysis(prev => ({ ...prev, endDate: e.target.value }))}
                      disabled={generateReportMutation.isPending}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleTrendAnalysis}
                    disabled={generateReportMutation.isPending}
                    className="min-w-32"
                  >
                    {generateReportMutation.isPending ? (
                      "Analyzing..."
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Generate Trend Analysis
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="existing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Generated Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingReports ? (
                <div className="text-center text-sm text-gray-500">
                  Loading reports...
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center text-sm text-gray-500">
                  No reports found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Report Title
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Type
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Generated
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Format
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {reports.map((report: any) => (
                        <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {report.title}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm capitalize">
                            {report.reportType.replace('_', ' ')}
                          </td>
                          <td className="py-3 px-4">
                            {getReportStatusBadge(report.status)}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {new Date(report.generatedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm uppercase">
                            {report.format}
                          </td>
                          <td className="py-3 px-4">
                            {report.status === 'completed' ? (
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            ) : (
                              <span className="text-sm text-gray-500">
                                {report.status === 'generating' ? 'Processing...' : 'Unavailable'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}