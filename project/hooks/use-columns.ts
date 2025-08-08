"use client"
import { createColumn, deleteCol, getProjectColumns, updateCol } from "@/actions/task-col_actions"
import { ColumnCreate, ProjectCreator } from "@/types"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

  

export function useColumns(projectId:string){
    const queryClient = useQueryClient()
    const {
        data: columns,
        isLoading,
        error
    } = useQuery({
        queryKey: ['columns',projectId],
        queryFn: async () => {
        const res = await getProjectColumns(projectId);
        if (!res.success) throw new Error(res.error);
        return res.data;
        },
    })
      //Create Column
    const{
        mutate: useCreateColumn,
        isPending: isCreating,
        error: createError,
      }  = useMutation({
        mutationFn: async (data:ColumnCreate) => {
          console.log('Creating Column',data)
          const res = await createColumn(data);
          if (!res.success) throw new Error(res.error);
          return res.data;
        },
        onSuccess: () => {
          console.log("Column Creation Success",)
          queryClient.invalidateQueries({ queryKey: ['columns',projectId] })
        }
      })
      
      //Delete Column
      const{
          mutate: useDeleteCol,
          isPending: isDeleting,
          error: deleteError,
        }  = useMutation({
          mutationFn: async (colId:number) => {
            console.log('Deleting Column',colId)
            const res = await deleteCol(colId);
            if (!res.success) throw new Error(res.error);
            return res.data;
          },
          onSuccess: () => {
            console.log(" Column deletion Success",)
            queryClient.invalidateQueries({ queryKey: ['columns',projectId] })
          }
        })
      //update Column
      const{
          mutate: useUpdateCol,
          isPending: isUpdating,
          error: updateError,
        }  = useMutation({
          mutationFn: async ({ colId, colUpdateData }: { colId: number; colUpdateData: ColumnCreate }) => {
            console.log('Updating Column',colId)
            const res = await updateCol(colId,colUpdateData);
            if (!res.success) throw new Error(res.error);
            return res.data;
          },
          onSuccess: () => {
            console.log(" Column update Success",)
            queryClient.invalidateQueries({ queryKey: ['columns',projectId] })
          }
        })


    return {
        columns: columns,
        isLoading: isLoading,
        error: error,

        isDeleting:isDeleting,
        deleteError:deleteError,

        isCreating:isCreating,
        createError:createError,

        
        createCol: (data: ColumnCreate) =>useCreateColumn(data),
        updateCol: (colId:number,colUpdateData: ColumnCreate) => useUpdateCol({colId,colUpdateData}),
        deleteCol: (id: number) => useDeleteCol(id),
    }
}