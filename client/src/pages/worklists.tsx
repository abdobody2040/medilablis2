import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Play, Pause, CheckCircle, Clock } from 'lucide-react';

export default function Worklists() {
  const [worklists] = useState([
    {
      id: '1',
      name: 'Morning Chemistry Panel',
      description: 'Basic metabolic panel and lipid profile',
      assignedTo: 'Tech Station A',
      samplesCount: 12,
      completedCount: 8,
      status: 'in_progress',
      priority: 'routine',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2', 
      name: 'Urgent CBC Tests',
      description: 'Complete blood count for urgent cases',
      assignedTo: 'Tech Station B',
      samplesCount: 5,
      completedCount: 3,
      status: 'in_progress',
      priority: 'urgent',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Microbiology Cultures',
      description: 'Bacterial culture and sensitivity testing',
      assignedTo: 'Micro Station',
      samplesCount: 8,
      completedCount: 8,
      status: 'completed',
      priority: 'routine',
      createdAt: new Date().toISOString(),
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <Play className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'stat': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'urgent': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'routine': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleWorklistAction = async (worklistId: string, action: string) => {
    console.log(`${action} worklist ${worklistId}`);

    try {
      // Log the action
      await fetch('/api/actions/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'current-user-id',
          actionType: `WORKLIST_${action.toUpperCase()}`,
          actionCategory: 'worklists',
          actionData: { worklistId, action },
          description: `Worklist ${action}: ${worklistId}`,
          success: true,
        }),
      });

      alert(`Worklist ${action} successful!`);
    } catch (error) {
      console.error('Worklist action error:', error);
      alert(`Failed to ${action} worklist`);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="h-6 w-6" />
            Worklists
          </h1>
          <Button onClick={() => console.log('Create new worklist')}>
            Create Worklist
          </Button>
        </div>

        <div className="grid gap-6">
          {worklists.map((worklist) => (
            <Card key={worklist.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(worklist.status)}
                      {worklist.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {worklist.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getPriorityColor(worklist.priority)}>
                      {worklist.priority}
                    </Badge>
                    <Badge className={getStatusColor(worklist.status)}>
                      {worklist.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned To</p>
                    <p className="text-sm text-gray-900 dark:text-white">{worklist.assignedTo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Progress</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {worklist.completedCount} / {worklist.samplesCount} samples
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(worklist.completedCount / worklist.samplesCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(worklist.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {worklist.status === 'pending' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleWorklistAction(worklist.id, 'start')}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  )}
                  {worklist.status === 'in_progress' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleWorklistAction(worklist.id, 'pause')}
                      >
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleWorklistAction(worklist.id, 'complete')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    </>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => console.log(`View details for worklist ${worklist.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}