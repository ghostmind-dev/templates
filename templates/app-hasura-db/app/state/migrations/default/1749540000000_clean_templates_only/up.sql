-- Drop templates table if it exists (to ensure clean structure)
DROP TABLE IF EXISTS "public"."templates";

-- Create clean templates table with only id and name
CREATE TABLE "public"."templates" (
    "id" serial NOT NULL, 
    "name" text NOT NULL, 
    PRIMARY KEY ("id"), 
    UNIQUE ("id")
); 