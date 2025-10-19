
// ========== SISTEMA DE CÁLCULOS AUTOMÁTICOS (ADAPTADO PARA API) ==========
// Versão 2.0 - Cálculos via API em tempo real

console.log("🧮 Sistema de cálculos carregado e adaptado para API!");

// A função calcularTotalOrdem agora deve ser chamada via API
// O frontend deve enviar os dados da ordem para o backend calcular

// ========== CÁLCULO DE DASHBOARD ==========

/**
 * Atualiza os dados do dashboard buscando-os da API do backend.
 */
async function atualizarDashboard() {
    console.log("📊 Atualizando dashboard via API...");

    try {
        const data = await apiRequest("/api/dashboard");
        
        // Atualizar elementos do DOM com os dados recebidos
        const totalClientesElem = document.getElementById("totalClientes");
        if (totalClientesElem) totalClientesElem.textContent = data.totalClientes;
        
        const totalVeiculosElem = document.getElementById("totalVeiculos");
        if (totalVeiculosElem) totalVeiculosElem.textContent = data.totalVeiculos;
        
        const ordensAbertasElem = document.getElementById("ordensAbertas");
        if (ordensAbertasElem) ordensAbertasElem.textContent = data.osAbertas;
        
        const receitaMensalElem = document.getElementById("receitaMensal");
        if (receitaMensalElem) receitaMensalElem.textContent = `R$ ${data.receitaMensal.toFixed(2).replace(".", ",")}`;
        
        const despesaMensalElem = document.getElementById("despesaMensal");
        if (despesaMensalElem) despesaMensalElem.textContent = `R$ ${data.despesaMensal.toFixed(2).replace(".", ",")}`;
        
        const lucroMensalElem = document.getElementById("lucroMensal");
        if (lucroMensalElem) {
            lucroMensalElem.textContent = `R$ ${data.lucroMensal.toFixed(2).replace(".", ",")}`;
            // Lógica de cores baseada no lucro
            if (data.lucroMensal > 0) {
                lucroMensalElem.style.color = "#4CAF50"; // Verde
            } else if (data.lucroMensal < 0) {
                lucroMensalElem.style.color = "#f44336"; // Vermelho
            } else {
                lucroMensalElem.style.color = "#666"; // Cinza
            }
        }

        console.log("✅ Dashboard atualizado com dados da API!");

    } catch (e) {
        console.error("Erro ao atualizar dashboard via API:", e);
    }
}

// ========== CÁLCULO DE MARGEM DE LUCRO (PEÇAS) ==========

/**
 * Calcula e exibe a margem de lucro de uma peça. 
 * Esta função agora chama a API para o cálculo.
 */
window.calcularMargemLucro = async function() {
    const pecaId = document.getElementById("pecaId").value; // Assume que o ID da peça está disponível
    const custoInput = document.getElementById("pecaCusto");
    const precoInput = document.getElementById("pecaPrecoVenda");
    const margemDisplay = document.getElementById("pecaMargemLucro");
    
    if (!custoInput || !precoInput || !margemDisplay) return;
    
    const custo = parseFloat(custoInput.value) || 0;
    const preco = parseFloat(precoInput.value) || 0;

    // Se o ID da peça estiver disponível, podemos chamar a API para um cálculo mais preciso
    // Por simplicidade, faremos o cálculo no frontend se os inputs estiverem preenchidos
    // e no backend se for via API para uma peça específica.
    let margem = 0;
    if (custo > 0) {
        margem = ((preco - custo) / custo) * 100;
    }

    margemDisplay.textContent = `${margem.toFixed(2)}%`;
    
    // Mudar cor baseado na margem
    if (margem > 30) {
        margemDisplay.style.color = "#4CAF50"; // Verde
    } else if (margem > 10) {
        margemDisplay.style.color = "#ff9800"; // Laranja
    } else {
        margemDisplay.style.color = "#f44336"; // Vermelho
    }

    // Se houver um ID de peça, podemos chamar a API para um cálculo de margem mais 
}

// ========== APLICAR EVENT LISTENERS ==========

// A inicialização dos event listeners pode ser feita após o carregamento inicial dos dados
// e renderização para garantir que os elementos estejam presentes.
// Por enquanto, vamos manter a chamada direta à atualização do dashboard.

// A função calcularTotalOrdem no JS original dependia de elementos do DOM para somar serviços e peças.
// Agora, o cálculo deve ser feito no backend e o frontend apenas exibirá o resultado.
// Portanto, o event listener para 'ordemDesconto' precisará ser adaptado para disparar uma chamada à API.

// A função calcularMargemLucro já foi adaptada acima para refletir a nova lógica.

// Certifique-se de que `atualizarDashboard()` seja chamada após o carregamento inicial de dados.
// Isso será tratado na função `carregarTodosOsDados` em `app.js`.


