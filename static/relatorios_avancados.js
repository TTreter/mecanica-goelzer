
// ========== SISTEMA DE RELATÓRIOS AVANÇADOS (ADAPTADO PARA API) ==========
// Relatórios individuais por cliente, dia, mês, ano e serviço, buscando dados da API

console.log("📊 Sistema de relatórios avançados carregado e adaptado para API!");

// Funções auxiliares (formatarData, formatarMoeda) são assumidas como disponíveis globalmente (ex: em app.js ou pdf_profissional.js)

// ========== RELATÓRIO POR CLIENTE ==========
async function gerarRelatorioPorCliente() {
    const clienteId = document.getElementById("relatorioClienteSelect").value;
    
    if (!clienteId) {
        notificarAviso("Selecione um cliente");
        return;
    }
    
    try {
        const cliente = await apiRequest(`/api/clientes/${clienteId}`);
        if (!cliente) {
            notificarErro("Cliente não encontrado");
            return;
        }
        
        const ordensCliente = await apiRequest(`/api/ordens?cliente_id=${clienteId}`);
        const veiculosCliente = await apiRequest(`/api/veiculos?cliente_id=${clienteId}`);
        
        // Calcular totais
        const totalGasto = ordensCliente.reduce((sum, o) => sum + (o.valor_total || 0), 0);
        const totalServicos = ordensCliente.length;
        const servicosConcluidos = ordensCliente.filter(o => o.status === "Concluída").length;
        const servicosAbertos = ordensCliente.filter(o => o.status === "Aberta" || o.status === "Em Andamento").length;
        
        let html = `
            <div class="relatorio-cliente">
                <h2>Relatório Individual do Cliente</h2>
                
                <div class="cliente-info">
                    <h3>Dados do Cliente</h3>
                    <p><strong>Nome:</strong> ${cliente.nome}</p>
                    <p><strong>CPF/CNPJ:</strong> ${cliente.cpfCnpj || "Não informado"}</p>
                    <p><strong>Telefone:</strong> ${cliente.telefone || "Não informado"}</p>
                    <p><strong>Email:</strong> ${cliente.email || "Não informado"}</p>
                    <p><strong>Endereço:</strong> ${cliente.endereco || "Não informado"}</p>
                </div>
                
                <div class="cliente-resumo">
                    <h3>Resumo Financeiro</h3>
                    <p><strong>Total Gasto:</strong> ${formatarMoeda(totalGasto)}</p>
                    <p><strong>Total de Serviços:</strong> ${totalServicos}</p>
                    <p><strong>Serviços Concluídos:</strong> ${servicosConcluidos}</p>
                    <p><strong>Serviços Abertos:</strong> ${servicosAbertos}</p>
                </div>
                
                <div class="cliente-veiculos">
                    <h3>Veículos do Cliente</h3>
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
        `;
        
        veiculosCliente.forEach(v => {
            html += `
                <tr>
                    <td>${v.placa}</td>
                    <td>${v.marca}</td>
                    <td>${v.modelo}</td>
                    <td>${v.ano || "-"}</td>
                    <td>${v.km || "-"}</td>
                </tr>
            `;
        });
        
        html += `
                        </tbody>
                    </table>
                </div>
                
                <div class="cliente-ordens">
                    <h3>Histórico de Ordens de Serviço</h3>
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
        `;
        
        const todosVeiculos = await apiRequest("/api/veiculos"); // Para exibir detalhes do veículo na OS

        ordensCliente.forEach(o => {
            const veiculoOS = todosVeiculos.find(v => v.id === o.veiculo_id);
            html += `
                <tr>
                    <td>${o.id}</td>
                    <td>${formatarData(o.data_abertura)}</td>
                    <td>${veiculoOS ? `${veiculoOS.marca} ${veiculoOS.modelo} - ${veiculoOS.placa}` : "N/A"}</td>
                    <td><span class="badge badge-${o.status === "Concluída" ? "success" : o.status === "Aberta" ? "warning" : "info"}">${o.status}</span></td>
                    <td>${formatarMoeda(o.valor_total || 0)}</td>
                </tr>
            `;
        });
        
        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        document.getElementById("relatorioConteudo").innerHTML = html;
        document.getElementById("relatorioResultado").classList.remove("hidden");

    } catch (error) {
        console.error("Erro ao gerar relatório por cliente:", error);
        notificarErro("Erro ao gerar relatório por cliente!");
    }
}

// ========== RELATÓRIO POR DIA ==========
async function gerarRelatorioPorDia() {
    const data = document.getElementById("relatorioDiaData").value;
    
    if (!data) {
        notificarAviso("Selecione uma data");
        return;
    }
    
    try {
        const ordensData = await apiRequest(`/api/ordens?data_abertura=${data}`);
        const movimentacoesData = await apiRequest(`/api/movimentacoes?data=${data}`);
        const despesasData = await apiRequest(`/api/despesasGerais?data=${data}`);

        const todosClientes = await apiRequest("/api/clientes");
        const todosVeiculos = await apiRequest("/api/veiculos");

        const totalFaturado = ordensData.reduce((sum, o) => sum + (o.valor_total || 0), 0);
        const totalServicos = ordensData.length;
        
        const receitasDia = movimentacoesData.filter(m => m.tipo === "receita").reduce((sum, m) => sum + m.valor, 0);
        const despesasMovimentacoesDia = movimentacoesData.filter(m => m.tipo === "despesa").reduce((sum, m) => sum + m.valor, 0);
        const despesasGeraisDia = despesasData.reduce((sum, d) => sum + d.valor, 0);
        const totalDespesasDia = despesasMovimentacoesDia + despesasGeraisDia;
        const lucroDia = receitasDia - totalDespesasDia;
        
        let html = `
            <div class="relatorio-dia">
                <h2>Relatório do Dia ${formatarData(data)}</h2>
                
                <div class="dia-resumo">
                    <h3>Resumo Financeiro</h3>
                    <p><strong>Receitas:</strong> ${formatarMoeda(receitasDia)}</p>
                    <p><strong>Despesas:</strong> ${formatarMoeda(totalDespesasDia)}</p>
                    <p><strong>Lucro:</strong> <span style="color: ${lucroDia >= 0 ? "green" : "red"}">${formatarMoeda(lucroDia)}</span></p>
                    <p><strong>Total de Serviços:</strong> ${totalServicos}</p>
                </div>
                
                <div class="dia-ordens">
                    <h3>Ordens de Serviço do Dia</h3>
        `;
        
        if (ordensData.length === 0) {
            html += "<p>Nenhuma ordem de serviço neste dia.</p>";
        } else {
            html += `
                    <table>
                        <thead>
                            <tr>
                                <th>OS Nº</th>
                                <th>Cliente</th>
                                <th>Veículo</th>
                                <th>Status</th>
                                <th>Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            ordensData.forEach(o => {
                const cliente = todosClientes.find(c => c.id === o.cliente_id);
                const veiculo = todosVeiculos.find(v => v.id === o.veiculo_id);
                html += `
                    <tr>
                        <td>${o.id}</td>
                        <td>${cliente ? cliente.nome : "N/A"}</td>
                        <td>${veiculo ? `${veiculo.marca} ${veiculo.modelo}` : "N/A"}</td>
                        <td><span class="badge badge-${o.status === "Concluída" ? "success" : o.status === "Aberta" ? "warning" : "info"}">${o.status}</span></td>
                        <td>${formatarMoeda(o.valor_total || 0)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
            `;
        }
        
        html += `
                </div>
                
                <div class="dia-movimentacoes">
                    <h3>Movimentações Financeiras</h3>
        `;
        
        const todasMovimentacoesDoDia = [...movimentacoesData, ...despesasData.map(d => ({...d, tipo: "despesa", descricao: `Despesa Geral: ${d.descricao}`}))];

        if (todasMovimentacoesDoDia.length === 0) {
            html += "<p>Nenhuma movimentação financeira neste dia.</p>";
        } else {
            html += `
                    <table>
                        <thead>
                            <tr>
                                <th>Tipo</th>
                                <th>Descrição</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            todasMovimentacoesDoDia.forEach(m => {
                html += `
                    <tr>
                        <td><span class="badge badge-${m.tipo === "receita" ? "success" : "danger"}">${m.tipo}</span></td>
                        <td>${m.descricao}</td>
                        <td>${formatarMoeda(m.valor)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
        
        document.getElementById("relatorioConteudo").innerHTML = html;
        document.getElementById("relatorioResultado").classList.remove("hidden");

    } catch (error) {
        console.error("Erro ao gerar relatório por dia:", error);
        notificarErro("Erro ao gerar relatório por dia!");
    }
}

// ========== RELATÓRIO POR MÊS ==========
async function gerarRelatorioPorMes() {
    const mes = document.getElementById("relatorioMesSelect").value;
    const ano = document.getElementById("relatorioMesAno").value;
    
    if (!mes || !ano) {
        notificarAviso("Selecione mês e ano");
        return;
    }
    
    try {
        const relatorioMensal = await apiRequest(`/api/relatorios/financeiro-mensal/${ano}/${mes}`);
        const ordensMes = await apiRequest(`/api/ordens?mes=${mes}&ano=${ano}`);

        const totalFaturado = ordensMes.reduce((sum, o) => sum + (o.valor_total || 0), 0);
        const totalServicos = ordensMes.length;
        
        const receitasMes = relatorioMensal.receitaMensal;
        const despesasMes = relatorioMensal.despesaMensal;
        const lucroMes = relatorioMensal.lucroMensal;
        
        const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const mesNome = nomesMeses[parseInt(mes) - 1];
        
        let html = `
            <div class="relatorio-mes">
                <h2>Relatório do Mês de ${mesNome} de ${ano}</h2>
                
                <div class="mes-resumo">
                    <h3>Resumo Financeiro</h3>
                    <p><strong>Receitas:</strong> ${formatarMoeda(receitasMes)}</p>
                    <p><strong>Despesas:</strong> ${formatarMoeda(despesasMes)}</p>
                    <p><strong>Lucro:</strong> <span style="color: ${lucroMes >= 0 ? "green" : "red"}">${formatarMoeda(lucroMes)}</span></p>
                    <p><strong>Total de Ordens de Serviço:</strong> ${totalServicos}</p>
                </div>
                
                <div class="mes-ordens">
                    <h3>Ordens de Serviço do Mês</h3>
        `;
        
        if (ordensMes.length === 0) {
            html += "<p>Nenhuma ordem de serviço neste mês.</p>";
        } else {
            html += `
                    <table>
                        <thead>
                            <tr>
                                <th>OS Nº</th>
                                <th>Data</th>
                                <th>Cliente</th>
                                <th>Veículo</th>
                                <th>Status</th>
                                <th>Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            const todosClientes = await apiRequest("/api/clientes");
            const todosVeiculos = await apiRequest("/api/veiculos");

            ordensMes.forEach(o => {
                const cliente = todosClientes.find(c => c.id === o.cliente_id);
                const veiculo = todosVeiculos.find(v => v.id === o.veiculo_id);
                html += `
                    <tr>
                        <td>${o.id}</td>
                        <td>${formatarData(o.data_abertura)}</td>
                        <td>${cliente ? cliente.nome : "N/A"}</td>
                        <td>${veiculo ? `${veiculo.marca} ${veiculo.modelo}` : "N/A"}</td>
                        <td><span class="badge badge-${o.status === "Concluída" ? "success" : o.status === "Aberta" ? "warning" : "info"}">${o.status}</span></td>
                        <td>${formatarMoeda(o.valor_total || 0)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
        
        document.getElementById("relatorioConteudo").innerHTML = html;
        document.getElementById("relatorioResultado").classList.remove("hidden");

    } catch (error) {
        console.error("Erro ao gerar relatório por mês:", error);
        notificarErro("Erro ao gerar relatório por mês!");
    }
}

// ========== RELATÓRIO POR ANO ==========
async function gerarRelatorioPorAno() {
    const ano = document.getElementById("anoRelatorio").value;
    
    if (!ano) {
        notificarAviso("Selecione um ano");
        return;
    }
    
    try {
        const relatorioAnual = await apiRequest(`/api/relatorios/financeiro-anual/${ano}`);
        const ordensAno = await apiRequest(`/api/ordens?ano=${ano}`);

        const totalServicos = ordensAno.length;
        
        const receitasAno = relatorioAnual.receitaAnual;
        const despesasAno = relatorioAnual.despesaAnual;
        const lucroAno = relatorioAnual.lucroAnual;
        
        let html = `
            <div class="relatorio-ano">
                <h2>Relatório Financeiro Anual de ${ano}</h2>
                
                <div class="ano-resumo">
                    <h3>Resumo Financeiro</h3>
                    <p><strong>Receitas:</strong> ${formatarMoeda(receitasAno)}</p>
                    <p><strong>Despesas:</strong> ${formatarMoeda(despesasAno)}</p>
                    <p><strong>Lucro:</strong> <span style="color: ${lucroAno >= 0 ? "green" : "red"}">${formatarMoeda(lucroAno)}</span></p>
                    <p><strong>Total de Ordens de Serviço:</strong> ${totalServicos}</p>
                </div>
                
                <div class="ano-ordens">
                    <h3>Ordens de Serviço do Ano</h3>
        `;
        
        if (ordensAno.length === 0) {
            html += "<p>Nenhuma ordem de serviço neste ano.</p>";
        } else {
            html += `
                    <table>
                        <thead>
                            <tr>
                                <th>OS Nº</th>
                                <th>Data</th>
                                <th>Cliente</th>
                                <th>Veículo</th>
                                <th>Status</th>
                                <th>Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            const todosClientes = await apiRequest("/api/clientes");
            const todosVeiculos = await apiRequest("/api/veiculos");

            ordensAno.forEach(o => {
                const cliente = todosClientes.find(c => c.id === o.cliente_id);
                const veiculo = todosVeiculos.find(v => v.id === o.veiculo_id);
                html += `
                    <tr>
                        <td>${o.id}</td>
                        <td>${formatarData(o.data_abertura)}</td>
                        <td>${cliente ? cliente.nome : "N/A"}</td>
                        <td>${veiculo ? `${veiculo.marca} ${veiculo.modelo}` : "N/A"}</td>
                        <td><span class="badge badge-${o.status === "Concluída" ? "success" : o.status === "Aberta" ? "warning" : "info"}">${o.status}</span></td>
                        <td>${formatarMoeda(o.valor_total || 0)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
        
        document.getElementById("relatorioConteudo").innerHTML = html;
        document.getElementById("relatorioResultado").classList.remove("hidden");

    } catch (error) {
        console.error("Erro ao gerar relatório por ano:", error);
        notificarErro("Erro ao gerar relatório por ano!");
    }
}

// ========== RELATÓRIO POR SERVIÇO ==========
async function gerarRelatorioPorServico() {
    const servicoId = document.getElementById("relatorioServicoSelect").value;
    
    if (!servicoId) {
        notificarAviso("Selecione um serviço");
        return;
    }
    
    try {
        const servico = await apiRequest(`/api/servicos/${servicoId}`);
        if (!servico) {
            notificarErro("Serviço não encontrado");
            return;
        }
        
        const ordensComServico = await apiRequest(`/api/ordens?servico_id=${servicoId}`);
        
        const totalVezesUsado = ordensComServico.length;
        const totalFaturadoServico = ordensComServico.reduce((sum, o) => {
            const servicoNaOrdem = o.servicos_ids.find(s_id => s_id === servico.id);
            return sum + (servicoNaOrdem ? servico.valorMaoObra : 0);
        }, 0);

        const todosClientes = await apiRequest("/api/clientes");
        const todosVeiculos = await apiRequest("/api/veiculos");
        
        let html = `
            <div class="relatorio-servico">
                <h2>Relatório do Serviço: ${servico.descricao}</h2>
                
                <div class="servico-resumo">
                    <h3>Resumo</h3>
                    <p><strong>Categoria:</strong> ${servico.categoria || "Não informado"}</p>
                    <p><strong>Valor Mão de Obra:</strong> ${formatarMoeda(servico.valorMaoObra)}</p>
                    <p><strong>Tempo Estimado:</strong> ${servico.tempoEstimado || "Não informado"}</p>
                    <p><strong>Total de vezes utilizado:</strong> ${totalVezesUsado}</p>
                    <p><strong>Total Faturado com este serviço:</strong> ${formatarMoeda(totalFaturadoServico)}</p>
                </div>
                
                <div class="servico-ordens">
                    <h3>Ordens de Serviço que utilizaram este serviço</h3>
        `;
        
        if (ordensComServico.length === 0) {
            html += "<p>Nenhuma ordem de serviço utilizou este serviço.</p>";
        } else {
            html += `
                    <table>
                        <thead>
                            <tr>
                                <th>OS Nº</th>
                                <th>Data</th>
                                <th>Cliente</th>
                                <th>Veículo</th>
                                <th>Status</th>
                                <th>Valor Total OS</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            ordensComServico.forEach(o => {
                const cliente = todosClientes.find(c => c.id === o.cliente_id);
                const veiculo = todosVeiculos.find(v => v.id === o.veiculo_id);
                html += `
                    <tr>
                        <td>${o.id}</td>
                        <td>${formatarData(o.data_abertura)}</td>
                        <td>${cliente ? cliente.nome : "N/A"}</td>
                        <td>${veiculo ? `${veiculo.marca} ${veiculo.modelo}` : "N/A"}</td>
                        <td><span class="badge badge-${o.status === "Concluída" ? "success" : o.status === "Aberta" ? "warning" : "info"}">${o.status}</span></td>
                        <td>${formatarMoeda(o.valor_total || 0)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
        
        document.getElementById("relatorioConteudo").innerHTML = html;
        document.getElementById("relatorioResultado").classList.remove("hidden");

    } catch (error) {
        console.error("Erro ao gerar relatório por serviço:", error);
        notificarErro("Erro ao gerar relatório por serviço!");
    }
}

// ========== RELATÓRIO DE ESTOQUE BAIXO ==========
async function gerarRelatorioEstoqueBaixo() {
    try {
        const pecas = await apiRequest("/api/pecas");
        const pecasBaixoEstoque = pecas.filter(p => p.quantidadeEstoque <= p.estoqueMinimo);

        let html = `
            <div class="relatorio-estoque-baixo">
                <h2>Relatório de Peças com Estoque Baixo</h2>
                
                <p>Este relatório lista todas as peças cujo estoque atual é igual ou inferior ao estoque mínimo definido.</p>
        `;

        if (pecasBaixoEstoque.length === 0) {
            html += "<p>Nenhuma peça com estoque baixo no momento. 🎉</p>";
        } else {
            html += `
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descrição</th>
                                <th>Fornecedor</th>
                                <th>Estoque Atual</th>
                                <th>Estoque Mínimo</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            pecasBaixoEstoque.forEach(p => {
                html += `
                    <tr>
                        <td>${p.codigo}</td>
                        <td>${p.descricao}</td>
                        <td>${p.fornecedor || "N/A"}</td>
                        <td>${p.quantidadeEstoque}</td>
                        <td>${p.estoqueMinimo}</td>
                    </tr>
                `;
            });
            html += `
                        </tbody>
                    </table>
            `;
        }
        html += `
            </div>
        `;

        document.getElementById("relatorioConteudo").innerHTML = html;
        document.getElementById("relatorioResultado").classList.remove("hidden");

    } catch (error) {
        console.error("Erro ao gerar relatório de estoque baixo:", error);
        notificarErro("Erro ao gerar relatório de estoque baixo!");
    }
}


// ========== INICIALIZAÇÃO E EVENT LISTENERS ==========

window.configurarListenersRelatorios = async function() {
    // Preencher selects de clientes e serviços
    const clientes = await apiRequest("/api/clientes");
    const servicos = await apiRequest("/api/servicos");

    const selectCliente = document.getElementById("relatorioClienteSelect");
    if (selectCliente) {
        selectCliente.innerHTML = "<option value=\"\">Selecione um Cliente</option>";
        clientes.forEach(c => {
            const option = document.createElement("option");
            option.value = c.id;
            option.textContent = c.nome;
            selectCliente.appendChild(option);
        });
        selectCliente.addEventListener("change", gerarRelatorioPorCliente);
    }

    const selectServico = document.getElementById("relatorioServicoSelect");
    if (selectServico) {
        selectServico.innerHTML = "<option value=\"\">Selecione um Serviço</option>";
        servicos.forEach(s => {
            const option = document.createElement("option");
            option.value = s.id;
            option.textContent = s.descricao;
            selectServico.appendChild(option);
        });
        selectServico.addEventListener("change", gerarRelatorioPorServico);
    }

    // Listeners para os botões de relatório
    const btnRelatorioDia = document.getElementById("btnGerarRelatorioDia");
    if (btnRelatorioDia) btnRelatorioDia.addEventListener("click", gerarRelatorioPorDia);

    const btnRelatorioMes = document.getElementById("btnGerarRelatorioMes");
    if (btnRelatorioMes) btnRelatorioMes.addEventListener("click", gerarRelatorioPorMes);

    // O relatório anual já é acionado pelo formulário no index.html
    // const btnRelatorioAno = document.getElementById("btnGerarRelatorioAno");
    // if (btnRelatorioAno) btnRelatorioAno.addEventListener("click", gerarRelatorioPorAno);

    const btnRelatorioEstoqueBaixo = document.getElementById("btnGerarRelatorioEstoqueBaixo");
    if (btnRelatorioEstoqueBaixo) btnRelatorioEstoqueBaixo.addEventListener("click", gerarRelatorioEstoqueBaixo);

    console.log("✅ Listeners de relatórios configurados!");
};

// A chamada para configurarListenersRelatorios() será feita em app.js após o carregamento inicial de dados.

