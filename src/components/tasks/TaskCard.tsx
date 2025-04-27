'use client'

import { IconType } from 'react-icons'
import { Database } from '../../lib/supabase'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

type Task = Database['public']['Tables']['tasks']['Row']

interface TaskCardProps {
  task: Task
  icon: IconType
}

export default function TaskCard({ task, icon: Icon }: TaskCardProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleStartTask = async () => {
    setLoading(true)
    try {
      // Here we'll implement task completion logic
      // For now, just show a success message
      toast.success('Task started! Follow the instructions to complete it.')
      router.push(`/dashboard/tasks/${task.id}`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 rounded-lg bg-primary/10 p-2 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
        </div>
        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
          ${task.reward}
        </span>
      </div>
      <p className="mb-4 text-sm text-gray-600">{task.description}</p>
      <button
        onClick={handleStartTask}
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? 'Starting...' : 'Start Task'}
      </button>
    </div>
  )
} 