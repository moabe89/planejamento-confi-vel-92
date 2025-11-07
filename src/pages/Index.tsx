import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ProgressBar';
import { Etapa1DadosPessoais } from '@/components/etapas/Etapa1DadosPessoais';
import { Etapa2ServicoPublico } from '@/components/etapas/Etapa2ServicoPublico';
import { Etapa3TempoContribuicao } from '@/components/etapas/Etapa3TempoContribuicao';
import { Etapa4Revisao } from '@/components/etapas/Etapa4Revisao';
import { ArrowLeft, ArrowRight, CheckCircle, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { FormularioData, FormularioErrors } from '@/types/formulario';
import { INITIAL_FORM_DATA } from '@/types/formulario';
import { validarCPF, validarDataBR, validarEmail, validarIdadeMinima } from '@/lib/validations';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY = 'planejamento-previdenciario-draft';

const Index = () => {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [formData, setFormData] = useState<FormularioData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormularioErrors>({
    dadosPessoais: {},
    servicoPublico: {},
    tempoContribuicao: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // AutoSave
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao carregar rascunho', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Definir valor padrão "Moderado" quando PcD é selecionado
  useEffect(() => {
    if (formData.dadosPessoais.pessoaComDeficiencia && !formData.dadosPessoais.grauDeficiencia) {
      setFormData(prev => ({
        ...prev,
        dadosPessoais: {
          ...prev.dadosPessoais,
          grauDeficiencia: 'Moderado'
        }
      }));
    }
  }, [formData.dadosPessoais.pessoaComDeficiencia]);

  const totalEtapas = formData.dadosPessoais.vinculo === 'Servidor Público' ? 4 : 3;

  const handleNext = async () => {
    if (await validarEtapa()) {
      const proximaEtapa = formData.dadosPessoais.vinculo === 'Carteira Assinada (CLT)' && etapaAtual === 1
        ? 3
        : etapaAtual + 1;
      setEtapaAtual(proximaEtapa);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    const etapaAnterior = formData.dadosPessoais.vinculo === 'Carteira Assinada (CLT)' && etapaAtual === 3
      ? 1
      : etapaAtual - 1;
    setEtapaAtual(etapaAnterior);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetificar = () => {
    setEtapaAtual(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validarEtapa = async (): Promise<boolean> => {
    const newErrors: FormularioErrors = {
      dadosPessoais: {},
      servicoPublico: {},
      tempoContribuicao: {},
    };

    if (etapaAtual === 1) {
      const dp = formData.dadosPessoais;
      if (!dp.nomeCompleto.trim()) newErrors.dadosPessoais.nomeCompleto = 'Campo obrigatório';
      if (!dp.sexo) newErrors.dadosPessoais.sexo = 'Campo obrigatório';
      if (!dp.dataNascimento) {
        newErrors.dadosPessoais.dataNascimento = 'Campo obrigatório';
      } else if (!validarDataBR(dp.dataNascimento)) {
        newErrors.dadosPessoais.dataNascimento = 'Data inválida';
      } else if (!validarIdadeMinima(dp.dataNascimento)) {
        newErrors.dadosPessoais.dataNascimento = 'Idade mínima: 16 anos';
      }
      if (!dp.vinculo) newErrors.dadosPessoais.vinculo = 'Campo obrigatório';
      if (!dp.emailCliente || !validarEmail(dp.emailCliente)) {
        newErrors.dadosPessoais.emailCliente = 'E-mail inválido';
      }
      if (!dp.cpf || !validarCPF(dp.cpf)) {
        newErrors.dadosPessoais.cpf = 'CPF inválido';
      }
      if (dp.professor === null) newErrors.dadosPessoais.professor = 'Campo obrigatório';
      if (dp.professor === true && !dp.professorTipo) {
        newErrors.dadosPessoais.professorTipo = 'Campo obrigatório';
      }
      if (dp.pessoaComDeficiencia === null) newErrors.dadosPessoais.pessoaComDeficiencia = 'Campo obrigatório';
      if (dp.insalubridadeOuEspecial === null) newErrors.dadosPessoais.insalubridadeOuEspecial = 'Campo obrigatório';
      if (dp.policial === null) newErrors.dadosPessoais.policial = 'Campo obrigatório';
      if (dp.bombeiroMilitar === null) newErrors.dadosPessoais.bombeiroMilitar = 'Campo obrigatório';
      
      // Verificar se já existe formulário com esse CPF
      if (dp.cpf && validarCPF(dp.cpf)) {
        const { data: existingForm } = await supabase
          .from('formularios_submetidos')
          .select('id')
          .eq('cpf', dp.cpf)
          .single();
        
        if (existingForm) {
          newErrors.dadosPessoais.cpf = 'Este CPF já possui um formulário enviado';
          toast({
            title: 'Formulário já enviado',
            description: 'Já existe um formulário enviado com este CPF.',
            variant: 'destructive',
          });
        }
      }
    }

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((section) => Object.keys(section).length > 0);

    if (hasErrors) {
      toast({
        title: 'Atenção',
        description: 'Corrija os erros antes de continuar.',
        variant: 'destructive',
      });
    }

    return !hasErrors;
  };

  const handleSubmit = async () => {
    if (!formData.consentimentoLGPD) {
      setErrors({ ...errors, geral: 'Você deve aceitar os termos' });
      toast({
        title: 'Consentimento necessário',
        description: 'É necessário aceitar os termos para continuar.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Salvar no banco de dados
      const { error: dbError } = await supabase
        .from('formularios_submetidos')
        .insert([{
          nome_completo: formData.dadosPessoais.nomeCompleto,
          cpf: formData.dadosPessoais.cpf,
          email_cliente: formData.dadosPessoais.emailCliente,
          dados_completos: formData as any,
        }]);

      if (dbError) {
        console.error('Erro ao salvar formulário:', dbError);
        toast({
          title: 'Erro ao salvar',
          description: 'Não foi possível salvar seus dados. Tente novamente.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Enviar emails - mapeando para snake_case
      const { error: emailError } = await supabase.functions.invoke('enviar-confirmacao-formulario', {
        body: {
          nome_completo: formData.dadosPessoais.nomeCompleto,
          email_cliente: formData.dadosPessoais.emailCliente,
          sexo: formData.dadosPessoais.sexo,
          data_nascimento: formData.dadosPessoais.dataNascimento,
          cpf: formData.dadosPessoais.cpf,
          vinculo: formData.dadosPessoais.vinculo,
          uf: formData.servicoPublico?.uf,
          municipio: formData.servicoPublico?.municipio,
          professor: formData.dadosPessoais.professor || false,
          professorTipo: formData.dadosPessoais.professorTipo,
          pessoaComDeficiencia: formData.dadosPessoais.pessoaComDeficiencia || false,
          grauDeficiencia: formData.dadosPessoais.grauDeficiencia,
          insalubridadeOuEspecial: formData.dadosPessoais.insalubridadeOuEspecial || false,
          policial: formData.dadosPessoais.policial || false,
          bombeiroMilitar: formData.dadosPessoais.bombeiroMilitar || false,
          servicoPublico: formData.servicoPublico ? {
            origem: formData.servicoPublico.origemFuncional,
            dataIngressoServicoPublico: formData.servicoPublico.dataIngressoServicoPublico,
            tempoCarreira: formData.servicoPublico.tempoCarreira,
            tempoCargo: formData.servicoPublico.tempoCargo,
            tempoAfastamento: formData.servicoPublico.tempoAfastamentoNaoRemunerado,
          } : undefined,
          tempoContribuicao: {
            tempoComum: formData.tempoContribuicao.comum,
            tempoMagisterio: formData.tempoContribuicao.magisterio,
            tempoForaMagisterio: formData.tempoContribuicao.remuneradoForaMagisterio,
            tempoEspecialInsalubre: formData.tempoContribuicao.especialInsalubre,
            tempoPolicial: formData.tempoContribuicao.policial,
            tempoPCD: formData.tempoContribuicao.pcd,
          },
        },
      });

      if (emailError) {
        console.error('Erro ao enviar emails:', emailError);
        toast({
          title: 'Dados salvos',
          description: 'Seus dados foram salvos, mas houve um problema ao enviar os emails de confirmação.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Sucesso!',
          description: 'Seus dados foram enviados e você receberá um email de confirmação.',
        });
      }

      localStorage.removeItem(STORAGE_KEY);
      window.location.href = '/obrigado';
    } catch (error) {
      console.error('Erro ao processar formulário:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao processar seus dados. Tente novamente.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-[hsl(262.1_83.3%_57.8%)] mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 bg-clip-text">
            Planejamento Previdenciário
          </h1>
          <p className="text-muted-foreground text-lg">
            Preencha o formulário e receba seu planejamento personalizado
          </p>
        </header>

        <div className="bg-card rounded-2xl shadow-[0_20px_50px_-12px_hsl(var(--primary)_/_0.15)] border border-border/50 p-8 md:p-10 mb-6 animate-fade-in backdrop-blur-sm">
          <ProgressBar currentStep={etapaAtual} totalSteps={totalEtapas} className="mb-8" />

          {etapaAtual === 1 && (
            <Etapa1DadosPessoais
              data={formData.dadosPessoais}
              errors={errors.dadosPessoais}
              onChange={(field, value) =>
                setFormData((prev) => ({
                  ...prev,
                  dadosPessoais: { ...prev.dadosPessoais, [field]: value },
                }))
              }
              onValidate={() => {}}
            />
          )}

          {etapaAtual === 2 && (
            <Etapa2ServicoPublico
              data={formData.servicoPublico}
              errors={errors.servicoPublico}
              onChange={(field, value) =>
                setFormData((prev) => ({
                  ...prev,
                  servicoPublico: { ...prev.servicoPublico, [field]: value },
                }))
              }
              onValidate={() => {}}
            />
          )}

          {etapaAtual === 3 && (
            <Etapa3TempoContribuicao
              data={formData.tempoContribuicao}
              dadosPessoais={formData.dadosPessoais}
              errors={errors.tempoContribuicao}
              onChange={(field, value) =>
                setFormData({ ...formData, tempoContribuicao: { ...formData.tempoContribuicao, [field]: value } })
              }
              onValidate={() => {}}
            />
          )}

          {etapaAtual === 4 && (
            <Etapa4Revisao
              data={formData}
              consentimentoLGPD={formData.consentimentoLGPD}
              onConsentimentoChange={(checked) =>
                setFormData({ ...formData, consentimentoLGPD: checked })
              }
              errorConsentimento={errors.geral}
              onRetificar={handleRetificar}
            />
          )}

          <div className="flex justify-between items-center mt-10 pt-8 border-t border-border/50">
            {etapaAtual > 1 ? (
              <Button onClick={handleBack} variant="outline" size="lg" className="rounded-lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            ) : (
              <div />
            )}

            {etapaAtual < totalEtapas ? (
              <Button onClick={handleNext} size="lg" className="rounded-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Próxima Etapa
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} size="lg" className="rounded-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <CheckCircle className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Enviando...' : 'Confirmo os Dados'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
