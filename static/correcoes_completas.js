// ========== CORREÇÕES COMPLETAS DO SISTEMA ==========
// Este arquivo corrige TODOS os problemas reportados

console.log('🔧 Carregando correções completas...');

// ========== 1. CARREGAR VEÍCULOS AO SELECIONAR CLIENTE ==========

// Função para adicionar event listeners aos selects de cliente
function configurarCarregamentoVeiculos() {
    // Agendamentos
    const agendamentoCliente = document.getElementById('agendamentoClienteId');
    if (agendamentoCliente) {
        agendamentoCliente.addEventListener('change', function() {
            carregarVeiculosSelectAgenda(this.value);
        });
    }
    
    // Ordens de Serviço
    const ordemCliente = document.getElementById('ordemClienteId');
    if (ordemCliente) {
        ordemCliente.addEventListener('change', function() {
            const selectVeiculo = document.getElementById('ordemVeiculoId');
            if (!selectVeiculo) return;
            
            selectVeiculo.innerHTML = '<option value="">Selecione um veículo...</option>';
            
            if (!this.value) return;
            
            const veiculos = dados.veiculos.filter(v => v.clienteId == this.value);
            veiculos.forEach(veiculo => {
                const option = document.createElement('option');
                option.value = veiculo.id;
                option.textContent = `${veiculo.placa} - ${veiculo.marca} ${veiculo.modelo}`;
                selectVeiculo.appendChild(option);
            });
        });
    }
}

// ========== 2. MELHORAR BOTÕES SALVAR ==========

// Sobrescrever função salvarCliente
const salvarClienteOriginal = window.salvarCliente;
window.salvarCliente = function() {
    const result = salvarClienteOriginal();
    if (result !== false) {
        mostrarNotificacao('✅ Cliente salvo com sucesso!', 'success');
        fecharModal('clienteModal');
        renderizarClientes();
    }
};

// Sobrescrever função salvarVeiculo
const salvarVeiculoOriginal = window.salvarVeiculo;
window.salvarVeiculo = function() {
    const result = salvarVeiculoOriginal();
    if (result !== false) {
        mostrarNotificacao('✅ Veículo salvo com sucesso!', 'success');
        fecharModal('veiculoModal');
        renderizarVeiculos();
    }
};

// Sobrescrever função salvarAgendamento
const salvarAgendamentoOriginal = window.salvarAgendamento;
window.salvarAgendamento = function() {
    const result = salvarAgendamentoOriginal();
    if (result !== false) {
        mostrarNotificacao('✅ Agendamento salvo com sucesso!', 'success');
        fecharModal('agendamentoModal');
        renderizarAgendamentos();
    }
};

// Sobrescrever função salvarOrdem
const salvarOrdemOriginal = window.salvarOrdem;
window.salvarOrdem = function() {
    const result = salvarOrdemOriginal();
    if (result !== false) {
        mostrarNotificacao('✅ Ordem de Serviço salva com sucesso!', 'success');
        fecharModal('ordemModal');
        renderizarOrdensServico();
    }
};

// ========== 3. ADICIONAR PLACEHOLDERS DESCRITIVOS ==========

function adicionarPlaceholders() {
    // Clientes
    const clienteNome = document.getElementById('clienteNome');
    if (clienteNome && !clienteNome.placeholder) {
        clienteNome.placeholder = 'Digite o nome completo do cliente';
    }
    
    const clienteCpf = document.getElementById('clienteCpfCnpj');
    if (clienteCpf && !clienteCpf.placeholder) {
        clienteCpf.placeholder = 'Digite o CPF ou CNPJ';
    }
    
    const clienteTel = document.getElementById('clienteTelefone');
    if (clienteTel && !clienteTel.placeholder) {
        clienteTel.placeholder = '(00) 00000-0000';
    }
    
    const clienteEmail = document.getElementById('clienteEmail');
    if (clienteEmail && !clienteEmail.placeholder) {
        clienteEmail.placeholder = 'email@exemplo.com';
    }
    
    // Veículos
    const veiculoPlaca = document.getElementById('veiculoPlaca');
    if (veiculoPlaca && !veiculoPlaca.placeholder) {
        veiculoPlaca.placeholder = 'ABC-1234';
    }
    
    const veiculoMarca = document.getElementById('veiculoMarca');
    if (veiculoMarca && !veiculoMarca.placeholder) {
        veiculoMarca.placeholder = 'Ex: Volkswagen, Fiat, Chevrolet';
    }
    
    const veiculoModelo = document.getElementById('veiculoModelo');
    if (veiculoModelo && !veiculoModelo.placeholder) {
        veiculoModelo.placeholder = 'Ex: Gol, Uno, Onix';
    }
}

// ========== 4. CORRIGIR FINANCEIRO ==========

// Adicionar event listeners para botões de receita e despesa
function configurarFinanceiro() {
    const btnReceita = document.querySelector('#financeiro button[onclick*="Receita"]');
    if (btnReceita) {
        btnReceita.onclick = function() {
            abrirModalMovimentacao('receita');
        };
    }
    
    const btnDespesa = document.querySelector('#financeiro button[onclick*="Despesa"]');
    if (btnDespesa) {
        btnDespesa.onclick = function() {
            abrirModalMovimentacao('despesa');
        };
    }
}

function abrirModalMovimentacao(tipo) {
    // Criar modal dinâmico
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'movimentacaoModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${tipo === 'receita' ? '💰 Nova Receita' : '💸 Nova Despesa'}</h3>
                <span class="close" onclick="document.getElementById('movimentacaoModal').remove()">&times;</span>
            </div>
            <form onsubmit="salvarMovimentacao(event, '${tipo}')">
                <div class="form-group">
                    <label>Data *</label>
                    <input type="date" id="movData" required value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label>Categoria *</label>
                    <select id="movCategoria" required>
                        ${tipo === 'receita' ? `
                            <option value="Serviços">Serviços</option>
                            <option value="Peças">Peças</option>
                            <option value="Outros">Outros</option>
                        ` : `
                            <option value="Fornecedores">Fornecedores</option>
                            <option value="Salários">Salários</option>
                            <option value="Aluguel">Aluguel</option>
                            <option value="Energia">Energia</option>
                            <option value="Água">Água</option>
                            <option value="Internet">Internet</option>
                            <option value="Outros">Outros</option>
                        `}
                    </select>
                </div>
                <div class="form-group">
                    <label>Descrição *</label>
                    <input type="text" id="movDescricao" placeholder="Descreva a ${tipo}" required>
                </div>
                <div class="form-group">
                    <label>Valor (R$) *</label>
                    <input type="number" id="movValor" step="0.01" placeholder="0,00" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('movimentacaoModal').remove()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

window.salvarMovimentacao = function(event, tipo) {
    event.preventDefault();
    
    const movimentacao = {
        id: Date.now(),
        tipo: tipo,
        data: document.getElementById('movData').value,
        categoria: document.getElementById('movCategoria').value,
        descricao: document.getElementById('movDescricao').value,
        valor: parseFloat(document.getElementById('movValor').value),
        origem: tipo === 'receita' ? 'Manual' : 'Manual'
    };
    
    if (!dados.movimentacoes) {
        dados.movimentacoes = [];
    }
    
    dados.movimentacoes.push(movimentacao);
    salvarDados();
    
    mostrarNotificacao(`✅ ${tipo === 'receita' ? 'Receita' : 'Despesa'} salva com sucesso!`, 'success');
    document.getElementById('movimentacaoModal').remove();
    
    // Renderizar financeiro
    if (typeof renderizarFinanceiro === 'function') {
        renderizarFinanceiro();
    }
};

// ========== 5. INICIALIZAR CORREÇÕES ==========

function inicializarCorrecoes() {
    console.log('🔧 Inicializando correções...');
    
    // Aguardar DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', aplicarCorrecoes);
    } else {
        aplicarCorrecoes();
    }
}

function aplicarCorrecoes() {
    console.log('✅ Aplicando correções...');
    
    // Aplicar correções
    configurarCarregamentoVeiculos();
    adicionarPlaceholders();
    configurarFinanceiro();
    
    // Observar mudanças no DOM para reaplicar correções quando modais abrirem
    const observer = new MutationObserver(function(mutations) {
        configurarCarregamentoVeiculos();
        adicionarPlaceholders();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ Correções aplicadas com sucesso!');
}

// Inicializar
inicializarCorrecoes();




// ========== 6. CORRIGIR CARREGAMENTO DE ITENS DE COMPRA ==========

window.carregarItensCompra = function() {
    const tipo = document.getElementById('compraTipo').value;
    const selectItem = document.getElementById('compraItem');
    
    if (!selectItem) return;
    
    selectItem.innerHTML = '<option value="">Selecione...</option>';
    
    if (tipo === 'Peça') {
        dados.pecas.forEach(peca => {
            const option = document.createElement('option');
            option.value = peca.id;
            option.textContent = `${peca.codigo} - ${peca.descricao}`;
            selectItem.appendChild(option);
        });
    } else if (tipo === 'Serviço') {
        dados.servicos.forEach(servico => {
            const option = document.createElement('option');
            option.value = servico.id;
            option.textContent = servico.descricao;
            selectItem.appendChild(option);
        });
    }
};

// ========== 7. CORRIGIR RELATÓRIOS PARA MOSTRAR DADOS REAIS ==========

// Sobrescrever função gerarRelatorioCliente
if (typeof gerarRelatorioCliente !== 'undefined') {
    const gerarRelatorioClienteOriginal = window.gerarRelatorioCliente;
    window.gerarRelatorioCliente = function() {
        const clienteId = document.getElementById('relatorioClienteSelect').value;
        
        if (!clienteId) {
            alert('Por favor, selecione um cliente');
            return;
        }
        
        const cliente = dados.clientes.find(c => c.id == clienteId);
        if (!cliente) {
            alert('Cliente não encontrado');
            return;
        }
        
        // Buscar dados do cliente
        const veiculos = dados.veiculos.filter(v => v.clienteId == clienteId);
        const ordensServico = dados.ordensServico ? dados.ordensServico.filter(os => os.clienteId == clienteId) : [];
        const agendamentos = dados.agendamentos ? dados.agendamentos.filter(a => a.clienteId == clienteId) : [];
        
        // Calcular total gasto
        let totalGasto = 0;
        ordensServico.forEach(os => {
            if (os.valorTotal) {
                totalGasto += parseFloat(os.valorTotal);
            }
        });
        
        // Gerar HTML do relatório
        let html = `
            <div class="relatorio-container">
                <h2>📊 Relatório Individual do Cliente</h2>
                <hr>
                
                <h3>Dados do Cliente</h3>
                <p><strong>Nome:</strong> ${cliente.nome}</p>
                <p><strong>CPF/CNPJ:</strong> ${cliente.cpfCnpj || 'Não informado'}</p>
                <p><strong>Telefone:</strong> ${cliente.telefone || 'Não informado'}</p>
                <p><strong>Email:</strong> ${cliente.email || 'Não informado'}</p>
                <p><strong>Endereço:</strong> ${cliente.endereco || 'Não informado'}</p>
                
                <hr>
                <h3>Resumo Financeiro</h3>
                <p><strong>Total Gasto:</strong> R$ ${totalGasto.toFixed(2)}</p>
                <p><strong>Total de Serviços:</strong> ${ordensServico.length}</p>
                <p><strong>Serviços Concluídos:</strong> ${ordensServico.filter(os => os.status === 'Concluída').length}</p>
                <p><strong>Serviços Abertos:</strong> ${ordensServico.filter(os => os.status === 'Aberta' || os.status === 'Em Execução').length}</p>
                
                <hr>
                <h3>Veículos do Cliente</h3>
                ${veiculos.length > 0 ? `
                    <table>
                        <thead>
                            <tr>
                                <th>Placa</th>
                                <th>Marca</th>
                                <th>Modelo</th>
                                <th>Ano</th>
                                <th>KM</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${veiculos.map(v => `
                                <tr>
                                    <td>${v.placa}</td>
                                    <td>${v.marca}</td>
                                    <td>${v.modelo}</td>
                                    <td>${v.ano}</td>
                                    <td>${v.km || 'N/A'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p>Nenhum veículo cadastrado</p>'}
                
                <hr>
                <h3>Histórico de Ordens de Serviço</h3>
                ${ordensServico.length > 0 ? `
                    <table>
                        <thead>
                            <tr>
                                <th>OS Nº</th>
                                <th>Data</th>
                                <th>Veículo</th>
                                <th>Status</th>
                                <th>Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${ordensServico.map(os => {
                                const veiculo = dados.veiculos.find(v => v.id == os.veiculoId);
                                return `
                                    <tr>
                                        <td>${os.numero || os.id}</td>
                                        <td>${os.dataAbertura || 'N/A'}</td>
                                        <td>${veiculo ? veiculo.placa : 'N/A'}</td>
                                        <td>${os.status}</td>
                                        <td>R$ ${(os.valorTotal || 0).toFixed(2)}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                ` : '<p>Nenhuma ordem de serviço registrada</p>'}
                
                <hr>
                <h3>Agendamentos</h3>
                ${agendamentos.length > 0 ? `
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Hora</th>
                                <th>Serviços</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${agendamentos.map(a => `
                                <tr>
                                    <td>${a.data}</td>
                                    <td>${a.hora}</td>
                                    <td>${a.servicos}</td>
                                    <td>${a.status}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p>Nenhum agendamento registrado</p>'}
                
                <hr>
                <p><small>Relatório gerado em ${new Date().toLocaleString('pt-BR')}</small></p>
            </div>
        `;
        
        // Exibir relatório
        const container = document.getElementById('relatorioClienteResultado');
        if (container) {
            container.innerHTML = html;
            container.style.display = 'block';
        }
    };
}

// ========== 8. MELHORAR SISTEMA DE NOTIFICAÇÕES ==========

// Garantir que a função mostrarNotificacao existe e funciona
if (typeof mostrarNotificacao === 'undefined') {
    window.mostrarNotificacao = function(mensagem, tipo = 'info') {
        // Remover notificações anteriores
        const notifAnterior = document.querySelector('.notificacao-toast');
        if (notifAnterior) {
            notifAnterior.remove();
        }
        
        // Criar notificação
        const notif = document.createElement('div');
        notif.className = `notificacao-toast notificacao-${tipo}`;
        notif.textContent = mensagem;
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${tipo === 'success' ? '#4CAF50' : tipo === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notif);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notif.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    };
    
    // Adicionar animações CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

console.log('✅ Todas as correções foram carregadas!');

