-- Recreate the tables that were dropped (for rollback purposes)
CREATE TABLE "public"."subjects" ("id" serial NOT NULL, "name" text NOT NULL, "source" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));

CREATE TABLE public.checkpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    longitude DOUBLE PRECISION NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    favorite BOOLEAN DEFAULT false
);

CREATE TABLE public.root (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country TEXT NOT NULL,
    length DOUBLE PRECISION NOT NULL,
    material TEXT NOT NULL,
    favorites BOOLEAN DEFAULT false,
    description TEXT
);

-- Recreate relationships
ALTER TABLE public.checkpoints ADD COLUMN root_id UUID;
ALTER TABLE public.checkpoints ADD CONSTRAINT fk_checkpoints_root FOREIGN KEY (root_id) REFERENCES public.root(id); 