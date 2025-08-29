'use client'
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"

import { useForm } from "react-hook-form"

import { taskSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TaskCreate } from "@/types";
import { taskPriority } from "@/lib/constants";
import { useProjectTasks } from "@/hooks/use-tasks";

type CreateTaskFormProps = {
  colId: number;
  projectId:string,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setLocked: React.Dispatch<React.SetStateAction<boolean>>

};

export function CreateTaskForm({colId,projectId, setOpen, setLocked}:CreateTaskFormProps){
    const {projectTasks,
      createTask,
    } = useProjectTasks(projectId);

    var nextPosition=0;
    if (!projectTasks) {
      nextPosition=0
    }else{
      nextPosition=projectTasks.length
    }
    

    const form = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(taskSchema),
          defaultValues: {
          title: "",
          description: "",
          priority: "low",
          dueDate: new Date(),
        }
    })

    async function onSubmit(data: z.infer<typeof taskSchema>) {
      try{
          const newTaskData:TaskCreate={
          assigneeId:null,
          position:nextPosition,
          columnId:colId,
          title:data.title,
          description:data.description||'',
          due_date:data.dueDate || null ,
          priority:data.priority,
        }
      
        await createTask(newTaskData)
        setOpen(false)
        setLocked(false)

      }catch (err){
        console.error("Failed to create task", err);
      }
      
    }

    return(
         <Form {...form}>
            <form id={`create-project-form-${colId}`} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
               <FormField
                control={form.control} name="title"
                render={({field})=>(
                  <FormItem className="flex flex-col">
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                        <Input placeholder="a-preposterous-endevour" {...field} />
                       
                    </FormControl>
    
                    <FormMessage className="text-red-600"/>
                  </FormItem>
                )}
              /> 
              <FormField
                control={form.control} name="description"
                render={({field})=>(
                  <FormItem className="flex flex-col">
                    <FormLabel >Task Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="I want to make something today.." {...field} />
                    </FormControl>
                    <FormDescription>
                        What's going to happen?
                    </FormDescription>
                    <FormMessage className="text-red-600"/>
                  </FormItem>
                )}
              /> 
              <FormField
                control={form.control} name="priority"
                render={({field})=>(
                  <FormItem className="flex flex-col">
                    <FormLabel >Task Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="What's this task's priority?" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                            {Object.entries(taskPriority).map(([name, value]) => (
                                <SelectItem key={value} value={value} className="cursor-pointer" >
                                <div className="flex flex-row items-center gap-2">
                                    {name}
                                </div>                               
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    <FormMessage className="text-red-600"/>
                  </FormItem>
                )}
              /> 
              <FormField
                control={form.control} name="dueDate"
                render={({field})=>(
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}>{field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar 
                        className="bg-white"
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                   
                  </FormItem>
              
                )}
              />
              
            </form>
          </Form>
    )
}