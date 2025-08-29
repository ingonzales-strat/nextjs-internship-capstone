"use client"
import { closeTask, createTask, deleteTask, getTasks, getTasksByProject, openTask, updateTask } from "@/actions/task-col_actions";
import { TaskCreate } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { taskPriority } from '../lib/constants';


export function useTasks(colId: number) {
  const queryClient = useQueryClient()
  const {
      data: tasks,
      isLoading,
      error
  } = useQuery({
      queryKey: ['tasks',colId],
      queryFn: async () => {
      const res = await getTasks(colId);
      if (!res.success) throw new Error(res.error);
      return res.data;
      },
  })

  //Create Column
  const{
      mutate: useCreateTask,
      isPending: isCreating,
      error: createError,
    }  = useMutation({
      mutationFn: async (data:TaskCreate) => {
        return await createTask(data);
      },
      onSuccess: (data) => {
        toast.success(
          "Task Added!", {
          description: `Your new task "${data.title}" has been successfully created (ID: ${data.id}).`,
        })
        queryClient.invalidateQueries({ queryKey: ['tasks',colId] })
      },
      onError: (err) => {
        toast.error("Failed to create task", { description: err.message });
        console.error("Task creation failed:", err);
    },
     
  })



  //update Task
  const{
      mutate: useUpdateTask,
      isPending: isUpdating,
      error: updateError,
    }  = useMutation({
      mutationFn: async ({ taskId, taskUpdateData }: { taskId: number; taskUpdateData: TaskCreate }) => {
        return await updateTask(taskId,taskUpdateData);
      },
      onSuccess: (data) => {
        toast.success(
          "Task Updated!", {
          description: `Task "${data.title}" has been successfully updated.`,
        })
        queryClient.invalidateQueries({ queryKey: ['tasks',colId] })
      },
      onError: (err) => {
          toast.error("Failed to update task", { description: err.message });
          console.error("Task update failed:", err);
      },
    })
  
  return {
    tasks,
    isLoading,
    error,
    
    isCreating:isCreating,
    
    isUpdating: isUpdating,
    updateError: updateError,

    //: isDeleting,
    //deleteError: deleteError,
    createTask: (data: TaskCreate) => useCreateTask(data),
    updateTask: (taskId: number, taskUpdateData: TaskCreate) => useUpdateTask({taskId,taskUpdateData}),
    //deleteTask: (id: number) => useDeleteTask(id),
    moveTask: (taskId: string, newListId: string, position: number) =>
      console.log(`TODO: Move task ${taskId} to list ${newListId} at position ${position}`),
  }
}


export function useProjectTasks(projectId: string) {
  const queryClient = useQueryClient()
  const {
      data: projectTasks,
      isLoading,
      error
  } = useQuery({
      queryKey: ['tasks',projectId],
      queryFn: async () => {
      const res = await getTasksByProject(projectId);
      if (!res.success) throw new Error(res.error);
      return res.data;
      },
  })

  const{
      mutate: useCreateTask,
      isPending: isCreating,
      error: createError,
    }  = useMutation({
      mutationFn: async (data:TaskCreate) => {
        return await createTask(data);
      },
      onSuccess: (data) => {
        toast.success(
          "Task Added!", {
          description: `Your new task "${data.title}" has been successfully created (ID: ${data.id}).`,
        })
        queryClient.invalidateQueries({ queryKey: ['tasks',projectId] })
      },
      onError: (err) => {
        toast.error("Failed to create task", { description: err.message });
        console.error("Task creation failed:", err);
    },
     
  })

  type UpdateTaskArgs = {
    taskId: number;
    taskUpdateData: TaskCreate;
    source: "form" | "order";   // 👈 added here
  };


  const{
    mutate: useUpdateProjectTasks,
    isPending: isUpdating,
    error: updateError,
  }  = useMutation({
    mutationFn: async ({ taskId, taskUpdateData }:UpdateTaskArgs) => {
        return await updateTask(taskId,taskUpdateData);
      },
      onSuccess: (data,variables) => {
        if(variables.source==="form"){
          toast.success(
            "Task Updated!", {
            description: `Task "${data.title}" has been successfully updated.`,
          })

        }
        
        queryClient.invalidateQueries({ queryKey: ['tasks',projectId] })
      },
      onError: (err) => {
          toast.error("Failed to update task", { description: err.message });
          console.error("Task update failed:", err);
      },
  })

  const{
    mutate: useDeleteProjectTask,
    isPending: isDeleting,
    error: deleteError,
  }  = useMutation({
    mutationFn: async (taskId:number) => {
      return await deleteTask(taskId);
    },
    onSuccess: (data) => {
        toast.success(
          "Task Deleted!", {
          description: `Your task ${data.deletedId} has been successfully deleted.`,
        })
        queryClient.invalidateQueries({ queryKey: ['tasks',projectId] })
    },
    onError: (err) => {
        toast.error("Failed to delete task", { description: err.message });
        console.error("Task deletion failed:", err);
    },
  })

  const{
    mutate: useCloseTask,
    isPending: isClosing,
    error: closeError,
  }  = useMutation({
    mutationFn: async ({ taskId,  }: { taskId: number; }) => {
        const res = await closeTask(taskId);
        if (!res.success) throw new Error(res.error);
        return res.data;
      },
      onSuccess: () => {
        console.log(" Task was closed")
        queryClient.invalidateQueries({ queryKey: ['tasks',projectId] })
      }
  })
  const{
    mutate: useOpenTask,
    isPending: isOpening,
    error: openError,
  }  = useMutation({
    mutationFn: async ({ taskId,  }: { taskId: number; }) => {
        const res = await openTask(taskId);
        if (!res.success) throw new Error(res.error);
        return res.data;
      },
      onSuccess: () => {
        console.log(" Task was opened")
        queryClient.invalidateQueries({ queryKey: ['tasks',projectId] })
      }
  })
  
  return {
    projectTasks,
    isLoading,
    error,

    isCreating:isCreating,
    createError:createError,
    createTask: (data: TaskCreate) => useCreateTask(data),

    isPending: isUpdating,
    updateError: updateError,
    updateTask: (taskId: number, taskUpdateData: TaskCreate,source: "form" | "order") => useUpdateProjectTasks({taskId,taskUpdateData,source}),
    
    isDeleting: isDeleting,
    deleteError: deleteError,
    deleteTask: (id: number) => useDeleteProjectTask(id),


    isClosing:isClosing,
    isOpening:isOpening,

    closeError:closeError,
    openError:openError,
    
    closeTask:(taskId:number) =>useCloseTask({taskId}),
    openTask:(taskId:number) =>useOpenTask({taskId}),
  }
}