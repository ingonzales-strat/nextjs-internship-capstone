// TODO: Task 3.1 - Design database schema for users, projects, lists, and tasks
// TODO: Task 3.3 - Set up Drizzle ORM with type-safe schema definitions

/*
TODO: Implementation Notes for Interns:

2. Define schemas for:
   - users (id, clerkId, email, name, createdAt, updatedAt)
   - projects (id, name, description, ownerId, createdAt, updatedAt, dueDate)
   - lists (id, name, projectId, position, createdAt, updatedAt)
   - tasks (id, title, description, listId, assigneeId, priority, dueDate, position, createdAt, updatedAt)
   - comments (id, content, taskId, authorId, createdAt, updatedAt)

3. Set up proper relationships between tables
4. Add indexes for performance
5. Configure migrations

Example structure:
import { pgTable, text, timestamp, integer, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ... other tables
*/

import { relations, sql } from "drizzle-orm";

import { integer, pgTable, varchar,text,timestamp,boolean,jsonb, primaryKey,uuid, check, pgEnum } from "drizzle-orm/pg-core";


export const usersTable = pgTable("users", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey().notNull(),
  clerkId: text('clerk_id').notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  teamId: integer("team_id").references(() => teamTable.id),
});







export const projectTable = pgTable("project", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey().notNull(),
  projectOwner:uuid('projectOwner').notNull().references(()=>usersTable.id, {onDelete: 'cascade'}),
  name: varchar('name',{ length: 255 }).notNull().unique(),
  statusId: integer("status_id")
    .references(() => statusTable.id, { onDelete: "set null" })
    .notNull(),
  description:text("description"),
  color: varchar("color", { length: 64 }).notNull().default('blue-500'),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  due_date: timestamp("due_date", { withTimezone: true }),

  });

export const projectMembers = pgTable("projectMembers", {
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  projectId: uuid("project_id").notNull().references(() => projectTable.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 32 }).notNull().default("member"), // optional metadata
  joinedAt: timestamp("joined_at").defaultNow() // optional

},
  (table) => [
  primaryKey({ columns: [table.userId, table.projectId] }),

])

export const projectRelation=relations(projectTable,({ many }) => ({
  members: many(projectMembers),
}));
export const userRelations = relations(usersTable, ({ many }) => ({
  projectMemberships: many(projectMembers),
}));

export const projectMemberRelations = relations(projectMembers, ({ one }) => ({
  user: one(usersTable, {
    fields: [projectMembers.userId],
    references: [usersTable.id],
  }),
  project: one(projectTable, {
    fields: [projectMembers.projectId],
    references: [projectTable.id],
  }),
}));




export const teamTable = pgTable("team", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),

});

export const statusTable=pgTable("projStatus",{
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull().unique(), // e.g. 'In Progress'
  description: text("description"),
})

export const columnTable = pgTable("kbColumn", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectId: uuid("project_id").notNull().references(() => projectTable.id, { onDelete: "cascade" }),
  
  name: varchar({ length: 255 }).notNull(), // e.g. "To Do", "In Progress"
  description: text("description"),
  color: varchar("color", { length: 64 }).notNull().default('blue-500'),

  position: integer("order").default(0), // controls column order

  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);
export const taskTable = pgTable("task", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  columnId: integer("column_Id").notNull().references(() => columnTable.id, { onDelete: "cascade" }),
  assigneeId:uuid('assignee_Id').references(()=>usersTable.id, {onDelete: 'cascade'}),
  
  title: varchar({ length: 255 }).notNull(),
  description:text("description"),
  priority: priorityEnum("priority").notNull(),
  position: integer("order").default(0),

  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  due_date: timestamp("due_date", { withTimezone: true }),




});

export const taskRelations = relations(taskTable, ({ one }) => ({
  column: one(columnTable, {
    fields: [taskTable.columnId],
    references: [columnTable.id],
  }),
  assignee: one(usersTable, {
    fields: [taskTable.assigneeId],
    references: [usersTable.id],
  }),
}));
export const columnRelations = relations(columnTable, ({ many }) => ({
  tasks: many(taskTable),
}));

export const comments = "TODO: Implement comments table schema"
