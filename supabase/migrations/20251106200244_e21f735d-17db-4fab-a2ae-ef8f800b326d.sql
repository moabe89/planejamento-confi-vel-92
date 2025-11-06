-- Tabela para armazenar os registros de planejamento previdenciário
CREATE TABLE IF NOT EXISTS public.planejamento_previdenciario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  origem_formulario TEXT NOT NULL DEFAULT 'planejamento-previdenciario-v1',
  
  -- Dados Pessoais
  nome_completo TEXT NOT NULL,
  sexo TEXT NOT NULL CHECK (sexo IN ('Masculino', 'Feminino', 'Outro/Prefiro não informar')),
  data_nascimento TEXT NOT NULL,
  vinculo TEXT NOT NULL CHECK (vinculo IN ('Servidor Público', 'Carteira Assinada (CLT)')),
  pessoa_com_deficiencia BOOLEAN NOT NULL,
  grau_deficiencia TEXT CHECK (grau_deficiencia IN ('Leve', 'Moderado', 'Grave') OR grau_deficiencia IS NULL),
  insalubridade_ou_especial BOOLEAN NOT NULL,
  professor BOOLEAN NOT NULL,
  policial BOOLEAN NOT NULL,
  bombeiro_militar BOOLEAN NOT NULL,
  email_cliente TEXT NOT NULL,
  cpf TEXT NOT NULL,
  
  -- Serviço Público (pode ser NULL para CLT)
  origem_funcional TEXT CHECK (origem_funcional IN ('Federal', 'Estadual', 'Municipal') OR origem_funcional IS NULL),
  uf TEXT,
  municipio TEXT,
  data_ingresso_servico_publico TEXT,
  tempo_carreira_anos INTEGER DEFAULT 0,
  tempo_carreira_meses INTEGER DEFAULT 0,
  tempo_carreira_dias INTEGER DEFAULT 0,
  tempo_cargo_anos INTEGER DEFAULT 0,
  tempo_cargo_meses INTEGER DEFAULT 0,
  tempo_cargo_dias INTEGER DEFAULT 0,
  tempo_afastamento_anos INTEGER DEFAULT 0,
  tempo_afastamento_meses INTEGER DEFAULT 0,
  tempo_afastamento_dias INTEGER DEFAULT 0,
  
  -- Tempo de Contribuição
  tempo_comum_anos INTEGER NOT NULL DEFAULT 0,
  tempo_comum_meses INTEGER NOT NULL DEFAULT 0,
  tempo_comum_dias INTEGER NOT NULL DEFAULT 0,
  tempo_magisterio_anos INTEGER DEFAULT 0,
  tempo_magisterio_meses INTEGER DEFAULT 0,
  tempo_magisterio_dias INTEGER DEFAULT 0,
  tempo_fora_magisterio_anos INTEGER DEFAULT 0,
  tempo_fora_magisterio_meses INTEGER DEFAULT 0,
  tempo_fora_magisterio_dias INTEGER DEFAULT 0,
  tempo_especial_insalubre_anos INTEGER DEFAULT 0,
  tempo_especial_insalubre_meses INTEGER DEFAULT 0,
  tempo_especial_insalubre_dias INTEGER DEFAULT 0,
  tempo_policial_anos INTEGER DEFAULT 0,
  tempo_policial_meses INTEGER DEFAULT 0,
  tempo_policial_dias INTEGER DEFAULT 0,
  policial_civil_ou_federal BOOLEAN DEFAULT FALSE,
  policial_militar_ou_bombeiro BOOLEAN DEFAULT FALSE,
  tempo_pcd_anos INTEGER DEFAULT 0,
  tempo_pcd_meses INTEGER DEFAULT 0,
  tempo_pcd_dias INTEGER DEFAULT 0,
  
  -- Metadados
  ip TEXT,
  user_agent TEXT,
  recaptcha_score DECIMAL(3,2),
  versao INTEGER NOT NULL DEFAULT 1,
  
  -- Índices únicos para evitar duplicidade
  CONSTRAINT unique_cpf UNIQUE (cpf),
  CONSTRAINT unique_email UNIQUE (email_cliente)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_planejamento_criado_em ON public.planejamento_previdenciario(criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_planejamento_cpf ON public.planejamento_previdenciario(cpf);
CREATE INDEX IF NOT EXISTS idx_planejamento_email ON public.planejamento_previdenciario(email_cliente);

-- Habilitar Row Level Security (mas sem políticas, acesso apenas via servidor)
ALTER TABLE public.planejamento_previdenciario ENABLE ROW LEVEL SECURITY;

-- Política para acesso de serviço (sem JWT, apenas via edge functions)
CREATE POLICY "Acesso via service role apenas"
  ON public.planejamento_previdenciario
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Comentários na tabela
COMMENT ON TABLE public.planejamento_previdenciario IS 'Armazena dados de formulários de planejamento previdenciário com proteção contra duplicidade';
COMMENT ON CONSTRAINT unique_cpf ON public.planejamento_previdenciario IS 'Impede cadastro duplicado pelo mesmo CPF';
COMMENT ON CONSTRAINT unique_email ON public.planejamento_previdenciario IS 'Impede cadastro duplicado pelo mesmo email';