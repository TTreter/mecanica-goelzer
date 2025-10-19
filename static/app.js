
// Sistema de Gestão para Oficina Mecânica - v2.0 com Backend Python/Flask

const API_BASE_URL = 

// ========== ESTRUTURA DE DADOS (CACHE LOCAL) ==========
let dados = {
    clientes: [],
    veiculos: [],
    servicos: [],
    pecas: [],
    ferramentas: [],
    agendamentos: [],
    ordens: [],
    compras: [],
    movimentacoes: [],
    despesasGerais: []
};

// ========== INICIALIZAÇÃO ==========
document.addEventListener("DOMContentLoaded", () => {
    // A função criarModals ainda pode ser útil para gerar o HTML dos modais dinamicamente
    criarModals(); 
    
    // Carrega todos os dados iniciais do backend
    carregarTodosOsDados();

    // Configura listeners de eventos que não dependem de dados dinâmicos
    configurarListenersEstaticos();

    console.log("✅ Sistema (Frontend) carregado com sucesso!");
});

// ========== FUNÇÕES DE API (COMUNICAÇÃO COM O BACKEND) ==========

/**
 * Função genérica para fazer requisições fetch.
 * @param {string} url - A URL da API.
 * @param {string} method - O método HTTP (GET, POST, PUT, DELETE).
 * @param {object} [body=null] - O corpo da requisição para POST/PUT.
 * @returns {Promise<any>} - A resposta da API em JSON.
 */
async function apiRequest(url, method = "GET", body = null) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro na requisição: ${response.statusText}`);
        }
        // Retorna um objeto vazio para respostas 204 No Content (DELETE)
        if (response.status === 204) {
            return {};
        }
        return await response.json();
    } catch (error) {
        console.error(`Falha na API [${method}] ${url}:`, error);
        // Adicionar notificação para o usuário aqui
        alert(`Erro de comunicação com o servidor: ${error.message}`);
        throw error;
    }
}

/**
 * Carrega todos os dados essenciais do backend e atualiza a interface.
 */
async function carregarTodosOsDados() {
    try {
        // Carrega as entidades em paralelo para otimizar o tempo
        const [clientes, veiculos, servicos, pecas, ordens, despesasGerais, ferramentas, agendamentos, compras, movimentacoes] = await Promise.all([
            apiRequest("/api/clientes"),
            apiRequest("/api/veiculos"),
            apiRequest("/api/servicos"),
            apiRequest("/api/pecas"),
            apiRequest("/api/ordens"),
            apiRequest("/api/despesasGerais"),
            apiRequest("/api/ferramentas"),
            apiRequest("/api/agendamentos"),
            apiRequest("/api/compras"),
            apiRequest("/api/movimentacoes"),
        ]);

        // Atualiza o cache de dados local
        dados = { clientes, veiculos, servicos, pecas, ordens, despesasGerais, ferramentas, agendamentos, compras, movimentacoes };

        console.log("✅ Todos os dados foram carregados do backend.");

        // Renderiza todas as seções da UI com os novos dados
        renderizarTudo();
        
        // Atualiza o dashboard
        atualizarDashboard();

    } catch (error) {
        console.error("Falha ao carregar dados iniciais:", error);
    }
}

// ========== RENDERIZAÇÃO (ATUALIZAÇÃO DA UI) ==========

/**
 * Renderiza todas as tabelas e componentes da interface.
 */
function renderizarTudo() {
    console.log("🔄 Renderizando todos os componentes...");
    renderizarTabela("clientes", "clientesBody", criarLinhaCliente);
    renderizarTabela("veiculos", "veiculosBody", criarLinhaVeiculo);
    renderizarTabela("servicos", "servicosTable", criarLinhaServico, true);
    renderizarTabela("pecas", "pecasTable", criarLinhaPeca, true);
    renderizarTabela("ordens", "ordensBody", criarLinhaOrdem);
    // Adicione chamadas para renderizar outras seções (ferramentas, despesas, etc.)
}

/**
 * Função genérica para renderizar uma tabela.
 * @param {string} nomeEntidade - A chave da entidade no objeto `dados` (ex: "clientes").
 * @param {string} idTabelaBody - O ID do `<tbody>` ou do elemento que conterá as linhas.
 * @param {function} funcaoCriarLinha - A função que cria o HTML de uma linha da tabela.
 * @param {boolean} [isHeader=false] - Se a tabela tem um `<thead>` e o ID é da tabela inteira.
 */
function renderizarTabela(nomeEntidade, idTabela, funcaoCriarLinha, isHeader = false) {
    const elemento = document.getElementById(idTabela);
    if (!elemento) {
        console.warn(`Elemento com ID ${idTabela} não encontrado para renderização.`);
        return;
    }

    const corpoTabela = isHeader ? elemento.querySelector("tbody") : elemento;
    if (!corpoTabela) {
        console.warn(`TBODY não encontrado na tabela com ID ${idTabela}.`);
        return;
    }

    corpoTabela.innerHTML = ""; // Limpa a tabela antes de renderizar
    if (dados[nomeEntidade] && dados[nomeEntidade].length > 0) {
        dados[nomeEntidade].forEach(item => {
            corpoTabela.innerHTML += funcaoCriarLinha(item);
        });
    } else {
        const numColunas = corpoTabela.parentElement.querySelector("thead tr").children.length;
        corpoTabela.innerHTML = `<tr><td colspan=\"${numColunas}\" class=\"text-center\">Nenhum item encontrado.</td></tr>`;
    }
}

// Funções para criar linhas de cada tabela
function criarLinhaCliente(cliente) {
    const numVeiculos = dados.veiculos.filter(v => v.cliente_id === cliente.id).length;
    return `
        <tr>
            <td>${cliente.nome}</td>
            <td>${cliente.cpfCnpj || "Não informado"}</td>
            <td>${cliente.telefone || "Não informado"}</td>
            <td>${cliente.email || "Não informado"}</td>
            <td>${numVeiculos}</td>
            <td class=\"acoes\">
                <button class=\"btn-acao editar\" onclick=\"editarCliente(${cliente.id})\">✏️</button>
                <button class=\"btn-acao excluir\" onclick=\"removerItem("clientes", ${cliente.id})\">🗑️</button>
            </td>
        </tr>
    `;
}

function criarLinhaVeiculo(veiculo) {
    const cliente = dados.clientes.find(c => c.id === veiculo.cliente_id);
    return `
        <tr>
            <td>${veiculo.placa}</td>
            <td>${veiculo.marca}</td>
            <td>${veiculo.modelo}</td>
            <td>${veiculo.ano || "-"}</td>
            <td>${cliente ? cliente.nome : "Cliente não encontrado"}</td>
            <td>${veiculo.km || "-"}</td>
            <td class=\"acoes\">
                <button class=\"btn-acao editar\" onclick=\"editarVeiculo(${veiculo.id})\">✏️</button>
                <button class=\"btn-acao excluir\" onclick=\"removerItem("veiculos", ${veiculo.id})\">🗑️</button>
            </td>
        </tr>
    `;
}

function criarLinhaServico(servico) {
    return `
        <tr>
            <td>${servico.descricao}</td>
            <td>${servico.categoria || "-"}</td>
            <td>R$ ${servico.valorMaoObra.toFixed(2)}</td>
            <td>${servico.tempoEstimado || "-"}</td>
            <td class=\"acoes\">
                <button class=\"btn-acao editar\" onclick=\"editarServico(${servico.id})\">✏️</button>
                <button class=\"btn-acao excluir\" onclick=\"removerItem("servicos", ${servico.id})\">🗑️</button>
            </td>
        </tr>
    `;
}

function criarLinhaPeca(peca) {
    return `
        <tr>
            <td>${peca.codigo}</td>
            <td>${peca.descricao}</td>
            <td>${peca.fornecedor || "-"}</td>
            <td>R$ ${peca.precoVenda.toFixed(2)}</td>
            <td>${peca.quantidadeEstoque}</td>
            <td class=\"acoes\">
                <button class=\"btn-acao editar\" onclick=\"editarPeca(${peca.id})\">✏️</button>
                <button class=\"btn-acao excluir\" onclick=\"removerItem("pecas", ${peca.id})\">🗑️</button>
            </td>
        </tr>
    `;
}

function criarLinhaOrdem(ordem) {
    const cliente = dados.clientes.find(c => c.id === ordem.cliente_id);
    const veiculo = dados.veiculos.find(v => v.id === ordem.veiculo_id);
    return `
        <tr>
            <td>${ordem.id}</td>
            <td>${cliente ? cliente.nome : "-"}</td>
            <td>${veiculo ? `${veiculo.modelo} (${veiculo.placa})` : "-"}</td>
            <td>${new Date(ordem.data_abertura).toLocaleDateString()}</td>
            <td><span class=\"status ${ordem.status.toLowerCase()}\">${ordem.status}</span></td>
            <td>R$ ${ordem.total ? ordem.total.toFixed(2) : "0.00"}</td>
            <td class=\"acoes\">
                <button class=\"btn-acao visualizar\" onclick=\"visualizarOrdem(${ordem.id})\">👁️</button>
                <button class=\"btn-acao editar\" onclick=\"editarOrdem(${ordem.id})\">✏️</button>
                <button class=\"btn-acao excluir\" onclick=\"removerItem("ordens", ${ordem.id})\">🗑️</button>
            </td>
        </tr>
    `;
}


// ========== FUNÇÕES DE CRUD (CLIENT-SIDE) ==========

/**
 * Função genérica para remover um item, com confirmação.
 * @param {string} nomeEntidade - O nome da entidade (ex: "clientes").
 * @param {number} id - O ID do item a ser removido.
 */
async function removerItem(nomeEntidade, id) {
    const confirmacao = confirm(`Tem certeza que deseja excluir este item? A ação não pode ser desfeita.`);
    if (confirmacao) {
        try {
            await apiRequest(`/api/${nomeEntidade}/${id}`, "DELETE");
            console.log(`✅ Item ${id} da entidade ${nomeEntidade} removido com sucesso.`);
            // Recarrega os dados para refletir a remoção
            await carregarTodosOsDados(); 
        } catch (error) {
            console.error(`Falha ao remover item:`, error);
        }
    }
}

// --- Clientes ---
async function salvarCliente(event) {
    event.preventDefault();
    const id = document.getElementById("clienteId").value;
    const cliente = {
        nome: document.getElementById("clienteNome").value,
        cpfCnpj: document.getElementById("clienteCpfCnpj").value,
        telefone: document.getElementById("clienteTelefone").value,
        email: document.getElementById("clienteEmail").value,
        endereco: document.getElementById("clienteEndereco").value,
    };

    const url = id ? `/api/clientes/${id}` : "/api/clientes";
    const method = id ? "PUT" : "POST";

    try {
        await apiRequest(url, method, cliente);
        fecharModal("clienteModal");
        await carregarTodosOsDados();
    } catch (error) {
        console.error("Falha ao salvar cliente:", error);
    }
}

function editarCliente(id) {
    const cliente = dados.clientes.find(c => c.id === id);
    if (cliente) {
        document.getElementById("clienteId").value = cliente.id;
        document.getElementById("clienteNome").value = cliente.nome;
        document.getElementById("clienteCpfCnpj").value = cliente.cpfCnpj;
        document.getElementById("clienteTelefone").value = cliente.telefone;
        document.getElementById("clienteEmail").value = cliente.email;
        document.getElementById("clienteEndereco").value = cliente.endereco;
        document.getElementById("clienteModalTitle").textContent = "Editar Cliente";
        openModal("clienteModal");
    }
}

// --- Veículos ---
async function salvarVeiculo(event) {
    event.preventDefault();
    const id = document.getElementById("veiculoId").value;
    const veiculo = {
        cliente_id: parseInt(document.getElementById("veiculoCliente").value),
        placa: document.getElementById("veiculoPlaca").value,
        marca: document.getElementById("veiculoMarca").value,
        modelo: document.getElementById("veiculoModelo").value,
        ano: document.getElementById("veiculoAno").value,
        cor: document.getElementById("veiculoCor").value,
        km: document.getElementById("veiculoKm").value,
    };

    const url = id ? `/api/veiculos/${id}` : "/api/veiculos";
    const method = id ? "PUT" : "POST";

    try {
        await apiRequest(url, method, veiculo);
        fecharModal("veiculoModal");
        await carregarTodosOsDados();
    } catch (error) {
        console.error("Falha ao salvar veículo:", error);
    }
}

function editarVeiculo(id) {
    const veiculo = dados.veiculos.find(v => v.id === id);
    if (veiculo) {
        document.getElementById("veiculoId").value = veiculo.id;
        preencherSelectClientes(veiculo.cliente_id);
        document.getElementById("veiculoPlaca").value = veiculo.placa;
        document.getElementById("veiculoMarca").value = veiculo.marca;
        document.getElementById("veiculoModelo").value = veiculo.modelo;
        document.getElementById("veiculoAno").value = veiculo.ano;
        document.getElementById("veiculoCor").value = veiculo.cor;
        document.getElementById("veiculoKm").value = veiculo.km;
        document.getElementById("veiculoModalTitle").textContent = "Editar Veículo";
        openModal("veiculoModal");
    }
}

// Adicione as funções salvar e editar para as outras entidades (Serviços, Peças, etc.) seguindo o mesmo padrão.


// ========== DASHBOARD ==========
async function atualizarDashboard() {
    try {
        const data = await apiRequest("/api/dashboard");
        document.getElementById("totalClientes").textContent = data.totalClientes;
        document.getElementById("totalVeiculos").textContent = data.totalVeiculos;
        document.getElementById("ordensAbertas").textContent = data.osAbertas;
        document.getElementById("receitaMensal").textContent = `R$ ${data.receitaMensal.toFixed(2)}`;
        document.getElementById("despesaMensal").textContent = `R$ ${data.despesaMensal.toFixed(2)}`;
        document.getElementById("lucroMensal").textContent = `R$ ${data.lucroMensal.toFixed(2)}`;
        console.log("✅ Dashboard atualizado com dados do backend.");
    } catch (error) {
        console.error("Falha ao atualizar dashboard:", error);
    }
}


// ========== NAVEGAÇÃO E MODAIS (UTILITÁRIOS) ==========

function showPage(pageId, event) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });
    document.getElementById(pageId).classList.remove("hidden");

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });
    if (event && event.currentTarget) {
        event.currentTarget.classList.add("active");
    }
}

function openModal(modalId) {
    // Limpa o formulário ao abrir para um novo item
    if (!document.getElementById(`${modalId.replace("Modal", "")}Id`).value) {
        document.querySelector(`#${modalId} form`).reset();
        document.getElementById(`${modalId.replace("Modal", "")}Id`).value = "";
        document.getElementById(`${modalId.replace("Modal", "")}ModalTitle`).textContent = `Novo ${modalId.replace("Modal", "")}`;
    }
    
    // Preenche selects dinâmicos
    if (modalId === "veiculoModal") {
        preencherSelectClientes();
    }
    
    document.getElementById(modalId).style.display = "block";
}

function fecharModal(modalId) {
    const form = document.querySelector(`#${modalId} form`);
    if (form) {
        form.reset();
    }
    // Limpa o campo de ID oculto
    const idField = modalId.replace("Modal", "") + "Id";
    if (document.getElementById(idField)) {
        document.getElementById(idField).value = "";
    }
    document.getElementById(modalId).style.display = "none";
}

function preencherSelectClientes(selectedId = null) {
    const select = document.getElementById("veiculoCliente");
    select.innerHTML = "<option value=\"\">Selecione um cliente</option>";
    dados.clientes.forEach(cliente => {
        const selected = cliente.id === selectedId ? " selected" : "";
        select.innerHTML += `<option value=\"" + cliente.id + "\"${selected}>${cliente.nome}</option>`;
    });
}

function configurarListenersEstaticos() {
    // Fechar modais ao clicar fora
    window.onclick = function(event) {
        if (event.target.classList.contains("modal")) {
            fecharModal(event.target.id);
        }
    }
}

// A função criarModals pode ser mantida como está, pois ela apenas cria a estrutura HTML.
// As chamadas onsubmit agora chamarão as novas funções assíncronas (ex: salvarCliente).
function criarModals() {
    const container = document.getElementById("modalContainer");
    if (!container) return;
    container.innerHTML = `
        <!-- Modal Cliente -->
        <div id=\"clienteModal\" class=\"modal\"><div class=\"modal-content\"><div class=\"modal-header\"><h2 id=\"clienteModalTitle\">Novo Cliente</h2><span class=\"close\" onclick=\"fecharModal("clienteModal")\">&times;</span></div><form onsubmit=\"salvarCliente(event)\"><input type=\"hidden\" id=\"clienteId\"><div class=\"form-group\"><label>Nome *</label><input type=\"text\" id=\"clienteNome\" required></div><div class=\"form-row\"><div class=\"form-group\"><label>CPF/CNPJ</label><input type=\"text\" id=\"clienteCpfCnpj\"></div><div class=\"form-group\"><label>Telefone</label><input type=\"text\" id=\"clienteTelefone\"></div></div><div class=\"form-group\"><label>Email</label><input type=\"email\" id=\"clienteEmail\"></div><div class=\"form-group\"><label>Endereço</label><textarea id=\"clienteEndereco\"></textarea></div><div class=\"modal-actions\"><button type=\"submit\" class=\"btn btn-primary\">Salvar</button><button type=\"button\" class=\"btn btn-secondary\" onclick=\"fecharModal("clienteModal")\">Cancelar</button></div></form></div></div>
        
        <!-- Modal Veículo -->
        <div id=\"veiculoModal\" class=\"modal\"><div class=\"modal-content\"><div class=\"modal-header\"><h2 id=\"veiculoModalTitle\">Novo Veículo</h2><span class=\"close\" onclick=\"fecharModal("veiculoModal")\">&times;</span></div><form onsubmit=\"salvarVeiculo(event)\"><input type=\"hidden\" id=\"veiculoId\"><div class=\"form-group\"><label>Cliente *</label><select id=\"veiculoCliente\" required></select></div><div class=\"form-row\"><div class=\"form-group\"><label>Placa *</label><input type=\"text\" id=\"veiculoPlaca\" required></div><div class=\"form-group\"><label>Marca *</label><input type=\"text\" id=\"veiculoMarca\" required></div></div><div class=\"form-row\"><div class=\"form-group\"><label>Modelo *</label><input type=\"text\" id=\"veiculoModelo\" required></div><div class=\"form-group\"><label>Ano</label><input type=\"number\" id=\"veiculoAno\"></div></div><div class=\"form-row\"><div class=\"form-group\"><label>Cor</label><input type=\"text\" id=\"veiculoCor\"></div><div class=\"form-group\"><label>KM Atual</label><input type=\"number\" id=\"veiculoKm\"></div></div><div class=\"modal-actions\"><button type=\"submit\" class=\"btn btn-primary\">Salvar</button><button type=\"button\" class=\"btn btn-secondary\" onclick=\"fecharModal("veiculoModal")\">Cancelar</button></div></form></div></div>
        
        <!-- Outros modais (Serviço, Peça, etc.) aqui -->
    `;
}

