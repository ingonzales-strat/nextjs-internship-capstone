
"use client"
import { ProjectCreator } from "@/types"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createProject, deleteProject, getProjectsById, getUserProjects, updateProject } from "@/actions/project_actions";
import { toast } from "sonner";
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
      return await createProject(data);
    },
    onSuccess: (data) => {
      toast.success(
        "Project Added!", {
        description: `Your new project "${data.name}" has been successfully created (ID: ${data.id}).`,
      })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (err) => {
      toast.error("Failed to create project", { description: err.message });
      console.error("Project creation failed:", err);
    },
  })

  //Delete Project
  const{
    mutate: useDeleteProject,
    isPending: isDeleting,
    error: deleteError,
  }  = useMutation({
    mutationFn: async (projectId:string) => {
      return await deleteProject(projectId);
    },
    onSuccess: (data) => {
      toast.success(
        "Project Deleted!", {
        description: `Project ${data.deletedId} has been successfully deleted.`,
      })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (err) => {
      // React Query passes the thrown error here
      toast.error("Failed to delete project", { description: err.message });
      console.error("Project deletion failed:", err);
    },
  })
  

  //Update Project
  const{
    mutate: useUpdateProject,
    isPending: isUpdating,
    error: updateError,
  }  = useMutation({
    mutationFn: async ({ projectId, updateData }: { projectId: string; updateData: ProjectCreator }) => {
      return await updateProject(projectId,updateData);
    },
    onSuccess: (data) => {
      toast.success(
        "Project Updated!", {
        description: `Project "${data.name}" has been successfully updated.`,
      })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (err) => {
      // React Query passes the thrown error here
      toast.error("Failed to update project", { description: err.message });
      console.error("Project update failed:", err);
    },
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