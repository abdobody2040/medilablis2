import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

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
