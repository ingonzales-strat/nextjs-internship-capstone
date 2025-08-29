'use client'

import { useForm } from "react-hook-form"

import { colSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Column, ColumnCreate } from "@/types";
import { colors } from "@/lib/constants";
import { useColumns } from "@/hooks/use-columns";

type UpdateColumnFormProps = {
  column: Column;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setLocked: React.Dispatch<React.SetStateAction<boolean>>

};


export function UpdateColumnForm({column,setOpen,setLocked}:UpdateColumnFormProps){
    const {updateCol} = useColumns(column.projectId);

    const form = useForm<z.infer<typeof colSchema>>({
        resolver: zodResolver(colSchema),
          defaultValues: {
            name:column.name,
            description:column.description||"",
            color:column.color||"",
        }
    })

    async function onSubmit(data: z.infer<typeof colSchema>) {
      const upColData:ColumnCreate={
        name:data.name,
        description:data.description||'',
        color:data.color,
        projectId:column.projectId,
        position:column.position

      }
      console.log("RUnning UPdate",upColData)
      try {
        await updateCol(column.id, upColData); // wait for mutation
        setOpen(false); // only closes if successful
        setLocked(false);
      } catch (err) {
        console.error("Failed to update column:", err);
      }
    }

    return(
         <Form {...form}>
            <form id={`update-col-form-${column.id}`} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
               <FormField
                control={form.control} name="name"
                render={({field})=>(
                  <FormItem className="flex flex-col">
                    <FormLabel>Label text*</FormLabel>
                    <FormControl>
                        <Input placeholder="a-preposterous-lemming" {...field} />
                       
                    </FormControl>
                    <FormMessage className="text-red-600"/>
                  </FormItem>
                )}
              /> 
              <FormField
                control={form.control} name="description"
                render={({field})=>(
                  <FormItem className="flex flex-col">
                    <FormLabel >Project Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="I want to make something today.." {...field} />
                    </FormControl>
                    <FormMessage className="text-red-600"/>
                  </FormItem>
                )}
              /> 
              <FormField
                control={form.control} name="color"
                render={({field})=>(
                  <FormItem className="flex flex-col">
                    <FormLabel >Color</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a color for your project" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                            {Object.entries(colors).map(([name, value]) => (
                                <SelectItem key={value} value={value} className="cursor-pointer" >
                                <div className="flex flex-row items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full bg-${value}`} />
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
              
              
            </form>
          </Form>
    )
}