import React from 'react';
import Link from 'next/link';
import { FaYoutube, FaTiktok, FaInstagram, FaGlobe, FaMobileAlt, FaClipboardList } from 'react-icons/fa';
import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const getTaskIcon = () => {
    switch (task.type) {
      case 'youtube':
        return <FaYoutube className="h-6 w-6 text-red-600" />;
      case 'tiktok':
        return <FaTiktok className="h-6 w-6 text-black" />;
      case 'instagram':
        return <FaInstagram className="h-6 w-6 text-pink-600" />;
      case 'website':
        return <FaGlobe className="h-6 w-6 text-blue-500" />;
      case 'app':
        return <FaMobileAlt className="h-6 w-6 text-green-500" />;
      case 'survey':
        return <FaClipboardList className="h-6 w-6 text-purple-500" />;
      default:
        return <FaClipboardList className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-center mb-3">
        {getTaskIcon()}
        <span className="ml-2 text-sm font-medium px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full">
          {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
        </span>
        <span className="ml-auto text-green-600 font-bold">
          ${task.reward.toFixed(2)}
        </span>
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        {task.description.length > 100 
          ? `${task.description.substring(0, 100)}...` 
          : task.description
        }
      </p>
      
      <div className="flex justify-between items-center">
        <Link 
          href={`/tasks/${task.id}`}
          className="btn-primary text-sm"
        >
          View Details
        </Link>
        
        <div className="text-xs text-gray-500">
          {task.status === 'active' ? (
            <>
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Active
            </>
          ) : task.status === 'completed' ? (
            <>
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
              Completed
            </>
          ) : (
            <>
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
              Expired
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard; 