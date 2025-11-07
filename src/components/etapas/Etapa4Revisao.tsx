import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { formatarTempo } from '@/lib/validations';
import type { FormularioData } from '@/types/formulario';
import { Separator } from '@/components/ui/separator';
import { Edit } from 'lucide-react';

interface Etapa4Props {
  data: FormularioData;
  consentimentoLGPD: boolean;
  onConsentimentoChange: (checked: boolean) => void;
  errorConsentimento?: string;
  onRetificar: () => void;
}

export const Etapa4Revisao: React.FC<Etapa4Props> = ({
  data,
  consentimentoLGPD,
  onConsentimentoChange,
  errorConsentimento,
  onRetificar,
}) => {
  const { dadosPessoais, servicoPublico, tempoContribuicao } = data;
  const isServidorPublico = dadosPessoais.vinculo === 'Servidor Público';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Revisão dos Dados</h2>
        <p className="text-muted-foreground">
          Confira atentamente todas as informações antes de enviar.
        </p>
      </div>

      {/* Dados Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Nome Completo</p>
            <p className="font-medium">{dadosPessoais.nomeCompleto}</p>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Sexo</p>
              <p className="font-medium">{dadosPessoais.sexo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data de Nascimento</p>
              <p className="font-medium">{dadosPessoais.dataNascimento}</p>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground">Vínculo</p>
            <p className="font-medium">{dadosPessoais.vinculo}</p>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">E-mail</p>
              <p className="font-medium">{dadosPessoais.emailCliente}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CPF</p>
              <p className="font-medium">{dadosPessoais.cpf}</p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Pessoa com Deficiência</p>
              <p className="font-medium">
                {dadosPessoais.pessoaComDeficiencia ? `Sim (${dadosPessoais.grauDeficiencia})` : 'Não'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Atividade Insalubre/Especial</p>
              <p className="font-medium">{dadosPessoais.insalubridadeOuEspecial ? 'Sim' : 'Não'}</p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Professor</p>
              <p className="font-medium">{dadosPessoais.professor ? 'Sim' : 'Não'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Policial</p>
              <p className="font-medium">{dadosPessoais.policial ? 'Sim' : 'Não'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bombeiro Militar</p>
              <p className="font-medium">{dadosPessoais.bombeiroMilitar ? 'Sim' : 'Não'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Serviço Público (apenas se for servidor) */}
      {isServidorPublico && (
        <Card>
          <CardHeader>
            <CardTitle>Dados do Serviço Público</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Origem Funcional</p>
              <p className="font-medium">{servicoPublico.origemFuncional}</p>
            </div>
            {servicoPublico.uf && (
              <>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">UF</p>
                    <p className="font-medium">{servicoPublico.uf}</p>
                  </div>
                  {servicoPublico.municipio && (
                    <div>
                      <p className="text-sm text-muted-foreground">Município</p>
                      <p className="font-medium">{servicoPublico.municipio}</p>
                    </div>
                  )}
                </div>
              </>
            )}
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Data de Ingresso</p>
              <p className="font-medium">{servicoPublico.dataIngressoServicoPublico}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Tempo de Carreira</p>
              <p className="font-medium">{formatarTempo(servicoPublico.tempoCarreira)}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Tempo no Cargo</p>
              <p className="font-medium">{formatarTempo(servicoPublico.tempoCargo)}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tempo de Contribuição */}
      <Card>
        <CardHeader>
          <CardTitle>Tempo de Contribuição</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Tempo Comum</p>
            <p className="font-medium">{formatarTempo(tempoContribuicao.comum)}</p>
          </div>
          
          {dadosPessoais.professor && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Tempo no Magistério</p>
                <p className="font-medium">{formatarTempo(tempoContribuicao.magisterio)}</p>
              </div>
            </>
          )}
          
          {dadosPessoais.insalubridadeOuEspecial && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Tempo Especial/Insalubre</p>
                <p className="font-medium">{formatarTempo(tempoContribuicao.especialInsalubre)}</p>
              </div>
            </>
          )}
          
          {dadosPessoais.policial && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Tempo Policial</p>
                <p className="font-medium">{formatarTempo(tempoContribuicao.policial)}</p>
              </div>
            </>
          )}
          
          {dadosPessoais.pessoaComDeficiencia && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Tempo como PcD</p>
                <p className="font-medium">{formatarTempo(tempoContribuicao.pcd)}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Consentimento LGPD */}
      <Card className={errorConsentimento ? 'border-destructive' : ''}>
        <CardHeader>
          <CardTitle>Consentimento e Termos</CardTitle>
          <CardDescription>
            É necessário seu consentimento para processamento dos dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-3">
            <Checkbox
              id="consentimento"
              checked={consentimentoLGPD}
              onCheckedChange={onConsentimentoChange}
              aria-invalid={!!errorConsentimento}
            />
            <div className="space-y-1">
              <Label
                htmlFor="consentimento"
                className="text-sm font-normal leading-relaxed cursor-pointer"
              >
                Declaro que li e concordo com a{' '}
                <a
                  href="/privacidade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Política de Privacidade
                </a>
                {' '}e os{' '}
                <a
                  href="/termos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Termos de Uso
                </a>
                , e autorizo o tratamento dos meus dados pessoais conforme a LGPD.
              </Label>
              {errorConsentimento && (
                <p className="text-xs text-destructive animate-slide-in" role="alert">
                  {errorConsentimento}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão Retificar */}
      <div className="flex justify-center">
        <Button onClick={onRetificar} variant="outline" size="lg" className="rounded-lg">
          <Edit className="w-4 h-4 mr-2" />
          Retificar Dados
        </Button>
      </div>
    </div>
  );
};
