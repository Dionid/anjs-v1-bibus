CREATE TABLE public."user" (
    id UUID PRIMARY KEY,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
);