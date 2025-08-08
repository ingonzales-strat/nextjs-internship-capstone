"use client"
import {  Plus } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { CreateProjectForm } from '../forms/create-project-form';
import { Button } from "../ui/button";
import { useProjects } from "@/hooks/use-projects";
import { useColumns } from "@/hooks/use-columns";
import { CreateColumnForm } from "../forms/create-col-form";

type CreateColumnModalpProps = {
  projectId: string;
};

export  function CreateColumnModal({projectId}:CreateColumnModalpProps) {
    const {

      isCreating

    } = useColumns(projectId);
  
  return (
    <Dialog>
        <DialogTrigger className="w-full p-3 border-2 border-dashed border-french_gray-300 dark:border-payne's_gray-400 rounded-lg text-payne's_gray-500 dark:text-french_gray-400 hover:border-blue_munsell-500 hover:text-blue_munsell-500 transition-colors">
            + Add Column
        </DialogTrigger>
        <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="font-bold text-outer_space-500 dark:text-platinum-500">Add Column</DialogTitle>

        </DialogHeader>
        <CreateColumnForm projectId={projectId}/>
        
        <DialogFooter className="flex flex-col gap-3 sm:flex-row">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button disabled={isCreating} className="bg-blue_munsell-500 hover:bg-blue_munsell-300 text-white" type="submit" variant="outline"form="create-col-form">
              {isCreating ? "Creating..." : "Add Column"}
            </Button>
          </DialogClose>
        </DialogFooter>
        
      </DialogContent>
     
            
    </Dialog>
    
  )
}
