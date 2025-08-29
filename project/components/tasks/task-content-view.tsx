"use client"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { TaskPriorityBadge, TaskStatusBadge } from "../ui/status_badges"

import { useUser } from "@clerk/nextjs"
import { CreateCommentForm } from "../forms/comment-form"
import { ScrollArea } from "../ui/scroll-area"
import { useTaskComments } from "@/hooks/use-comments"
import TaskCommentCard from './task-comment-card';
import { useTaskSheet } from "./task-sheet-context"
import { Button } from "../ui/button"
import { CircleCheckBig, Loader2Icon, RefreshCcwDot } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useEffect, useState } from "react"




type TaskSheetRootProps = {
    isOpening:boolean
    isClosing:boolean
    openTask: (taskId: number) => void;
    closeTask: (taskId: number) => void;
};




export default function TaskSheetRoot({isOpening,isClosing,openTask,closeTask}:TaskSheetRootProps) {
  const { activeTask, setActiveTask } = useTaskSheet();
  const [taskStatus, setTaskStatus] = useState(true);

  useEffect(() => {
  if (activeTask) {
    setTaskStatus(activeTask.openStatus);
    }
  }, [activeTask]);


  
  const { isLoaded, isSignedIn, user } = useUser();

  // Call useTaskComments with a safe fallback ID or null
  const { comments,createComment ,isCreating, isLoading, error } = useTaskComments(activeTask?.id ?? -1);

  // Conditionally render only after hooks
  if (!activeTask) return null;

  
  if (!isLoaded ) {
    return <p>Loading...</p>  // still fetching user
  }

  if (!isSignedIn || !user) {
    return <p>Not signed in</p>
  }

  async function handleToggleTaskStatus() {
    if (!activeTask) return;
    try{
      if (taskStatus){
        console.log("Closing")

        await closeTask(activeTask.id);
        setTaskStatus(false)
        
      }else{
        console.log("Opening")
        await openTask(activeTask.id);
        setTaskStatus(true)
      }
      
    } catch (err) {
      console.error("Failed to toggle task status", err);
    }
  }
  return (
    <>
      {activeTask && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 pointer-events-auto" />
          <Sheet open={!!activeTask} onOpenChange={(open) => !open && setActiveTask(null)}>
          <SheetContent className="bg-white rounded-l-lg border overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-bold text-2xl text-outer_space-500">{activeTask.title} #{activeTask.id}</SheetTitle>
                <ScrollArea>
                  <div className="flex flex-col">
                    <div className="flex flex-row gap-2 py-2">
                      <TaskStatusBadge status={taskStatus} size="lg" />
                      <TaskPriorityBadge priority={activeTask.priority} size="lg" />
                    </div>

                    <div className="flex flex-row gap-2">
                      Assignees:
                      <div className="w-6 h-6 bg-blue_munsell-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        U
                      </div>
                    </div>

                    <Separator className="my-2 bg-outer_space-200" />

                    <div>{activeTask.description}</div>

                    <div className="my-4 flex flex-col gap-4">
                      <div className="text-lg font-bold text-outer_space-500">
                        Comments 
                      </div>
                      <div>
                        {error && <p>Failed to load comments: {error.message}</p>}
                        {!comments && !error && <p>Loading comments...</p>}
                        {comments && comments.length === 0 && <p>No comments yet.</p>}

                        {comments && comments.length > 0 && (
                          <div className="space-y-2">
                            {comments.map((comment) => (
                              <TaskCommentCard key={comment.id} userId={comment.author_id} commentData={comment}/>
                             
                            ))}
                          </div>
                        )}
                      </div>
                      <Separator className="my-2 border-t-2 border-dashed border-outer_space-200 " />
                      <div className="flex flex-row gap-2 items-center">
                          <Avatar className="h-12 w-12 rounded-full border-outer_space-500 border">
                            <AvatarImage src={user.imageUrl} className="h-12 w-12 rounded-full object-cover"/>
                            <AvatarFallback className="rounded-full">CN</AvatarFallback>
                          </Avatar>
                          <div className="text-md font-medium text-outer_space-500">
                            Add Comments
                          </div>
                      </div>
                      
                      <div className="grid grid-rows-2 gap-2">
                        <CreateCommentForm taskId={activeTask.id} createComment={createComment}/>
                        <div className=" flex flex-row justify-end gap-2 ">
                            <Button disabled={isClosing || isOpening}  onClick={handleToggleTaskStatus} className="bg-blue_munsell-500 hover:bg-blue_munsell-300 text-white" type="submit" variant="outline">
                                {isClosing ? (
                                  <>
                                    <Loader2Icon className="animate-spin mr-2" size={15} />
                                    Closing...
                                  </>
                                ) : isOpening ? (
                                  <>
                                    <Loader2Icon className="animate-spin mr-2" size={15} />
                                    Opening...
                                  </>
                                ) : (
                                  <>
                                    
                                    {taskStatus ? 
                                    <>
                                      <CircleCheckBig size={15} className="mr-2" />Close Task
                                    </>
                                     : <><RefreshCcwDot size={15} className="mr-2"/>Open Task</>}
                                  </>
                                )}
                            </Button>
                            <Button disabled={isCreating} className="bg-blue_munsell-500 hover:bg-blue_munsell-300 text-white" type="submit" variant="outline"form="create-comment-form">
                                {isCreating ? (
                                  <>
                                    <Loader2Icon className="animate-spin mr-2" size={15} /> Posting...
                                  </>
                                ) : (
                                  "Comment"
                                )}
                            </Button>
                        </div>
                        
                      </div>
                      
                      
                    </div>
                  </div>
                </ScrollArea>
                
            </SheetHeader>
          </SheetContent>
        </Sheet>
        </>
      )}
    </>
  );
}