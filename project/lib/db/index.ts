// TODO: Task 3.2 - Configure PostgreSQL database (Vercel Postgres or Neon)
// TODO: Task 3.5 - Implement database connection and query utilities

/*
TODO: Implementation Notes for Interns:

1. Choose database provider:
   - Vercel Postgres (recommended for Vercel deployment)
   - Neon (good alternative)
   - Local PostgreSQL for development

2. Set up environment variables:
   - DATABASE_URL
   - POSTGRES_URL (if using Vercel Postgres)

3. Configure Drizzle connection
4. Implement CRUD operations for all entities
5. Add proper error handling
6. Set up connection pooling if needed

Example structure:
import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'
import * as schema from './schema'

export const db = drizzle(sql, { schema })

export const queries = {
  projects: {
    getAll: async () => { ... },
    getById: async (id: string) => { ... },
    create: async (data: any) => { ... },
    update: async (id: string, data: any) => { ... },
    delete: async (id: string) => { ... },
  },
  // ... other entity queries
}
*/


import {config} from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/lib/db/schema';
import { ColumnCreate, ProjectCreator, TaskCreate } from "@/types";
import { columnTable, projectMembers, projectTable, taskTable } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { create } from "domain";

config({path:".env"});
export const db = drizzle(process.env.DATABASE_URL!,{schema});

export const queries = {
  users:{
    getById: async (clerkId: string) => {
        return await db.query.usersTable.findFirst({
        where: (u, { eq }) => eq(u.clerkId, clerkId),
      });
    },

  },
  projects: {
    getAll: async () => {
      return await db.select().from(projectTable);
    },
    getByUser:async(userId: string)=>{
      return  await db.query.projectMembers.findMany({
          where: (pm, { eq }) => eq(pm.userId, userId),
          with: {
            project: true,
          },
      });
    },
    getById: async (projectId: string) => {
      const result = await db
          .select()
          .from(projectTable)
          .where(eq(projectTable.id, projectId))
          .limit(1); 

      return result[0] ?? null;
    },
    create: async (projectOwner:string,projectData:ProjectCreator) => {
      const data={
        projectOwner:projectOwner,
        name:projectData.name,
        statusId:projectData.statusId,
        description:projectData.description,
        color:projectData.color,
        due_date:projectData.dueDate
      }

      const newProject=await db.insert(projectTable).values(data).returning()
      return newProject
    },
    projectUserLink:async (projectId:string, userId:string,role:string)=>{
        try {
          await db.insert(projectMembers).values({
            userId,
            projectId,
            role,
          });
          return true; // success
        } catch (error) {
          console.error("Error linking user to project:", error);
          return false; // failure
        }
    },
    update: (id: string, projectData: ProjectCreator) => {
      return db.update(projectTable)
        .set({
          name:projectData.name,
          description:projectData.description,
          color:projectData.color,
          due_date:projectData.dueDate,
          statusId:projectData.statusId,
          updated_at:sql`now()`
        }).where(eq(projectTable.id,id));
    },
    delete: async (id: string) => {
      const res =await  db.delete(projectTable).where(eq(projectTable.id,id)).returning({ deletedId: projectTable.id});
      return res
    },
  },
  tasks: {

    getByCol: async(colId:number)=>{
      return db.select().from(taskTable).where(eq(taskTable.columnId,colId))
    },
    create: async (data: TaskCreate) => {
      return db.insert(taskTable).values(data).returning()
    },
    update: (id: number, data: TaskCreate) => {
      return db.update(taskTable)
        .set({
          title:data.title,
          description:data.description,
          priority:data.priority,
          position:data.position,
          due_date:data.due_date,
          updated_at:sql`now()`
        }).where(eq(taskTable.id,id));
    },
    delete: (id: number) => {
      return db.delete(taskTable).where(eq(taskTable.id,id)).returning({ deletedId: taskTable.id});;  
    },
  },
  cols:{
    getByProject: async(projectId: string) => {
      return db.select().from(columnTable).where(eq(columnTable.projectId,projectId))
    },
    create: async(colData: ColumnCreate)=>{
      const newProject=await db.insert(columnTable).values(colData).returning()
      return newProject 
    },
    update: (colId: number,  colData: ColumnCreate) => {
      return db.update(columnTable)
        .set({
          name:colData.name,
          description:colData.description,
          position:colData.position,
          color:colData.color,
          updated_at:sql`now()`
        }).where(eq(columnTable.id,colId));
    },
    delete: async (colId: number) => {
      const res =await  db.delete(columnTable).where(eq(columnTable.id,colId)).returning({ deletedId: projectTable.id});
      return res
    },

  }
}
