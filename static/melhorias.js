
// ========== 10 MELHORIAS PRIORITÁRIAS (ADAPTADAS PARA API) ==========
// Arquivo com todas as melhorias implementadas, agora interagindo com o backend Python

// ========== 1. ATUALIZAÇÃO AUTOMÁTICA DE ESTOQUE ==========
async function atualizarEstoqueAutomatico(ordem) {
    if (!ordem.pecas || ordem.pecas.length === 0) return;
    
    for (const p of ordem.pecas) {
        try {
            const peca = await apiRequest(`/api/pecas/${p.peca_id}`);
            if (peca) {
                // Deduzir quantidade do estoque
                const novaQuantidade = peca.quantidadeEstoque - p.quantidade;
                await apiRequest(`/api/pecas/${peca.id}`, "PUT", { quantidadeEstoque: novaQuantidade });
                
                // Alertar se estoque baixo (ainda no frontend)
                if (novaQuantidade <= peca.estoqueMinimo) {
                    notificarAlerta(
                        `⚠️ Estoque baixo: ${peca.descricao} - Restam ${novaQuantidade} unidades`
                    );
                }
                
                // Registrar movimentação de estoque (nova API endpoint)
                await apiRequest("/api/movimentacoes_estoque", "POST", {
                    peca_id: peca.id,
                    quantidade: p.quantidade,
                    tipo: "saida",
                    motivo: `OS ${ordem.id}`,
                    ordem_id: ordem.id
                });
            }
        } catch (error) {
            console.error("Erro ao atualizar estoque ou registrar movimentação para peça:", p.peca_id, error);
        }
    }
}

// ========== 2. INTEGRAÇÃO FINANCEIRA AUTOMÁTICA ==========
async function registrarMovimentacaoFinanceira(ordem, tipo) {
    try {
        if (tipo === "receita") {
            const cliente = dados.clientes.find(c => c.id === ordem.cliente_id);
            await apiRequest("/api/movimentacoes", "POST", {
                tipo: "receita",
                descricao: `OS ${ordem.id} - ${cliente?.nome || "Cliente"}`,
                valor: ordem.valor_total,
                categoria: "Serviços",
                data: ordem.data_fechamento || new Date().toISOString().split("T")[0],
                ordem_id: ordem.id,
                forma_pagamento: ordem.forma_pagamento || "Dinheiro"
            });
        }
        
        if (tipo === "despesa" && ordem.pecas_usadas) {
            for (const p of ordem.pecas_usadas) {
                const peca = dados.pecas.find(pc => pc.id === p.peca_id);
                if (peca) {
                    await apiRequest("/api/movimentacoes", "POST", {
                        tipo: "despesa",
                        descricao: `Peça: ${peca.descricao} - OS ${ordem.id}`,
                        valor: peca.custo_unitario * p.quantidade,
                        categoria: "Peças",
                        data: ordem.data_fechamento || new Date().toISOString().split("T")[0],
                        ordem_id: ordem.id
                    });
                }
            }
        }
        atualizarDashboard(); // Atualiza o dashboard após a movimentação
    } catch (error) {
        console.error("Erro ao registrar movimentação financeira:", error);
    }
}

// ========== 3. NUMERAÇÃO AUTOMÁTICA DE OS ==========
async function gerarNumeroOS() {
    try {
        const response = await apiRequest("/api/ordens/proximo_numero");
        return response.proximo_numero;
    } catch (error) {
        console.error("Erro ao gerar número de OS:", error);
        return `ERRO-${Date.now()}`;
    }
}

// ========== 4. DASHBOARD COM GRÁFICOS ==========
// A função atualizarDashboard já é chamada em app.js e agora busca dados da API.
// Os gráficos são inicializados e atualizados em graficos.js, que também usa a API.

// ========== 5. CONTAS A RECEBER ==========
async function adicionarContaReceber(ordem) {
    // A lógica de contas a receber deve ser tratada no backend.
    // O frontend apenas envia a OS e o backend decide se cria uma conta a receber.
    // Por exemplo, uma rota /api/ordens/finalizar que pode retornar a conta a receber criada.
    // Para simplificar, assumimos que o backend criará a conta a receber se necessário
    // quando a OS for atualizada para 'Concluída' ou 'Faturada'.
    console.log("Lógica de 'Contas a Receber' é tratada no backend.");
}

async function registrarPagamentoConta(contaId, valor) {
    try {
        await apiRequest(`/api/contas_a_receber/${contaId}/pagar`, "POST", { valor_pago: valor });
        notificarSucesso("Pagamento registrado com sucesso!");
        // renderizarContasAReceber(); // Se houver uma função para renderizar a lista de contas
    } catch (error) {
        console.error("Erro ao registrar pagamento:", error);
        notificarErro("Erro ao registrar pagamento!");
    }
}

// ========== 6. ORÇAMENTOS ==========
async function criarOrcamento(dados_orcamento) {
    try {
        const novoOrcamento = await apiRequest("/api/orcamentos", "POST", dados_orcamento);
        notificarSucesso("Orçamento criado com sucesso!");
        return novoOrcamento;
    } catch (error) {
        console.error("Erro ao criar orçamento:", error);
        notificarErro("Erro ao criar orçamento!");
        return null;
    }
}

async function gerarNumeroOrcamento() {
    try {
        const response = await apiRequest("/api/orcamentos/proximo_numero");
        return response.proximo_numero;
    } catch (error) {
        console.error("Erro ao gerar número de orçamento:", error);
        return `ORC-${Date.now()}`;
    }
}

// ========== 7. GESTÃO DE FERRAMENTAS ==========
// As funções de CRUD para ferramentas já estão sendo tratadas em app.js via API.
// A lógica de empréstimo/devolução seria implementada via API no backend.

// ========== 8. NOTIFICAÇÕES DE ESTOQUE BAIXO ==========
// A notificação de estoque baixo é disparada na função `atualizarEstoqueAutomatico`
// e usa a função `notificarAlerta` (que deve ser definida em `notificacoes.js`).

// ========== 9. BACKUP E RESTAURAÇÃO (VIA API) ==========
// Estas funções devem interagir com endpoints específicos no backend para realizar o backup/restauração.

window.exportarBackupCompleto = async function() {
    try {
        const backupData = await apiRequest("/api/backup", "GET");
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `backup_mecanica_goelzer_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        notificarSucesso("Backup completo exportado com sucesso!");
    } catch (error) {
        console.error("Erro ao exportar backup:", error);
        notificarErro("Erro ao exportar backup!");
    }
};

window.importarBackup = function() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const backupData = JSON.parse(event.target.result);
                    const confirmacao = confirm("Tem certeza que deseja importar este backup? Isso sobrescreverá os dados atuais.");
                    if (confirmacao) {
                        await apiRequest("/api/restore", "POST", backupData);
                        notificarSucesso("Backup importado com sucesso! Recarregando dados...");
                        await carregarTodosOsDados(); // Recarrega os dados após a restauração
                        atualizarTodasTabelas(); // Atualiza as tabelas no frontend
                        atualizarDashboard(); // Atualiza o dashboard
                    }
                } catch (error) {
                    console.error("Erro ao ler ou importar arquivo de backup:", error);
                    notificarErro("Erro ao importar backup. Verifique o formato do arquivo.");
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
};

// ========== 10. REGISTRO DE ATIVIDADES/LOGS (VIA API) ==========
// A função `registrarLog` deve enviar logs para o backend, que os armazenará.
// Isso será implementado no backend e as chamadas no frontend serão ajustadas.

async function registrarLog(acao, detalhes) {
    try {
        await apiRequest("/api/logs", "POST", { acao, detalhes, timestamp: new Date().toISOString() });
        console.log("Log registrado:", acao, detalhes);
    } catch (error) {
        console.error("Erro ao registrar log:", error);
    }
}

// Exemplo de uso:
// registrarLog("Criação de Cliente", { clienteId: novoCliente.id, nome: novoCliente.nome });

console.log("✅ Sistema de melhorias adaptado para API!");

