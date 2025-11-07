import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Obrigado = () => {
  const [nomeUsuario, setNomeUsuario] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // Recuperar o nome do usuário do localStorage
    const dadosLocalStorage = localStorage.getItem("formularioPrevidenciario");
    if (dadosLocalStorage) {
      try {
        const dados = JSON.parse(dadosLocalStorage);
        setNomeUsuario(dados.nome_completo || "");
      } catch (error) {
        console.error("Erro ao recuperar dados:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-card rounded-2xl shadow-xl p-8 md:p-12 text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <CheckCircle2 className="w-16 h-16 text-primary" />
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Informações Recebidas!
        </h1>
        
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg">
            {nomeUsuario && (
              <>
                Obrigado, <span className="font-semibold text-foreground">{nomeUsuario}</span>!
              </>
            )}
          </p>
          <p className="text-lg">
            Seus dados foram recebidos com sucesso. Em breve você receberá seu planejamento previdenciário personalizado.
          </p>
          <p className="text-base">
            Fique atento ao seu e-mail para mais informações sobre os próximos passos.
          </p>
        </div>

        <div className="pt-6">
          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="min-w-[200px]"
          >
            Voltar ao Início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Obrigado;
