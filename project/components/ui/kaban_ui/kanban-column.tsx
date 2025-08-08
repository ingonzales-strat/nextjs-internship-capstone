import { CreateTaskModal } from "@/components/modals/create-task-modal";
import { TaskCard } from "@/components/task-card";
import { useTasks } from "@/hooks/use-tasks";
import { Column } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useColumns } from "@/hooks/use-columns";
import { UpdateColumnModal } from "@/components/modals/update-col-modal";
import { Dialog, DialogTrigger } from "../dialog";


export interface KanbanColumnProps {
  column: Column
}

export default function KanbanColumn({column}:KanbanColumnProps){
    const{tasks,isLoading,error}=useTasks(column.id)
    const{deleteCol}=useColumns(column.projectId)
     if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Failed to load tasks {error.message}</p>;
    if (!tasks) return <p>Failed to load tasks</p>;

    const delColHandler = async () => { 
      deleteCol(column.id)
   }
    
    return(
        <div className="flex-shrink-0 w-80">
                <div className="bg-gray-100 dark:bg-outer_space-400 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400">
                  <div className="p-3 border-b border-french_gray-300 dark:border-payne's_gray-400">
                    <div className="flex gap-2 items-center justify-between">
                      <div className="flex flex-row gap-2 items-center">
                        <div className={`w-5 h-5 
                              bg-${column.color}/40
                              border-${column.color}
                              border-2
                              rounded-full 
                              `}
                          />
                        <h3 className="font-semibold text-outer_space-500 dark:text-platinum-500">
                          {column.name}
                        </h3>
                        <div className=" p-1 px-2 text-xs border-5 bg-white border-black dark:border-payne's_gray-400 dark:bg-payne's_gray-400 rounded-full">
                          {tasks.length}
                        </div>
                      </div>
                      <Dialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 rounded hover:bg-muted">
                              <MoreHorizontal size={16} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white dark:bg-zinc-900 text-sm">
                            <DropdownMenuItem  onSelect={(e) => e.preventDefault()} className="cursor-pointer hover:bg-muted">
                              <DialogTrigger className="">
                                  Edit Column
                              </DialogTrigger>
                              
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={delColHandler}
                              className="cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <UpdateColumnModal column={column}/>
                      </Dialog>
                      
                    </div>
                    <p className="mt-2 text-xs text-payne's_gray-500 dark:text-french_gray-400 ">
                      {column.description}
                    </p>
                  </div>

                  <div className="p-3 space-y-2 min-h-[400px]">
                    <ScrollArea className="h-85 ">
                      <div className="flex flex-col gap-2">
                        {tasks.map((task,key) => (
                        <TaskCard key={key} task={task}/>
                      ))}
                      </div>
                      
       
                    </ScrollArea>
                    
                    <CreateTaskModal colId={column.id}/>
                  </div>
                </div>
              </div>
    )
}