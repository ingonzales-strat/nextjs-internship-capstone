"use client"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { useColumns } from "@/hooks/use-columns";
import { Column } from "@/types";
import { UpdateColumnForm } from "../forms/update-col-form";

type UpdateColumnModalpProps = {
  column:Column
};

export  function UpdateColumnModal({column}:UpdateColumnModalpProps) {
    const {

      isCreating

    } = useColumns(column.projectId);
  
  return (
    <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="font-bold text-outer_space-500 dark:text-platinum-500">Edit Column</DialogTitle>

        </DialogHeader>
        <UpdateColumnForm column={column}/>
        
        <DialogFooter className="flex flex-col gap-3 sm:flex-row">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button disabled={isCreating} className="bg-blue_munsell-500 hover:bg-blue_munsell-300 text-white" type="submit" variant="outline"form={`update-col-form-${column.id}`}>
              {isCreating ? "Saving..." : "Save"}
            </Button>
          </DialogClose>
        </DialogFooter>
        
    </DialogContent>
  )
}
