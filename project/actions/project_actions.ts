"use server";
import 'dotenv/config';

import { queries } from '../lib/db/index';
import { auth } from '@clerk/nextjs/server';
import { Project, ProjectCreator } from '@/types';
import { clerkAuthCheck } from '@/lib/server_util';


export const getProjects = async () => {
  try {
    clerkAuthCheck()
    const projects = await queries.projects.getAll();
    return {
      success: true,
      data: projects,
    };
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getProjectsById = async (projectId:string) => {
  try {
    clerkAuthCheck()
    const project = await queries.projects.getById(projectId)
    return {
      success: true,
      data: project,
    };
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getUserProjects=async()=>{
  try {
      const clerkID= await clerkAuthCheck()

      const internalUser = await queries.users.getById(clerkID)

      if (!internalUser) {
        throw new Error("User not found.");
      }

      const memberships = await queries.projects.getByUser(internalUser.id)

      const userProjects = memberships.map((m) => m.project);

      return {success: true,data: userProjects}
    
  } catch (error) {

    console.error("❌ Error fetching user's projects:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    
  }
}

export const createProject=async (
  data:ProjectCreator
)=>{
  try {
    const clerkID= await clerkAuthCheck()

    // Get internal user UUID from your `usersTable`
    const internalUser = await await queries.users.getById(clerkID)
    if (!internalUser) {
      throw new Error("User not found.");
    }

    const [newProject] =await queries.projects.create(internalUser.id,data);
    await queries.projects.projectUserLink(newProject.id,internalUser.id,"Project Owner")

    return { success: true, data:newProject }
    
  } catch (error) {
    console.error("❌ Error creating project =>", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    
  }

}

export const deleteProject=async(projectId:string)=>{
  try {
    clerkAuthCheck()
    const deletedId =await queries.projects.delete(projectId)

    if (!deletedId) {
      throw new Error("Project could not be deleted or was not found.");
    }

    return {
      success: true,
      data: deletedId,
    };

  } catch (error) {
    console.error(`❌ Error deleting project ${projectId} =>`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    
  }

}

export const updateProject=async (
  projectId:string,
  data:ProjectCreator
)=>{
  try {
    clerkAuthCheck()

    const updatedProject = await queries.projects.update(projectId,data).returning()
    
    if (!updatedProject) {
      throw new Error("Project could not be updated or was not found.");
    }




    return { success: true, data:updatedProject }
    
  } catch (error) {
    console.error("❌ Error creating project =>", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    
  }

}