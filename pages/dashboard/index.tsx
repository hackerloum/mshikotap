import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Task, UserTask, UserProfile } from '@/types';
import { FaMoneyBillWave, FaTasks, FaCheckCircle, FaHistory } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

const Dashboard = () => {
  const { data: session } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [userTasks, setUserTasks] = useState<(UserTask & { task: Task })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return;
      
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileError) throw profileError;
        
        // Fetch available tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (tasksError) throw tasksError;
        
        // Fetch user's tasks
        const { data: userTasksData, error: userTasksError } = await supabase
          .from('user_tasks')
          .select('*, task:tasks(*)')
          .eq('user_id', session.user.id)
          .order('started_at', { ascending: false })
          .limit(5);
          
        if (userTasksError) throw userTasksError;
        
        setUserProfile(profileData);
        setAvailableTasks(tasksData || []);
        setUserTasks(userTasksData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [session]);
  
  if (loading) {
    return (
      <MainLayout title="Dashboard | Mshiko Tap" requireAuth>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title="Dashboard | Mshiko Tap" requireAuth>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="md:col-span-3">
          <h1 className="text-3xl font-bold mb-6">
            Welcome back, {userProfile?.full_name || session?.user?.name || 'User'}
          </h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="card p-6 flex items-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mr-4">
                <FaMoneyBillWave className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Balance</p>
                <h3 className="text-2xl font-bold">${userProfile?.balance.toFixed(2) || '0.00'}</h3>
              </div>
            </div>
            
            <div className="card p-6 flex items-center">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mr-4">
                <FaTasks className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Completed Tasks</p>
                <h3 className="text-2xl font-bold">{userProfile?.completed_tasks || 0}</h3>
              </div>
            </div>
            
            <div className="card p-6 flex items-center">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3 mr-4">
                <FaHistory className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Earnings</p>
                <h3 className="text-2xl font-bold">${userProfile?.total_earnings.toFixed(2) || '0.00'}</h3>
              </div>
            </div>
          </div>
          
          {/* Available Tasks */}
          <div className="card mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Available Tasks</h2>
              <Link href="/tasks" className="text-primary hover:underline text-sm">
                View All Tasks
              </Link>
            </div>
            
            {availableTasks.length === 0 ? (
              <p className="text-gray-500 py-4">No tasks available at the moment. Check back later!</p>
            ) : (
              <div className="space-y-4">
                {availableTasks.map(task => (
                  <div key={task.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {task.description.length > 100 
                          ? `${task.description.substring(0, 100)}...` 
                          : task.description
                        }
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-green-600 font-bold mb-2">${task.reward.toFixed(2)}</span>
                      <Link 
                        href={`/tasks/${task.id}`} 
                        className="btn-primary text-xs px-3 py-1"
                      >
                        Start Task
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Recent Activity */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Activity</h2>
              <Link href="/my-tasks" className="text-primary hover:underline text-sm">
                View All Activity
              </Link>
            </div>
            
            {userTasks.length === 0 ? (
              <p className="text-gray-500 py-4">You haven't completed any tasks yet. Start earning now!</p>
            ) : (
              <div className="space-y-4">
                {userTasks.map(userTask => (
                  <div key={userTask.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{userTask.task.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(userTask.started_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-green-600 font-bold">${userTask.reward.toFixed(2)}</span>
                        <span className={`text-xs px-2 py-1 rounded-full mt-1
                          ${userTask.status === 'completed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : userTask.status === 'rejected'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}
                        >
                          {userTask.status.charAt(0).toUpperCase() + userTask.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/tasks" className="text-primary hover:underline flex items-center">
                  <FaTasks className="mr-2" /> Browse Tasks
                </Link>
              </li>
              <li>
                <Link href="/my-tasks" className="text-primary hover:underline flex items-center">
                  <FaCheckCircle className="mr-2" /> My Tasks
                </Link>
              </li>
              <li>
                <Link href="/earnings" className="text-primary hover:underline flex items-center">
                  <FaMoneyBillWave className="mr-2" /> Earnings & Withdrawals
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-primary hover:underline flex items-center">
                  <FaMoneyBillWave className="mr-2" /> Profile Settings
                </Link>
              </li>
            </ul>
          </div>
          
          {userProfile?.balance && userProfile.balance > 0 && (
            <div className="card bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700">
              <h3 className="font-bold text-lg mb-2">Ready to cash out?</h3>
              <p className="text-sm mb-4">
                You have ${userProfile.balance.toFixed(2)} available for withdrawal.
              </p>
              <Link href="/earnings/withdraw" className="btn-primary block text-center">
                Withdraw Funds
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard; 