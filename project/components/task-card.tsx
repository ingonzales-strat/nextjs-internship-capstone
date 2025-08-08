// TODO: Task 5.6 - Create task detail modals and editing interfaces

import { Task } from "@/types"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UpdateTaskModal } from "./modals/update-task-modal"
import { useState } from "react"
import { Dialog, DialogTrigger } from "./ui/dialog"
import { useTasks } from "@/hooks/use-tasks"

/*
TODO: Implementation Notes for Interns:

This component should display:
- Task title and description
- Priority indicator
- Assignee avatar
- Due date
- Labels/tags
- Comments count
- Drag handle for reordering

Props interface:
interface TaskCardProps {
  task: {
    id: string
    title: string
    description?: string
    priority: 'low' | 'medium' | 'high'
    assignee?: User
    dueDate?: Date
    labels: string[]
    commentsCount: number
  }
  isDragging?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

Features to implement:
- Drag and drop support
- Click to open task modal
- Priority color coding
- Overdue indicators
- Responsive design
*/
interface TaskCardProps {
  task:Task
  isDragging?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}


export function TaskCard( {task }: TaskCardProps) {
  const{deleteTask,isDeleting,deleteError}=useTasks(task.columnId)
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const delTaskHandler = async () => { 
    deleteTask(task.id)
  }
  return (
    <div 
        className="p-4 bg-white dark:bg-outer_space-300 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-between">
                      <h4 className="font-medium text-outer_space-500 dark:text-platinum-500 text-sm mb-2">
                        {task.title}
                      </h4>
                      <Dialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger><MoreHorizontal size={16} /></DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white">
                            <DropdownMenuItem  className="cursor-pointer hover:bg-muted">
                              <DialogTrigger className="">
                                Edit Task
                              </DialogTrigger> 
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={delTaskHandler}
                              className="cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                              >
                                Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <UpdateTaskModal task={task}/>
                      </Dialog>
                    </div>
        
        <p className="text-xs text-payne's_gray-500 dark:text-french_gray-400 mb-3">
          {task.description}
        </p>
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <div className="w-6 h-6 bg-blue_munsell-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            U
          </div>
        </div>
        
      </div>
  )
}
