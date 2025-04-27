import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Task, TaskType } from '@/types';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

interface TaskManagerProps {
  tasks: Task[];
  onAdd: (task: Omit<Task, 'id' | 'created_at'>) => Promise<void>;
  onUpdate: (id: string, task: Partial<Task>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const TaskManager = ({ tasks, onAdd, onUpdate, onDelete }: TaskManagerProps) => {
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Task, 'id' | 'created_at'>>();
  
  const handleAdd = () => {
    setEditTask(null);
    setIsAdding(true);
    reset({
      title: '',
      description: '',
      type: 'youtube',
      reward: 0.5,
      url: '',
      status: 'active',
    });
  };
  
  const handleEdit = (task: Task) => {
    setIsAdding(false);
    setEditTask(task);
    reset({
      title: task.title,
      description: task.description,
      type: task.type,
      reward: task.reward,
      url: task.url || '',
      status: task.status,
      expires_at: task.expires_at,
    });
  };
  
  const onSubmit = async (data: Omit<Task, 'id' | 'created_at'>) => {
    try {
      if (isAdding) {
        await onAdd(data);
        setIsAdding(false);
      } else if (editTask) {
        await onUpdate(editTask.id, data);
        setEditTask(null);
      }
      reset();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Tasks</h2>
        <button 
          onClick={handleAdd}
          className="btn-primary flex items-center"
        >
          <FaPlus className="mr-2" /> Add Task
        </button>
      </div>
      
      {(isAdding || editTask) && (
        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {isAdding ? 'Add New Task' : 'Edit Task'}
          </h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Task Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                rows={3}
                className="w-full p-2 border rounded-md"
                {...register('description', { required: 'Description is required' })}
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Task Type</label>
                <select
                  className="w-full p-2 border rounded-md"
                  {...register('type', { required: 'Type is required' })}
                >
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                  <option value="survey">Survey</option>
                  <option value="website">Website</option>
                  <option value="app">App</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Reward ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="w-full p-2 border rounded-md"
                  {...register('reward', { 
                    required: 'Reward is required',
                    min: { value: 0.01, message: 'Must be at least $0.01' }
                  })}
                />
                {errors.reward && (
                  <p className="text-red-500 text-sm mt-1">{errors.reward.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">URL (if applicable)</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                {...register('url')}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full p-2 border rounded-md"
                  {...register('status')}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Expires At (optional)</label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border rounded-md"
                  {...register('expires_at')}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditTask(null);
                  reset();
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {isAdding ? 'Add Task' : 'Update Task'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Reward
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No tasks available. Create one to get started.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {task.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    ${task.reward.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${task.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : task.status === 'completed' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-primary hover:text-blue-700 mr-3"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this task?')) {
                          onDelete(task.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskManager; 