import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { Task, TaskType } from '@/types';

interface TaskListProps {
  tasks: Task[];
}

const TaskList = ({ tasks }: TaskListProps) => {
  const [filter, setFilter] = useState<TaskType | 'all'>('all');
  
  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(task => task.type === filter);
  
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('youtube')}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === 'youtube' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          YouTube
        </button>
        <button
          onClick={() => setFilter('tiktok')}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === 'tiktok' 
              ? 'bg-black text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          TikTok
        </button>
        <button
          onClick={() => setFilter('instagram')}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === 'instagram' 
              ? 'bg-pink-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Instagram
        </button>
        <button
          onClick={() => setFilter('survey')}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === 'survey' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Surveys
        </button>
        <button
          onClick={() => setFilter('website')}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === 'website' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Websites
        </button>
        <button
          onClick={() => setFilter('app')}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === 'app' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Apps
        </button>
      </div>
      
      {filteredTasks.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium text-gray-500">No tasks available</h3>
          <p className="mt-2 text-gray-400">Check back later for new tasks</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList; 