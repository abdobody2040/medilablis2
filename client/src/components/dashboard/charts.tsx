import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const mockData = {
  dailyStats: [
    { date: '2024-01-01', samples: 45, tests: 120 },
  { date: '2024-01-02', samples: 52, tests: 140 },
    { date: '2024-01-03', samples: 38, tests: 95 },
    { date: '2024-01-04', samples: 61, tests: 165 },
    { date: '2024-01-05', samples: 48, tests: 128 },
    { date: '2024-01-06', samples: 55, tests: 150 },
    { date: '2024-01-07', samples: 42, tests: 110 },
  ],
  testTypes: [
    { name: 'Blood Chemistry', value: 35, color: '#8884d8' },
    { name: 'Hematology', value: 25, color: '#82ca9d' },
    { name: 'Microbiology', value: 20, color: '#ffc658' },
    { name: 'Immunology', value: 15, color: '#ff7c7c' },
    { name: 'Others', value: 5, color: '#8dd1e1' },
  ],
  turnaroundTime: [
    { department: 'Chemistry', avg: 2.5, target: 4 },
    { department: 'Hematology', avg: 1.8, target: 2 },
    { department: 'Microbiology', avg: 24, target: 48 },
    { department: 'Immunology', avg: 6, target: 8 },
  ],
};

export function Charts({ stats }: ChartsProps) {
  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    { name: 'Daily Samples', value: stats.dailySamples },
    { name: 'Results Ready', value: stats.resultsReady },
    { name: 'Pending Tests', value: stats.pendingTests },
    { name: 'QC Passed', value: stats.qcPassed },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
        <CardDescription>
          Laboratory performance metrics for today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-8 w-full">
            {chartData.map((item) => (
              <div key={item.name} className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {item.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Charts;