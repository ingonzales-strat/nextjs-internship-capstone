"use server"

import { auth } from "@clerk/nextjs/server";

export async function clerkAuthCheck(){
  const clerkID = (await auth()).userId;

  if (!clerkID) {
    throw new Error("User not Authenticated.");
  }
  return clerkID
}