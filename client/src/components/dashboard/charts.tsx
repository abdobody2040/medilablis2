
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

// Mock data for demonstration - in real app this would come from API
const sampleVolumeData = [
  { day: 'Mon', samples: 45 },
  { day: 'Tue', samples: 52 },
  { day: 'Wed', samples: 48 },
  { day: 'Thu', samples: 61 },
  { day: 'Fri', samples: 55 },
  { day: 'Sat', samples: 42 },
  { day: 'Sun', samples: 38 },
];

const testDistributionData = [
  { name: 'Blood Chemistry', value: 35, color: 'hsl(207, 90%, 54%)' },
  { name: 'Hematology', value: 25, color: 'hsl(142, 71%, 45%)' },
  { name: 'Microbiology', value: 20, color: 'hsl(45, 93%, 47%)' },
  { name: 'Immunology', value: 15, color: 'hsl(262, 52%, 47%)' },
  { name: 'Other', value: 5, color: 'hsl(346, 77%, 49%)' },
];

export function SampleVolumeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sample Volume Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampleVolumeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                dataKey="day" 
                className="text-xs text-gray-500 dark:text-gray-400"
              />
              <YAxis className="text-xs text-gray-500 dark:text-gray-400" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="samples" 
                stroke="hsl(207, 90%, 54%)" 
                strokeWidth={2}
                dot={{ fill: 'hsl(207, 90%, 54%)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(207, 90%, 54%)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function TestDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Type Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={testDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {testDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
                formatter={(value: number, name: string) => [
                  `${value}%`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {testDistributionData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {item.name} ({item.value}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ChartData {
  totalSamples?: number;
  completedSamples?: number;
  pendingSamples?: number;
  rejectedSamples?: number;
  avgTurnaround?: number;
  dailyVolume?: Array<{ date: string; samples: number; }>;
  testTypes?: Array<{ name: string; count: number; }>;
}

interface ChartsProps {
  stats?: ChartData;
}

export function Charts({ stats }: ChartsProps) {
  // Mock data for demonstration
  const mockDailyVolume = [
    { date: '2024-01-01', samples: 45 },
    { date: '2024-01-02', samples: 52 },
    { date: '2024-01-03', samples: 48 },
    { date: '2024-01-04', samples: 61 },
    { date: '2024-01-05', samples: 55 },
    { date: '2024-01-06', samples: 67 },
    { date: '2024-01-07', samples: 43 },
  ];

  const mockTestTypes = [
    { name: 'Blood Work', count: 145, color: '#8884d8' },
    { name: 'Urine Analysis', count: 89, color: '#82ca9d' },
    { name: 'Microbiology', count: 67, color: '#ffc658' },
    { name: 'Chemistry', count: 123, color: '#ff7300' },
    { name: 'Serology', count: 45, color: '#8dd1e1' },
  ];

  const mockTurnaroundTrend = [
    { day: 'Mon', hours: 4.2 },
    { day: 'Tue', hours: 3.8 },
    { day: 'Wed', hours: 4.5 },
    { day: 'Thu', hours: 3.9 },
    { day: 'Fri', hours: 4.1 },
    { day: 'Sat', hours: 5.2 },
    { day: 'Sun', hours: 4.8 },
  ];

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Daily Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Sample Volume</CardTitle>
            <CardDescription>Number of samples processed per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats?.dailyVolume || mockDailyVolume}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Bar dataKey="samples" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Test Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Test Types Distribution</CardTitle>
            <CardDescription>Breakdown by test category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats?.testTypes || mockTestTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(stats?.testTypes || mockTestTypes).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || `hsl(${index * 45}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Turnaround Time Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Average Turnaround Time</CardTitle>
          <CardDescription>Average processing time by day of week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockTurnaroundTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} hours`, 'Avg TAT']}
              />
              <Line 
                type="monotone" 
                dataKey="hours" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
