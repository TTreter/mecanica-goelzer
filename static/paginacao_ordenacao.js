
// ========== SISTEMA DE PAGINAÇÃO E ORDENAÇÃO (ADAPTADO) ==========
// Versão 2.0 - Paginar e ordenar listas localmente com dados da API

console.log("📄 Sistema de paginação e ordenação carregado e adaptado!");

// ========== ESTADO DA PAGINAÇÃO ==========

window.estadoPaginacao = {
    clientes: { paginaAtual: 1, itensPorPagina: 10, ordenacao: { campo: "nome", ordem: "asc" } },
    veiculos: { paginaAtual: 1, itensPorPagina: 10, ordenacao: { campo: "placa", ordem: "asc" } },
    servicos: { paginaAtual: 1, itensPorPagina: 10, ordenacao: { campo: "descricao", ordem: "asc" } },
    pecas: { paginaAtual: 1, itensPorPagina: 10, ordenacao: { campo: "descricao", ordem: "asc" } },
    ordens: { paginaAtual: 1, itensPorPagina: 10, ordenacao: { campo: "data_abertura", ordem: "desc" } },
    movimentacoes: { paginaAtual: 1, itensPorPagina: 10, ordenacao: { campo: "data", ordem: "desc" } },
    agendamentos: { paginaAtual: 1, itensPorPagina: 10, ordenacao: { campo: "data", ordem: "asc" } },
    despesasGerais: { paginaAtual: 1, itensPorPagina: 10, ordenacao: { campo: "data", ordem: "desc" } },
    compras: { paginaAtual: 1, itensPorPagina: 10, ordenacao: { campo: "data", ordem: "desc" } },
    ferramentas: { paginaAtual: 1, itensPorPagina: 10, ordenacao: { campo: "nome", ordem: "asc" } }
};

// ========== FUNÇÕES DE ORDENAÇÃO ==========

window.ordenarArray = function(array, campo, ordem = "asc") {
    return array.sort((a, b) => {
        let valorA = a[campo];
        let valorB = b[campo];
        
        // Tratar valores nulos ou indefinidos
        if (valorA === undefined || valorA === null) valorA = "";
        if (valorB === undefined || valorB === null) valorB = "";

        // Converter para minúsculas se for string
        if (typeof valorA === "string") valorA = valorA.toLowerCase();
        if (typeof valorB === "string") valorB = valorB.toLowerCase();
        
        if (ordem === "asc") {
            return valorA > valorB ? 1 : valorA < valorB ? -1 : 0;
        } else {
            return valorA < valorB ? 1 : valorA > valorB ? -1 : 0;
        }
    });
};

window.alternarOrdenacao = function(entidade, campo) {
    const estado = estadoPaginacao[entidade];
    
    if (estado.ordenacao.campo === campo) {
        // Alternar ordem
        estado.ordenacao.ordem = estado.ordenacao.ordem === "asc" ? "desc" : "asc";
    } else {
        // Novo campo
        estado.ordenacao.campo = campo;
        estado.ordenacao.ordem = "asc";
    }
    
    // Resetar para primeira página
    estado.paginaAtual = 1;
    
    // Chamar a função de renderização apropriada (que agora usa os dados locais)
    switch(entidade) {
        case "clientes":
            renderizarTabela("clientes", "clientesBody", criarLinhaCliente);
            break;
        case "veiculos":
            renderizarTabela("veiculos", "veiculosBody", criarLinhaVeiculo);
            break;
        case "servicos":
            renderizarTabela("servicos", "servicosBody", criarLinhaServico, true);
            break;
        case "pecas":
            renderizarTabela("pecas", "pecasBody", criarLinhaPeca, true);
            break;
        case "ordens":
            renderizarTabela("ordens", "ordensBody", criarLinhaOrdem);
            break;
        case "movimentacoes":
            renderizarTabela("movimentacoes", "movimentacoesBody", criarLinhaMovimentacao);
            break;
        case "agendamentos":
            renderizarTabela("agendamentos", "agendamentosBody", criarLinhaAgendamento);
            break;
        case "despesasGerais":
            renderizarTabela("despesasGerais", "despesasBody", criarLinhaDespesa);
            break;
        case "compras":
            renderizarTabela("compras", "comprasBody", criarLinhaCompra);
            break;
        case "ferramentas":
            renderizarTabela("ferramentas", "ferramentasBody", criarLinhaFerramenta);
            break;
    }
};

// ========== FUNÇÕES DE PAGINAÇÃO ==========

window.paginarArray = function(array, pagina, itensPorPagina) {
    const inicio = (pagina - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return array.slice(inicio, fim);
};

window.mudarPagina = function(entidade, novaPagina) {
    const estado = estadoPaginacao[entidade];
    estado.paginaAtual = novaPagina;
    
    // Chamar a função de renderização apropriada
    switch(entidade) {
        case "clientes":
            renderizarTabela("clientes", "clientesBody", criarLinhaCliente);
            break;
        case "veiculos":
            renderizarTabela("veiculos", "veiculosBody", criarLinhaVeiculo);
            break;
        case "servicos":
            renderizarTabela("servicos", "servicosBody", criarLinhaServico, true);
            break;
        case "pecas":
            renderizarTabela("pecas", "pecasBody", criarLinhaPeca, true);
            break;
        case "ordens":
            renderizarTabela("ordens", "ordensBody", criarLinhaOrdem);
            break;
        case "movimentacoes":
            renderizarTabela("movimentacoes", "movimentacoesBody", criarLinhaMovimentacao);
            break;
        case "agendamentos":
            renderizarTabela("agendamentos", "agendamentosBody", criarLinhaAgendamento);
            break;
        case "despesasGerais":
            renderizarTabela("despesasGerais", "despesasBody", criarLinhaDespesa);
            break;
        case "compras":
            renderizarTabela("compras", "comprasBody", criarLinhaCompra);
            break;
        case "ferramentas":
            renderizarTabela("ferramentas", "ferramentasBody", criarLinhaFerramenta);
            break;
    }
};

window.renderizarControlesPaginacao = function(entidade, totalItens) {
    const estado = estadoPaginacao[entidade];
    const totalPaginas = Math.ceil(totalItens / estado.itensPorPagina);
    
    if (totalPaginas <= 1) return ""; // Não mostrar paginação se só tem 1 página
    
    let html = "<div class=\"paginacao\">\n";
    
    // Botão anterior
    if (estado.paginaAtual > 1) {
        html += `<button onclick=\"mudarPagina(\'${entidade}\', ${estado.paginaAtual - 1})\" class=\"btn-paginacao\">← Anterior</button>\n`;
    }
    
    // Números das páginas
    html += "<span class=\"paginas\">\n";
    
    // Sempre mostrar primeira página
    if (estado.paginaAtual > 3) {
        html += `<button onclick=\"mudarPagina(\'${entidade}\', 1)\" class=\"btn-pagina\">1</button>\n`;
        if (estado.paginaAtual > 4) {
            html += "<span>...</span>\n";
        }
    }
    
    // Páginas ao redor da atual
    for (let i = Math.max(1, estado.paginaAtual - 2); i <= Math.min(totalPaginas, estado.paginaAtual + 2); i++) {
        if (i === estado.paginaAtual) {
            html += `<button class=\"btn-pagina ativa\">${i}</button>\n`;
        } else {
            html += `<button onclick=\"mudarPagina(\'${entidade}\', ${i})\" class=\"btn-pagina\">${i}</button>\n`;
        }
    }
    
    // Sempre mostrar última página
    if (estado.paginaAtual < totalPaginas - 2) {
        if (estado.paginaAtual < totalPaginas - 3) {
            html += "<span>...</span>\n";
        }
        html += `<button onclick=\"mudarPagina(\'${entidade}\', ${totalPaginas})\" class=\"btn-pagina\">${totalPaginas}</button>\n`;
    }
    
    html += "</span>\n";
    
    // Botão próximo
    if (estado.paginaAtual < totalPaginas) {
        html += `<button onclick=\"mudarPagina(\'${entidade}\', ${estado.paginaAtual + 1})\" class=\"btn-paginacao\">Próximo →</button>\n`;
    }
    
    // Info
    html += `<span class=\"info-paginacao\">Página ${estado.paginaAtual} de ${totalPaginas} (${totalItens} itens)</span>\n`;
    
    html += "</div>\n";
    
    return html;
};

// ========== ADICIONAR ÍCONES DE ORDENAÇÃO NAS TABELAS ==========

window.adicionarIconesOrdenacao = function() {
    // Adicionar clique nos cabeçalhos de tabela
    document.querySelectorAll("th[data-sortable]").forEach(th => {
        const entidade = th.dataset.entidade;
        const campo = th.dataset.campo;
        
        if (!entidade || !campo) return;
        
        th.style.cursor = "pointer";
        th.style.userSelect = "none";
        
        // Adicionar ícone
        if (!th.querySelector(".sort-icon")) {
            const icon = document.createElement("span");
            icon.className = "sort-icon";
            icon.innerHTML = " ⇅";
            th.appendChild(icon);
        }
        
        // Adicionar evento de clique
        th.onclick = function() {
            alternarOrdenacao(entidade, campo);
            
            // Atualizar ícones
            document.querySelectorAll(`th[data-entidade="${entidade}"] .sort-icon`).forEach(i => {
                i.innerHTML = " ⇅";
            });
            
            const estado = estadoPaginacao[entidade];
            if (estado.ordenacao.campo === campo) {
                const icon = this.querySelector(".sort-icon");
                icon.innerHTML = estado.ordenacao.ordem === "asc" ? " ↑" : " ↓";
            }
        };
    });
};

// ========== CSS PARA PAGINAÇÃO ==========

const style = document.createElement("style");
style.textContent = `
.paginacao {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin: 20px 0;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 8px;
}

.btn-paginacao, .btn-pagina {
    padding: 8px 12px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-paginacao:hover, .btn-pagina:hover {
    background: #e0e0e0;
}

.btn-pagina.ativa {
    background: var(--primary-color, #2196F3);
    color: white;
    border-color: var(--primary-color, #2196F3);
}

.paginas {
    display: flex;
    gap: 5px;
    align-items: center;
}

.info-paginacao {
    font-size: 14px;
    color: #666;
    margin-left: 10px;
}

.sort-icon {
    font-size: 12px;
    color: #999;
}

th[data-sortable]:hover {
    background: rgba(0,0,0,0.05);
}
`;
document.head.appendChild(style);

// ========== INICIALIZAÇÃO ==========

// A função adicionarIconesOrdenacao() será chamada em app.js após o carregamento inicial de dados.

console.log("✅ Sistema de paginação e ordenação inicializado!");

