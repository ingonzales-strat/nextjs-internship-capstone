ALTER TABLE "users" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;