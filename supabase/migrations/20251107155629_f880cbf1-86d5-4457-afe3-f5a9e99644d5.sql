-- Create table to store submitted forms
CREATE TABLE public.formularios_submetidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  cpf TEXT NOT NULL,
  email_cliente TEXT NOT NULL,
  dados_completos JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.formularios_submetidos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public form submission)
CREATE POLICY "Anyone can submit forms" 
ON public.formularios_submetidos 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to check if form exists (for duplicate check)
CREATE POLICY "Anyone can check form existence" 
ON public.formularios_submetidos 
FOR SELECT 
USING (true);

-- Create index for faster CPF lookups
CREATE INDEX idx_formularios_cpf ON public.formularios_submetidos(cpf);

-- Create index for created_at for ordering
CREATE INDEX idx_formularios_created_at ON public.formularios_submetidos(created_at DESC);