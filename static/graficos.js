
// ========== SISTEMA DE GRÁFICOS (ADAPTADO PARA API) ==========
// Versão 2.0 - Gráficos com Chart.js (CDN) e dados da API

console.log("📊 Sistema de gráficos carregado e adaptado para API!");

// A biblioteca Chart.js já é carregada no index.html via CDN.
// As funções de inicialização e atualização de gráficos agora buscarão dados da API.

// ========== FUNÇÕES DE GRÁFICOS ==========

async function inicializarGraficos() {
    console.log("📊 Inicializando gráficos...");
    
    // Aguardar o carregamento completo dos dados e do DOM
    await carregarTodosOsDados(); // Garante que `dados` esteja populado

    // Criar os canvas para os gráficos se ainda não existirem
    adicionarCanvasGraficos();

    // Criar gráficos do dashboard
    criarGraficoReceitasDespesas();
    criarGraficoOrdensServico();
    criarGraficoServicosMaisRealizados();
}

// ========== GRÁFICO DE RECEITAS X DESPESAS ==========

window.criarGraficoReceitasDespesas = async function() {
    const canvas = document.getElementById("graficoFinanceiro"); // ID do canvas no index.html
    if (!canvas) {
        console.log("Canvas graficoFinanceiro não encontrado");
        return;
    }
    
    // Os dados para este gráfico virão da função atualizarDashboard, que já busca da API
    // Para este gráfico, vamos precisar de dados mensais dos últimos 6 meses.
    // A API do backend precisa fornecer um endpoint para isso.
    // Por enquanto, vamos simular com os dados locais `dados.movimentacoes` e `dados.despesasGerais`
    // Se houver um endpoint específico para isso no futuro, será adaptado.

    const meses = [];
    const receitas = [];
    const despesas = [];
    
    for (let i = 5; i >= 0; i--) {
        const data = new Date();
        data.setMonth(data.getMonth() - i);
        const mesAno = data.toISOString().substring(0, 7); // YYYY-MM
        const mesNome = data.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
        
        meses.push(mesNome);
        
        let receitaMes = 0;
        let despesaMes = 0;
        
        dados.movimentacoes.forEach(m => {
            if (m.data && m.data.startsWith(mesAno)) {
                if (m.tipo === "receita") {
                    receitaMes += parseFloat(m.valor) || 0;
                } else if (m.tipo === "despesa") {
                    despesaMes += parseFloat(m.valor) || 0;
                }
            }
        });

        dados.despesasGerais.forEach(d => {
            if (d.data && d.data.startsWith(mesAno)) {
                despesaMes += parseFloat(d.valor) || 0;
            }
        });
        
        receitas.push(receitaMes);
        despesas.push(despesaMes);
    }
    
    // Destruir gráfico anterior se existir
    if (window.chartReceitasDespesas) {
        window.chartReceitasDespesas.destroy();
    }
    
    // Criar novo gráfico
    const ctx = canvas.getContext("2d");
    window.chartReceitasDespesas = new Chart(ctx, {
        type: "bar",
        data: {
            labels: meses,
            datasets: [
                {
                    label: "Receitas",
                    data: receitas,
                    backgroundColor: "rgba(76, 175, 80, 0.7)",
                    borderColor: "rgb(76, 175, 80)",
                    borderWidth: 1
                },
                {
                    label: "Despesas",
                    data: despesas,
                    backgroundColor: "rgba(244, 67, 54, 0.7)",
                    borderColor: "rgb(244, 67, 54)",
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: "Receitas x Despesas (Últimos 6 meses)",
                    font: { size: 16 }
                },
                legend: {
                    display: true,
                    position: "top"
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return "R$ " + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
    
    console.log("✅ Gráfico de Receitas x Despesas criado!");
};

// ========== GRÁFICO DE ORDENS DE SERVIÇO POR STATUS ==========

window.criarGraficoOrdensServico = async function() {
    const canvas = document.getElementById("graficoOrdensServico");
    if (!canvas) {
        console.log("Canvas graficoOrdensServico não encontrado");
        return;
    }
    
    // Contar OS por status usando dados locais (já carregados)
    const statusCount = {};
    dados.ordens.forEach(os => {
        const status = os.status || "Sem Status";
        statusCount[status] = (statusCount[status] || 0) + 1;
    });
    
    const labels = Object.keys(statusCount);
    const valores = Object.values(statusCount);
    
    const cores = {
        "Aberta": "rgba(33, 150, 243, 0.7)",
        "Em Execução": "rgba(255, 152, 0, 0.7)",
        "Aguardando Peças": "rgba(156, 39, 176, 0.7)",
        "Concluída": "rgba(76, 175, 80, 0.7)",
        "Cancelada": "rgba(244, 67, 54, 0.7)",
        "Sem Status": "rgba(158, 158, 158, 0.7)"
    };
    
    const backgroundColors = labels.map(l => cores[l] || "rgba(158, 158, 158, 0.7)");
    
    if (window.chartOrdensServico) {
        window.chartOrdensServico.destroy();
    }
    
    const ctx = canvas.getContext("2d");
    window.chartOrdensServico = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: valores,
                backgroundColor: backgroundColors,
                borderWidth: 2,
                borderColor: "#fff"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: "Ordens de Serviço por Status",
                    font: { size: 16 }
                },
                legend: {
                    display: true,
                    position: "right"
                }
            }
        }
    });
    
    console.log("✅ Gráfico de Ordens de Serviço criado!");
};

// ========== GRÁFICO DE SERVIÇOS MAIS REALIZADOS ==========

window.criarGraficoServicosMaisRealizados = async function() {
    const canvas = document.getElementById("graficoServicosMaisRealizados");
    if (!canvas) {
        console.log("Canvas graficoServicosMaisRealizados não encontrado");
        return;
    }
    
    // Contar quantas vezes cada serviço foi usado
    const servicosCount = {};
    
    dados.ordens.forEach(os => {
        (os.servicos_ids || []).forEach(servico_id => {
            const servico = dados.servicos.find(s => s.id === servico_id);
            if (servico) {
                const descricao = servico.descricao || "Serviço sem descrição";
                servicosCount[descricao] = (servicosCount[descricao] || 0) + 1;
            }
        });
    });
    
    // Ordenar e pegar top 5
    const servicosOrdenados = Object.entries(servicosCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const labels = servicosOrdenados.map(s => s[0]);
    const valores = servicosOrdenados.map(s => s[1]);
    
    if (window.chartServicosMaisRealizados) {
        window.chartServicosMaisRealizados.destroy();
    }
    
    const ctx = canvas.getContext("2d");
    window.chartServicosMaisRealizados = new Chart(ctx, {
        type: "bar", // Alterado de horizontalBar para bar para compatibilidade com Chart.js v4
        data: {
            labels: labels,
            datasets: [{
                label: "Quantidade",
                data: valores,
                backgroundColor: "rgba(33, 150, 243, 0.7)",
                borderColor: "rgb(33, 150, 243)",
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: "y", // Para barras horizontais
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: "Top 5 Serviços Mais Realizados",
                    font: { size: 16 }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
    
    console.log("✅ Gráfico de Serviços Mais Realizados criado!");
};

// ========== ADICIONAR CANVAS PARA GRÁFICOS NO DASHBOARD ==========

window.adicionarCanvasGraficos = function() {
    const dashboard = document.getElementById("dashboard");
    if (!dashboard) return;
    
    // Verificar se já existe
    if (document.getElementById("graficos-container")) return;
    
    const graficosHTML = `
        <div id="graficos-container" style="margin-top: 30px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div class="card" style="padding: 20px;">
                    <canvas id="graficoReceitasDespesas" style="height: 300px;"></canvas>
                </div>
                <div class="card" style="padding: 20px;">
                    <canvas id="graficoOrdensServico" style="height: 300px;"></canvas>
                </div>
            </div>
            <div class="card" style="padding: 20px; margin-top: 20px;">
                <h3>Top Serviços</h3>
                <canvas id="graficoServicosMaisRealizados" style="height: 300px;"></canvas>
            </div>
        </div>
    `;
    
    dashboard.insertAdjacentHTML("beforeend", graficosHTML);
    console.log("✅ Canvas de gráficos adicionados ao dashboard!");
};

// ========== ATUALIZAR GRÁFICOS ==========

window.atualizarGraficos = function() {
    if (window.Chart) {
        criarGraficoReceitasDespesas();
        criarGraficoOrdensServico();
        criarGraficoServicosMaisRealizados();
    }
};

// A inicialização dos gráficos será chamada após o carregamento inicial de dados em app.js

console.log("✅ Sistema de gráficos inicializado!");

