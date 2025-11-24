-- Fix critical RLS vulnerabilities on tables containing sensitive PII

-- Drop insecure policies on formularios_submetidos
DROP POLICY IF EXISTS "Anyone can check form existence" ON public.formularios_submetidos;
DROP POLICY IF EXISTS "Anyone can submit forms" ON public.formularios_submetidos;

-- Create secure policies that restrict access to service role only
CREATE POLICY "service_role_only_select"
ON public.formularios_submetidos
FOR SELECT
USING (auth.role() = 'service_role');

CREATE POLICY "service_role_only_insert"
ON public.formularios_submetidos
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Fix misconfigured RLS policy on planejamento_previdenciario
DROP POLICY IF EXISTS "Acesso via service role apenas" ON public.planejamento_previdenciario;

CREATE POLICY "service_role_only_all"
ON public.planejamento_previdenciario
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Add comment documenting the security model
COMMENT ON TABLE public.formularios_submetidos IS 'Contains sensitive PII (CPF, email, personal data). Access restricted to service role only for backend processing.';
COMMENT ON TABLE public.planejamento_previdenciario IS 'Contains extensive PII including health conditions. Access restricted to service role only.';