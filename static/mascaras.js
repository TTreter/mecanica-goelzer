
// ========== SISTEMA DE MÁSCARAS DE ENTRADA ==========
// Versão 1.0 - Formatação automática de campos
// Este arquivo não precisa de adaptação para a API, pois ele lida apenas com formatação de input no frontend.

console.log("🎭 Sistema de máscaras carregado!");

// ========== FUNÇÕES DE MÁSCARA ==========

function mascaraCPF(valor) {
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return valor;
}

function mascaraCNPJ(valor) {
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
    valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    return valor;
}

function mascaraCPFCNPJ(valor) {
    valor = valor.replace(/\D/g, "");
    
    if (valor.length <= 11) {
        return mascaraCPF(valor);
    } else {
        return mascaraCNPJ(valor);
    }
}

function mascaraTelefone(valor) {
    valor = valor.replace(/\D/g, "");
    
    if (valor.length <= 10) {
        // (00) 0000-0000
        valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
        valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    } else {
        // (00) 00000-0000
        valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    }
    
    return valor;
}

function mascaraPlaca(valor) {
    valor = valor.toUpperCase().replace(/[^A-Z0-9]/g, "");
    
    if (valor.length <= 7) {
        // Formato antigo: ABC-1234
        valor = valor.replace(/^([A-Z]{3})([0-9])/, "$1-$2");
    } else {
        // Formato Mercosul: ABC1D23
        valor = valor.substring(0, 7);
    }
    
    return valor;
}

function mascaraCEP(valor) {
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/^(\d{5})(\d)/, "$1-$2");
    return valor;
}

function mascaraMoeda(valor) {
    valor = valor.replace(/\D/g, "");
    valor = (parseInt(valor) / 100).toFixed(2);
    valor = valor.replace(".", ",");
    valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return valor;
}

function mascaraNumero(valor) {
    return valor.replace(/\D/g, "");
}

function mascaraAno(valor) {
    valor = valor.replace(/\D/g, "");
    return valor.substring(0, 4);
}

// ========== APLICAR MÁSCARAS AUTOMATICAMENTE ==========

window.aplicarMascaras = function() {
    console.log("🎭 Aplicando máscaras nos campos...");
    
    // CPF/CNPJ
    document.querySelectorAll("input[id*=\"cpf\"], input[id*=\"Cpf\"], input[id*=\"cnpj\"], input[id*=\"Cnpj\"]").forEach(input => {
        input.addEventListener("input", function(e) {
            e.target.value = mascaraCPFCNPJ(e.target.value);
        });
        input.setAttribute("placeholder", "000.000.000-00 ou 00.000.000/0000-00");
        input.setAttribute("maxlength", "18");
    });
    
    // Telefone
    document.querySelectorAll("input[id*=\"telefone\"], input[id*=\"Telefone\"], input[id*=\"celular\"], input[id*=\"Celular\"]").forEach(input => {
        input.addEventListener("input", function(e) {
            e.target.value = mascaraTelefone(e.target.value);
        });
        input.setAttribute("placeholder", "(00) 00000-0000");
        input.setAttribute("maxlength", "15");
    });
    
    // Placa
    document.querySelectorAll("input[id*=\"placa\"], input[id*=\"Placa\"]").forEach(input => {
        input.addEventListener("input", function(e) {
            e.target.value = mascaraPlaca(e.target.value);
        });
        input.setAttribute("placeholder", "ABC-1234 ou ABC1D23");
        input.setAttribute("maxlength", "8");
    });
    
    // CEP
    document.querySelectorAll("input[id*=\"cep\"], input[id*=\"Cep\"]").forEach(input => {
        input.addEventListener("input", function(e) {
            e.target.value = mascaraCEP(e.target.value);
        });
        input.setAttribute("placeholder", "00000-000");
        input.setAttribute("maxlength", "9");
    });
    
    // Ano
    document.querySelectorAll("input[id*=\"ano\"], input[id*=\"Ano\"]").forEach(input => {
        input.addEventListener("input", function(e) {
            e.target.value = mascaraAno(e.target.value);
        });
        input.setAttribute("placeholder", "AAAA");
        input.setAttribute("maxlength", "4");
    });
    
    // KM (apenas números)
    document.querySelectorAll("input[id*=\"km\"], input[id*=\"Km\"], input[id*=\"quilometragem\"]").forEach(input => {
        input.addEventListener("input", function(e) {
            e.target.value = mascaraNumero(e.target.value);
        });
        input.setAttribute("placeholder", "0");
    });
    
    console.log("✅ Máscaras aplicadas com sucesso!");
};

// ========== APLICAR PLACEHOLDERS DESCRITIVOS ==========

window.aplicarPlaceholders = function() {
    console.log("📝 Aplicando placeholders descritivos...");
    
    const placeholders = {
        // Clientes
        "clienteNome": "Digite o nome completo do cliente",
        "clienteEmail": "exemplo@email.com",
        "clienteEndereco": "Rua, número, bairro, cidade - UF",
        
        // Veículos
        "veiculoMarca": "Ex: Volkswagen, Fiat, Chevrolet",
        "veiculoModelo": "Ex: Gol, Uno, Onix",
        "veiculoCor": "Ex: Preto, Branco, Prata",
        
        // Serviços
        "servicoDescricao": "Descreva o serviço oferecido",
        "servicoCategoria": "Ex: Mecânica, Elétrica, Funilaria",
        "servicoValor": "0,00",
        "servicoTempo": "Tempo em horas",
        
        // Peças
        "pecaCodigo": "Código da peça",
        "pecaDescricao": "Descrição da peça",
        "pecaFornecedor": "Nome do fornecedor",
        "pecaCusto": "0,00",
        "pecaPrecoVenda": "0,00",
        "pecaEstoque": "0",
        "pecaEstoqueMinimo": "0",
        
        // Ordem de Serviço
        "ordemDesconto": "0,00",
        "ordemObservacoes": "Observações adicionais sobre a ordem de serviço",
        
        // Agendamento
        "agendamentoObservacoes": "Observações sobre o agendamento",
        
        // Movimentação
        "movDescricao": "Descreva a receita ou despesa",
        "movValor": "0,00",
        
        // Busca
        "buscaCliente": "🔍 Buscar por nome, CPF/CNPJ, telefone ou email",
        "buscaVeiculo": "🔍 Buscar por placa, marca ou modelo",
        "buscaServico": "🔍 Buscar por descrição ou categoria",
        "buscaPeca": "🔍 Buscar por código, descrição ou fornecedor"
    };
    
    Object.keys(placeholders).forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.setAttribute("placeholder", placeholders[id]);
        }
    });
    
    // Placeholders genéricos por tipo
    document.querySelectorAll("input[type=\"text\"]:not([placeholder])").forEach(input => {
        if (!input.placeholder) {
            input.setAttribute("placeholder", "Digite aqui...");
        }
    });
    
    document.querySelectorAll("textarea:not([placeholder])").forEach(textarea => {
        if (!textarea.placeholder) {
            textarea.setAttribute("placeholder", "Digite suas observações...");
        }
    });
    
    console.log("✅ Placeholders aplicados!");
};

// ========== INICIALIZAÇÃO ==========

// As funções aplicarMascaras() e aplicarPlaceholders() serão chamadas em app.js após o carregamento inicial de dados.

console.log("✅ Sistema de máscaras inicializado!");

