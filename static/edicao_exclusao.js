
// ========== SISTEMA DE EDIÇÃO E EXCLUSÃO (ADAPTADO PARA API) ==========
// Versão 2.0 - Editar e excluir registros via API

console.log("✏️ Sistema de edição e exclusão carregado e adaptado para API!");

// ========== FUNÇÕES DE EDIÇÃO ==========

/**
 * Preenche o modal de cliente com os dados para edição.
 * @param {number} id - O ID do cliente a ser editado.
 */
window.editarCliente = async function(id) {
    try {
        const cliente = await apiRequest(`/api/clientes/${id}`);
        if (!cliente) {
            console.error("Cliente não encontrado!");
            // notificarErro("Cliente não encontrado!"); // Se houver um sistema de notificação
            return;
        }
        
        document.getElementById("clienteId").value = cliente.id;
        document.getElementById("clienteNome").value = cliente.nome || "";
        document.getElementById("clienteCpfCnpj").value = cliente.cpfCnpj || "";
        document.getElementById("clienteTelefone").value = cliente.telefone || "";
        document.getElementById("clienteEmail").value = cliente.email || "";
        document.getElementById("clienteEndereco").value = cliente.endereco || "";
        
        document.getElementById("clienteModalTitle").textContent = "✏️ Editar Cliente";
        openModal("clienteModal");
        // notificarInfo("Editando cliente: " + cliente.nome); // Se houver um sistema de notificação

    } catch (error) {
        console.error("Erro ao carregar dados do cliente para edição:", error);
    }
};

/**
 * Preenche o modal de veículo com os dados para edição.
 * @param {number} id - O ID do veículo a ser editado.
 */
window.editarVeiculo = async function(id) {
    try {
        const veiculo = await apiRequest(`/api/veiculos/${id}`);
        if (!veiculo) {
            console.error("Veículo não encontrado!");
            return;
        }
        
        document.getElementById("veiculoId").value = veiculo.id;
        // A função preencherSelectClientes deve ser chamada antes e com o ID do cliente selecionado
        // Isso já é tratado em openModal("veiculoModal") se o ID do veiculo for passado.
        // Para garantir, vamos chamar aqui também.
        await carregarTodosOsDados(); // Garante que `dados.clientes` esteja atualizado
        preencherSelectClientes(veiculo.cliente_id); 

        document.getElementById("veiculoPlaca").value = veiculo.placa || "";
        document.getElementById("veiculoMarca").value = veiculo.marca || "";
        document.getElementById("veiculoModelo").value = veiculo.modelo || "";
        document.getElementById("veiculoAno").value = veiculo.ano || "";
        document.getElementById("veiculoCor").value = veiculo.cor || "";
        document.getElementById("veiculoKm").value = veiculo.km || "";
        
        document.getElementById("veiculoModalTitle").textContent = "✏️ Editar Veículo";
        openModal("veiculoModal");

    } catch (error) {
        console.error("Erro ao carregar dados do veículo para edição:", error);
    }
};

/**
 * Preenche o modal de serviço com os dados para edição.
 * @param {number} id - O ID do serviço a ser editado.
 */
window.editarServico = async function(id) {
    try {
        const servico = await apiRequest(`/api/servicos/${id}`);
        if (!servico) {
            console.error("Serviço não encontrado!");
            return;
        }
        
        document.getElementById("servicoId").value = servico.id;
        document.getElementById("servicoDescricao").value = servico.descricao || "";
        document.getElementById("servicoCategoria").value = servico.categoria || "";
        document.getElementById("servicoValor").value = servico.valorMaoObra || "";
        document.getElementById("servicoTempo").value = servico.tempoEstimado || "";
        
        document.getElementById("servicoModalTitle").textContent = "✏️ Editar Serviço";
        openModal("servicoModal");

    } catch (error) {
        console.error("Erro ao carregar dados do serviço para edição:", error);
    }
};

/**
 * Preenche o modal de peça com os dados para edição.
 * @param {number} id - O ID da peça a ser editada.
 */
window.editarPeca = async function(id) {
    try {
        const peca = await apiRequest(`/api/pecas/${id}`);
        if (!peca) {
            console.error("Peça não encontrada!");
            return;
        }
        
        document.getElementById("pecaId").value = peca.id;
        document.getElementById("pecaCodigo").value = peca.codigo || "";
        document.getElementById("pecaDescricao").value = peca.descricao || "";
        document.getElementById("pecaFornecedor").value = peca.fornecedor || "";
        document.getElementById("pecaCusto").value = peca.custoUnitario || "";
        document.getElementById("pecaPrecoVenda").value = peca.precoVenda || "";
        document.getElementById("pecaEstoque").value = peca.quantidadeEstoque || 0;
        document.getElementById("pecaEstoqueMinimo").value = peca.estoqueMinimo || 0;
        
        document.getElementById("pecaModalTitle").textContent = "✏️ Editar Peça";
        openModal("pecaModal");
        calcularMargemLucro(); // Recalcula a margem ao editar

    } catch (error) {
        console.error("Erro ao carregar dados da peça para edição:", error);
    }
};

// ========== FUNÇÕES DE EXCLUSÃO (GENÉRICAS - JÁ TRATADAS EM app.js) ==========
// As funções de exclusão específicas (excluirCliente, excluirVeiculo, etc.)
// foram substituídas por uma função genérica `removerItem(nomeEntidade, id)`
// em `app.js` para centralizar a lógica de comunicação com a API.
// Portanto, este arquivo não precisa mais dessas funções específicas de exclusão.

console.log("✅ Funções de edição adaptadas para a API!");


