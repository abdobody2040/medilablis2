import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, FileText, Download, Calendar, TrendingUp, PieChart, Activity } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

export default function Reports() {
  const [reportFilters, setReportFilters] = useState({
    reportType: '',
    dateFrom: '',
    dateTo: '',
    department: '',
    format: 'pdf',
  });

  // Mock data for charts
  const sampleVolumeData = [
    { month: 'Jan', samples: 1250, completed: 1180 },
    { month: 'Feb', samples: 1180, completed: 1140 },
    { month: 'Mar', samples: 1350, completed: 1290 },
    { month: 'Apr', samples: 1420, completed: 1380 },
    { month: 'May', samples: 1380, completed: 1340 },
    { month: 'Jun', samples: 1480, completed: 1450 },
  ];

  const departmentData = [
    { name: 'Chemistry', value: 35, count: 1250, color: 'hsl(207, 90%, 54%)' },
    { name: 'Hematology', value: 25, count: 890, color: 'hsl(142, 71%, 45%)' },
    { name: 'Microbiology', value: 20, count: 710, color: 'hsl(45, 93%, 47%)' },
    { name: 'Immunology', value: 15, count: 535, color: 'hsl(262, 52%, 47%)' },
    { name: 'Pathology', value: 5, count: 180, color: 'hsl(346, 77%, 49%)' },
  ];

  const turnaroundTimeData = [
    { test: 'CBC', target: 2, actual: 1.8, status: 'on_target' },
    { test: 'BMP', target: 3, actual: 2.9, status: 'on_target' },
    { test: 'Lipid Panel', target: 4, actual: 4.2, status: 'delayed' },
    { test: 'Liver Panel', target: 4, actual: 3.7, status: 'on_target' },
    { test: 'Thyroid', target: 6, actual: 5.8, status: 'on_target' },
    { test: 'Culture', target: 48, actual: 46, status: 'on_target' },
  ];

  const qualityMetrics = [
    { metric: 'QC Pass Rate', value: 98.5, target: 95, unit: '%' },
    { metric: 'Repeat Rate', value: 2.1, target: 3, unit: '%' },
    { metric: 'Critical Values', value: 12, target: 15, unit: 'alerts' },
    { metric: 'Equipment Uptime', value: 99.2, target: 98, unit: '%' },
  ];

  const handleGenerateReport = () => {
    console.log('Generating report with filters:', reportFilters);
    
    if (!reportFilters.reportType) {
      alert('Please select a report type');
      return;
    }
    
    if (!reportFilters.dateFrom || !reportFilters.dateTo) {
      alert('Please select date range');
      return;
    }
    
    // Generate report content based on type
    let reportContent = '';
    const reportDate = new Date().toLocaleDateString();
    
    switch (reportFilters.reportType) {
      case 'sample_volume':
        reportContent = `Sample Volume Report - ${reportDate}\n` +
          `Date Range: ${reportFilters.dateFrom} to ${reportFilters.dateTo}\n` +
          `Department: ${reportFilters.department || 'All'}\n\n` +
          sampleVolumeData.map(item => `${item.month}: ${item.samples} samples, ${item.completed} completed`).join('\n');
        break;
      case 'turnaround_time':
        reportContent = `Turnaround Time Report - ${reportDate}\n` +
          `Date Range: ${reportFilters.dateFrom} to ${reportFilters.dateTo}\n\n` +
          turnaroundTimeData.map(item => `${item.test}: Target ${item.target}h, Actual ${item.actual}h (${item.status})`).join('\n');
        break;
      case 'quality_metrics':
        reportContent = `Quality Metrics Report - ${reportDate}\n` +
          `Date Range: ${reportFilters.dateFrom} to ${reportFilters.dateTo}\n\n` +
          qualityMetrics.map(item => `${item.metric}: ${item.value}${item.unit} (Target: ${item.target}${item.unit})`).join('\n');
        break;
      default:
        reportContent = `General Lab Report - ${reportDate}\n` +
          `Date Range: ${reportFilters.dateFrom} to ${reportFilters.dateTo}\n` +
          `Department: ${reportFilters.department || 'All'}\n\n` +
          `Report generated successfully with current lab data.`;
    }
    
    // Create and download file
    const fileExtension = reportFilters.format === 'excel' ? 'csv' : reportFilters.format;
    const mimeType = reportFilters.format === 'pdf' ? 'text/plain' : 'text/csv';
    const blob = new Blob([reportContent], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `lab-report-${reportFilters.reportType}-${new Date().toISOString().split('T')[0]}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    alert(`${reportFilters.reportType.replace('_', ' ')} report generated and downloaded successfully!`);
  };

  const handleExport = (format: string) => {
    console.log(`Exporting in ${format} format`);
    
    // Prepare comprehensive data export
    const exportData = {
      sampleVolume: sampleVolumeData,
      departmentBreakdown: departmentData,
      turnaroundTimes: turnaroundTimeData,
      qualityMetrics: qualityMetrics,
      exportDate: new Date().toLocaleDateString(),
      generatedBy: 'Laboratory Information System'
    };
    
    let content = '';
    let fileName = '';
    let mimeType = '';
    
    if (format === 'excel' || format === 'csv') {
      // Create CSV format
      content = `Laboratory Data Export - ${exportData.exportDate}\n\n` +
        `Sample Volume Data:\n` +
        `Month,Samples,Completed\n` +
        exportData.sampleVolume.map(item => `${item.month},${item.samples},${item.completed}`).join('\n') +
        `\n\nDepartment Breakdown:\n` +
        `Department,Percentage,Count\n` +
        exportData.departmentBreakdown.map(item => `${item.name},${item.value}%,${item.count}`).join('\n') +
        `\n\nTurnaround Times:\n` +
        `Test,Target Hours,Actual Hours,Status\n` +
        exportData.turnaroundTimes.map(item => `${item.test},${item.target},${item.actual},${item.status}`).join('\n') +
        `\n\nQuality Metrics:\n` +
        `Metric,Value,Target,Unit\n` +
        exportData.qualityMetrics.map(item => `${item.metric},${item.value},${item.target},${item.unit}`).join('\n');
      
      fileName = `lab-data-export-${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv';
    } else {
      // Create JSON format for other types
      content = JSON.stringify(exportData, null, 2);
      fileName = `lab-data-export-${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json';
    }
    
    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    alert(`Lab data exported successfully in ${format.toUpperCase()} format!`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Laboratory workflow and statistical reports
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500">
              Real-time analytics
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Reports
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Monthly Samples
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      1,480
                    </p>
                    <p className="text-xs text-green-600 mt-1">+7.2% from last month</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900/20">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Completion Rate
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      98.0%
                    </p>
                    <p className="text-xs text-green-600 mt-1">+0.5% improvement</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-green-100 dark:bg-green-900/20">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Avg Turnaround
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      3.2h
                    </p>
                    <p className="text-xs text-red-600 mt-1">+0.1h from target</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-orange-100 dark:bg-orange-900/20">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      QC Pass Rate
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      98.5%
                    </p>
                    <p className="text-xs text-green-600 mt-1">Above target (95%)</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-purple-100 dark:bg-purple-900/20">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sample Volume Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Sample Volume Trend (6 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sampleVolumeData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                        }}
                      />
                      <Bar dataKey="samples" fill="hsl(207, 90%, 54%)" name="Total Samples" />
                      <Bar dataKey="completed" fill="hsl(142, 71%, 45%)" name="Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Department Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Sample Distribution by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                        }}
                        formatter={(value: number, name: string, props: any) => [
                          `${value}% (${props.payload.count} samples)`,
                          name
                        ]}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 justify-center">
                  {departmentData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Turnaround Times */}
            <Card>
              <CardHeader>
                <CardTitle>Turnaround Time Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 text-sm font-medium">Test</th>
                        <th className="text-left py-2 text-sm font-medium">Target (hrs)</th>
                        <th className="text-left py-2 text-sm font-medium">Actual (hrs)</th>
                        <th className="text-left py-2 text-sm font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {turnaroundTimeData.map((item, index) => (
                        <tr key={index}>
                          <td className="py-2 text-sm font-medium">{item.test}</td>
                          <td className="py-2 text-sm">{item.target}</td>
                          <td className="py-2 text-sm">{item.actual}</td>
                          <td className="py-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              item.status === 'on_target' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {item.status === 'on_target' ? 'On Target' : 'Delayed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Quality Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qualityMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {metric.metric}
                        </p>
                        <p className="text-xs text-gray-500">
                          Target: {metric.target}{metric.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          metric.value >= metric.target ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.value}{metric.unit}
                        </p>
                        <p className={`text-xs ${
                          metric.value >= metric.target ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.value >= metric.target ? '✓ Met' : '✗ Below'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="generate" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generate Custom Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reportType">Report Type *</Label>
                    <Select value={reportFilters.reportType} onValueChange={(value) => setReportFilters(prev => ({ ...prev, reportType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily_summary">Daily Summary</SelectItem>
                        <SelectItem value="weekly_summary">Weekly Summary</SelectItem>
                        <SelectItem value="monthly_summary">Monthly Summary</SelectItem>
                        <SelectItem value="department_performance">Department Performance</SelectItem>
                        <SelectItem value="turnaround_time">Turnaround Time Analysis</SelectItem>
                        <SelectItem value="quality_control">Quality Control Report</SelectItem>
                        <SelectItem value="financial_summary">Financial Summary</SelectItem>
                        <SelectItem value="custom">Custom Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select value={reportFilters.department} onValueChange={(value) => setReportFilters(prev => ({ ...prev, department: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="hematology">Hematology</SelectItem>
                        <SelectItem value="microbiology">Microbiology</SelectItem>
                        <SelectItem value="immunology">Immunology</SelectItem>
                        <SelectItem value="pathology">Pathology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateFrom">From Date *</Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      required
                      value={reportFilters.dateFrom}
                      onChange={(e) => setReportFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dateTo">To Date *</Label>
                    <Input
                      id="dateTo"
                      type="date"
                      required
                      value={reportFilters.dateTo}
                      onChange={(e) => setReportFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="format">Export Format</Label>
                  <Select value={reportFilters.format} onValueChange={(value) => setReportFilters(prev => ({ ...prev, format: value }))}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                      <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                      <SelectItem value="csv">CSV Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      console.log('Previewing report with filters:', reportFilters);
                      if (!reportFilters.reportType) {
                        alert('Please select a report type to preview');
                        return;
                      }
                      
                      const previewData = {
                        type: reportFilters.reportType,
                        dateRange: `${reportFilters.dateFrom} to ${reportFilters.dateTo}`,
                        department: reportFilters.department || 'All Departments',
                        format: reportFilters.format,
                        estimatedSize: '2.3 MB',
                        estimatedPages: '15-20 pages'
                      };
                      
                      alert(`Report Preview:\n\n` +
                        `Type: ${previewData.type.replace('_', ' ').toUpperCase()}\n` +
                        `Date Range: ${previewData.dateRange}\n` +
                        `Department: ${previewData.department}\n` +
                        `Format: ${previewData.format.toUpperCase()}\n` +
                        `Estimated Size: ${previewData.estimatedSize}\n` +
                        `Estimated Pages: ${previewData.estimatedPages}\n\n` +
                        `Click "Generate Report" to create and download the full report.`);
                    }}
                  >
                    Preview Report
                  </Button>
                  <Button onClick={handleGenerateReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Advanced Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Advanced Analytics Dashboard
                </p>
                <div className="mt-4 space-y-2">
                  <Button 
                    variant="outline" 
                    className="mr-2"
                    onClick={() => {
                      console.log('Opening predictive analytics...');
                      alert('Predictive Analytics:\n\n' +
                        '• Sample volume forecasting based on historical trends\n' +
                        '• Equipment maintenance predictions\n' +
                        '• Peak workload analysis\n' +
                        '• Quality control trend analysis\n\n' +
                        'Advanced analytics features are being prepared for deployment.');
                    }}
                  >
                    Predictive Analytics
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      console.log('Opening trend analysis...');
                      alert('Trend Analysis Available:\n\n' +
                        '• Monthly sample volume trends\n' +
                        '• Department performance comparison\n' +
                        '• Turnaround time improvements\n' +
                        '• Seasonal pattern recognition\n\n' +
                        'Use the Dashboard and Custom Reports tabs to access current trend data.');
                    }}
                  >
                    Trend Analysis
                  </Button>
                </div>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">
                  Machine learning insights and automated reporting coming in next update
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
