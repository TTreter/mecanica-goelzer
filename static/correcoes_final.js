// ========== CORREÇÕES FINAIS COMPLETAS ==========
// Versão 4.0 - Todas as funcionalidades corrigidas

console.log('🔧 Carregando correções finais v4.0...');

// Aguardar sistema carregar
setTimeout(function() {
    console.log('✅ Aplicando correções finais...');
    
    // ========== 1. CARREGAR VEÍCULOS AO SELECIONAR CLIENTE ==========
    
    // Agendamentos
    const agendamentoCliente = document.getElementById('agendamentoClienteId');
    if (agendamentoCliente) {
        agendamentoCliente.removeEventListener('change', carregarVeiculosAgendamento);
        agendamentoCliente.addEventListener('change', carregarVeiculosAgendamento);
    }
    
    function carregarVeiculosAgendamento() {
        const clienteId = this.value;
        const selectVeiculo = document.getElementById('agendamentoVeiculoId');
        if (!selectVeiculo) return;
        
        selectVeiculo.innerHTML = '<option value="">Selecione um veículo...</option>';
        
        if (!clienteId) return;
        
        const veiculos = dados.veiculos.filter(v => v.clienteId == clienteId);
        veiculos.forEach(veiculo => {
            const option = document.createElement('option');
            option.value = veiculo.id;
            option.textContent = `${veiculo.placa} - ${veiculo.marca} ${veiculo.modelo}`;
            selectVeiculo.appendChild(option);
        });
    }
    
    // Ordens de Serviço
    const ordemCliente = document.getElementById('ordemClienteId');
    if (ordemCliente) {
        ordemCliente.removeEventListener('change', carregarVeiculosOrdem);
        ordemCliente.addEventListener('change', carregarVeiculosOrdem);
    }
    
    function carregarVeiculosOrdem() {
        const clienteId = this.value;
        const selectVeiculo = document.getElementById('ordemVeiculoId');
        if (!selectVeiculo) return;
        
        selectVeiculo.innerHTML = '<option value="">Selecione um veículo...</option>';
        
        if (!clienteId) return;
        
        const veiculos = dados.veiculos.filter(v => v.clienteId == clienteId);
        veiculos.forEach(veiculo => {
            const option = document.createElement('option');
            option.value = veiculo.id;
            option.textContent = `${veiculo.placa} - ${veiculo.marca} ${veiculo.modelo}`;
            selectVeiculo.appendChild(option);
        });
    }
    
    // ========== 2. CORRIGIR FINANCEIRO ==========
    
    // Buscar botões de receita e despesa
    const botoes = document.querySelectorAll('#financeiro button');
    botoes.forEach(btn => {
        if (btn.textContent.includes('Receita')) {
            btn.onclick = function() { abrirModalMovimentacao('receita'); };
        } else if (btn.textContent.includes('Despesa')) {
            btn.onclick = function() { abrirModalMovimentacao('despesa'); };
        }
    });
    
    console.log('✅ Correções finais aplicadas com sucesso!');
    
}, 1000);

// ========== FUNÇÕES AUXILIARES ==========

function abrirModalMovimentacao(tipo) {
    // Remover modal anterior se existir
    const modalAntigo = document.getElementById('movimentacaoModal');
    if (modalAntigo) {
        modalAntigo.remove();
    }
    
    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'movimentacaoModal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${tipo === 'receita' ? '💰 Nova Receita' : '💸 Nova Despesa'}</h3>
                <span class="close" onclick="document.getElementById('movimentacaoModal').remove()">&times;</span>
            </div>
            <form onsubmit="salvarMovimentacaoFinal(event, '${tipo}')">
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
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('movimentacaoModal').remove()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

window.salvarMovimentacaoFinal = function(event, tipo) {
    event.preventDefault();
    
    const movimentacao = {
        id: Date.now(),
        tipo: tipo,
        data: document.getElementById('movData').value,
        categoria: document.getElementById('movCategoria').value,
        descricao: document.getElementById('movDescricao').value,
        valor: parseFloat(document.getElementById('movValor').value),
        origem: 'Manual'
    };
    
    if (!dados.movimentacoes) {
        dados.movimentacoes = [];
    }
    
    dados.movimentacoes.push(movimentacao);
    salvarDados();
    
    // Mostrar notificação
    alert(`✅ ${tipo === 'receita' ? 'Receita' : 'Despesa'} salva com sucesso!`);
    
    // Fechar modal
    document.getElementById('movimentacaoModal').remove();
    
    // Atualizar página
    if (typeof renderizarFinanceiro === 'function') {
        renderizarFinanceiro();
    }
};

console.log('✅ Arquivo de correções finais carregado!');

