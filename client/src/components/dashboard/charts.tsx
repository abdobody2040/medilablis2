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

export const Charts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData.dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="samples" fill="#8884d8" name="Samples" />
              <Bar dataKey="tests" fill="#82ca9d" name="Tests" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Test Types Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Test Types Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockData.testTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mockData.testTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Turnaround Time */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Average Turnaround Time (Hours)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData.turnaroundTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avg" fill="#8884d8" name="Actual" />
              <Bar dataKey="target" fill="#82ca9d" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Charts;