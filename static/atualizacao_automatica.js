// ========== SISTEMA DE ATUALIZAÇÃO AUTOMÁTICA ==========
// Versão 1.0 - Atualiza interface sem precisar F5

console.log('🔄 Sistema de atualização automática carregado!');

// ========== SOBRESCREVER FUNÇÕES DE SALVAMENTO ==========

// Guardar referências originais
const salvarDadosOriginal = window.salvarDados;

// Criar nova função salvarDados que atualiza automaticamente
window.salvarDados = function() {
    // Chamar função original
    if (salvarDadosOriginal) {
        salvarDadosOriginal();
    } else {
        // Fallback se não existir
        try {
            localStorage.setItem('oficinaDados', JSON.stringify(dados));
        } catch (e) {
            console.error('Erro ao salvar dados:', e);
        }
    }
    
    // Atualizar dashboard se estiver visível
    if (document.getElementById('dashboard') && document.getElementById('dashboard').style.display !== 'none') {
        if (typeof atualizarDashboard === 'function') {
            atualizarDashboard();
        }
    }
};

// ========== SOBRESCREVER FUNÇÕES DE SALVAMENTO DE ENTIDADES ==========

// Função auxiliar para fechar modal e atualizar
function salvarEAtualizar(funcaoSalvar, funcaoRenderizar, modalId) {
    return function() {
        try {
            // Executar salvamento
            const resultado = funcaoSalvar.apply(this, arguments);
            
            // Se retornou false, houve erro de validação
            if (resultado === false) {
                return false;
            }
            
            // Salvar dados
            salvarDados();
            
            // Renderizar lista atualizada
            if (typeof funcaoRenderizar === 'function') {
                funcaoRenderizar();
            }
            
            // Fechar modal
            if (modalId) {
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.style.display = 'none';
                    modal.classList.remove('active');
                }
            }
            
            return true;
        } catch (e) {
            console.error('Erro ao salvar:', e);
            notificarErro('Erro ao salvar: ' + e.message);
            return false;
        }
    };
}

// Aguardar carregamento do sistema
setTimeout(function() {
    console.log('🔄 Aplicando atualização automática...');
    
    // ========== CLIENTES ==========
    if (typeof window.salvarCliente === 'function') {
        const salvarClienteOriginal = window.salvarCliente;
        window.salvarCliente = function() {
            try {
                // Coletar dados do formulário
                const id = document.getElementById('clienteId') ? document.getElementById('clienteId').value : null;
                const cliente = {
                    nome: document.getElementById('clienteNome').value,
                    cpfCnpj: document.getElementById('clienteCpfCnpj') ? document.getElementById('clienteCpfCnpj').value : '',
                    telefone: document.getElementById('clienteTelefone') ? document.getElementById('clienteTelefone').value : '',
                    email: document.getElementById('clienteEmail') ? document.getElementById('clienteEmail').value : '',
                    endereco: document.getElementById('clienteEndereco') ? document.getElementById('clienteEndereco').value : ''
                };
                
                // Validar
                if (typeof validarCliente === 'function') {
                    const erros = validarCliente(cliente);
                    if (erros.length > 0) {
                        mostrarErrosValidacao(erros);
                        return false;
                    }
                }
                
                // Salvar
                if (id) {
                    // Edição
                    const index = dados.clientes.findIndex(c => c.id == id);
                    if (index !== -1) {
                        dados.clientes[index] = { ...cliente, id: parseInt(id) };
                        notificarSucesso('Cliente atualizado com sucesso!');
                    }
                } else {
                    // Novo
                    cliente.id = Date.now();
                    dados.clientes.push(cliente);
                    notificarSucesso('Cliente cadastrado com sucesso!');
                }
                
                salvarDados();
                
                if (typeof renderizarClientes === 'function') {
                    renderizarClientes();
                }
                
                // Fechar modal
                const modal = document.getElementById('clienteModal');
                if (modal) {
                    modal.style.display = 'none';
                    modal.classList.remove('active');
                }
                
                // Limpar formulário
                document.getElementById('clienteNome').value = '';
                if (document.getElementById('clienteCpfCnpj')) document.getElementById('clienteCpfCnpj').value = '';
                if (document.getElementById('clienteTelefone')) document.getElementById('clienteTelefone').value = '';
                if (document.getElementById('clienteEmail')) document.getElementById('clienteEmail').value = '';
                if (document.getElementById('clienteEndereco')) document.getElementById('clienteEndereco').value = '';
                if (document.getElementById('clienteId')) document.getElementById('clienteId').value = '';
                
                return true;
            } catch (e) {
                console.error('Erro ao salvar cliente:', e);
                notificarErro('Erro ao salvar cliente: ' + e.message);
                return false;
            }
        };
        console.log('✅ salvarCliente() atualizado');
    }
    
    // ========== VEÍCULOS ==========
    if (typeof window.salvarVeiculo === 'function') {
        window.salvarVeiculo = function() {
            try {
                const id = document.getElementById('veiculoId') ? document.getElementById('veiculoId').value : null;
                const veiculo = {
                    clienteId: document.getElementById('veiculoClienteId').value,
                    placa: document.getElementById('veiculoPlaca').value,
                    marca: document.getElementById('veiculoMarca').value,
                    modelo: document.getElementById('veiculoModelo').value,
                    ano: document.getElementById('veiculoAno') ? document.getElementById('veiculoAno').value : '',
                    cor: document.getElementById('veiculoCor') ? document.getElementById('veiculoCor').value : '',
                    km: document.getElementById('veiculoKm') ? document.getElementById('veiculoKm').value : ''
                };
                
                if (typeof validarVeiculo === 'function') {
                    const erros = validarVeiculo(veiculo);
                    if (erros.length > 0) {
                        mostrarErrosValidacao(erros);
                        return false;
                    }
                }
                
                if (id) {
                    const index = dados.veiculos.findIndex(v => v.id == id);
                    if (index !== -1) {
                        dados.veiculos[index] = { ...veiculo, id: parseInt(id) };
                        notificarSucesso('Veículo atualizado com sucesso!');
                    }
                } else {
                    veiculo.id = Date.now();
                    dados.veiculos.push(veiculo);
                    notificarSucesso('Veículo cadastrado com sucesso!');
                }
                
                salvarDados();
                
                if (typeof renderizarVeiculos === 'function') {
                    renderizarVeiculos();
                }
                
                const modal = document.getElementById('veiculoModal');
                if (modal) {
                    modal.style.display = 'none';
                    modal.classList.remove('active');
                }
                
                return true;
            } catch (e) {
                console.error('Erro ao salvar veículo:', e);
                notificarErro('Erro ao salvar veículo: ' + e.message);
                return false;
            }
        };
        console.log('✅ salvarVeiculo() atualizado');
    }
    
    // ========== SERVIÇOS ==========
    if (typeof window.salvarServico === 'function') {
        window.salvarServico = function() {
            try {
                const id = document.getElementById('servicoId') ? document.getElementById('servicoId').value : null;
                const servico = {
                    descricao: document.getElementById('servicoDescricao').value,
                    categoria: document.getElementById('servicoCategoria') ? document.getElementById('servicoCategoria').value : '',
                    valor: document.getElementById('servicoValor').value,
                    tempo: document.getElementById('servicoTempo') ? document.getElementById('servicoTempo').value : ''
                };
                
                if (typeof validarServico === 'function') {
                    const erros = validarServico(servico);
                    if (erros.length > 0) {
                        mostrarErrosValidacao(erros);
                        return false;
                    }
                }
                
                if (id) {
                    const index = dados.servicos.findIndex(s => s.id == id);
                    if (index !== -1) {
                        dados.servicos[index] = { ...servico, id: parseInt(id) };
                        notificarSucesso('Serviço atualizado com sucesso!');
                    }
                } else {
                    servico.id = Date.now();
                    dados.servicos.push(servico);
                    notificarSucesso('Serviço cadastrado com sucesso!');
                }
                
                salvarDados();
                
                if (typeof renderizarServicos === 'function') {
                    renderizarServicos();
                }
                
                const modal = document.getElementById('servicoModal');
                if (modal) {
                    modal.style.display = 'none';
                    modal.classList.remove('active');
                }
                
                return true;
            } catch (e) {
                console.error('Erro ao salvar serviço:', e);
                notificarErro('Erro ao salvar serviço: ' + e.message);
                return false;
            }
        };
        console.log('✅ salvarServico() atualizado');
    }
    
    // ========== PEÇAS ==========
    if (typeof window.salvarPeca === 'function') {
        window.salvarPeca = function() {
            try {
                const id = document.getElementById('pecaId') ? document.getElementById('pecaId').value : null;
                const peca = {
                    codigo: document.getElementById('pecaCodigo') ? document.getElementById('pecaCodigo').value : '',
                    descricao: document.getElementById('pecaDescricao').value,
                    fornecedor: document.getElementById('pecaFornecedor') ? document.getElementById('pecaFornecedor').value : '',
                    custo: document.getElementById('pecaCusto').value,
                    precoVenda: document.getElementById('pecaPrecoVenda').value,
                    estoque: document.getElementById('pecaEstoque') ? document.getElementById('pecaEstoque').value : 0,
                    estoqueMinimo: document.getElementById('pecaEstoqueMinimo') ? document.getElementById('pecaEstoqueMinimo').value : 0
                };
                
                if (typeof validarPeca === 'function') {
                    const erros = validarPeca(peca);
                    if (erros.length > 0) {
                        mostrarErrosValidacao(erros);
                        return false;
                    }
                }
                
                if (id) {
                    const index = dados.pecas.findIndex(p => p.id == id);
                    if (index !== -1) {
                        dados.pecas[index] = { ...peca, id: parseInt(id) };
                        notificarSucesso('Peça atualizada com sucesso!');
                    }
                } else {
                    peca.id = Date.now();
                    dados.pecas.push(peca);
                    notificarSucesso('Peça cadastrada com sucesso!');
                }
                
                salvarDados();
                
                if (typeof renderizarPecas === 'function') {
                    renderizarPecas();
                }
                
                const modal = document.getElementById('pecaModal');
                if (modal) {
                    modal.style.display = 'none';
                    modal.classList.remove('active');
                }
                
                return true;
            } catch (e) {
                console.error('Erro ao salvar peça:', e);
                notificarErro('Erro ao salvar peça: ' + e.message);
                return false;
            }
        };
        console.log('✅ salvarPeca() atualizado');
    }
    
    console.log('✅ Sistema de atualização automática aplicado!');
    
}, 2000);

console.log('✅ Sistema de atualização automática inicializado!');

