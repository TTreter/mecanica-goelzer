// ========== SISTEMA DE VALIDAÇÕES ==========
// Versão 1.0 - Validação completa de formulários

console.log('✔️ Sistema de validações carregado!');

// ========== VALIDAÇÕES BÁSICAS ==========

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false; // Todos os dígitos iguais
    
    // Validar primeiro dígito
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = resto >= 10 ? 0 : resto;
    
    if (digito1 !== parseInt(cpf.charAt(9))) return false;
    
    // Validar segundo dígito
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = resto >= 10 ? 0 : resto;
    
    return digito2 === parseInt(cpf.charAt(10));
}

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    
    // Validar primeiro dígito
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) return false;
    
    // Validar segundo dígito
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    return resultado == digitos.charAt(1);
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarTelefone(telefone) {
    const numeros = telefone.replace(/\D/g, '');
    return numeros.length >= 10 && numeros.length <= 11;
}

function validarPlaca(placa) {
    // Aceita formato antigo (ABC-1234) e Mercosul (ABC1D23)
    const regexAntigo = /^[A-Z]{3}-?\d{4}$/;
    const regexMercosul = /^[A-Z]{3}\d[A-Z]\d{2}$/;
    placa = placa.toUpperCase().replace('-', '');
    return regexAntigo.test(placa) || regexMercosul.test(placa);
}

// ========== VALIDAÇÕES DE ENTIDADES ==========

window.validarCliente = function(cliente) {
    const erros = [];
    
    // Nome obrigatório
    if (!cliente.nome || cliente.nome.trim() === '') {
        erros.push('Nome é obrigatório');
    } else if (cliente.nome.trim().length < 3) {
        erros.push('Nome deve ter pelo menos 3 caracteres');
    }
    
    // CPF/CNPJ opcional, mas se preenchido deve ser válido
    if (cliente.cpfCnpj && cliente.cpfCnpj.trim() !== '') {
        const numeros = cliente.cpfCnpj.replace(/\D/g, '');
        if (numeros.length === 11) {
            if (!validarCPF(cliente.cpfCnpj)) {
                erros.push('CPF inválido');
            }
        } else if (numeros.length === 14) {
            if (!validarCNPJ(cliente.cpfCnpj)) {
                erros.push('CNPJ inválido');
            }
        } else {
            erros.push('CPF/CNPJ deve ter 11 ou 14 dígitos');
        }
    }
    
    // Email opcional, mas se preenchido deve ser válido
    if (cliente.email && cliente.email.trim() !== '') {
        if (!validarEmail(cliente.email)) {
            erros.push('Email inválido');
        }
    }
    
    // Telefone opcional, mas se preenchido deve ser válido
    if (cliente.telefone && cliente.telefone.trim() !== '') {
        if (!validarTelefone(cliente.telefone)) {
            erros.push('Telefone inválido (mínimo 10 dígitos)');
        }
    }
    
    return erros;
};

window.validarVeiculo = function(veiculo) {
    const erros = [];
    
    // Cliente obrigatório
    if (!veiculo.clienteId) {
        erros.push('Cliente é obrigatório');
    }
    
    // Placa obrigatória
    if (!veiculo.placa || veiculo.placa.trim() === '') {
        erros.push('Placa é obrigatória');
    } else if (!validarPlaca(veiculo.placa)) {
        erros.push('Placa inválida (formato: ABC-1234 ou ABC1D23)');
    }
    
    // Marca obrigatória
    if (!veiculo.marca || veiculo.marca.trim() === '') {
        erros.push('Marca é obrigatória');
    }
    
    // Modelo obrigatório
    if (!veiculo.modelo || veiculo.modelo.trim() === '') {
        erros.push('Modelo é obrigatório');
    }
    
    // Ano opcional, mas se preenchido deve ser válido
    if (veiculo.ano) {
        const ano = parseInt(veiculo.ano);
        const anoAtual = new Date().getFullYear();
        if (ano < 1900 || ano > anoAtual + 1) {
            erros.push(`Ano inválido (deve estar entre 1900 e ${anoAtual + 1})`);
        }
    }
    
    return erros;
};

window.validarServico = function(servico) {
    const erros = [];
    
    // Descrição obrigatória
    if (!servico.descricao || servico.descricao.trim() === '') {
        erros.push('Descrição é obrigatória');
    }
    
    // Valor obrigatório e deve ser positivo
    if (servico.valor === undefined || servico.valor === null || servico.valor === '') {
        erros.push('Valor é obrigatório');
    } else {
        const valor = parseFloat(servico.valor);
        if (isNaN(valor) || valor < 0) {
            erros.push('Valor deve ser um número positivo');
        }
    }
    
    return erros;
};

window.validarPeca = function(peca) {
    const erros = [];
    
    // Descrição obrigatória
    if (!peca.descricao || peca.descricao.trim() === '') {
        erros.push('Descrição é obrigatória');
    }
    
    // Custo obrigatório
    if (peca.custo === undefined || peca.custo === null || peca.custo === '') {
        erros.push('Custo é obrigatório');
    } else {
        const custo = parseFloat(peca.custo);
        if (isNaN(custo) || custo < 0) {
            erros.push('Custo deve ser um número positivo');
        }
    }
    
    // Preço de venda obrigatório
    if (peca.precoVenda === undefined || peca.precoVenda === null || peca.precoVenda === '') {
        erros.push('Preço de venda é obrigatório');
    } else {
        const preco = parseFloat(peca.precoVenda);
        if (isNaN(preco) || preco < 0) {
            erros.push('Preço de venda deve ser um número positivo');
        }
        
        // Preço de venda deve ser maior que custo
        const custo = parseFloat(peca.custo);
        if (!isNaN(custo) && !isNaN(preco) && preco < custo) {
            erros.push('Preço de venda deve ser maior ou igual ao custo');
        }
    }
    
    // Estoque mínimo deve ser positivo
    if (peca.estoqueMinimo !== undefined && peca.estoqueMinimo !== null && peca.estoqueMinimo !== '') {
        const estMin = parseInt(peca.estoqueMinimo);
        if (isNaN(estMin) || estMin < 0) {
            erros.push('Estoque mínimo deve ser um número positivo');
        }
    }
    
    return erros;
};

window.validarOrdemServico = function(ordem) {
    const erros = [];
    
    // Cliente obrigatório
    if (!ordem.clienteId) {
        erros.push('Cliente é obrigatório');
    }
    
    // Veículo obrigatório
    if (!ordem.veiculoId) {
        erros.push('Veículo é obrigatório');
    }
    
    // Deve ter pelo menos um serviço ou uma peça
    const temServicos = ordem.servicos && ordem.servicos.length > 0;
    const temPecas = ordem.pecas && ordem.pecas.length > 0;
    
    if (!temServicos && !temPecas) {
        erros.push('Adicione pelo menos um serviço ou uma peça');
    }
    
    return erros;
};

window.validarMovimentacao = function(movimentacao) {
    const erros = [];
    
    // Data obrigatória
    if (!movimentacao.data) {
        erros.push('Data é obrigatória');
    }
    
    // Categoria obrigatória
    if (!movimentacao.categoria) {
        erros.push('Categoria é obrigatória');
    }
    
    // Descrição obrigatória
    if (!movimentacao.descricao || movimentacao.descricao.trim() === '') {
        erros.push('Descrição é obrigatória');
    }
    
    // Valor obrigatório e positivo
    if (movimentacao.valor === undefined || movimentacao.valor === null || movimentacao.valor === '') {
        erros.push('Valor é obrigatório');
    } else {
        const valor = parseFloat(movimentacao.valor);
        if (isNaN(valor) || valor <= 0) {
            erros.push('Valor deve ser maior que zero');
        }
    }
    
    return erros;
};

// ========== FUNÇÃO AUXILIAR PARA MOSTRAR ERROS ==========

window.mostrarErrosValidacao = function(erros) {
    if (erros.length === 0) return true;
    
    const mensagem = erros.join('<br>');
    notificarErro(mensagem, 5000);
    return false;
};

console.log('✅ Funções de validação disponíveis: validarCliente(), validarVeiculo(), validarServico(), validarPeca(), validarOrdemServico(), validarMovimentacao()');

