// TODO: Task 4.4 - Build task creation and editing functionality
// TODO: Task 5.6 - Create task detail modals and editing interfaces

/*
TODO: Implementation Notes for Interns:

Modal for creating and editing tasks.

Features to implement:
- Task title and description
- Priority selection
- Assignee selection
- Due date picker
- Labels/tags
- Attachments
- Comments section (for edit mode)
- Activity history (for edit mode)

Form fields:
- Title (required)
- Description (rich text editor)
- Priority (low/medium/high)
- Assignee (team member selector)
- Due date (date picker)
- Labels (tag input)
- Attachments (file upload)

Integration:
- Use task validation schema
- Call task creation/update API
- Update board state optimistically
- Handle file uploads
- Real-time updates for comments
*/

"use client"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { useProjectTasks } from "@/hooks/use-tasks";
import { CreateTaskForm } from "../forms/create-task-form";
import { useState } from "react";

type CreateTaskModalpProps = {
  projectId:string
  colId: number;
  setLocked: React.Dispatch<React.SetStateAction<boolean>>

};


export  function CreateTaskModal({ colId,projectId,setLocked }: CreateTaskModalpProps) {
  const [isOpen,setIsOpen] = useState(false)
    const {
    
      isCreating

    } = useProjectTasks(projectId);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);   // controls modal visibility
        setLocked(open);   // lock/unlock while modal is open
      }}>
        <DialogTrigger className="w-full p-3 border-2 border-dashed border-french_gray-300 dark:border-payne's_gray-400 rounded-lg text-payne's_gray-500 dark:text-french_gray-400 hover:border-blue_munsell-500 hover:text-blue_munsell-500 transition-colors">
          + Add Task
        </DialogTrigger>
        <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="font-bold text-outer_space-500 dark:text-platinum-500">New Task</DialogTitle>
        </DialogHeader>
        <CreateTaskForm colId={colId} projectId={projectId} setOpen={setIsOpen} setLocked={setLocked}/>
        
        <DialogFooter className="flex flex-col gap-3 sm:flex-row">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          
          <Button disabled={isCreating} className="bg-blue_munsell-500 hover:bg-blue_munsell-300 text-white" type="submit" variant="outline"form={`create-project-form-${colId}`}>
            {isCreating ? "Creating..." : "Add Task"}
          </Button>
       
        </DialogFooter>
        
      </DialogContent>
     
            
    </Dialog>
    
  )
}
