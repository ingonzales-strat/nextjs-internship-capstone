"use client"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { useColumns } from "@/hooks/use-columns";
import { Column } from "@/types";
import { UpdateColumnForm } from "../forms/update-col-form";
import { useState } from "react";

type UpdateColumnModalpProps = {
  column:Column
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setLocked: React.Dispatch<React.SetStateAction<boolean>>

};

export  function UpdateColumnModal({column,setOpen,setLocked}:UpdateColumnModalpProps) {
    
    const {

      isUpdating

    } = useColumns(column.projectId);
  
  return (
    <DialogContent  className="bg-white">
        <DialogHeader>
          <DialogTitle className="font-bold text-outer_space-500 dark:text-platinum-500">Edit Column</DialogTitle>

        </DialogHeader>
        <UpdateColumnForm column={column} setOpen={setOpen} setLocked={setLocked}/>
        
        <DialogFooter className="flex flex-col gap-3 sm:flex-row">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
      
            <Button disabled={isUpdating} className="bg-blue_munsell-500 hover:bg-blue_munsell-300 text-white" type="submit" variant="outline"form={`update-col-form-${column.id}`}>
              {isUpdating ? "Saving..." : "Save"}
            </Button>
         
        </DialogFooter>
        
    </DialogContent>
  )
}
