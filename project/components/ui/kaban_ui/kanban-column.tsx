import { CreateTaskModal } from "@/components/modals/create-task-modal";
import { TaskCard } from "@/components/tasks/task-card";
import { useProjectTasks } from "@/hooks/use-tasks";
import { Column, Task, TaskCreate } from "@/types";
import {  MoreHorizontal,ArrowRight, ArrowLeft, Trash, Pencil } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useColumns } from "@/hooks/use-columns";
import { UpdateColumnModal } from "@/components/modals/update-col-modal";
import { Dialog, DialogTrigger } from "../dialog";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCallback, useEffect, useState } from "react";


export interface KanbanColumnProps {
  id:number,
  colArrayLength:number,
  colLocalPosition:number,
  column: Column,
  taskArray:Task[],

  leftHandler: () => void;
  rightHandler: () => void;

}

export default function KanbanColumn({id,colArrayLength,column,taskArray,colLocalPosition ,leftHandler, rightHandler}:KanbanColumnProps){

    const {updateTask,  deleteTask } = useProjectTasks(column.projectId);
    
    const{deleteCol}=useColumns(column.projectId)
    const [dragTasks, setDragTasks] = useState<Task[]>([]);
    const[openDiag,setOpenDiag] = useState(false)
    const[locked,setLocked] = useState(false)

    useEffect(() => {

      if (!taskArray) return;
  
      const sortedServer = [...taskArray].sort((a, b) => a.position - b.position);
      const sortedLocal = [...dragTasks].sort((a, b) => a.position - b.position);
      if(id===119){
        //console.log("Testing task differences",id)
       // console.log("Server",sortedServer)
        //console.log("Local",sortedLocal)
      }
      
      const differentContent = JSON.stringify(sortedServer) !== JSON.stringify(sortedLocal);
  
      if (differentContent) {
        
        setDragTasks(sortedServer);
        //taskOrderUpdate(sortedServer)
        console.log("Updating column",id,sortedServer)
       
      }
    }, [taskArray]);
    


    const {attributes, listeners, setNodeRef, transform, transition} =useSortable(
    {id:id,
    data: {
      type: "column",
      column,
    },
    disabled:locked
    })
    const style = {
      transition,
      transform: CSS.Transform.toString(transform),
    };

    //if (isLoading) return <p>Loading...</p>;
    //if (error) return <p>Failed to load tasks {error.message}</p>;
    //if (!tasks) return <p>Failed to load tasks</p>;

    const delColHandler = async () => { 
      deleteCol(column.id)
    }


    const getTaskPos = useCallback((id: number) =>
      dragTasks.findIndex(task => task.id === id),
      [dragTasks]
    );

    function taskOrderUpdate(newTaskArr:Task[]){
        newTaskArr.forEach((task, index) => {
          const taskData:TaskCreate = {
            ...task,
            position: index, // or whatever position field you use
            columnId:id
          };
       
          updateTask(task.id, taskData,"order");
        });
  
    }

    function toBottomButton(taskId:number){
      console.log("To Bottom button pressed")
      const originalPos = getTaskPos(taskId);
      if (originalPos!==dragTasks.length-1) {
        setDragTasks((dragTasks) => {
        const newArr = arrayMove(dragTasks, originalPos, dragTasks.length - 1);        
        taskOrderUpdate(newArr);
        return newArr;
      });
      } 
    }
    function setOpenHandler (open:boolean){
        setOpenDiag(open);   // controls modal visibility
        setLocked(open);   // lock/unlock while modal is open

    }

    function toTopButton(taskId:number){
      console.log("To Top button pressed")
      const originalPos = getTaskPos(taskId);
      if (originalPos!==0) {
        setDragTasks((dragTasks) => {
        const newArr = arrayMove(dragTasks, originalPos, 0);        
        taskOrderUpdate(newArr);
        return newArr;
      });
      } 
    }
    const disableCheckLeft = colLocalPosition=== 0;
    const disableCheckRight = colLocalPosition === colArrayLength-1;

    return(
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex-shrink-0 w-80 column">
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
                    {column.name} {column.id} {column.position}
                  </h3>
                  <div className=" p-1 px-2 text-xs border-5 bg-white border-black dark:border-payne's_gray-400 dark:bg-payne's_gray-400 rounded-full">
                    {dragTasks.length}
                  </div>
                </div>
                <Dialog open={openDiag} onOpenChange={setOpenHandler }>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded hover:bg-muted">
                        <MoreHorizontal size={16} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white dark:bg-zinc-900 text-sm">

                      <DropdownMenuLabel>Column</DropdownMenuLabel>
                      <DropdownMenuGroup>

                        <DropdownMenuItem  onSelect={(e) => e.preventDefault()} className="cursor-pointer  hover:bg-muted">
                        <DialogTrigger   className="flex flex-row items-center gap-2">
                            <Pencil size={16} /> Edit Column
                        </DialogTrigger>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                        onClick={delColHandler}
                        className="cursor-pointer flex flex-row items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                      >
                        <Trash size={16} />
                        Delete
                      </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Position</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        <DropdownMenuItem className="cursor-pointer" disabled={disableCheckLeft} onClick={leftHandler}>
                          <ArrowLeft size={12}/> Move Left
                          
                        </DropdownMenuItem>
                        <DropdownMenuItem  className="cursor-pointer" disabled={disableCheckRight} onClick={rightHandler}>
                         <ArrowRight size={12}/> Move Right
                          
                        </DropdownMenuItem>

                      </DropdownMenuGroup>
                    
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <UpdateColumnModal column={column} setOpen={setOpenDiag} setLocked={setLocked}/>
                </Dialog>
                
              </div>
              <p className="mt-2 text-xs text-payne's_gray-500 dark:text-french_gray-400 ">
                {column.description}
              </p>
            </div>
            <div className="p-3 space-y-2 min-h-[400px]">
              <ScrollArea className="h-72">
                <SortableContext items={dragTasks} strategy={verticalListSortingStrategy}>
                  {dragTasks.map((task) => (
                    <TaskCard key={task.id} projectId={column.projectId} id={task.id} task={task} delTaskHandler={()=>deleteTask(task.id)}arrayPosition={getTaskPos(task.id)} taskArrayLength={dragTasks.length} topHandler={()=>toTopButton(task.id)} bottomHandler={()=>toBottomButton(task.id)}/>
                  ))}
                </SortableContext>
              </ScrollArea>
              <CreateTaskModal colId={column.id} projectId={column.projectId} setLocked={setLocked}/>
            </div>
          </div>
        </div>
    )
}