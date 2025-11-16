// Sistema de Gestão para Oficina Mecânica - Completo e Integrado
// Armazenamento local no navegador (localStorage)

// ========== ESTRUTURA DE DADOS ==========
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
document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    criarModals();
    inicializarNavegacao();
    atualizarDashboard();
    renderizarTudo();
    
    // Inicializar melhorias após carregar dados
    if (typeof inicializarMelhorias === 'function') {
        inicializarMelhorias();
    }
    
    console.log('✅ Sistema carregado com sucesso!');
});

// Inicializar navegação também após um pequeno delay para garantir que o DOM está pronto
setTimeout(() => {
    if (document.querySelectorAll('.nav-item').length > 0) {
        inicializarNavegacao();
    }
}, 500);

// ========== FUNÇÕES DE ARMAZENAMENTO ==========
function carregarDados() {
    const salvos = localStorage.getItem('oficinaCompleta');
    if (salvos) {
        dados = JSON.parse(salvos);
        if (!dados.agendamentos) dados.agendamentos = [];
        if (!dados.despesasGerais) dados.despesasGerais = [];
    } else {
        // Dados de exemplo
        inicializarDadosExemplo();
    }
}

function salvarDados() {
    localStorage.setItem('oficinaCompleta', JSON.stringify(dados));
    atualizarDashboard();
}

function inicializarDadosExemplo() {
    // Serviços padrão
    dados.servicos = [
        { id: 1, descricao: 'Troca de Óleo', categoria: 'Manutenção', valorMaoObra: 50, tempoEstimado: '30 min' },
        { id: 2, descricao: 'Alinhamento', categoria: 'Suspensão', valorMaoObra: 80, tempoEstimado: '1 hora' },
        { id: 3, descricao: 'Balanceamento', categoria: 'Suspensão', valorMaoObra: 60, tempoEstimado: '45 min' },
        { id: 4, descricao: 'Troca de Pastilhas de Freio', categoria: 'Freios', valorMaoObra: 120, tempoEstimado: '1.5 horas' },
        { id: 5, descricao: 'Revisão Completa', categoria: 'Manutenção', valorMaoObra: 200, tempoEstimado: '3 horas' }
    ];
    
    // Peças padrão
    dados.pecas = [
        { id: 1, codigo: 'P001', descricao: 'Óleo 5W30', fornecedor: 'Petrobras', custoUnitario: 25, precoVenda: 45, quantidadeEstoque: 50, estoqueMinimo: 10 },
        { id: 2, codigo: 'P002', descricao: 'Filtro de Óleo', fornecedor: 'Mann', custoUnitario: 15, precoVenda: 30, quantidadeEstoque: 30, estoqueMinimo: 5 },
        { id: 3, codigo: 'P003', descricao: 'Pastilha de Freio', fornecedor: 'Bosch', custoUnitario: 80, precoVenda: 150, quantidadeEstoque: 20, estoqueMinimo: 5 },
        { id: 4, codigo: 'P004', descricao: 'Disco de Freio', fornecedor: 'Bosch', custoUnitario: 120, precoVenda: 220, quantidadeEstoque: 15, estoqueMinimo: 3 }
    ];
    
    salvarDados();
}

// ========== NAVEGAÇÃO ==========
function showPage(pageId, event) {
    console.log('Navegando para:', pageId);
    
    // Ocultar todas as páginas
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // Mostrar a página selecionada
    const pageElement = document.getElementById(pageId);
    if (pageElement) {
        pageElement.classList.remove('hidden');
    } else {
        console.error('Página não encontrada:', pageId);
        return;
    }
    
    // Atualizar o item de navegação ativo
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Marcar o item de navegação como ativo
    const navItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
    
    // Renderizar o conteúdo da página
    renderizarTudo();
    
    console.log('✅ Navegação concluída para:', pageId);
}

// ========== INICIALIZAR EVENT LISTENERS DE NAVEGAÇÃO ==========
function inicializarNavegacao() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                showPage(pageId);
            }
        });
    });
    console.log('✅ Event listeners de navegação inicializados');
}

// ========== MODAL ==========
function criarModals() {
    const container = document.getElementById('modalContainer');
    
    // Modal Cliente
    container.innerHTML += `
        <div id="clienteModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="clienteModalTitle">Novo Cliente</h2>
                    <span class="close" onclick="fecharModal('clienteModal')">&times;</span>
                </div>
                <form onsubmit="salvarCliente(event)">
                    <input type="hidden" id="clienteId">
                    <div class="form-group">
                        <label>Nome *</label>
                        <input type="text" id="clienteNome" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>CPF/CNPJ *</label>
                            <input type="text" id="clienteCpfCnpj" required>
                        </div>
                        <div class="form-group">
                            <label>Telefone</label>
                            <input type="text" id="clienteTelefone">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="clienteEmail">
                    </div>
                    <div class="form-group">
                        <label>Endereço</label>
                        <textarea id="clienteEndereco"></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="submit" class="btn btn-primary">Salvar</button>
                        <button type="button" class="btn btn-secondary" onclick="fecharModal('clienteModal')">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Modal Veículo
    container.innerHTML += `
        <div id="veiculoModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="veiculoModalTitle">Novo Veículo</h2>
                    <span class="close" onclick="fecharModal('veiculoModal')">&times;</span>
                </div>
                <form onsubmit="salvarVeiculo(event)">
                    <input type="hidden" id="veiculoId">
                    <div class="form-group">
                        <label>Cliente *</label>
                        <select id="veiculoCliente" required></select>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Placa *</label>
                            <input type="text" id="veiculoPlaca" required>
                        </div>
                        <div class="form-group">
                            <label>Marca *</label>
                            <input type="text" id="veiculoMarca" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Modelo *</label>
                            <input type="text" id="veiculoModelo" required>
                        </div>
                        <div class="form-group">
                            <label>Ano</label>
                            <input type="number" id="veiculoAno">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Cor</label>
                            <input type="text" id="veiculoCor">
                        </div>
                        <div class="form-group">
                            <label>KM Atual</label>
                            <input type="number" id="veiculoKm">
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button type="submit" class="btn btn-primary">Salvar</button>
                        <button type="button" class="btn btn-secondary" onclick="fecharModal('veiculoModal')">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Modal Serviço
    container.innerHTML += `
        <div id="servicoModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="servicoModalTitle">Novo Serviço</h2>
                    <span class="close" onclick="fecharModal('servicoModal')">&times;</span>
                </div>
                <form onsubmit="salvarServico(event)">
                    <input type="hidden" id="servicoId">
                    <div class="form-group">
                        <label>Descrição *</label>
                        <input type="text" id="servicoDescricao" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Categoria</label>
                            <input type="text" id="servicoCategoria" list="categorias">
                            <datalist id="categorias">
                                <option value="Manutenção">
                                <option value="Freios">
                                <option value="Suspensão">
                                <option value="Motor">
                                <option value="Elétrica">
                            </datalist>
                        </div>
                        <div class="form-group">
                            <label>Valor Mão de Obra *</label>
                            <input type="number" step="0.01" id="servicoValor" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Tempo Estimado</label>
                        <input type="text" id="servicoTempo" placeholder="Ex: 1 hora">
                    </div>
                    <div class="modal-actions">
                        <button type="submit" class="btn btn-primary">Salvar</button>
                        <button type="button" class="btn btn-secondary" onclick="fecharModal('servicoModal')">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Modal Peça
    container.innerHTML += `
        <div id="pecaModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="pecaModalTitle">Nova Peça</h2>
                    <span class="close" onclick="fecharModal('pecaModal')">&times;</span>
                </div>
                <form onsubmit="salvarPeca(event)">
                    <input type="hidden" id="pecaId">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Código *</label>
                            <input type="text" id="pecaCodigo" required>
                        </div>
                        <div class="form-group">
                            <label>Descrição *</label>
                            <input type="text" id="pecaDescricao" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Fornecedor</label>
                        <input type="text" id="pecaFornecedor">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Custo Unitário *</label>
                            <input type="number" step="0.01" id="pecaCusto" required>
                        </div>
                        <div class="form-group">
                            <label>Preço Venda *</label>
                            <input type="number" step="0.01" id="pecaPreco" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Quantidade em Estoque</label>
                            <input type="number" id="pecaEstoque" value="0">
                        </div>
                        <div class="form-group">
                            <label>Estoque Mínimo</label>
                            <input type="number" id="pecaMinimo" value="5">
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button type="submit" class="btn btn-primary">Salvar</button>
                        <button type="button" class="btn btn-secondary" onclick="fecharModal('pecaModal')">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Modal Ferramenta
    container.innerHTML += `
        <div id="ferramentaModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="ferramentaModalTitle">Nova Ferramenta</h2>
                    <span class="close" onclick="fecharModal('ferramentaModal')">&times;</span>
                </div>
                <form onsubmit="salvarFerramenta(event)">
                    <input type="hidden" id="ferramentaId">
                    <div class="form-group">
                        <label>Descrição *</label>
                        <input type="text" id="ferramentaDescricao" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Marca</label>
                            <input type="text" id="ferramentaMarca">
                        </div>
                        <div class="form-group">
                            <label>Número de Série</label>
                            <input type="text" id="ferramentaSerie">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Data Aquisição</label>
                            <input type="date" id="ferramentaData">
                        </div>
                        <div class="form-group">
                            <label>Valor Aquisição</label>
                            <input type="number" step="0.01" id="ferramentaValor">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select id="ferramentaStatus">
                            <option value="Disponível">Disponível</option>
                            <option value="Em Uso">Em Uso</option>
                            <option value="Manutenção">Manutenção</option>
                        </select>
                    </div>
                    <div class="modal-actions">
                        <button type="submit" class="btn btn-primary">Salvar</button>
                        <button type="button" class="btn btn-secondary" onclick="fecharModal('ferramentaModal')">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    
    // Carregar selects se necessário
    if (modalId === 'veiculoModal' || modalId === 'ordemModal') {
        carregarClientesSelect();
    }
    if (modalId === 'ordemModal') {
        carregarServicosSelect();
        carregarPecasSelect();
    }
}

function fecharModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.querySelector(`#${modalId} form`).reset();
    // Limpar ID hidden
    const idInput = document.querySelector(`#${modalId} input[type="hidden"]`);
    if (idInput) idInput.value = '';
}

// ========== TEMA ==========
function toggleTheme() {
    document.body.classList.toggle('dark');
    const btn = document.querySelector('.theme-toggle');
    btn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    localStorage.setItem('tema', document.body.classList.contains('dark') ? 'dark' : 'light');
}

// Carregar tema salvo
const temaSalvo = localStorage.getItem('tema');
if (temaSalvo === 'dark') {
    document.body.classList.add('dark');
    document.querySelector('.theme-toggle').textContent = '☀️';
}

// ========== UTILITÁRIOS ==========
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor || 0);
}

function formatarData(data) {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
}

function formatarDataHora(data) {
    if (!data) return '-';
    return new Date(data).toLocaleString('pt-BR');
}

function gerarId() {
    return Date.now() + Math.random();
}

function filtrarTabela(tableId, termo) {
    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName('tr');
    
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const texto = row.textContent.toLowerCase();
        row.style.display = texto.includes(termo.toLowerCase()) ? '' : 'none';
    }
}

// Continua no próximo arquivo...



// ========== CLIENTES ==========
async function salvarCliente(event) {
    event.preventDefault();
    
    const id = document.getElementById('clienteId').value;
    const cliente = {
        id: id ? parseInt(id) : gerarId(),
        nome: document.getElementById('clienteNome').value,
        cpfCnpj: document.getElementById('clienteCpfCnpj').value,
        telefone: document.getElementById('clienteTelefone').value,
        email: document.getElementById('clienteEmail').value,
        endereco: document.getElementById('clienteEndereco').value,
        dataCadastro: id ? dados.clientes.find(c => c.id == id).dataCadastro : new Date().toISOString()
    };
    
    if (id) {
        const index = dados.clientes.findIndex(c => c.id == id);
        dados.clientes[index] = cliente;
    } else {
        dados.clientes.push(cliente);
    }
    
    // Salvar dados (aguarda conclusão)
    salvarDados();
    
    // Fechar modal e atualizar interface
    fecharModal('clienteModal');
    renderizarClientes();
    mostrarNotificacao('Cliente salvo com sucesso!', 'success');
}

function editarCliente(id) {
    const cliente = dados.clientes.find(c => c.id === id);
    if (!cliente) return;
    
    document.getElementById('clienteId').value = cliente.id;
    document.getElementById('clienteNome').value = cliente.nome;
    document.getElementById('clienteCpfCnpj').value = cliente.cpfCnpj;
    document.getElementById('clienteTelefone').value = cliente.telefone || '';
    document.getElementById('clienteEmail').value = cliente.email || '';
    document.getElementById('clienteEndereco').value = cliente.endereco || '';
    
    document.getElementById('clienteModalTitle').textContent = 'Editar Cliente';
    openModal('clienteModal');
}

function excluirCliente(id) {
    // Verificar se tem veículos
    const temVeiculos = dados.veiculos.some(v => v.clienteId === id);
    if (temVeiculos) {
        mostrarNotificacao('Não é possível excluir cliente com veículos cadastrados!', 'danger');
        return;
    }
    
    if (!confirm('Deseja realmente excluir este cliente?')) return;
    
    dados.clientes = dados.clientes.filter(c => c.id !== id);
    salvarDados();
    renderizarClientes();
    mostrarNotificacao('Cliente excluído com sucesso!', 'success');
}

function renderizarClientes() {
    const tbody = document.getElementById('clientesBody');
    tbody.innerHTML = '';
    
    dados.clientes.forEach(cliente => {
        const veiculos = dados.veiculos.filter(v => v.clienteId === cliente.id).length;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cliente.nome}</td>
            <td>${cliente.cpfCnpj}</td>
            <td>${cliente.telefone || '-'}</td>
            <td>${cliente.email || '-'}</td>
            <td><span class="badge badge-info">${veiculos}</span></td>
            <td>
                <button class="btn btn-small btn-secondary" onclick="editarCliente(${cliente.id})">✏️ Editar</button>
                <button class="btn btn-small btn-danger" onclick="excluirCliente(${cliente.id})">🗑️ Excluir</button>
                <button class="btn btn-small btn-primary" onclick="verDetalhesCliente(${cliente.id})">👁️ Detalhes</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function verDetalhesCliente(id) {
    const cliente = dados.clientes.find(c => c.id === id);
    if (!cliente) return;
    
    const veiculos = dados.veiculos.filter(v => v.clienteId === id);
    const ordens = dados.ordens.filter(o => o.clienteId === id);
    const totalGasto = ordens.reduce((sum, o) => sum + (o.valorTotal || 0), 0);
    
    let html = `
        <div class="card">
            <h3>Detalhes do Cliente</h3>
            <p><strong>Nome:</strong> ${cliente.nome}</p>
            <p><strong>CPF/CNPJ:</strong> ${cliente.cpfCnpj}</p>
            <p><strong>Telefone:</strong> ${cliente.telefone || '-'}</p>
            <p><strong>Email:</strong> ${cliente.email || '-'}</p>
            <p><strong>Endereço:</strong> ${cliente.endereco || '-'}</p>
            <p><strong>Data Cadastro:</strong> ${formatarData(cliente.dataCadastro)}</p>
            <p><strong>Total Gasto:</strong> ${formatarMoeda(totalGasto)}</p>
            
            <h4>Veículos (${veiculos.length})</h4>
            ${veiculos.length > 0 ? `
                <ul>
                    ${veiculos.map(v => `<li>${v.placa} - ${v.marca} ${v.modelo}</li>`).join('')}
                </ul>
            ` : '<p>Nenhum veículo cadastrado</p>'}
            
            <h4>Histórico de Serviços (${ordens.length})</h4>
            ${ordens.length > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Veículo</th>
                            <th>Valor</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ordens.map(o => {
                            const veiculo = dados.veiculos.find(v => v.id === o.veiculoId);
                            return `
                                <tr>
                                    <td>${formatarData(o.dataAbertura)}</td>
                                    <td>${veiculo ? veiculo.placa : '-'}</td>
                                    <td>${formatarMoeda(o.valorTotal)}</td>
                                    <td><span class="badge badge-${o.status === 'Concluída' ? 'success' : 'warning'}">${o.status}</span></td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            ` : '<p>Nenhum serviço realizado</p>'}
        </div>
    `;
    
    // Criar modal de detalhes
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px; max-height: 80vh; overflow-y: auto;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            ${html}
            <button onclick="this.closest('.modal').remove()" style="margin-top: 20px;">Fechar</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Fechar ao clicar fora
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    };
}

// ========== VEÍCULOS ==========
async function salvarVeiculo(event) {
    event.preventDefault();
    
    const id = document.getElementById('veiculoId').value;
    const veiculo = {
        id: id ? parseInt(id) : gerarId(),
        clienteId: parseInt(document.getElementById('veiculoCliente').value),
        placa: document.getElementById('veiculoPlaca').value,
        marca: document.getElementById('veiculoMarca').value,
        modelo: document.getElementById('veiculoModelo').value,
        ano: document.getElementById('veiculoAno').value,
        cor: document.getElementById('veiculoCor').value,
        km: parseInt(document.getElementById('veiculoKm').value) || 0
    };
    
    if (id) {
        const index = dados.veiculos.findIndex(v => v.id == id);
        dados.veiculos[index] = veiculo;
    } else {
        dados.veiculos.push(veiculo);
    }
    
    salvarDados();
    fecharModal('veiculoModal');
    renderizarVeiculos();
    mostrarNotificacao('Veículo salvo com sucesso!', 'success');
}

function editarVeiculo(id) {
    const veiculo = dados.veiculos.find(v => v.id === id);
    if (!veiculo) return;
    
    carregarClientesSelect();
    
    document.getElementById('veiculoId').value = veiculo.id;
    document.getElementById('veiculoCliente').value = veiculo.clienteId;
    document.getElementById('veiculoPlaca').value = veiculo.placa;
    document.getElementById('veiculoMarca').value = veiculo.marca;
    document.getElementById('veiculoModelo').value = veiculo.modelo;
    document.getElementById('veiculoAno').value = veiculo.ano || '';
    document.getElementById('veiculoCor').value = veiculo.cor || '';
    document.getElementById('veiculoKm').value = veiculo.km || 0;
    
    document.getElementById('veiculoModalTitle').textContent = 'Editar Veículo';
    openModal('veiculoModal');
}

function excluirVeiculo(id) {
    // Verificar se tem ordens de serviço
    const temOrdens = dados.ordens.some(o => o.veiculoId === id);
    if (temOrdens) {
        mostrarNotificacao('Não é possível excluir veículo com ordens de serviço!', 'danger');
        return;
    }
    
    if (!confirm('Deseja realmente excluir este veículo?')) return;
    
    dados.veiculos = dados.veiculos.filter(v => v.id !== id);
    salvarDados();
    renderizarVeiculos();
    mostrarNotificacao('Veículo excluído com sucesso!', 'success');
}

function renderizarVeiculos() {
    const tbody = document.getElementById('veiculosBody');
    tbody.innerHTML = '';
    
    dados.veiculos.forEach(veiculo => {
        const cliente = dados.clientes.find(c => c.id === veiculo.clienteId);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${veiculo.placa}</td>
            <td>${veiculo.marca}</td>
            <td>${veiculo.modelo}</td>
            <td>${veiculo.ano || '-'}</td>
            <td>${cliente ? cliente.nome : '-'}</td>
            <td>${veiculo.km ? veiculo.km.toLocaleString() : '-'}</td>
            <td>
                <button class="btn btn-small btn-secondary" onclick="editarVeiculo(${veiculo.id})">✏️ Editar</button>
                <button class="btn btn-small btn-danger" onclick="excluirVeiculo(${veiculo.id})">🗑️ Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ========== SERVIÇOS ==========
async function salvarServico(event) {
    event.preventDefault();
    
    const id = document.getElementById('servicoId').value;
    const servico = {
        id: id ? parseInt(id) : gerarId(),
        descricao: document.getElementById('servicoDescricao').value,
        categoria: document.getElementById('servicoCategoria').value,
        valorMaoObra: parseFloat(document.getElementById('servicoValor').value),
        tempoEstimado: document.getElementById('servicoTempo').value
    };
    
    if (id) {
        const index = dados.servicos.findIndex(s => s.id == id);
        dados.servicos[index] = servico;
    } else {
        dados.servicos.push(servico);
    }
    
    salvarDados();
    fecharModal('servicoModal');
    renderizarServicos();
    mostrarNotificacao('Serviço salvo com sucesso!', 'success');
}

function editarServico(id) {
    const servico = dados.servicos.find(s => s.id === id);
    if (!servico) return;
    
    document.getElementById('servicoId').value = servico.id;
    document.getElementById('servicoDescricao').value = servico.descricao;
    document.getElementById('servicoCategoria').value = servico.categoria || '';
    document.getElementById('servicoValor').value = servico.valorMaoObra;
    document.getElementById('servicoTempo').value = servico.tempoEstimado || '';
    
    document.getElementById('servicoModalTitle').textContent = 'Editar Serviço';
    openModal('servicoModal');
}

function excluirServico(id) {
    if (!confirm('Deseja realmente excluir este serviço?')) return;
    
    dados.servicos = dados.servicos.filter(s => s.id !== id);
    salvarDados();
    renderizarServicos();
    mostrarNotificacao('Serviço excluído com sucesso!', 'success');
}

function renderizarServicos() {
    const tbody = document.getElementById('servicosBody');
    tbody.innerHTML = '';
    
    dados.servicos.forEach(servico => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${servico.descricao}</td>
            <td>${servico.categoria || '-'}</td>
            <td>${formatarMoeda(servico.valorMaoObra)}</td>
            <td>${servico.tempoEstimado || '-'}</td>
            <td>
                <button class="btn btn-small btn-secondary" onclick="editarServico(${servico.id})">✏️ Editar</button>
                <button class="btn btn-small btn-danger" onclick="excluirServico(${servico.id})">🗑️ Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ========== PEÇAS ==========
async function salvarPeca(event) {
    event.preventDefault();
    
    const id = document.getElementById('pecaId').value;
    const peca = {
        id: id ? parseInt(id) : gerarId(),
        codigo: document.getElementById('pecaCodigo').value,
        descricao: document.getElementById('pecaDescricao').value,
        fornecedor: document.getElementById('pecaFornecedor').value,
        custoUnitario: parseFloat(document.getElementById('pecaCusto').value),
        precoVenda: parseFloat(document.getElementById('pecaPreco').value),
        quantidadeEstoque: parseInt(document.getElementById('pecaEstoque').value),
        estoqueMinimo: parseInt(document.getElementById('pecaMinimo').value)
    };
    
    if (id) {
        const index = dados.pecas.findIndex(p => p.id == id);
        dados.pecas[index] = peca;
    } else {
        dados.pecas.push(peca);
    }
    
    salvarDados();
    fecharModal('pecaModal');
    renderizarPecas();
    mostrarNotificacao('Peça salva com sucesso!', 'success');
}

function editarPeca(id) {
    const peca = dados.pecas.find(p => p.id === id);
    if (!peca) return;
    
    document.getElementById('pecaId').value = peca.id;
    document.getElementById('pecaCodigo').value = peca.codigo;
    document.getElementById('pecaDescricao').value = peca.descricao;
    document.getElementById('pecaFornecedor').value = peca.fornecedor || '';
    document.getElementById('pecaCusto').value = peca.custoUnitario;
    document.getElementById('pecaPreco').value = peca.precoVenda;
    document.getElementById('pecaEstoque').value = peca.quantidadeEstoque;
    document.getElementById('pecaMinimo').value = peca.estoqueMinimo;
    
    document.getElementById('pecaModalTitle').textContent = 'Editar Peça';
    openModal('pecaModal');
}

function excluirPeca(id) {
    if (!confirm('Deseja realmente excluir esta peça?')) return;
    
    dados.pecas = dados.pecas.filter(p => p.id !== id);
    salvarDados();
    renderizarPecas();
    mostrarNotificacao('Peça excluída com sucesso!', 'success');
}

function renderizarPecas() {
    const tbody = document.getElementById('pecasBody');
    tbody.innerHTML = '';
    
    dados.pecas.forEach(peca => {
        const estoqueBaixo = peca.quantidadeEstoque <= peca.estoqueMinimo;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${peca.codigo}</td>
            <td>${peca.descricao}</td>
            <td>${peca.fornecedor || '-'}</td>
            <td>${formatarMoeda(peca.custoUnitario)}</td>
            <td>${formatarMoeda(peca.precoVenda)}</td>
            <td><span class="badge ${estoqueBaixo ? 'badge-danger' : 'badge-success'}">${peca.quantidadeEstoque}</span></td>
            <td>${peca.estoqueMinimo}</td>
            <td>
                <button class="btn btn-small btn-secondary" onclick="editarPeca(${peca.id})">✏️ Editar</button>
                <button class="btn btn-small btn-danger" onclick="excluirPeca(${peca.id})">🗑️ Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ========== FERRAMENTAS ==========
async function salvarFerramenta(event) {
    event.preventDefault();
    
    const id = document.getElementById('ferramentaId').value;
    const ferramenta = {
        id: id ? parseInt(id) : gerarId(),
        descricao: document.getElementById('ferramentaDescricao').value,
        marca: document.getElementById('ferramentaMarca').value,
        numeroSerie: document.getElementById('ferramentaSerie').value,
        dataAquisicao: document.getElementById('ferramentaData').value,
        valorAquisicao: parseFloat(document.getElementById('ferramentaValor').value) || 0,
        status: document.getElementById('ferramentaStatus').value
    };
    
    if (id) {
        const index = dados.ferramentas.findIndex(f => f.id == id);
        dados.ferramentas[index] = ferramenta;
    } else {
        dados.ferramentas.push(ferramenta);
    }
    
    salvarDados();
    fecharModal('ferramentaModal');
    renderizarFerramentas();
    mostrarNotificacao('Ferramenta salva com sucesso!', 'success');
}

function editarFerramenta(id) {
    const ferramenta = dados.ferramentas.find(f => f.id === id);
    if (!ferramenta) return;
    
    document.getElementById('ferramentaId').value = ferramenta.id;
    document.getElementById('ferramentaDescricao').value = ferramenta.descricao;
    document.getElementById('ferramentaMarca').value = ferramenta.marca || '';
    document.getElementById('ferramentaSerie').value = ferramenta.numeroSerie || '';
    document.getElementById('ferramentaData').value = ferramenta.dataAquisicao || '';
    document.getElementById('ferramentaValor').value = ferramenta.valorAquisicao || 0;
    document.getElementById('ferramentaStatus').value = ferramenta.status;
    
    document.getElementById('ferramentaModalTitle').textContent = 'Editar Ferramenta';
    openModal('ferramentaModal');
}

function excluirFerramenta(id) {
    if (!confirm('Deseja realmente excluir esta ferramenta?')) return;
    
    dados.ferramentas = dados.ferramentas.filter(f => f.id !== id);
    salvarDados();
    renderizarFerramentas();
    mostrarNotificacao('Ferramenta excluída com sucesso!', 'success');
}

function renderizarFerramentas() {
    const tbody = document.getElementById('ferramentasBody');
    tbody.innerHTML = '';
    
    dados.ferramentas.forEach(ferramenta => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${ferramenta.descricao}</td>
            <td>${ferramenta.marca || '-'}</td>
            <td>${ferramenta.numeroSerie || '-'}</td>
            <td>${formatarData(ferramenta.dataAquisicao)}</td>
            <td>${formatarMoeda(ferramenta.valorAquisicao)}</td>
            <td><span class="badge badge-${ferramenta.status === 'Disponível' ? 'success' : ferramenta.status === 'Em Uso' ? 'warning' : 'danger'}">${ferramenta.status}</span></td>
            <td>
                <button class="btn btn-small btn-secondary" onclick="editarFerramenta(${ferramenta.id})">✏️ Editar</button>
                <button class="btn btn-small btn-danger" onclick="excluirFerramenta(${ferramenta.id})">🗑️ Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ========== HELPERS ==========
function carregarClientesSelect() {
    // Carregar para modal de veículo
    const selectVeiculo = document.getElementById('veiculoCliente');
    if (selectVeiculo) {
        selectVeiculo.innerHTML = '<option value="">Selecione um cliente...</option>';
        dados.clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id;
            option.textContent = cliente.nome;
            selectVeiculo.appendChild(option);
        });
    }
    
    // Carregar para modal de ordem de serviço
    const selectOrdem = document.getElementById('ordemClienteId');
    if (selectOrdem) {
        selectOrdem.innerHTML = '<option value="">Selecione um cliente...</option>';
        dados.clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id;
            option.textContent = cliente.nome;
            selectOrdem.appendChild(option);
        });
    }
}

// Função mostrarNotificacao definida mais abaixo no arquivo

function renderizarTudo() {
    renderizarClientes();
    renderizarVeiculos();
    renderizarServicos();
    renderizarPecas();
    renderizarFerramentas();
    
    // Inicializar relatórios avançados se a função existir
    if (typeof inicializarRelatoriosAvancados === 'function') {
        inicializarRelatoriosAvancados();
    }
}

// Continua...



// ========== DASHBOARD ==========
function atualizarDashboard() {
    // Totais
    document.getElementById('totalClientes').textContent = dados.clientes.length;
    document.getElementById('totalVeiculos').textContent = dados.veiculos.length;
    
    // Ordens abertas
    const osAbertas = dados.ordens.filter(o => o.status !== 'Concluída' && o.status !== 'Cancelada').length;
    document.getElementById('osAbertas').textContent = osAbertas;
    
    // Financeiro do mês
    const mesAtual = new Date().getMonth();
    const anoAtual = new Date().getFullYear();
    
    const receitaMes = dados.movimentacoes
        .filter(m => {
            const d = new Date(m.data);
            return m.tipo === 'Receita' && d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
        })
        .reduce((sum, m) => sum + m.valor, 0);
    
    const despesaMes = dados.movimentacoes
        .filter(m => {
            const d = new Date(m.data);
            return m.tipo === 'Despesa' && d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
        })
        .reduce((sum, m) => sum + m.valor, 0);
    
    const lucroMes = receitaMes - despesaMes;
    
    document.getElementById('receitaMes').textContent = formatarMoeda(receitaMes);
    document.getElementById('despesaMes').textContent = formatarMoeda(despesaMes);
    document.getElementById('lucroMes').textContent = formatarMoeda(lucroMes);
    
    // Totais gerais
    const totalReceitas = dados.movimentacoes.filter(m => m.tipo === 'Receita').reduce((sum, m) => sum + m.valor, 0);
    const totalDespesas = dados.movimentacoes.filter(m => m.tipo === 'Despesa').reduce((sum, m) => sum + m.valor, 0);
    const saldoTotal = totalReceitas - totalDespesas;
    
    if (document.getElementById('totalReceitas')) {
        document.getElementById('totalReceitas').textContent = formatarMoeda(totalReceitas);
        document.getElementById('totalDespesas').textContent = formatarMoeda(totalDespesas);
        document.getElementById('saldoTotal').textContent = formatarMoeda(saldoTotal);
    }
    
    // Ordens recentes
    const ordensRecentes = dados.ordens.slice(-5).reverse();
    const divOrdens = document.getElementById('ordensRecentes');
    if (divOrdens) {
        if (ordensRecentes.length === 0) {
            divOrdens.innerHTML = '<p>Nenhuma ordem de serviço cadastrada</p>';
        } else {
            divOrdens.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Número</th>
                            <th>Cliente</th>
                            <th>Data</th>
                            <th>Status</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ordensRecentes.map(o => {
                            const cliente = dados.clientes.find(c => c.id === o.clienteId);
                            return `
                                <tr>
                                    <td>${o.numero}</td>
                                    <td>${cliente ? cliente.nome : '-'}</td>
                                    <td>${formatarData(o.dataAbertura)}</td>
                                    <td><span class="badge badge-${o.status === 'Concluída' ? 'success' : 'warning'}">${o.status}</span></td>
                                    <td>${formatarMoeda(o.valorTotal)}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;
        }
    }
    
    // Alertas de estoque
    const divAlertas = document.getElementById('alertasEstoque');
    if (divAlertas) {
        const pecasBaixas = dados.pecas.filter(p => p.quantidadeEstoque <= p.estoqueMinimo);
        if (pecasBaixas.length === 0) {
            divAlertas.innerHTML = '<p class="alert alert-success">✅ Todos os itens com estoque adequado</p>';
        } else {
            divAlertas.innerHTML = pecasBaixas.map(p => `
                <div class="alert alert-warning">
                    ⚠️ <strong>${p.descricao}</strong> - Estoque: ${p.quantidadeEstoque} (Mínimo: ${p.estoqueMinimo})
                </div>
            `).join('');
        }
    }
}

// ========== EXPORTAR DADOS ==========
function exportarDados() {
    const dataStr = JSON.stringify(dados, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-oficina-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    mostrarNotificacao('Dados exportados com sucesso!', 'success');
}

// ========== RELATÓRIOS ==========
function gerarRelatorioFinanceiro() {
    const totalReceitas = dados.movimentacoes.filter(m => m.tipo === 'Receita').reduce((sum, m) => sum + m.valor, 0);
    const totalDespesas = dados.movimentacoes.filter(m => m.tipo === 'Despesa').reduce((sum, m) => sum + m.valor, 0);
    const lucro = totalReceitas - totalDespesas;
    
    const html = `
        <h3>Resumo Financeiro</h3>
        <div class="totais">
            <div class="total-row">
                <span>Total de Receitas:</span>
                <span style="color: var(--success)">${formatarMoeda(totalReceitas)}</span>
            </div>
            <div class="total-row">
                <span>Total de Despesas:</span>
                <span style="color: var(--danger)">${formatarMoeda(totalDespesas)}</span>
            </div>
            <div class="total-row final">
                <span>Lucro Líquido:</span>
                <span>${formatarMoeda(lucro)}</span>
            </div>
        </div>
        
        <h4>Receitas por Categoria</h4>
        <table>
            <thead>
                <tr>
                    <th>Categoria</th>
                    <th>Quantidade</th>
                    <th>Valor Total</th>
                </tr>
            </thead>
            <tbody>
                ${agruparPorCategoria(dados.movimentacoes.filter(m => m.tipo === 'Receita'))}
            </tbody>
        </table>
        
        <h4>Despesas por Categoria</h4>
        <table>
            <thead>
                <tr>
                    <th>Categoria</th>
                    <th>Quantidade</th>
                    <th>Valor Total</th>
                </tr>
            </thead>
            <tbody>
                ${agruparPorCategoria(dados.movimentacoes.filter(m => m.tipo === 'Despesa'))}
            </tbody>
        </table>
    `;
    
    document.getElementById('relatorioTitulo').textContent = 'Relatório Financeiro';
    document.getElementById('relatorioConteudo').innerHTML = html;
    document.getElementById('relatorioResultado').classList.remove('hidden');
}

function agruparPorCategoria(movimentacoes) {
    const grupos = {};
    movimentacoes.forEach(m => {
        if (!grupos[m.categoria]) {
            grupos[m.categoria] = { quantidade: 0, total: 0 };
        }
        grupos[m.categoria].quantidade++;
        grupos[m.categoria].total += m.valor;
    });
    
    return Object.entries(grupos).map(([cat, dados]) => `
        <tr>
            <td>${cat}</td>
            <td>${dados.quantidade}</td>
            <td>${formatarMoeda(dados.total)}</td>
        </tr>
    `).join('');
}

function gerarRelatorioServicos() {
    const html = `
        <h3>Relatório de Serviços</h3>
        <p>Total de Ordens: ${dados.ordens.length}</p>
        <p>Ordens Concluídas: ${dados.ordens.filter(o => o.status === 'Concluída').length}</p>
        <p>Ordens Abertas: ${dados.ordens.filter(o => o.status !== 'Concluída' && o.status !== 'Cancelada').length}</p>
    `;
    
    document.getElementById('relatorioTitulo').textContent = 'Relatório de Serviços';
    document.getElementById('relatorioConteudo').innerHTML = html;
    document.getElementById('relatorioResultado').classList.remove('hidden');
}

function gerarRelatorioClientes() {
    const html = `
        <h3>Relatório de Clientes</h3>
        <table>
            <thead>
                <tr>
                    <th>Cliente</th>
                    <th>Veículos</th>
                    <th>Ordens</th>
                    <th>Total Gasto</th>
                </tr>
            </thead>
            <tbody>
                ${dados.clientes.map(c => {
                    const veiculos = dados.veiculos.filter(v => v.clienteId === c.id).length;
                    const ordens = dados.ordens.filter(o => o.clienteId === c.id);
                    const total = ordens.reduce((sum, o) => sum + (o.valorTotal || 0), 0);
                    return `
                        <tr>
                            <td>${c.nome}</td>
                            <td>${veiculos}</td>
                            <td>${ordens.length}</td>
                            <td>${formatarMoeda(total)}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    
    document.getElementById('relatorioTitulo').textContent = 'Relatório de Clientes';
    document.getElementById('relatorioConteudo').innerHTML = html;
    document.getElementById('relatorioResultado').classList.remove('hidden');
}

function gerarRelatorioEstoque() {
    const valorTotal = dados.pecas.reduce((sum, p) => sum + (p.custoUnitario * p.quantidadeEstoque), 0);
    
    const html = `
        <h3>Relatório de Estoque</h3>
        <p><strong>Valor Total do Estoque:</strong> ${formatarMoeda(valorTotal)}</p>
        <p><strong>Total de Itens:</strong> ${dados.pecas.length}</p>
        
        <h4>Peças em Estoque Baixo</h4>
        <table>
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Descrição</th>
                    <th>Estoque</th>
                    <th>Mínimo</th>
                </tr>
            </thead>
            <tbody>
                ${dados.pecas.filter(p => p.quantidadeEstoque <= p.estoqueMinimo).map(p => `
                    <tr>
                        <td>${p.codigo}</td>
                        <td>${p.descricao}</td>
                        <td><span class="badge badge-danger">${p.quantidadeEstoque}</span></td>
                        <td>${p.estoqueMinimo}</td>
                    </tr>
                `).join('') || '<tr><td colspan="4">Nenhuma peça com estoque baixo</td></tr>'}
            </tbody>
        </table>
    `;
    
    document.getElementById('relatorioTitulo').textContent = 'Relatório de Estoque';
    document.getElementById('relatorioConteudo').innerHTML = html;
    document.getElementById('relatorioResultado').classList.remove('hidden');
}

function imprimirRelatorio() {
    window.print();
}

console.log('✅ Sistema de Gestão para Oficina Mecânica carregado!');
console.log('📊 Dados:', dados);




// ========== SISTEMA DE BACKUP EM ARQUIVOS SEPARADOS ==========
function exportarBackupCompleto() {
    // Criar objeto com timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const backup = {
        dataBackup: new Date().toISOString(),
        versao: '1.0',
        dados: dados
    };
    
    // Criar ZIP com todos os arquivos (simulado com múltiplos downloads)
    const categorias = [
        { nome: 'clientes', dados: dados.clientes },
        { nome: 'veiculos', dados: dados.veiculos },
        { nome: 'servicos', dados: dados.servicos },
        { nome: 'pecas', dados: dados.pecas },
        { nome: 'ferramentas', dados: dados.ferramentas },
        { nome: 'ordens', dados: dados.ordens },
        { nome: 'compras', dados: dados.compras },
        { nome: 'movimentacoes', dados: dados.movimentacoes },
        { nome: 'backup_completo', dados: backup }
    ];
    
    // Baixar cada categoria separadamente
    categorias.forEach((cat, index) => {
        setTimeout(() => {
            baixarJSON(cat.dados, `${timestamp}_${cat.nome}.json`);
        }, index * 500); // Delay para não travar o navegador
    });
    
    mostrarNotificacao(`Backup iniciado! ${categorias.length} arquivos serão baixados.`, 'success');
}

function baixarJSON(dados, nomeArquivo) {
    const dataStr = JSON.stringify(dados, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    link.click();
    URL.revokeObjectURL(url);
}

function importarBackup() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const backup = JSON.parse(event.target.result);
                
                // Verificar se é backup completo ou parcial
                if (backup.dados) {
                    // Backup completo
                    dados = backup.dados;
                } else if (backup.dataBackup) {
                    // Backup antigo
                    dados = backup;
                } else {
                    // Arquivo de categoria específica
                    if (confirm('Este parece ser um arquivo de categoria específica. Deseja importar mesmo assim?')) {
                        // Tentar identificar a categoria pelo conteúdo
                        if (Array.isArray(backup)) {
                            alert('Importação de categorias específicas deve ser feita manualmente.');
                            return;
                        }
                    }
                }
                
                salvarDados();
                renderizarTudo();
                atualizarDashboard();
                mostrarNotificacao('Backup restaurado com sucesso!', 'success');
            } catch (error) {
                mostrarNotificacao('Erro ao importar backup: ' + error.message, 'danger');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// ========== GERAÇÃO DE PDF DA ORDEM DE SERVIÇO ==========
function gerarPDFOrdem(ordemId) {
    const ordem = dados.ordens.find(o => o.id === ordemId);
    if (!ordem) {
        mostrarNotificacao('Ordem de serviço não encontrada!', 'danger');
        return;
    }
    
    const cliente = dados.clientes.find(c => c.id === ordem.clienteId);
    const veiculo = dados.veiculos.find(v => v.id === ordem.veiculoId);
    
    // Criar HTML para impressão
    const htmlPDF = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ordem de Serviço ${ordem.numero}</title>
    <style>
        @media print {
            @page { margin: 2cm; }
        }
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #1e3a8a;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            max-width: 150px;
            margin-bottom: 10px;
        }
        .empresa {
            font-size: 24px;
            font-weight: bold;
            color: #1e3a8a;
            margin: 10px 0;
        }
        .numero-os {
            font-size: 20px;
            font-weight: bold;
            background: #1e3a8a;
            color: white;
            padding: 10px 20px;
            display: inline-block;
            border-radius: 5px;
            margin: 10px 0;
        }
        .secao {
            margin-bottom: 25px;
        }
        .secao-titulo {
            font-size: 16px;
            font-weight: bold;
            background: #f3f4f6;
            padding: 8px 12px;
            border-left: 4px solid #1e3a8a;
            margin-bottom: 10px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 15px;
        }
        .info-item {
            padding: 8px;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-label {
            font-weight: bold;
            color: #6b7280;
            font-size: 12px;
        }
        .info-valor {
            color: #1f2937;
            font-size: 14px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        th {
            background: #f9fafb;
            font-weight: bold;
            color: #1e3a8a;
        }
        .totais {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .total-linha {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
        }
        .total-final {
            font-size: 20px;
            font-weight: bold;
            color: #1e3a8a;
            border-top: 2px solid #1e3a8a;
            padding-top: 10px;
            margin-top: 10px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }
        .assinaturas {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-top: 50px;
        }
        .assinatura {
            text-align: center;
        }
        .linha-assinatura {
            border-top: 1px solid #333;
            margin-top: 60px;
            padding-top: 5px;
        }
        .status {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
        }
        .status-aberta { background: #fef3c7; color: #92400e; }
        .status-execucao { background: #dbeafe; color: #1e40af; }
        .status-concluida { background: #d1fae5; color: #065f46; }
        .status-cancelada { background: #fee2e2; color: #991b1b; }
    </style>
</head>
<body>
    <div class="header">
        <img src="logo.png" alt="Logo" class="logo">
        <div class="empresa">OFICINA MECÂNICA</div>
        <div class="numero-os">ORDEM DE SERVIÇO Nº ${ordem.numero}</div>
    </div>

    <div class="secao">
        <div class="secao-titulo">DADOS DA ORDEM</div>
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Data Abertura</div>
                <div class="info-valor">${formatarDataHora(ordem.dataAbertura)}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Status</div>
                <div class="info-valor">
                    <span class="status status-${ordem.status.toLowerCase().replace(' ', '-')}">${ordem.status}</span>
                </div>
            </div>
            ${ordem.dataFechamento ? `
            <div class="info-item">
                <div class="info-label">Data Fechamento</div>
                <div class="info-valor">${formatarDataHora(ordem.dataFechamento)}</div>
            </div>
            ` : ''}
        </div>
    </div>

    <div class="secao">
        <div class="secao-titulo">DADOS DO CLIENTE</div>
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Nome</div>
                <div class="info-valor">${cliente ? cliente.nome : '-'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">CPF/CNPJ</div>
                <div class="info-valor">${cliente ? cliente.cpfCnpj : '-'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Telefone</div>
                <div class="info-valor">${cliente ? cliente.telefone : '-'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Email</div>
                <div class="info-valor">${cliente ? cliente.email : '-'}</div>
            </div>
        </div>
    </div>

    <div class="secao">
        <div class="secao-titulo">DADOS DO VEÍCULO</div>
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Placa</div>
                <div class="info-valor">${veiculo ? veiculo.placa : '-'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Marca/Modelo</div>
                <div class="info-valor">${veiculo ? `${veiculo.marca} ${veiculo.modelo}` : '-'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Ano</div>
                <div class="info-valor">${veiculo ? veiculo.ano : '-'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">KM Entrada</div>
                <div class="info-valor">${ordem.kmEntrada ? ordem.kmEntrada.toLocaleString() : '-'}</div>
            </div>
        </div>
    </div>

    ${ordem.descricaoProblema ? `
    <div class="secao">
        <div class="secao-titulo">DESCRIÇÃO DO PROBLEMA</div>
        <p>${ordem.descricaoProblema}</p>
    </div>
    ` : ''}

    ${ordem.servicos && ordem.servicos.length > 0 ? `
    <div class="secao">
        <div class="secao-titulo">SERVIÇOS REALIZADOS</div>
        <table>
            <thead>
                <tr>
                    <th>Descrição</th>
                    <th>Qtd</th>
                    <th>Valor Unit.</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${ordem.servicos.map(s => `
                    <tr>
                        <td>${s.descricao}</td>
                        <td>${s.quantidade || 1}</td>
                        <td>${formatarMoeda(s.valorMaoObra)}</td>
                        <td>${formatarMoeda(s.valorMaoObra * (s.quantidade || 1))}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    ` : ''}

    ${ordem.pecas && ordem.pecas.length > 0 ? `
    <div class="secao">
        <div class="secao-titulo">PEÇAS UTILIZADAS</div>
        <table>
            <thead>
                <tr>
                    <th>Descrição</th>
                    <th>Qtd</th>
                    <th>Valor Unit.</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${ordem.pecas.map(p => `
                    <tr>
                        <td>${p.descricao}</td>
                        <td>${p.quantidade}</td>
                        <td>${formatarMoeda(p.precoVenda)}</td>
                        <td>${formatarMoeda(p.precoVenda * p.quantidade)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    ` : ''}

    <div class="totais">
        <div class="total-linha">
            <span>Total Mão de Obra:</span>
            <span>${formatarMoeda(ordem.totalMaoObra || 0)}</span>
        </div>
        <div class="total-linha">
            <span>Total Peças:</span>
            <span>${formatarMoeda(ordem.totalPecas || 0)}</span>
        </div>
        ${ordem.desconto ? `
        <div class="total-linha">
            <span>Desconto:</span>
            <span>- ${formatarMoeda(ordem.desconto)}</span>
        </div>
        ` : ''}
        <div class="total-linha total-final">
            <span>VALOR TOTAL:</span>
            <span>${formatarMoeda(ordem.valorTotal || 0)}</span>
        </div>
    </div>

    ${ordem.observacoes ? `
    <div class="secao">
        <div class="secao-titulo">OBSERVAÇÕES</div>
        <p>${ordem.observacoes}</p>
    </div>
    ` : ''}

    <div class="assinaturas">
        <div class="assinatura">
            <div class="linha-assinatura">Assinatura do Cliente</div>
        </div>
        <div class="assinatura">
            <div class="linha-assinatura">Assinatura do Responsável</div>
        </div>
    </div>

    <div class="footer">
        <p>Documento gerado em ${formatarDataHora(new Date())}</p>
        <p>Sistema de Gestão para Oficina Mecânica</p>
    </div>

    <script>
        window.onload = function() {
            window.print();
        }
    </script>
</body>
</html>
    `;
    
    // Abrir em nova janela para impressão/salvamento
    const janela = window.open('', '_blank');
    janela.document.write(htmlPDF);
    janela.document.close();
}

// Atualizar função de renderização de ordens para incluir botão de PDF
function renderizarOrdens() {
    const tbody = document.getElementById('ordensBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    let ordens = dados.ordens;
    
    // Aplicar filtros se existirem
    const filtroStatus = document.getElementById('filtroStatusOS');
    if (filtroStatus && filtroStatus.value) {
        ordens = ordens.filter(o => o.status === filtroStatus.value);
    }
    
    ordens.forEach(ordem => {
        const cliente = dados.clientes.find(c => c.id === ordem.clienteId);
        const veiculo = dados.veiculos.find(v => v.id === ordem.veiculoId);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${ordem.numero}</strong></td>
            <td>${cliente ? cliente.nome : '-'}</td>
            <td>${veiculo ? `${veiculo.placa} - ${veiculo.marca} ${veiculo.modelo}` : '-'}</td>
            <td>${formatarData(ordem.dataAbertura)}</td>
            <td><span class="badge badge-${ordem.status === 'Concluída' ? 'success' : ordem.status === 'Cancelada' ? 'danger' : 'warning'}">${ordem.status}</span></td>
            <td><strong>${formatarMoeda(ordem.valorTotal || 0)}</strong></td>
            <td>
                <button class="btn btn-small btn-secondary" onclick="editarOrdem(${ordem.id})">✏️ Editar</button>
                <button class="btn btn-small btn-primary" onclick="gerarPDFOrdem(${ordem.id})">📄 PDF</button>
                <button class="btn btn-small btn-danger" onclick="excluirOrdem(${ordem.id})">🗑️ Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filtrarOrdens() {
    renderizarOrdens();
}

function editarOrdem(id) {
    mostrarNotificacao('Função de edição de ordem em desenvolvimento', 'info');
}

function excluirOrdem(id) {
    if (!confirm('Deseja realmente excluir esta ordem de serviço?')) return;
    
    dados.ordens = dados.ordens.filter(o => o.id !== id);
    salvarDados();
    renderizarOrdens();
    mostrarNotificacao('Ordem excluída com sucesso!', 'success');
}

// Atualizar renderizarTudo para incluir ordens
const renderizarTudoOriginal = renderizarTudo;
renderizarTudo = function() {
    renderizarTudoOriginal();
    renderizarOrdens();
};

console.log('✅ Funções de backup e PDF adicionadas!');


// ========== DESPESAS GERAIS ==========
function abrirModalDespesaGeral(id = null) {
    openModal('despesaGeralModal');
    const modal = criarModalDespesaGeral();
    document.body.appendChild(modal);
    
    if (id) {
        const despesa = dados.despesasGerais.find(d => d.id === id);
        if (despesa) {
            document.getElementById('despesaGeralId').value = despesa.id;
            document.getElementById('despesaGeralData').value = despesa.data;
            document.getElementById('despesaGeralTipo').value = despesa.tipo;
            document.getElementById('despesaGeralDescricao').value = despesa.descricao;
            document.getElementById('despesaGeralValor').value = despesa.valor;
        }
    }
    
    modal.classList.add('active');
}

function criarModalDespesaGeral() {
    let modal = document.getElementById('despesaGeralModal');
    if (modal) {
        modal.remove();
    }
    
    const div = document.createElement('div');
    div.id = 'despesaGeralModal';
    div.className = 'modal';
    div.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Nova Despesa Geral</h2>
                <span class="close" onclick="fecharModal('despesaGeralModal')">&times;</span>
            </div>
            <form onsubmit="salvarDespesaGeral(event)">
                <input type="hidden" id="despesaGeralId">
                <div class="form-group">
                    <label>Data *</label>
                    <input type="date" id="despesaGeralData" required value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label>Tipo *</label>
                    <select id="despesaGeralTipo" required>
                        <option value="">Selecione...</option>
                        <option value="Aluguel">Aluguel</option>
                        <option value="Energia Elétrica">Energia Elétrica</option>
                        <option value="Água">Água</option>
                        <option value="Internet/Telefone">Internet/Telefone</option>
                        <option value="Salários">Salários</option>
                        <option value="Impostos">Impostos</option>
                        <option value="Manutenção">Manutenção</option>
                        <option value="Material de Limpeza">Material de Limpeza</option>
                        <option value="Outros">Outros</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Descrição</label>
                    <input type="text" id="despesaGeralDescricao" placeholder="Detalhes da despesa">
                </div>
                <div class="form-group">
                    <label>Valor *</label>
                    <input type="number" id="despesaGeralValor" step="0.01" required placeholder="0.00">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="fecharModal('despesaGeralModal')">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar</button>
                </div>
            </form>
        </div>
    `;
    return div;
}

async function salvarDespesaGeral(event) {
    event.preventDefault();
    
    const id = document.getElementById('despesaGeralId').value;
    const despesa = {
        id: id ? parseInt(id) : gerarId(),
        data: document.getElementById('despesaGeralData').value,
        tipo: document.getElementById('despesaGeralTipo').value,
        descricao: document.getElementById('despesaGeralDescricao').value,
        valor: parseFloat(document.getElementById('despesaGeralValor').value)
    };
    
    if (id) {
        const index = dados.despesasGerais.findIndex(d => d.id == id);
        dados.despesasGerais[index] = despesa;
    } else {
        dados.despesasGerais.push(despesa);
    }
    
    salvarDados();
    fecharModal('despesaGeralModal');
    renderizarDespesasGerais();
    alert('Despesa salva com sucesso!');
}

function editarDespesaGeral(id) {
    abrirModalDespesaGeral(id);
}

function excluirDespesaGeral(id) {
    if (!confirm('Deseja realmente excluir esta despesa?')) return;
    
    dados.despesasGerais = dados.despesasGerais.filter(d => d.id !== id);
    salvarDados();
    renderizarDespesasGerais();
    alert('Despesa excluída!');
}

function renderizarDespesasGerais() {
    const tbody = document.getElementById('despesasGeraisBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const despesasOrdenadas = [...dados.despesasGerais].sort((a, b) => new Date(b.data) - new Date(a.data));
    
    despesasOrdenadas.forEach(despesa => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatarData(despesa.data)}</td>
            <td><span class="badge badge-danger">${despesa.tipo}</span></td>
            <td>${despesa.descricao || '-'}</td>
            <td>${formatarMoeda(despesa.valor)}</td>
            <td>
                <button class="btn btn-small btn-secondary" onclick="editarDespesaGeral(${despesa.id})">✏️</button>
                <button class="btn btn-small btn-danger" onclick="excluirDespesaGeral(${despesa.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ========== AGENDAMENTOS ==========
function abrirModalAgendamento(id = null) {
    const modal = criarModalAgendamento();
    document.body.appendChild(modal);
    
    carregarClientesSelectAgenda();
    
    if (id) {
        const agendamento = dados.agendamentos.find(a => a.id === id);
        if (agendamento) {
            document.getElementById('agendamentoId').value = agendamento.id;
            document.getElementById('agendamentoData').value = agendamento.data;
            document.getElementById('agendamentoHora').value = agendamento.hora;
            document.getElementById('agendamentoCliente').value = agendamento.clienteId;
            carregarVeiculosSelectAgenda(agendamento.clienteId);
            document.getElementById('agendamentoVeiculo').value = agendamento.veiculoId;
            document.getElementById('agendamentoServicos').value = agendamento.servicos;
            document.getElementById('agendamentoObservacoes').value = agendamento.observacoes || '';
            document.getElementById('agendamentoStatus').value = agendamento.status;
        }
    }
    
    modal.classList.add('active');
}

function criarModalAgendamento() {
    let modal = document.getElementById('agendamentoModal');
    if (modal) {
        modal.remove();
    }
    
    const div = document.createElement('div');
    div.id = 'agendamentoModal';
    div.className = 'modal';
    div.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Novo Agendamento</h2>
                <span class="close" onclick="fecharModal('agendamentoModal')">&times;</span>
            </div>
            <form onsubmit="salvarAgendamento(event)">
                <input type="hidden" id="agendamentoId">
                <div class="form-row">
                    <div class="form-group">
                        <label>Data *</label>
                        <input type="date" id="agendamentoData" required>
                    </div>
                    <div class="form-group">
                        <label>Hora *</label>
                        <input type="time" id="agendamentoHora" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Cliente *</label>
                    <select id="agendamentoCliente" required onchange="carregarVeiculosSelectAgenda(this.value)">
                        <option value="">Selecione um cliente...</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Veículo *</label>
                    <select id="agendamentoVeiculo" required>
                        <option value="">Selecione um veículo...</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Serviços *</label>
                    <input type="text" id="agendamentoServicos" required placeholder="Ex: Troca de óleo, Alinhamento">
                </div>
                <div class="form-group">
                    <label>Observações</label>
                    <textarea id="agendamentoObservacoes" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label>Status *</label>
                    <select id="agendamentoStatus" required>
                        <option value="Agendado">Agendado</option>
                        <option value="Confirmado">Confirmado</option>
                        <option value="Em Atendimento">Em Atendimento</option>
                        <option value="Concluído">Concluído</option>
                        <option value="Cancelado">Cancelado</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="fecharModal('agendamentoModal')">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar</button>
                </div>
            </form>
        </div>
    `;
    return div;
}

function carregarClientesSelectAgenda() {
    const select = document.getElementById('agendamentoCliente');
    if (!select) return;
    
    select.innerHTML = '<option value="">Selecione um cliente...</option>';
    dados.clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.id;
        option.textContent = cliente.nome;
        select.appendChild(option);
    });
}

function carregarVeiculosSelectAgenda(clienteId) {
    const select = document.getElementById('agendamentoVeiculo');
    if (!select) return;
    
    select.innerHTML = '<option value="">Selecione um veículo...</option>';
    
    if (!clienteId) return;
    
    const veiculos = dados.veiculos.filter(v => v.clienteId == clienteId);
    veiculos.forEach(veiculo => {
        const option = document.createElement('option');
        option.value = veiculo.id;
        option.textContent = `${veiculo.placa} - ${veiculo.marca} ${veiculo.modelo}`;
        select.appendChild(option);
    });
}

async function salvarAgendamento(event) {
    event.preventDefault();
    
    const id = document.getElementById('agendamentoId').value;
    const agendamento = {
        id: id ? parseInt(id) : gerarId(),
        data: document.getElementById('agendamentoData').value,
        hora: document.getElementById('agendamentoHora').value,
        clienteId: parseInt(document.getElementById('agendamentoCliente').value),
        veiculoId: parseInt(document.getElementById('agendamentoVeiculo').value),
        servicos: document.getElementById('agendamentoServicos').value,
        observacoes: document.getElementById('agendamentoObservacoes').value,
        status: document.getElementById('agendamentoStatus').value
    };
    
    if (id) {
        const index = dados.agendamentos.findIndex(a => a.id == id);
        dados.agendamentos[index] = agendamento;
    } else {
        dados.agendamentos.push(agendamento);
    }
    
    salvarDados();
    fecharModal('agendamentoModal');
    renderizarAgendamentos();
    alert('Agendamento salvo!');
}

function editarAgendamento(id) {
    abrirModalAgendamento(id);
}

function excluirAgendamento(id) {
    if (!confirm('Deseja realmente excluir este agendamento?')) return;
    
    dados.agendamentos = dados.agendamentos.filter(a => a.id !== id);
    salvarDados();
    renderizarAgendamentos();
    alert('Agendamento excluído!');
}

function renderizarAgendamentos() {
    const tbody = document.getElementById('agendamentosBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const agendamentosOrdenados = [...dados.agendamentos].sort((a, b) => {
        const dataA = new Date(a.data + ' ' + a.hora);
        const dataB = new Date(b.data + ' ' + b.hora);
        return dataB - dataA;
    });
    
    agendamentosOrdenados.forEach(agendamento => {
        const cliente = dados.clientes.find(c => c.id === agendamento.clienteId);
        const veiculo = dados.veiculos.find(v => v.id === agendamento.veiculoId);
        
        const badgeClass = {
            'Agendado': 'badge-info',
            'Confirmado': 'badge-primary',
            'Em Atendimento': 'badge-warning',
            'Concluído': 'badge-success',
            'Cancelado': 'badge-danger'
        }[agendamento.status] || 'badge-secondary';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatarData(agendamento.data)} ${agendamento.hora}</td>
            <td>${cliente ? cliente.nome : '-'}</td>
            <td>${veiculo ? `${veiculo.placa} - ${veiculo.marca} ${veiculo.modelo}` : '-'}</td>
            <td>${agendamento.servicos}</td>
            <td><span class="badge ${badgeClass}">${agendamento.status}</span></td>
            <td>
                <button class="btn btn-small btn-secondary" onclick="editarAgendamento(${agendamento.id})">✏️</button>
                <button class="btn btn-small btn-danger" onclick="excluirAgendamento(${agendamento.id})">🗑️</button>
                ${agendamento.status === 'Confirmado' ? `<button class="btn btn-small btn-success" onclick="converterEmOS(${agendamento.id})">📋 OS</button>` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function converterEmOS(agendamentoId) {
    const agendamento = dados.agendamentos.find(a => a.id === agendamentoId);
    if (!agendamento) return;
    
    if (!confirm('Deseja converter este agendamento em Ordem de Serviço?')) return;
    
    // Criar OS baseada no agendamento
    const os = {
        id: gerarId(),
        numero: gerarNumeroOS(),
        clienteId: agendamento.clienteId,
        veiculoId: agendamento.veiculoId,
        dataAbertura: new Date().toISOString(),
        status: 'Aberta',
        problema: agendamento.servicos,
        observacoes: agendamento.observacoes || '',
        servicos: [],
        pecas: [],
        valorTotal: 0,
        desconto: 0
    };
    
    dados.ordens.push(os);
    
    // Atualizar status do agendamento
    agendamento.status = 'Em Atendimento';
    
    salvarDados();
    renderizarAgendamentos();
    alert('Agendamento convertido em OS com sucesso! Vá para Ordens de Serviço para continuar.');
}



// ========== FUNÇÕES DE PDF PROFISSIONAIS ==========

// Função auxiliar para converter imagem em base64
async function imagemParaBase64(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Erro ao carregar imagem:', error);
        return null;
    }
}

// Gerar PDF da Ordem de Serviço com jsPDF
async function gerarPDFOrdemProfissional(ordemId) {
    const ordem = dados.ordens.find(o => o.id === ordemId);
    if (!ordem) {
        alert('Ordem de serviço não encontrada!');
        return;
    }
    
    const cliente = dados.clientes.find(c => c.id === ordem.clienteId);
    const veiculo = dados.veiculos.find(v => v.id === ordem.veiculoId);
    
    // Criar novo PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Carregar logo
    const logoBase64 = await imagemParaBase64('logo.png');
    
    let y = 20;
    
    // Logo e cabeçalho
    if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', 15, y, 30, 30);
    }
    
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('OFICINA MECÂNICA', 105, y + 10, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(30, 58, 138);
    doc.text(`ORDEM DE SERVIÇO Nº ${ordem.numero}`, 105, y + 20, { align: 'center' });
    
    // Linha separadora
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(1);
    doc.line(15, y + 30, 195, y + 30);
    
    y = y + 40;
    
    // Dados da Ordem
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('DADOS DA ORDEM', 15, y);
    y += 8;
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(`Data Abertura: ${formatarDataHora(ordem.dataAbertura)}`, 15, y);
    doc.text(`Status: ${ordem.status}`, 120, y);
    y += 6;
    
    if (ordem.dataFechamento) {
        doc.text(`Data Fechamento: ${formatarDataHora(ordem.dataFechamento)}`, 15, y);
        y += 6;
    }
    
    y += 5;
    
    // Dados do Cliente
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('DADOS DO CLIENTE', 15, y);
    y += 8;
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(`Nome: ${cliente ? cliente.nome : '-'}`, 15, y);
    y += 6;
    doc.text(`CPF/CNPJ: ${cliente ? cliente.cpfCnpj : '-'}`, 15, y);
    doc.text(`Telefone: ${cliente ? cliente.telefone : '-'}`, 120, y);
    y += 6;
    doc.text(`Email: ${cliente ? cliente.email : '-'}`, 15, y);
    y += 10;
    
    // Dados do Veículo
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('DADOS DO VEÍCULO', 15, y);
    y += 8;
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(`Placa: ${veiculo ? veiculo.placa : '-'}`, 15, y);
    doc.text(`Marca/Modelo: ${veiculo ? `${veiculo.marca} ${veiculo.modelo}` : '-'}`, 70, y);
    y += 6;
    doc.text(`Ano: ${veiculo ? veiculo.ano : '-'}`, 15, y);
    doc.text(`Cor: ${veiculo ? veiculo.cor : '-'}`, 70, y);
    doc.text(`KM: ${veiculo ? veiculo.km : '-'}`, 120, y);
    y += 10;
    
    // Problema Relatado
    if (ordem.problema) {
        doc.setFont(undefined, 'bold');
        doc.setFontSize(12);
        doc.text('PROBLEMA RELATADO', 15, y);
        y += 8;
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        const problemaLines = doc.splitTextToSize(ordem.problema, 180);
        doc.text(problemaLines, 15, y);
        y += (problemaLines.length * 6) + 5;
    }
    
    // Serviços Realizados
    if (ordem.servicos && ordem.servicos.length > 0) {
        doc.setFont(undefined, 'bold');
        doc.setFontSize(12);
        doc.text('SERVIÇOS REALIZADOS', 15, y);
        y += 8;
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);
        
        // Cabeçalho da tabela
        doc.setFillColor(30, 58, 138);
        doc.setTextColor(255, 255, 255);
        doc.rect(15, y - 5, 180, 7, 'F');
        doc.text('Descrição', 17, y);
        doc.text('Valor', 170, y);
        y += 7;
        
        doc.setTextColor(0, 0, 0);
        
        ordem.servicos.forEach(s => {
            const servico = dados.servicos.find(srv => srv.id === s.servicoId);
            if (servico) {
                doc.text(servico.descricao, 17, y);
                doc.text(formatarMoeda(servico.valorMaoObra), 170, y);
                y += 6;
            }
        });
        
        y += 5;
    }
    
    // Peças Utilizadas
    if (ordem.pecas && ordem.pecas.length > 0) {
        doc.setFont(undefined, 'bold');
        doc.setFontSize(12);
        doc.text('PEÇAS UTILIZADAS', 15, y);
        y += 8;
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);
        
        // Cabeçalho da tabela
        doc.setFillColor(30, 58, 138);
        doc.setTextColor(255, 255, 255);
        doc.rect(15, y - 5, 180, 7, 'F');
        doc.text('Descrição', 17, y);
        doc.text('Qtd', 130, y);
        doc.text('Valor Unit.', 150, y);
        doc.text('Total', 175, y);
        y += 7;
        
        doc.setTextColor(0, 0, 0);
        
        ordem.pecas.forEach(p => {
            const peca = dados.pecas.find(pc => pc.id === p.pecaId);
            if (peca) {
                doc.text(peca.descricao, 17, y);
                doc.text(p.quantidade.toString(), 130, y);
                doc.text(formatarMoeda(peca.precoVenda), 150, y);
                doc.text(formatarMoeda(peca.precoVenda * p.quantidade), 175, y);
                y += 6;
            }
        });
        
        y += 5;
    }
    
    // Observações
    if (ordem.observacoes) {
        doc.setFont(undefined, 'bold');
        doc.setFontSize(12);
        doc.text('OBSERVAÇÕES', 15, y);
        y += 8;
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        const obsLines = doc.splitTextToSize(ordem.observacoes, 180);
        doc.text(obsLines, 15, y);
        y += (obsLines.length * 6) + 10;
    }
    
    // Valores Totais
    doc.setFillColor(240, 240, 240);
    doc.rect(15, y - 5, 180, 25, 'F');
    
    doc.setFont(undefined, 'bold');
    doc.setFontSize(11);
    
    if (ordem.desconto > 0) {
        doc.text('Subtotal:', 120, y);
        doc.text(formatarMoeda(ordem.valorTotal + ordem.desconto), 175, y, { align: 'right' });
        y += 7;
        
        doc.text('Desconto:', 120, y);
        doc.text(formatarMoeda(ordem.desconto), 175, y, { align: 'right' });
        y += 7;
    }
    
    doc.setFontSize(14);
    doc.text('VALOR TOTAL:', 120, y);
    doc.text(formatarMoeda(ordem.valorTotal), 175, y, { align: 'right' });
    
    y += 20;
    
    // Assinaturas
    if (y > 240) {
        doc.addPage();
        y = 20;
    }
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    doc.line(30, y, 90, y);
    doc.text('Assinatura do Cliente', 60, y + 5, { align: 'center' });
    
    doc.line(110, y, 170, y);
    doc.text('Assinatura da Oficina', 140, y + 5, { align: 'center' });
    
    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Documento gerado em ${formatarDataHora(new Date())}`, 105, 285, { align: 'center' });
    doc.text('Sistema de Gestão para Oficina Mecânica', 105, 290, { align: 'center' });
    
    // Salvar PDF
    doc.save(`OS_${ordem.numero}.pdf`);
}

// Gerar Relatório Financeiro em PDF
async function gerarRelatorioFinanceiroPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const logoBase64 = await imagemParaBase64('logo.png');
    
    let y = 20;
    
    // Cabeçalho
    if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', 15, y, 25, 25);
    }
    
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('RELATÓRIO FINANCEIRO', 105, y + 10, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Gerado em: ${formatarDataHora(new Date())}`, 105, y + 18, { align: 'center' });
    
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(1);
    doc.line(15, y + 25, 195, y + 25);
    
    y = y + 35;
    
    // Calcular totais
    const receitas = dados.financeiro.filter(f => f.tipo === 'Receita');
    const despesas = dados.financeiro.filter(f => f.tipo === 'Despesa');
    
    const totalReceitas = receitas.reduce((sum, f) => sum + f.valor, 0);
    const totalDespesas = despesas.reduce((sum, f) => sum + f.valor, 0);
    const lucro = totalReceitas - totalDespesas;
    
    // Resumo
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('RESUMO FINANCEIRO', 15, y);
    y += 10;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    
    doc.setFillColor(220, 252, 231);
    doc.rect(15, y - 5, 180, 10, 'F');
    doc.text('Total de Receitas:', 20, y);
    doc.text(formatarMoeda(totalReceitas), 175, y, { align: 'right' });
    y += 12;
    
    doc.setFillColor(254, 226, 226);
    doc.rect(15, y - 5, 180, 10, 'F');
    doc.text('Total de Despesas:', 20, y);
    doc.text(formatarMoeda(totalDespesas), 175, y, { align: 'right' });
    y += 12;
    
    doc.setFillColor(219, 234, 254);
    doc.rect(15, y - 5, 180, 10, 'F');
    doc.setFont(undefined, 'bold');
    doc.text('Lucro/Prejuízo:', 20, y);
    doc.text(formatarMoeda(lucro), 175, y, { align: 'right' });
    y += 20;
    
    // Receitas Detalhadas
    if (receitas.length > 0) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('RECEITAS', 15, y);
        y += 8;
        
        doc.setFontSize(9);
        doc.setFillColor(30, 58, 138);
        doc.setTextColor(255, 255, 255);
        doc.rect(15, y - 5, 180, 7, 'F');
        doc.text('Data', 17, y);
        doc.text('Descrição', 50, y);
        doc.text('Origem', 130, y);
        doc.text('Valor', 175, y, { align: 'right' });
        y += 7;
        
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'normal');
        
        receitas.forEach(r => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            
            doc.text(formatarData(r.data), 17, y);
            doc.text(r.descricao.substring(0, 35), 50, y);
            doc.text(r.origem || '-', 130, y);
            doc.text(formatarMoeda(r.valor), 175, y, { align: 'right' });
            y += 6;
        });
        
        y += 10;
    }
    
    // Despesas Detalhadas
    if (despesas.length > 0 && y < 200) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('DESPESAS', 15, y);
        y += 8;
        
        doc.setFontSize(9);
        doc.setFillColor(30, 58, 138);
        doc.setTextColor(255, 255, 255);
        doc.rect(15, y - 5, 180, 7, 'F');
        doc.text('Data', 17, y);
        doc.text('Descrição', 50, y);
        doc.text('Origem', 130, y);
        doc.text('Valor', 175, y, { align: 'right' });
        y += 7;
        
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'normal');
        
        despesas.forEach(d => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            
            doc.text(formatarData(d.data), 17, y);
            doc.text(d.descricao.substring(0, 35), 50, y);
            doc.text(d.origem || '-', 130, y);
            doc.text(formatarMoeda(d.valor), 175, y, { align: 'right' });
            y += 6;
        });
    }
    
    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Sistema de Gestão para Oficina Mecânica', 105, 290, { align: 'center' });
    
    doc.save(`Relatorio_Financeiro_${new Date().toISOString().split('T')[0]}.pdf`);
}

// Gerar Relatório de Serviços em PDF
async function gerarRelatorioServicosPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const logoBase64 = await imagemParaBase64('logo.png');
    
    let y = 20;
    
    // Cabeçalho
    if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', 15, y, 25, 25);
    }
    
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('RELATÓRIO DE SERVIÇOS', 105, y + 10, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Gerado em: ${formatarDataHora(new Date())}`, 105, y + 18, { align: 'center' });
    
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(1);
    doc.line(15, y + 25, 195, y + 25);
    
    y = y + 35;
    
    // Estatísticas
    const ordensCompletas = dados.ordens.filter(o => o.status === 'Concluída');
    const totalServicos = ordensCompletas.length;
    const faturamentoTotal = ordensCompletas.reduce((sum, o) => sum + (o.valorTotal || 0), 0);
    const ticketMedio = totalServicos > 0 ? faturamentoTotal / totalServicos : 0;
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('ESTATÍSTICAS', 15, y);
    y += 10;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    
    doc.text(`Total de Serviços Concluídos: ${totalServicos}`, 20, y);
    y += 7;
    doc.text(`Faturamento Total: ${formatarMoeda(faturamentoTotal)}`, 20, y);
    y += 7;
    doc.text(`Ticket Médio: ${formatarMoeda(ticketMedio)}`, 20, y);
    y += 15;
    
    // Ordens de Serviço
    if (ordensCompletas.length > 0) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('ORDENS DE SERVIÇO CONCLUÍDAS', 15, y);
        y += 8;
        
        doc.setFontSize(9);
        doc.setFillColor(30, 58, 138);
        doc.setTextColor(255, 255, 255);
        doc.rect(15, y - 5, 180, 7, 'F');
        doc.text('Nº OS', 17, y);
        doc.text('Cliente', 40, y);
        doc.text('Data', 100, y);
        doc.text('Valor', 175, y, { align: 'right' });
        y += 7;
        
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'normal');
        
        ordensCompletas.forEach(o => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            
            const cliente = dados.clientes.find(c => c.id === o.clienteId);
            
            doc.text(o.numero, 17, y);
            doc.text(cliente ? cliente.nome.substring(0, 25) : '-', 40, y);
            doc.text(formatarData(o.dataAbertura), 100, y);
            doc.text(formatarMoeda(o.valorTotal), 175, y, { align: 'right' });
            y += 6;
        });
    }
    
    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Sistema de Gestão para Oficina Mecânica', 105, 290, { align: 'center' });
    
    doc.save(`Relatorio_Servicos_${new Date().toISOString().split('T')[0]}.pdf`);
}

// Gerar Relatório de Clientes em PDF
async function gerarRelatorioClientesPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const logoBase64 = await imagemParaBase64('logo.png');
    
    let y = 20;
    
    // Cabeçalho
    if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', 15, y, 25, 25);
    }
    
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('RELATÓRIO DE CLIENTES', 105, y + 10, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Gerado em: ${formatarDataHora(new Date())}`, 105, y + 18, { align: 'center' });
    
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(1);
    doc.line(15, y + 25, 195, y + 25);
    
    y = y + 35;
    
    // Estatísticas
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('ESTATÍSTICAS', 15, y);
    y += 10;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`Total de Clientes: ${dados.clientes.length}`, 20, y);
    y += 7;
    doc.text(`Total de Veículos: ${dados.veiculos.length}`, 20, y);
    y += 15;
    
    // Lista de Clientes
    if (dados.clientes.length > 0) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('CLIENTES CADASTRADOS', 15, y);
        y += 8;
        
        doc.setFontSize(9);
        doc.setFillColor(30, 58, 138);
        doc.setTextColor(255, 255, 255);
        doc.rect(15, y - 5, 180, 7, 'F');
        doc.text('Nome', 17, y);
        doc.text('Telefone', 90, y);
        doc.text('Veículos', 130, y);
        doc.text('Total Gasto', 165, y, { align: 'right' });
        y += 7;
        
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'normal');
        
        dados.clientes.forEach(c => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            
            const veiculos = dados.veiculos.filter(v => v.clienteId === c.id);
            const ordens = dados.ordens.filter(o => o.clienteId === c.id && o.status === 'Concluída');
            const totalGasto = ordens.reduce((sum, o) => sum + (o.valorTotal || 0), 0);
            
            doc.text(c.nome.substring(0, 30), 17, y);
            doc.text(c.telefone || '-', 90, y);
            doc.text(veiculos.length.toString(), 130, y);
            doc.text(formatarMoeda(totalGasto), 165, y, { align: 'right' });
            y += 6;
        });
    }
    
    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Sistema de Gestão para Oficina Mecânica', 105, 290, { align: 'center' });
    
    doc.save(`Relatorio_Clientes_${new Date().toISOString().split('T')[0]}.pdf`);
}

// Substituir função antiga de gerar PDF por esta nova
window.gerarPDFOrdem = gerarPDFOrdemProfissional;




// ========== FUNÇÕES AUXILIARES ORDEM DE SERVIÇO ==========

// ========== FUNÇÕES DE MODAL (CORREÇÃO) ==========
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
    }
}

function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
}

// Sobrescrever a função fecharModal para garantir que ela esteja no escopo global
window.fecharModal = fecharModal;
window.openModal = openModal;

// Fim das Funções de Modal (Correção)


let servicosOS = [];
let pecasOS = [];

function adicionarServicoOS() {
    const container = document.getElementById('ordemServicosLista');
    const index = servicosOS.length;
    
    const div = document.createElement('div');
    div.className = 'servico-os-item';
    div.innerHTML = `
        <div class="form-row">
            <div class="form-group" style="flex: 2">
                <select class="servico-select" onchange="preencherValorServico(this, ${index})">
                    <option value="">Selecione um serviço...</option>
                    ${dados.servicos.map(s => `<option value="${s.id}" data-valor="${s.valor}">${s.descricao} - ${formatarMoeda(s.valor)}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <input type="number" class="servico-valor" placeholder="Valor" step="0.01" min="0" onchange="calcularTotalOS()">
            </div>
            <button type="button" class="btn btn-danger btn-sm" onclick="removerServicoOS(${index})">×</button>
        </div>
    `;
    container.appendChild(div);
    servicosOS.push({});
}

function preencherValorServico(select, index) {
    const option = select.options[select.selectedIndex];
    const valor = option.getAttribute('data-valor');
    const valorInput = select.closest('.servico-os-item').querySelector('.servico-valor');
    valorInput.value = valor || 0;
    
    servicosOS[index] = {
        id: select.value,
        descricao: option.text.split(' - ')[0],
        valor: parseFloat(valor || 0)
    };
    calcularTotalOS();
}

function removerServicoOS(index) {
    const container = document.getElementById('ordemServicosLista');
    container.children[index].remove();
    servicosOS.splice(index, 1);
    calcularTotalOS();
}

function adicionarPecaOS() {
    const container = document.getElementById('ordemPecasLista');
    const index = pecasOS.length;
    
    const div = document.createElement('div');
    div.className = 'peca-os-item';
    div.innerHTML = `
        <div class="form-row">
            <div class="form-group" style="flex: 2">
                <select class="peca-select" onchange="preencherValorPeca(this, ${index})">
                    <option value="">Selecione uma peça...</option>
                    ${dados.pecas.map(p => `<option value="${p.id}" data-preco="${p.precoVenda}" data-estoque="${p.estoque}">${p.descricao} - ${formatarMoeda(p.precoVenda)} (Est: ${p.estoque})</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <input type="number" class="peca-qtd" placeholder="Qtd" min="1" value="1" onchange="atualizarPecaOS(${index})">
            </div>
            <div class="form-group">
                <input type="number" class="peca-valor" placeholder="Valor Unit." step="0.01" min="0" readonly>
            </div>
            <div class="form-group">
                <input type="number" class="peca-total" placeholder="Total" step="0.01" readonly>
            </div>
            <button type="button" class="btn btn-danger btn-sm" onclick="removerPecaOS(${index})">×</button>
        </div>
    `;
    container.appendChild(div);
    pecasOS.push({});
}

function preencherValorPeca(select, index) {
    const option = select.options[select.selectedIndex];
    const preco = option.getAttribute('data-preco');
    const estoque = option.getAttribute('data-estoque');
    const item = select.closest('.peca-os-item');
    const valorInput = item.querySelector('.peca-valor');
    const qtdInput = item.querySelector('.peca-qtd');
    
    valorInput.value = preco || 0;
    qtdInput.max = estoque;
    
    pecasOS[index] = {
        id: select.value,
        descricao: option.text.split(' - ')[0],
        precoUnitario: parseFloat(preco || 0),
        quantidade: parseInt(qtdInput.value || 1),
        total: parseFloat(preco || 0) * parseInt(qtdInput.value || 1)
    };
    
    atualizarPecaOS(index);
}

function atualizarPecaOS(index) {
    const item = document.querySelectorAll('.peca-os-item')[index];
    const qtd = parseInt(item.querySelector('.peca-qtd').value || 1);
    const valorUnit = parseFloat(item.querySelector('.peca-valor').value || 0);
    const total = qtd * valorUnit;
    
    item.querySelector('.peca-total').value = total.toFixed(2);
    
    if (pecasOS[index]) {
        pecasOS[index].quantidade = qtd;
        pecasOS[index].total = total;
    }
    
    calcularTotalOS();
}

function removerPecaOS(index) {
    const container = document.getElementById('ordemPecasLista');
    container.children[index].remove();
    pecasOS.splice(index, 1);
    calcularTotalOS();
}

function calcularTotalOS() {
    const totalServicos = servicosOS.reduce((sum, s) => sum + (s.valor || 0), 0);
    const totalPecas = pecasOS.reduce((sum, p) => sum + (p.total || 0), 0);
    const desconto = parseFloat(document.getElementById('ordemDesconto')?.value || 0);
    const total = totalServicos + totalPecas - desconto;
    
    const totalEl = document.getElementById('ordemTotal');
    if (totalEl) {
        totalEl.textContent = formatarMoeda(total);
    }
    
    return total;
}

function carregarVeiculosCliente(clienteId, selectId) {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">Selecione um veículo...</option>';
    
    if (!clienteId) return;
    
    const veiculos = dados.veiculos.filter(v => v.clienteId == clienteId);
    veiculos.forEach(v => {
        const option = document.createElement('option');
        option.value = v.id;
        option.textContent = `${v.placa} - ${v.marca} ${v.modelo}`;
        select.appendChild(option);
    });
}

function limparFormularioOS() {
    servicosOS = [];
    pecasOS = [];
    document.getElementById('ordemServicosLista').innerHTML = '';
    document.getElementById('ordemPecasLista').innerHTML = '';
    document.getElementById('ordemTotal').textContent = 'R$ 0,00';
}

// ========== NOTIFICAÇÕES ==========
function mostrarNotificacao(mensagem, tipo = 'success') {
    const notif = document.createElement('div');
    notif.className = `notificacao notificacao-${tipo}`;
    notif.textContent = mensagem;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'success' ? '#4CAF50' : tipo === 'danger' ? '#f44336' : '#ff9800'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    .modal-large .modal-content {
        max-width: 900px;
    }
    .servico-os-item, .peca-os-item {
        margin-bottom: 10px;
        padding: 10px;
        background: #f5f5f5;
        border-radius: 5px;
    }
    .form-row {
        display: flex;
        gap: 10px;
        align-items: flex-end;
    }
    .form-row .form-group {
        flex: 1;
        margin-bottom: 0;
    }
    .total-os {
        background: #e3f2fd;
        padding: 15px;
        border-radius: 5px;
        text-align: right;
        margin: 20px 0;
    }
    .total-os h3 {
        margin: 0;
        color: #1976d2;
    }
`;
document.head.appendChild(style);

