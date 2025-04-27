import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { FaVideo, FaUserPlus, FaPoll, FaGlobe } from 'react-icons/fa'
import TaskCard from '../../components/tasks/TaskCard'
import { Database } from '../../lib/supabase'
import { IconType } from 'react-icons'

export default async function DashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies })
  
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const taskTypeIcons: Record<string, IconType> = {
    video: FaVideo,
    social_follow: FaUserPlus,
    survey: FaPoll,
    website_visit: FaGlobe,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Available Tasks</h1>
        <p className="mt-1 text-sm text-gray-600">
          Complete tasks to earn rewards instantly
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tasks?.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            icon={taskTypeIcons[task.type]}
          />
        ))}
        {(!tasks || tasks.length === 0) && (
          <p className="col-span-full text-center text-gray-500">
            No tasks available at the moment. Check back soon!
          </p>
        )}
      </div>
    </div>
  )
} 