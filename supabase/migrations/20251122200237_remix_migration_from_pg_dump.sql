CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



SET default_table_access_method = heap;

--
-- Name: formularios_submetidos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.formularios_submetidos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome_completo text NOT NULL,
    cpf text NOT NULL,
    email_cliente text NOT NULL,
    dados_completos jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: planejamento_previdenciario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.planejamento_previdenciario (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    criado_em timestamp with time zone DEFAULT now() NOT NULL,
    origem_formulario text DEFAULT 'planejamento-previdenciario-v1'::text NOT NULL,
    nome_completo text NOT NULL,
    sexo text NOT NULL,
    data_nascimento text NOT NULL,
    vinculo text NOT NULL,
    pessoa_com_deficiencia boolean NOT NULL,
    grau_deficiencia text,
    insalubridade_ou_especial boolean NOT NULL,
    professor boolean NOT NULL,
    policial boolean NOT NULL,
    bombeiro_militar boolean NOT NULL,
    email_cliente text NOT NULL,
    cpf text NOT NULL,
    origem_funcional text,
    uf text,
    municipio text,
    data_ingresso_servico_publico text,
    tempo_carreira_anos integer DEFAULT 0,
    tempo_carreira_meses integer DEFAULT 0,
    tempo_carreira_dias integer DEFAULT 0,
    tempo_cargo_anos integer DEFAULT 0,
    tempo_cargo_meses integer DEFAULT 0,
    tempo_cargo_dias integer DEFAULT 0,
    tempo_afastamento_anos integer DEFAULT 0,
    tempo_afastamento_meses integer DEFAULT 0,
    tempo_afastamento_dias integer DEFAULT 0,
    tempo_comum_anos integer DEFAULT 0 NOT NULL,
    tempo_comum_meses integer DEFAULT 0 NOT NULL,
    tempo_comum_dias integer DEFAULT 0 NOT NULL,
    tempo_magisterio_anos integer DEFAULT 0,
    tempo_magisterio_meses integer DEFAULT 0,
    tempo_magisterio_dias integer DEFAULT 0,
    tempo_fora_magisterio_anos integer DEFAULT 0,
    tempo_fora_magisterio_meses integer DEFAULT 0,
    tempo_fora_magisterio_dias integer DEFAULT 0,
    tempo_especial_insalubre_anos integer DEFAULT 0,
    tempo_especial_insalubre_meses integer DEFAULT 0,
    tempo_especial_insalubre_dias integer DEFAULT 0,
    tempo_policial_anos integer DEFAULT 0,
    tempo_policial_meses integer DEFAULT 0,
    tempo_policial_dias integer DEFAULT 0,
    policial_civil_ou_federal boolean DEFAULT false,
    policial_militar_ou_bombeiro boolean DEFAULT false,
    tempo_pcd_anos integer DEFAULT 0,
    tempo_pcd_meses integer DEFAULT 0,
    tempo_pcd_dias integer DEFAULT 0,
    ip text,
    user_agent text,
    recaptcha_score numeric(3,2),
    versao integer DEFAULT 1 NOT NULL,
    CONSTRAINT planejamento_previdenciario_grau_deficiencia_check CHECK (((grau_deficiencia = ANY (ARRAY['Leve'::text, 'Moderado'::text, 'Grave'::text])) OR (grau_deficiencia IS NULL))),
    CONSTRAINT planejamento_previdenciario_origem_funcional_check CHECK (((origem_funcional = ANY (ARRAY['Federal'::text, 'Estadual'::text, 'Municipal'::text])) OR (origem_funcional IS NULL))),
    CONSTRAINT planejamento_previdenciario_sexo_check CHECK ((sexo = ANY (ARRAY['Masculino'::text, 'Feminino'::text, 'Outro/Prefiro não informar'::text]))),
    CONSTRAINT planejamento_previdenciario_vinculo_check CHECK ((vinculo = ANY (ARRAY['Servidor Público'::text, 'Carteira Assinada (CLT)'::text])))
);


--
-- Name: formularios_submetidos formularios_submetidos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.formularios_submetidos
    ADD CONSTRAINT formularios_submetidos_pkey PRIMARY KEY (id);


--
-- Name: planejamento_previdenciario planejamento_previdenciario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.planejamento_previdenciario
    ADD CONSTRAINT planejamento_previdenciario_pkey PRIMARY KEY (id);


--
-- Name: planejamento_previdenciario unique_cpf; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.planejamento_previdenciario
    ADD CONSTRAINT unique_cpf UNIQUE (cpf);


--
-- Name: planejamento_previdenciario unique_email; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.planejamento_previdenciario
    ADD CONSTRAINT unique_email UNIQUE (email_cliente);


--
-- Name: idx_formularios_cpf; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_formularios_cpf ON public.formularios_submetidos USING btree (cpf);


--
-- Name: idx_formularios_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_formularios_created_at ON public.formularios_submetidos USING btree (created_at DESC);


--
-- Name: idx_planejamento_cpf; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_planejamento_cpf ON public.planejamento_previdenciario USING btree (cpf);


--
-- Name: idx_planejamento_criado_em; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_planejamento_criado_em ON public.planejamento_previdenciario USING btree (criado_em DESC);


--
-- Name: idx_planejamento_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_planejamento_email ON public.planejamento_previdenciario USING btree (email_cliente);


--
-- Name: planejamento_previdenciario Acesso via service role apenas; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Acesso via service role apenas" ON public.planejamento_previdenciario TO service_role USING (true) WITH CHECK (true);


--
-- Name: formularios_submetidos Anyone can check form existence; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can check form existence" ON public.formularios_submetidos FOR SELECT USING (true);


--
-- Name: formularios_submetidos Anyone can submit forms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit forms" ON public.formularios_submetidos FOR INSERT WITH CHECK (true);


--
-- Name: formularios_submetidos; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.formularios_submetidos ENABLE ROW LEVEL SECURITY;

--
-- Name: planejamento_previdenciario; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.planejamento_previdenciario ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


