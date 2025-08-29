"use client"

// TODO: Task 5.6 - Create task detail modals and editing interfaces

import { Task } from "@/types"
import { ArrowDownToLine, ArrowUpToLine, MoreHorizontal, Pencil, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { UpdateTaskModal } from "../modals/update-task-modal"
import { Dialog, DialogTrigger } from "../ui/dialog"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities";

import { TaskPriorityBadge, TaskStatusBadge } from "../ui/status_badges"
import { useTaskSheet } from "./task-sheet-context"
import { useState } from "react"
import { useUpdateTaskModal } from "./task-update-modal-context"


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
  id:number
  task:Task
  isDragging?: boolean
  arrayPosition?:number
  taskArrayLength?:number
  projectId:string
  topHandler?: () => void;
  bottomHandler?: () => void;
  delTaskHandler?: () => void;
}


export function TaskCard( {id,task,arrayPosition, projectId,isDragging,taskArrayLength, delTaskHandler , topHandler,bottomHandler }: TaskCardProps) {
  const { setTaskToEdit } = useUpdateTaskModal();
  
  const { setActiveTask } = useTaskSheet();
  const [isOpen,setIsOpen] = useState(false)
 
  const disableCheckTop =
    arrayPosition == null ? true : arrayPosition === 0;

  const disableCheckBottom =
    taskArrayLength == null ? true : arrayPosition === taskArrayLength - 1;
  const {attributes, listeners, setNodeRef, transform, transition} =useSortable(
    {id:id,
    data: {
    type: "task",
    task,
   }

  })
  
  const style = {
        transition,
        transform: CSS.Transform.toString(transform),
  };


  const editTaskHandler = async () => { 
    setTaskToEdit(task)
  }
  return (
    <div
      ref={setNodeRef} style={style} {...attributes} {...listeners}
        className="p-4 my-2 bg-white dark:bg-outer_space-300 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 cursor-grab hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-between">
          <div onClick={() => setActiveTask(task)}>
            {/* Task content */}
            <h4 className="font-medium hover:underline hover:font-bold hover:text-outer_space-700 hover text-outer_space-500 dark:text-platinum-500 text-sm mb-2 cursor-pointer" >
                {task.title}-{task.id}-{task.position}-{task.columnId}
            </h4>
          </div>
          
          
            <DropdownMenu>
              <DropdownMenuTrigger disabled={isDragging}><MoreHorizontal size={16} /></DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuLabel>Task</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem 
                     onClick={editTaskHandler}
                     className="cursor-pointer hover:bg-muted flex flex-row items-center gap-2">
                      <Pencil size={16}/> Edit Task
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={delTaskHandler}
                      className="cursor-pointer flex flex-row items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                      >
                        <Trash size={16} />
                        Delete
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Position</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem className=" flex flex-row items-center cursor-pointer" disabled={disableCheckTop} onClick={topHandler}>
                        <ArrowUpToLine size={12}/> Move to Top
                        
                      </DropdownMenuItem>
                      <DropdownMenuItem  className=" flex flex-row items-center cursor-pointer" disabled={disableCheckBottom} onClick={bottomHandler} >
                        <ArrowDownToLine size={12}/> Move to Bottom
                        
                      </DropdownMenuItem>

                    </DropdownMenuGroup>
                
              </DropdownMenuContent>
            </DropdownMenu>
            
        </div>
      

        <div className="flex items-center justify-between">
          <div className="flex flex-row gap-2">
            <TaskStatusBadge status={task.openStatus}/>
            <TaskPriorityBadge priority={task.priority}/>
          </div>
          <div className="w-6 h-6 bg-blue_munsell-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            U
          </div>
        </div>
        
      </div>
  )
}
