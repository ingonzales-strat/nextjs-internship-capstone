'use client'
import { Project, ProjectCreator } from '../types/index';
import Link from 'next/link';
import { Calendar, Users, MoreHorizontal } from "lucide-react"
import { Button } from './ui/button';
import { projectStatus } from '@/lib/constants';
import { UpdateProjectModal } from './modals/update-project-modal';
import ProjectStatusChip from './project-status-chip';

// TODO: Task 4.5 - Design and implement project cards and layouts

/*
TODO: Implementation Notes for Interns:

This component should display:
- Project name and description
- Progress indicator
- Team member count
- Due date
- Status badge
- Actions menu (edit, delete, etc.)

Props interface:
interface ProjectCardProps {
  project: {
    id: string
    name: string
    description?: string
    progress: number
    memberCount: number
    dueDate?: Date
    status: 'active' | 'completed' | 'on-hold'
  }
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

Features to implement:
- Hover effects
- Click to navigate to project board
- Responsive design
- Loading states
- Error states
*/

export interface ProjectCardProps {
  project: Project
  onEdit?: (id: string,data:ProjectCreator) => void
  onDelete?: (id: string) => void
}

export default function ProjectCard({project,onDelete,onEdit}:ProjectCardProps,) {
  return (
    <div key={project.id}
          className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-3 h-3 rounded-full ${project.color}`} />
        <button className="p-1 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded">
          <MoreHorizontal size={16} />
        </button>
      </div>
      <Link href={`/projects/${project.id}`}>      
        <h3 className="text-lg font-semibold text-outer_space-500 dark:text-platinum-500 mb-2">{project.name}</h3>
      </Link>

      <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400 mb-4 line-clamp-2">
        {project.description ?? "No description provided."}
      </p>

      <div className="flex items-center justify-between text-sm text-payne's_gray-500 dark:text-french_gray-400 mb-4">
        <div className="flex items-center">
          <Users size={16} className="mr-1" />
          X members
        </div>
        <div className="flex items-center">
          <Calendar size={16} className="mr-1" />
          {project.due_date?.toDateString()}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-payne's_gray-500 dark:text-french_gray-400">Progress</span>
          <span className="text-outer_space-500 dark:text-platinum-500 font-medium">{0}%</span>
        </div>
        <div className="w-full bg-french_gray-300 dark:bg-payne's_gray-400 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${project.color}`}
            style={{ width: `0%` }}
          />
        </div>
      </div>

      <div className="flex flex-row items-center justify-between">
        <ProjectStatusChip statusId={project.statusId} />
        <div>
          <Button variant="default" onClick={() => onDelete?.(project.id)}>Delete</Button>
          <UpdateProjectModal projectData={project}/>
        </div>
      </div>
    </div>
  )
}
