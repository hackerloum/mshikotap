import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import TaskManager from '@/components/admin/TaskManager';
import { Task, DashboardStats, WithdrawalRequest } from '@/types';
import { FaUsers, FaCheckCircle, FaMoneyBillWave, FaTasks } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

const AdminDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalPayout: 0,
    pendingWithdrawals: 0,
  });
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (tasksError) throw tasksError;
        
        // Fetch dashboard stats
        const { data: statsData, error: statsError } = await supabase
          .rpc('get_admin_dashboard_stats');
          
        if (statsError) throw statsError;
        
        // Fetch pending withdrawal requests
        const { data: withdrawalData, error: withdrawalError } = await supabase
          .from('withdrawal_requests')
          .select('*, users(full_name, email)')
          .eq('status', 'pending')
          .order('requested_at', { ascending: false });
          
        if (withdrawalError) throw withdrawalError;
        
        setTasks(tasksData || []);
        setStats(statsData || {
          totalUsers: 0,
          activeUsers: 0,
          totalTasks: 0,
          completedTasks: 0,
          totalPayout: 0,
          pendingWithdrawals: 0,
        });
        setWithdrawalRequests(withdrawalData || []);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleAddTask = async (task: Omit<Task, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...task,
          created_at: new Date().toISOString(),
        }])
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        setTasks([data[0], ...tasks]);
        setStats({
          ...stats,
          totalTasks: stats.totalTasks + 1,
        });
      }
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };
  
  const handleUpdateTask = async (id: string, task: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(task)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        setTasks(tasks.map(t => t.id === id ? data[0] : t));
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };
  
  const handleDeleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setTasks(tasks.filter(t => t.id !== id));
      setStats({
        ...stats,
        totalTasks: stats.totalTasks - 1,
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const handleWithdrawalAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({
          status,
          processed_at: new Date().toISOString(),
        })
        .eq('id', id);
        
      if (error) throw error;
      
      setWithdrawalRequests(withdrawalRequests.filter(w => w.id !== id));
      setStats({
        ...stats,
        pendingWithdrawals: stats.pendingWithdrawals - 1,
      });
    } catch (error) {
      console.error(`Error ${status} withdrawal:`, error);
    }
  };
  
  if (loading) {
    return (
      <MainLayout title="Admin Dashboard | Mshiko Tap" requireAuth requireAdmin>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title="Admin Dashboard | Mshiko Tap" requireAuth requireAdmin>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 flex items-center">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mr-4">
            <FaUsers className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Users</p>
            <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
          </div>
        </div>
        
        <div className="card p-6 flex items-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mr-4">
            <FaTasks className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Tasks</p>
            <h3 className="text-2xl font-bold">
              {stats.completedTasks} / {stats.totalTasks}
            </h3>
          </div>
        </div>
        
        <div className="card p-6 flex items-center">
          <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3 mr-4">
            <FaCheckCircle className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Completion Rate</p>
            <h3 className="text-2xl font-bold">
              {stats.totalTasks > 0 
                ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
                : 0}%
            </h3>
          </div>
        </div>
        
        <div className="card p-6 flex items-center">
          <div className="rounded-full bg-yellow-100 dark:bg-yellow-900 p-3 mr-4">
            <FaMoneyBillWave className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Payout</p>
            <h3 className="text-2xl font-bold">${stats.totalPayout.toFixed(2)}</h3>
          </div>
        </div>
      </div>
      
      {/* Withdrawal Requests */}
      {withdrawalRequests.length > 0 && (
        <div className="card mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Pending Withdrawals</h2>
            <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium">
              {withdrawalRequests.length} Pending
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Requested
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {withdrawalRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.users?.full_name || 'Unknown User'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${request.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {request.payment_method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.requested_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleWithdrawalAction(request.id, 'approved')}
                        className="text-green-600 hover:text-green-800 mr-3"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleWithdrawalAction(request.id, 'rejected')}
                        className="text-red-600 hover:text-red-800"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Task Manager */}
      <TaskManager 
        tasks={tasks}
        onAdd={handleAddTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </MainLayout>
  );
};

export default AdminDashboard; 