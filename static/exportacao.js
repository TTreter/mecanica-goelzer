
// ========== SISTEMA DE EXPORTAÇÃO (ADAPTADO PARA API) ==========
// Versão 2.0 - Exportar dados para CSV via API

console.log("📤 Sistema de exportação carregado e adaptado para API!");

// ========== FUNÇÕES DE EXPORTAÇÃO CSV ==========

function arrayParaCSV(array, colunas) {
    let csv = ";";
    
    // Cabeçalho
    csv += colunas.map(c => `\"${c.titulo}\"`).join(",") + "\n";
    
    // Dados
    array.forEach(item => {
        const linha = colunas.map(c => {
            let valor = item[c.campo] || "";
            
            // Formatar valor se necessário
            if (c.formato === "moeda") {
                valor = `R$ ${parseFloat(valor).toFixed(2).replace(".", ",")}`;
            } else if (c.formato === "data") {
                valor = valor ? new Date(valor).toLocaleDateString("pt-BR") : "";
            }
            
            // Tratar strings com vírgulas ou aspas
            if (typeof valor === "string" && (valor.includes(",") || valor.includes("\""))) {
                valor = `\"${valor.replace(/\"/g, "\"\"")}\"`;
            }
            return valor;
        });
        csv += linha.join(",") + "\n";
    });
    
    return csv;
}

function baixarCSV(conteudo, nomeArquivo) {
    const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nomeArquivo;
    link.click();
    URL.revokeObjectURL(url);
}

// ========== EXPORTAR CLIENTES ==========

window.exportarClientes = async function() {
    try {
        const clientes = await apiRequest("/api/clientes");
        const colunas = [
            { campo: "nome", titulo: "Nome" },
            { campo: "cpfCnpj", titulo: "CPF/CNPJ" },
            { campo: "telefone", titulo: "Telefone" },
            { campo: "email", titulo: "Email" },
            { campo: "endereco", titulo: "Endereço" }
        ];
        
        const csv = arrayParaCSV(clientes, colunas);
        const dataHora = new Date().toISOString().split("T")[0];
        baixarCSV(csv, `clientes_${dataHora}.csv`);
        
        // notificarSucesso(`${clientes.length} cliente(s) exportado(s) com sucesso!`); // Se houver sistema de notificação
    } catch (error) {
        console.error("Erro ao exportar clientes:", error);
    }
};

// ========== EXPORTAR VEÍCULOS ==========

window.exportarVeiculos = async function() {
    try {
        const [veiculos, clientes] = await Promise.all([
            apiRequest("/api/veiculos"),
            apiRequest("/api/clientes")
        ]);

        const veiculosComCliente = veiculos.map(v => {
            const cliente = clientes.find(c => c.id === v.cliente_id);
            return {
                ...v,
                nomeCliente: cliente ? cliente.nome : "Cliente não encontrado"
            };
        });
        
        const colunas = [
            { campo: "placa", titulo: "Placa" },
            { campo: "marca", titulo: "Marca" },
            { campo: "modelo", titulo: "Modelo" },
            { campo: "ano", titulo: "Ano" },
            { campo: "cor", titulo: "Cor" },
            { campo: "km", titulo: "KM" },
            { campo: "nomeCliente", titulo: "Cliente" }
        ];
        
        const csv = arrayParaCSV(veiculosComCliente, colunas);
        const dataHora = new Date().toISOString().split("T")[0];
        baixarCSV(csv, `veiculos_${dataHora}.csv`);
        
        // notificarSucesso(`${veiculos.length} veículo(s) exportado(s) com sucesso!`);
    } catch (error) {
        console.error("Erro ao exportar veículos:", error);
    }
};

// ========== EXPORTAR SERVIÇOS ==========

window.exportarServicos = async function() {
    try {
        const servicos = await apiRequest("/api/servicos");
        const colunas = [
            { campo: "descricao", titulo: "Descrição" },
            { campo: "categoria", titulo: "Categoria" },
            { campo: "valorMaoObra", titulo: "Valor Mão de Obra", formato: "moeda" },
            { campo: "tempoEstimado", titulo: "Tempo Estimado" }
        ];
        
        const csv = arrayParaCSV(servicos, colunas);
        const dataHora = new Date().toISOString().split("T")[0];
        baixarCSV(csv, `servicos_${dataHora}.csv`);
        
        // notificarSucesso(`${servicos.length} serviço(s) exportado(s) com sucesso!`);
    } catch (error) {
        console.error("Erro ao exportar serviços:", error);
    }
};

// ========== EXPORTAR PEÇAS ==========

window.exportarPecas = async function() {
    try {
        const pecas = await apiRequest("/api/pecas");
        const colunas = [
            { campo: "codigo", titulo: "Código" },
            { campo: "descricao", titulo: "Descrição" },
            { campo: "fornecedor", titulo: "Fornecedor" },
            { campo: "custoUnitario", titulo: "Custo Unitário", formato: "moeda" },
            { campo: "precoVenda", titulo: "Preço Venda", formato: "moeda" },
            { campo: "quantidadeEstoque", titulo: "Estoque" },
            { campo: "estoqueMinimo", titulo: "Estoque Mínimo" }
        ];
        
        const csv = arrayParaCSV(pecas, colunas);
        const dataHora = new Date().toISOString().split("T")[0];
        baixarCSV(csv, `pecas_${dataHora}.csv`);
        
        // notificarSucesso(`${pecas.length} peça(s) exportada(s) com sucesso!`);
    } catch (error) {
        console.error("Erro ao exportar peças:", error);
    }
};

// ========== EXPORTAR ORDENS DE SERVIÇO ==========

window.exportarOrdensServico = async function() {
    try {
        const [ordens, clientes, veiculos] = await Promise.all([
            apiRequest("/api/ordens"),
            apiRequest("/api/clientes"),
            apiRequest("/api/veiculos")
        ]);

        const ordensComDetalhes = ordens.map(os => {
            const cliente = clientes.find(c => c.id === os.cliente_id);
            const veiculo = veiculos.find(v => v.id === os.veiculo_id);
            
            return {
                id: os.id,
                nomeCliente: cliente ? cliente.nome : "",
                placaVeiculo: veiculo ? veiculo.placa : "",
                dataAbertura: os.data_abertura,
                status: os.status,
                total: os.total || 0 // O total pode ser calculado no backend ou no frontend se necessário
            };
        });
        
        const colunas = [
            { campo: "id", titulo: "ID" },
            { campo: "nomeCliente", titulo: "Cliente" },
            { campo: "placaVeiculo", titulo: "Veículo" },
            { campo: "dataAbertura", titulo: "Data Abertura", formato: "data" },
            { campo: "status", titulo: "Status" },
            { campo: "total", titulo: "Valor Total", formato: "moeda" }
        ];
        
        const csv = arrayParaCSV(ordensComDetalhes, colunas);
        const dataHora = new Date().toISOString().split("T")[0];
        baixarCSV(csv, `ordens_servico_${dataHora}.csv`);
        
        // notificarSucesso(`${ordensComDetalhes.length} ordem(ns) de serviço exportada(s) com sucesso!`);
    } catch (error) {
        console.error("Erro ao exportar ordens de serviço:", error);
    }
};

// ========== EXPORTAR MOVIMENTAÇÕES FINANCEIRAS ==========

window.exportarMovimentacoes = async function() {
    try {
        const movimentacoes = await apiRequest("/api/movimentacoes");
        const despesasGerais = await apiRequest("/api/despesasGerais");

        const todasMovimentacoes = [...movimentacoes, ...despesasGerais.map(d => ({...d, tipo: "despesa", descricao: `Despesa Geral: ${d.descricao}`}))];

        const colunas = [
            { campo: "data", titulo: "Data", formato: "data" },
            { campo: "tipo", titulo: "Tipo" },
            { campo: "descricao", titulo: "Descrição" },
            { campo: "valor", titulo: "Valor", formato: "moeda" }
        ];
        
        const csv = arrayParaCSV(todasMovimentacoes, colunas);
        const dataHora = new Date().toISOString().split("T")[0];
        baixarCSV(csv, `movimentacoes_${dataHora}.csv`);
        
        // notificarSucesso(`${todasMovimentacoes.length} movimentação(ões) exportada(s) com sucesso!`);
    } catch (error) {
        console.error("Erro ao exportar movimentações financeiras:", error);
    }
};

// ========== EXPORTAR RELATÓRIO FINANCEIRO ==========

window.exportarRelatorioFinanceiro = async function(ano) {
    try {
        const relatorio = await apiRequest(`/api/relatorios/financeiro-anual/${ano}`);
        
        let csv = "RELATÓRIO FINANCEIRO\n";
        csv += `Período:,${relatorio.ano}\n`;
        csv += `Gerado em:,${new Date().toLocaleString("pt-BR")}\n\n`;
        csv += "RESUMO\n";
        csv += `Total Receitas:,"R$ ${relatorio.receitaAnual.toFixed(2).replace(".", ",")}"\n`;
        csv += `Total Despesas:,"R$ ${relatorio.despesaAnual.toFixed(2).replace(".", ",")}"\n`;
        csv += `Lucro/Prejuízo:,"R$ ${relatorio.lucroAnual.toFixed(2).replace(".", ",")}"\n\n`;
        
        // Para o detalhamento, precisaríamos de uma API específica para movimentações do ano
        // Por simplicidade, este relatório foca apenas no resumo.

        const dataHora = new Date().toISOString().split("T")[0];
        baixarCSV(csv, `relatorio_financeiro_${ano}_${dataHora}.csv`);
        
        // notificarSucesso("Relatório financeiro exportado com sucesso!");
    } catch (error) {
        console.error("Erro ao exportar relatório financeiro:", error);
    }
};

// ========== ADICIONAR BOTÕES DE EXPORTAÇÃO ==========

window.adicionarBotoesExportacao = function() {
    // Clientes
    const clientesHeader = document.querySelector("#clientes .page-header");
    if (clientesHeader && !document.getElementById("btnExportarClientes")) {
        const btn = document.createElement("button");
        btn.id = "btnExportarClientes";
        btn.className = "btn btn-secondary";
        btn.innerHTML = "📤 Exportar CSV";
        btn.onclick = exportarClientes;
        clientesHeader.appendChild(btn);
    }
    
    // Veículos
    const veiculosHeader = document.querySelector("#veiculos .page-header");
    if (veiculosHeader && !document.getElementById("btnExportarVeiculos")) {
        const btn = document.createElement("button");
        btn.id = "btnExportarVeiculos";
        btn.className = "btn btn-secondary";
        btn.innerHTML = "📤 Exportar CSV";
        btn.onclick = exportarVeiculos;
        veiculosHeader.appendChild(btn);
    }
    
    // Serviços
    const servicosHeader = document.querySelector("#servicos .page-header");
    if (servicosHeader && !document.getElementById("btnExportarServicos")) {
        const btn = document.createElement("button");
        btn.id = "btnExportarServicos";
        btn.className = "btn btn-secondary";
        btn.innerHTML = "📤 Exportar CSV";
        btn.onclick = exportarServicos;
        servicosHeader.appendChild(btn);
    }
    
    // Peças
    const pecasHeader = document.querySelector("#pecas .page-header");
    if (pecasHeader && !document.getElementById("btnExportarPecas")) {
        const btn = document.createElement("button");
        btn.id = "btnExportarPecas";
        btn.className = "btn btn-secondary";
        btn.innerHTML = "📤 Exportar CSV";
        btn.onclick = exportarPecas;
        pecasHeader.appendChild(btn);
    }
    
    // Ordens de Serviço
    const osHeader = document.querySelector("#ordens .page-header"); // Corrigido para #ordens
    if (osHeader && !document.getElementById("btnExportarOS")) {
        const btn = document.createElement("button");
        btn.id = "btnExportarOS";
        btn.className = "btn btn-secondary";
        btn.innerHTML = "📤 Exportar CSV";
        btn.onclick = exportarOrdensServico;
        osHeader.appendChild(btn);
    }
    
    // Financeiro (para movimentações)
    const financeiroHeader = document.querySelector("#financeiro .page-header");
    if (financeiroHeader && !document.getElementById("btnExportarMovimentacoes")) {
        const btn = document.createElement("button");
        btn.id = "btnExportarMovimentacoes";
        btn.className = "btn btn-secondary";
        btn.innerHTML = "📤 Exportar CSV";
        btn.onclick = exportarMovimentacoes;
        financeiroHeader.appendChild(btn);
    }

    // Relatórios (botão para relatório financeiro anual)
    const relatoriosCard = document.querySelector("#relatorios .card");
    if (relatoriosCard && !document.getElementById("btnExportarRelatorioFinanceiro")) {
        const form = relatoriosCard.querySelector("form");
        if (form) {
            const btn = document.createElement("button");
            btn.id = "btnExportarRelatorioFinanceiro";
            btn.className = "btn btn-secondary ms-2"; // Adiciona margem
            btn.innerHTML = "📤 Exportar Resumo CSV";
            btn.type = "button"; // Para não submeter o formulário
            btn.onclick = () => {
                const ano = document.getElementById("anoRelatorio").value;
                exportarRelatorioFinanceiro(parseInt(ano));
            };
            form.appendChild(btn);
        }
    }
};

// ========== INICIALIZAÇÃO ==========

// A chamada para adicionarBotoesExportacao() será feita após carregarTodosOsDados() em app.js
// para garantir que os elementos HTML estejam prontos.

console.log("✅ Sistema de exportação inicializado!");

