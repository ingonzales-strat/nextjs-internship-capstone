// TODO: Task 4.1 - Implement project CRUD operations
// TODO: Task 4.2 - Create project listing and dashboard interface
/*
TODO: Implementation Notes for Interns:

Custom hook for project data management:
- Fetch projects list
- Create new project
- Update project
- Delete project
- Search/filter projects
- Pagination

Features:
- React Query/SWR for caching
- Optimistic updates
- Error handling
- Loading states
- Infinite scrolling (optional)

Example structure:
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectCreationSchema } from '../lib/validations';

export function useProjects() {
  const queryClient = useQueryClient()
  
  const {
    data: projects,
    isLoading,
    error
  } = useQuery({
    queryKey: ['projects'],
    queryFn: () => queries.projects.getAll()
  })
  
  const createProject = useMutation({
    mutationFn: queries.projects.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })
  
  return {
    projects,
    isLoading,
    error,
    createProject: createProject.mutate,
    isCreating: createProject.isPending
  }
}

Dependencies to install:
- @tanstack/react-query (recommended)
- OR swr (alternative)
*/

// Placeholder to prevent import errors
"use client"
import { ProjectCreator } from "@/types"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createProject, deleteProject, getProjectsById, getUserProjects, updateProject } from "@/actions/project_actions";
export function useProjects() {
  const queryClient = useQueryClient()

  // Grab User Projects
  const {
    data: projects,
    isLoading,
    error
  } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await getUserProjects();
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  })
  

  //Create Projects
  const{
    mutate: useCreateProject,
    isPending: isCreating,
    error: createError,
  }  = useMutation({
    mutationFn: async (data:ProjectCreator) => {
      console.log('Creating Project',data)
      const res = await createProject(data);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      console.log("Project Creation Success",)
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })

  //Delete Project
  const{
    mutate: useDeleteProject,
    isPending: isDeleting,
    error: deleteError,
  }  = useMutation({
    mutationFn: async (projectId:string) => {
      console.log('Deleting Project',projectId)
      const res = await deleteProject(projectId);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      console.log("Project Deletion Success",)
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })
  

  //Update Project
  const{
    mutate: useUpdateProject,
    isPending: isUpdating,
    error: updateError,
  }  = useMutation({
    mutationFn: async ({ projectId, updateData }: { projectId: string; updateData: ProjectCreator }) => {
      console.log('Updating Project',projectId,updateData)
      const res = await updateProject(projectId,updateData);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      console.log("Project Update Success",)
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })


  return {
    projects: projects,
    isLoading: isLoading,
    error: error,
    
    isCreating:isCreating,
    createError:createError,

    isUpdating:isUpdating,
    updateError:updateError,

    createProject: (data: ProjectCreator) => useCreateProject(data),
    updateProject: (id: string, data:ProjectCreator) => useUpdateProject({projectId:id,updateData:data}),
    deleteProject: (id: string) => useDeleteProject(id),
  }
}

export function useSpecProject(projectId:string){
  const {
    data: project,
    isLoading,
    error
  } = useQuery({
    queryKey: ['projects',projectId],
    queryFn: async () => {
      const res = await getProjectsById(projectId);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  })

  return {
    project,
    isLoading,
    error,
  }
}