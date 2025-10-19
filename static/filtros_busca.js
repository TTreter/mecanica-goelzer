
// ========== SISTEMA DE FILTROS E BUSCA (ADAPTADO PARA API) ==========
// Versão 2.0 - Filtrar e buscar registros

console.log("🔍 Sistema de filtros e busca carregado e adaptado para API!");

// ========== FUNÇÕES DE BUSCA ==========

/**
 * Busca clientes com base em um termo e renderiza a tabela.
 * @param {string} termo - O termo de busca.
 */
window.buscarClientes = async function(termo) {
    termo = termo ? termo.trim().toLowerCase() : "";
    let clientesFiltrados = dados.clientes; // Usa o cache local de dados

    if (termo) {
        clientesFiltrados = clientesFiltrados.filter(c => 
            (c.nome && c.nome.toLowerCase().includes(termo)) ||
            (c.cpfCnpj && c.cpfCnpj.includes(termo)) ||
            (c.telefone && c.telefone.includes(termo)) ||
            (c.email && c.email.toLowerCase().includes(termo))
        );
    }
    
    renderizarTabela("clientes", "clientesBody", criarLinhaCliente, false, clientesFiltrados);
    // notificarInfo(`${clientesFiltrados.length} cliente(s) encontrado(s)`);
};

/**
 * Busca veículos com base em um termo e renderiza a tabela.
 * @param {string} termo - O termo de busca.
 */
window.buscarVeiculos = async function(termo) {
    termo = termo ? termo.trim().toLowerCase() : "";
    let veiculosFiltrados = dados.veiculos; // Usa o cache local de dados

    if (termo) {
        veiculosFiltrados = veiculosFiltrados.filter(v => 
            (v.placa && v.placa.toLowerCase().includes(termo)) ||
            (v.marca && v.marca.toLowerCase().includes(termo)) ||
            (v.modelo && v.modelo.toLowerCase().includes(termo)) ||
            (v.cor && v.cor.toLowerCase().includes(termo))
        );
    }
    
    renderizarTabela("veiculos", "veiculosBody", criarLinhaVeiculo, false, veiculosFiltrados);
    // notificarInfo(`${veiculosFiltrados.length} veículo(s) encontrado(s)`);
};

/**
 * Busca serviços com base em um termo e renderiza a tabela.
 * @param {string} termo - O termo de busca.
 */
window.buscarServicos = async function(termo) {
    termo = termo ? termo.trim().toLowerCase() : "";
    let servicosFiltrados = dados.servicos; // Usa o cache local de dados

    if (termo) {
        servicosFiltrados = servicosFiltrados.filter(s => 
            (s.descricao && s.descricao.toLowerCase().includes(termo)) ||
            (s.categoria && s.categoria.toLowerCase().includes(termo))
        );
    }
    
    renderizarTabela("servicos", "servicosTable", criarLinhaServico, true, servicosFiltrados);
    // notificarInfo(`${servicosFiltrados.length} serviço(s) encontrado(s)`);
};

/**
 * Busca peças com base em um termo e renderiza a tabela.
 * @param {string} termo - O termo de busca.
 */
window.buscarPecas = async function(termo) {
    termo = termo ? termo.trim().toLowerCase() : "";
    let pecasFiltradas = dados.pecas; // Usa o cache local de dados

    if (termo) {
        pecasFiltradas = pecasFiltradas.filter(p => 
            (p.codigo && p.codigo.toLowerCase().includes(termo)) ||
            (p.descricao && p.descricao.toLowerCase().includes(termo)) ||
            (p.fornecedor && p.fornecedor.toLowerCase().includes(termo))
        );
    }
    
    renderizarTabela("pecas", "pecasTable", criarLinhaPeca, true, pecasFiltradas);
    // notificarInfo(`${pecasFiltradas.length} peça(s) encontrada(s)`);
};

// ========== FUNÇÕES DE FILTRO ==========

/**
 * Filtra ordens de serviço com base em status e datas e renderiza a tabela.
 */
window.filtrarOrdensServico = async function() {
    const statusFiltro = document.getElementById("filtroStatusOS") ? document.getElementById("filtroStatusOS").value : "";
    const dataInicio = document.getElementById("filtroDataInicio") ? document.getElementById("filtroDataInicio").value : "";
    const dataFim = document.getElementById("filtroDataFim") ? document.getElementById("filtroDataFim").value : "";
    
    let ordensFiltradas = dados.ordens; // Usa o cache local de dados
    
    // Filtrar por status
    if (statusFiltro && statusFiltro !== "Todos os Status") {
        ordensFiltradas = ordensFiltradas.filter(os => os.status === statusFiltro);
    }
    
    // Filtrar por data
    if (dataInicio) {
        ordensFiltradas = ordensFiltradas.filter(os => os.data_abertura >= dataInicio);
    }
    
    if (dataFim) {
        ordensFiltradas = ordensFiltradas.filter(os => os.data_abertura <= dataFim);
    }
    
    renderizarTabela("ordens", "ordensBody", criarLinhaOrdem, false, ordensFiltradas);
    // notificarInfo(`${ordensFiltradas.length} ordem(ns) de serviço encontrada(s)`);
};

/**
 * Filtra movimentações financeiras e renderiza a tabela.
 */
window.filtrarMovimentacoes = async function() {
    const tipoFiltro = document.getElementById("filtroTipo") ? document.getElementById("filtroTipo").value : "";
    const categoriaFiltro = document.getElementById("filtroCategoria") ? document.getElementById("filtroCategoria").value : "";
    
    let movimentacoesFiltradas = dados.movimentacoes; // Usa o cache local de dados
    
    // Filtrar por tipo
    if (tipoFiltro && tipoFiltro !== "Todos os Tipos") {
        const tipo = tipoFiltro.toLowerCase().includes("receita") ? "receita" : "despesa";
        movimentacoesFiltradas = movimentacoesFiltradas.filter(m => m.tipo === tipo);
    }
    
    // Filtrar por categoria (se houver no objeto movimentacao)
    if (categoriaFiltro && categoriaFiltro !== "Todas as Categorias") {
        movimentacoesFiltradas = movimentacoesFiltradas.filter(m => m.categoria === categoriaFiltro);
    }
    
    renderizarTabela("movimentacoes", "movimentacoesBody", criarLinhaMovimentacao, false, movimentacoesFiltradas);
    // notificarInfo(`${movimentacoesFiltradas.length} movimentação(ões) encontrada(s)`);
};

/**
 * Filtra agendamentos e renderiza a tabela.
 */
window.filtrarAgendamentos = async function() {
    const statusFiltro = document.getElementById("filtroStatusAgendamento") ? document.getElementById("filtroStatusAgendamento").value : "";
    
    let agendamentosFiltrados = dados.agendamentos; // Usa o cache local de dados
    
    if (statusFiltro && statusFiltro !== "Todos os Status") {
        agendamentosFiltrados = agendamentosFiltrados.filter(a => a.status === statusFiltro);
    }
    
    renderizarTabela("agendamentos", "agendamentosBody", criarLinhaAgendamento, false, agendamentosFiltrados);
    // notificarInfo(`${agendamentosFiltrados.length} agendamento(s) encontrado(s)`);
};

// ========== APLICAR EVENT LISTENERS ==========

// Esta função será chamada uma vez após o DOM estar pronto e os dados carregados.
function configurarListenersBuscaFiltro() {
    console.log("🔍 Aplicando event listeners de busca e filtro...");
    
    // Busca de clientes
    const buscaCliente = document.querySelector("#clientes input[type=\"text\"]");
    if (buscaCliente) {
        buscaCliente.addEventListener("input", function(e) {
            buscarClientes(e.target.value);
        });
        console.log("✅ Busca de clientes ativada");
    }
    
    // Busca de veículos
    const buscaVeiculo = document.querySelector("#veiculos input[type=\"text\"]");
    if (buscaVeiculo) {
        buscaVeiculo.addEventListener("input", function(e) {
            buscarVeiculos(e.target.value);
        });
        console.log("✅ Busca de veículos ativada");
    }
    
    // Busca de serviços
    const buscaServico = document.querySelector("#servicos input[type=\"text\"]");
    if (buscaServico) {
        buscaServico.addEventListener("input", function(e) {
            buscarServicos(e.target.value);
        });
        console.log("✅ Busca de serviços ativada");
    }
    
    // Busca de peças
    const buscaPeca = document.querySelector("#pecas input[type=\"text\"]");
    if (buscaPeca) {
        buscaPeca.addEventListener("input", function(e) {
            buscarPecas(e.target.value);
        });
        console.log("✅ Busca de peças ativada");
    }
    
    // Filtros de Ordens de Serviço
    const filtroStatusOS = document.getElementById("filtroStatusOS");
    if (filtroStatusOS) {
        filtroStatusOS.addEventListener("change", filtrarOrdensServico);
        console.log("✅ Filtro de status OS ativado");
    }
    
    const filtroDataInicio = document.getElementById("filtroDataInicio");
    if (filtroDataInicio) {
        filtroDataInicio.addEventListener("change", filtrarOrdensServico);
        console.log("✅ Filtro de data início ativado");
    }
    
    const filtroDataFim = document.getElementById("filtroDataFim");
    if (filtroDataFim) {
        filtroDataFim.addEventListener("change", filtrarOrdensServico);
        console.log("✅ Filtro de data fim ativado");
    }
    
    // Filtros de Financeiro
    const filtroTipo = document.getElementById("filtroTipo");
    if (filtroTipo) {
        filtroTipo.addEventListener("change", filtrarMovimentacoes);
        console.log("✅ Filtro de tipo ativado");
    }
    
    const filtroCategoria = document.getElementById("filtroCategoria");
    if (filtroCategoria) {
        filtroCategoria.addEventListener("change", filtrarMovimentacoes);
        console.log("✅ Filtro de categoria ativado");
    }
    
    // Filtros de Agendamentos
    const filtroStatusAgendamento = document.getElementById("filtroStatusAgendamento");
    if (filtroStatusAgendamento) {
        filtroStatusAgendamento.addEventListener("change", filtrarAgendamentos);
        console.log("✅ Filtro de status agendamento ativado");
    }
    
    console.log("✅ Event listeners de busca e filtro aplicados!");
}

// A chamada para configurarListenersBuscaFiltro() será feita em app.js após o carregamento inicial de dados.

console.log("✅ Sistema de filtros e busca inicializado!");

