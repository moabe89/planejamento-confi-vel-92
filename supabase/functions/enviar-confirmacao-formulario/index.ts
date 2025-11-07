import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FormularioData {
  nome_completo: string;
  email_cliente: string;
  sexo: string;
  data_nascimento: string;
  cpf: string;
  vinculo: string;
  uf?: string;
  municipio?: string;
  professor: boolean;
  professorTipo?: string;
  pessoaComDeficiencia: boolean;
  grauDeficiencia?: string;
  insalubridadeOuEspecial: boolean;
  policial: boolean;
  bombeiroMilitar: boolean;
  servicoPublico?: any;
  tempoContribuicao?: any;
}

const escapeHtml = (unsafe: string | undefined): string => {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const formatarBooleano = (valor: boolean): string => {
  return valor ? "Sim" : "Não";
};

const formatarTempo = (tempo: any): string => {
  if (!tempo) return "0 anos, 0 meses, 0 dias";
  const anos = tempo.anos || 0;
  const meses = tempo.meses || 0;
  const dias = tempo.dias || 0;
  return `${anos} anos, ${meses} meses, ${dias} dias`;
};

const gerarEmailTexto = (data: FormularioData): string => {
  let texto = `DADOS DO FORMULÁRIO DE PLANEJAMENTO PREVIDENCIÁRIO\n\n`;
  texto += `=== DADOS PESSOAIS ===\n`;
  texto += `Nome Completo: ${data.nome_completo}\n`;
  texto += `CPF: ${data.cpf}\n`;
  texto += `Email: ${data.email_cliente}\n`;
  texto += `Sexo: ${data.sexo}\n`;
  texto += `Data de Nascimento: ${data.data_nascimento}\n`;
  texto += `Vínculo: ${data.vinculo}\n`;
  
  const municipioUf = [data.municipio, data.uf].filter(Boolean).join(' - ');
  if (municipioUf) texto += `Município: ${municipioUf}\n`;
  
  texto += `\n=== INFORMAÇÕES ESPECÍFICAS ===\n`;
  texto += `É ou foi professor: ${formatarBooleano(data.professor)}\n`;
  if (data.professor && data.professorTipo) {
    texto += `Tipo de professor: ${data.professorTipo}\n`;
  }
  texto += `Pessoa com Deficiência: ${formatarBooleano(data.pessoaComDeficiencia)}\n`;
  if (data.pessoaComDeficiencia && data.grauDeficiencia) {
    texto += `Grau de Deficiência: ${data.grauDeficiencia}\n`;
  }
  texto += `Atividade Insalubre ou Especial: ${formatarBooleano(data.insalubridadeOuEspecial)}\n`;
  texto += `Policial: ${formatarBooleano(data.policial)}\n`;
  texto += `Bombeiro Militar: ${formatarBooleano(data.bombeiroMilitar)}\n`;

  if (data.servicoPublico && data.vinculo === "Servidor Público") {
    texto += `\n=== SERVIÇO PÚBLICO ===\n`;
    texto += `Origem: ${data.servicoPublico.origem || "Não informado"}\n`;
    texto += `Data de Ingresso: ${data.servicoPublico.dataIngressoServicoPublico || "Não informado"}\n`;
    texto += `Tempo na Carreira: ${formatarTempo(data.servicoPublico.tempoCarreira)}\n`;
    texto += `Tempo no Cargo: ${formatarTempo(data.servicoPublico.tempoCargo)}\n`;
    texto += `Tempo de Afastamento: ${formatarTempo(data.servicoPublico.tempoAfastamento)}\n`;
  }

  if (data.tempoContribuicao) {
    texto += `\n=== TEMPO DE CONTRIBUIÇÃO ===\n`;
    texto += `Tempo Comum: ${formatarTempo(data.tempoContribuicao.tempoComum)}\n`;
    
    if (data.professor) {
      texto += `Tempo no Magistério: ${formatarTempo(data.tempoContribuicao.tempoMagisterio)}\n`;
      texto += `Tempo Fora do Magistério: ${formatarTempo(data.tempoContribuicao.tempoForaMagisterio)}\n`;
    }
    
    if (data.insalubridadeOuEspecial) {
      texto += `Tempo Especial/Insalubre: ${formatarTempo(data.tempoContribuicao.tempoEspecialInsalubre)}\n`;
    }
    
    if (data.policial) {
      texto += `Tempo como Policial: ${formatarTempo(data.tempoContribuicao.tempoPolicial)}\n`;
    }
    
    if (data.pessoaComDeficiencia) {
      texto += `Tempo como PcD: ${formatarTempo(data.tempoContribuicao.tempoPCD)}\n`;
    }
  }

  return texto;
};

const gerarEmailHTML = (data: FormularioData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .section-title { color: #7c3aed; font-size: 18px; font-weight: bold; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb; }
        .field { margin-bottom: 12px; }
        .field-label { font-weight: 600; color: #6b7280; }
        .field-value { color: #111827; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Planejamento Previdenciário</h1>
        <p>Confirmação de Dados Recebidos</p>
      </div>
      
      <div class="content">
        <p style="font-size: 16px; margin-bottom: 20px;">Olá, <strong>${escapeHtml(data.nome_completo)}</strong>!</p>
        <p style="margin-bottom: 20px;">Seu planejamento será realizado em breve conforme os dados abaixo:</p>
        
        <div class="section">
          <div class="section-title">Dados Pessoais</div>
          <div class="field"><span class="field-label">Nome Completo:</span> <span class="field-value">${escapeHtml(data.nome_completo)}</span></div>
          <div class="field"><span class="field-label">CPF:</span> <span class="field-value">${escapeHtml(data.cpf)}</span></div>
          <div class="field"><span class="field-label">Email:</span> <span class="field-value">${escapeHtml(data.email_cliente)}</span></div>
          <div class="field"><span class="field-label">Sexo:</span> <span class="field-value">${escapeHtml(data.sexo)}</span></div>
          <div class="field"><span class="field-label">Data de Nascimento:</span> <span class="field-value">${escapeHtml(data.data_nascimento)}</span></div>
          <div class="field"><span class="field-label">Vínculo:</span> <span class="field-value">${escapeHtml(data.vinculo)}</span></div>
          ${(data.uf || data.municipio) ? `<div class="field"><span class="field-label">Município:</span> <span class="field-value">${escapeHtml([data.municipio, data.uf].filter(Boolean).join(' - '))}</span></div>` : ''}
        </div>

        <div class="section">
          <div class="section-title">Informações Específicas</div>
          <div class="field"><span class="field-label">É ou foi professor:</span> <span class="field-value">${formatarBooleano(data.professor)}</span></div>
          ${data.professor && data.professorTipo ? `<div class="field"><span class="field-label">Tipo de professor:</span> <span class="field-value">${escapeHtml(data.professorTipo)}</span></div>` : ''}
          <div class="field"><span class="field-label">Pessoa com Deficiência:</span> <span class="field-value">${formatarBooleano(data.pessoaComDeficiencia)}</span></div>
          ${data.pessoaComDeficiencia && data.grauDeficiencia ? `<div class="field"><span class="field-label">Grau de Deficiência:</span> <span class="field-value">${escapeHtml(data.grauDeficiencia)}</span></div>` : ''}
          <div class="field"><span class="field-label">Atividade Insalubre ou Especial:</span> <span class="field-value">${formatarBooleano(data.insalubridadeOuEspecial)}</span></div>
          <div class="field"><span class="field-label">Policial:</span> <span class="field-value">${formatarBooleano(data.policial)}</span></div>
          <div class="field"><span class="field-label">Bombeiro Militar:</span> <span class="field-value">${formatarBooleano(data.bombeiroMilitar)}</span></div>
        </div>

        ${data.servicoPublico && data.vinculo === "Servidor Público" ? `
          <div class="section">
            <div class="section-title">Serviço Público</div>
            <div class="field"><span class="field-label">Origem:</span> <span class="field-value">${escapeHtml(data.servicoPublico.origem) || "Não informado"}</span></div>
            <div class="field"><span class="field-label">Data de Ingresso:</span> <span class="field-value">${escapeHtml(data.servicoPublico.dataIngressoServicoPublico) || "Não informado"}</span></div>
            <div class="field"><span class="field-label">Tempo na Carreira:</span> <span class="field-value">${formatarTempo(data.servicoPublico.tempoCarreira)}</span></div>
            <div class="field"><span class="field-label">Tempo no Cargo:</span> <span class="field-value">${formatarTempo(data.servicoPublico.tempoCargo)}</span></div>
            <div class="field"><span class="field-label">Tempo de Afastamento:</span> <span class="field-value">${formatarTempo(data.servicoPublico.tempoAfastamento)}</span></div>
          </div>
        ` : ''}

        ${data.tempoContribuicao ? `
          <div class="section">
            <div class="section-title">Tempo de Contribuição</div>
            <div class="field"><span class="field-label">Tempo Comum:</span> <span class="field-value">${formatarTempo(data.tempoContribuicao.tempoComum)}</span></div>
            ${data.professor ? `
              <div class="field"><span class="field-label">Tempo no Magistério:</span> <span class="field-value">${formatarTempo(data.tempoContribuicao.tempoMagisterio)}</span></div>
              <div class="field"><span class="field-label">Tempo Fora do Magistério:</span> <span class="field-value">${formatarTempo(data.tempoContribuicao.tempoForaMagisterio)}</span></div>
            ` : ''}
            ${data.insalubridadeOuEspecial ? `<div class="field"><span class="field-label">Tempo Especial/Insalubre:</span> <span class="field-value">${formatarTempo(data.tempoContribuicao.tempoEspecialInsalubre)}</span></div>` : ''}
            ${data.policial ? `<div class="field"><span class="field-label">Tempo como Policial:</span> <span class="field-value">${formatarTempo(data.tempoContribuicao.tempoPolicial)}</span></div>` : ''}
            ${data.pessoaComDeficiencia ? `<div class="field"><span class="field-label">Tempo como PcD:</span> <span class="field-value">${formatarTempo(data.tempoContribuicao.tempoPCD)}</span></div>` : ''}
          </div>
        ` : ''}

        <div class="footer">
          <p>Este é um email automático. Por favor, não responda.</p>
          <p>Em caso de dúvidas, entre em contato através de nossos canais oficiais.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: FormularioData = await req.json();
    console.log("Enviando emails de confirmação para:", data.email_cliente);

    // Email em texto para o escritório
    const emailTexto = gerarEmailTexto(data);
    
    // Email em HTML para o cliente
    const emailHTML = gerarEmailHTML(data);

    // Enviar email para o escritório (Resend em modo teste só envia para o email verificado)
    const emailEscritorio = await resend.emails.send({
      from: "Planejamento Previdenciário <onboarding@resend.dev>",
      to: "moabe.a.sousa@gmail.com", // Mudado para string e usando o email verificado
      subject: `Novo Formulário - ${escapeHtml(data.nome_completo)}`,
      text: emailTexto,
    });

    console.log("Email para escritório enviado:", emailEscritorio);

    // Enviar email para o cliente (também para o email verificado no modo teste)
    const emailCliente = await resend.emails.send({
      from: "Planejamento Previdenciário <onboarding@resend.dev>",
      to: data.email_cliente || "moabe.a.sousa@gmail.com", // Mudado para string com fallback
      subject: "Dados confirmados para o Planejamento",
      html: emailHTML,
    });

    console.log("Email para cliente enviado:", emailCliente);

    return new Response(
      JSON.stringify({ 
        success: true,
        emailEscritorio,
        emailCliente 
      }), 
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Erro ao enviar emails:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
