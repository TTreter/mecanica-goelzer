
// ========== GERAÇÃO DE PDF PROFISSIONAL PARA ORDEM DE SERVIÇO (ADAPTADO PARA API) ==========
// Seguindo exatamente o template fornecido pelo usuário, buscando dados da API

async function gerarPDFOrdemProfissionalTemplate(ordemId) {
    let ordem;
    let cliente;
    let veiculo;
    let pecasDisponiveis;
    let servicosDisponiveis;

    try {
        ordem = await apiRequest(`/api/ordens/${ordemId}`);
        if (!ordem) {
            mostrarNotificacao("Ordem de serviço não encontrada!", "error");
            return;
        }

        cliente = await apiRequest(`/api/clientes/${ordem.cliente_id}`);
        veiculo = await apiRequest(`/api/veiculos/${ordem.veiculo_id}`);
        pecasDisponiveis = await apiRequest("/api/pecas"); // Buscar todas as peças para referência
        servicosDisponiveis = await apiRequest("/api/servicos"); // Buscar todos os serviços para referência

    } catch (error) {
        console.error("Erro ao carregar dados para o PDF:", error);
        mostrarNotificacao("Erro ao carregar dados para o PDF!", "error");
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Carregar logo do diretório static
    const logoBase64 = await imagemParaBase64("/static/logo.png");
    
    // ========== CABEÇALHO ==========
    let y = 15;
    
    // Desenhar caixas do cabeçalho
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    
    // Caixa da logo (esquerda)
    doc.rect(15, y, 90, 25);
    
    // Caixa do número da OS (direita)
    doc.rect(105, y, 90, 25);
    
    // Logo
    if (logoBase64) {
        try {
            doc.addImage(logoBase64, 'PNG', 20, y + 3, 30, 18); // Ajustar tamanho e posição conforme necessário
        } catch (e) {
            console.log('Erro ao adicionar logo:', e);
        }
    }
    
    // Nome da empresa ao lado da logo
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('OFICINA MECÂNICA', 55, y + 12);
    
    // Número da OS (direita)
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(`Ordem de serviço: ${ordem.id || '___'}`, 150, y + 15, { align: 'center' });
    
    y += 30;
    
    // ========== DATA ENTRADA E RESPONSÁVEL ==========
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.8);
    doc.line(15, y, 195, y);
    y += 2;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('DATA ENTRADA:', 15, y + 4);
    doc.setFont(undefined, 'normal');
    doc.text(formatarData(ordem.data_abertura), 45, y + 4);
    
    doc.setFont(undefined, 'bold');
    doc.text('DEIXADO POR:', 120, y + 4);
    doc.setFont(undefined, 'normal');
    doc.text(ordem.responsavel || '_______________', 150, y + 4);
    
    y += 8;
    doc.setLineWidth(0.8);
    doc.line(15, y, 195, y);
    
    y += 8;
    
    // ========== DADOS DO CLIENTE ==========
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    
    // Nome
    doc.text('NOME:', 15, y);
    doc.setFont(undefined, 'normal');
    doc.text(cliente ? cliente.nome : '_______________', 30, y);
    
    // CNPJ
    doc.setFont(undefined, 'bold');
    doc.text('CPF/CNPJ:', 130, y);
    doc.setFont(undefined, 'normal');
    doc.text(cliente ? (cliente.cpfCnpj || '_______________') : '_______________', 150, y);
    
    y += 6;
    
    // Endereço
    doc.setFont(undefined, 'bold');
    doc.text('ENDEREÇO:', 15, y);
    doc.setFont(undefined, 'normal');
    doc.text(cliente ? (cliente.endereco || '_______________') : '_______________', 40, y);
    
    // CEP (assumindo que o cliente pode ter CEP)
    doc.setFont(undefined, 'bold');
    doc.text('CEP:', 130, y);
    doc.setFont(undefined, 'normal');
    doc.text(cliente ? (cliente.cep || '_______________') : '_______________', 145, y);
    
    y += 6;
    
    // Cidade
    doc.setFont(undefined, 'bold');
    doc.text('CIDADE:', 15, y);
    doc.setFont(undefined, 'normal');
    doc.text(cliente ? (cliente.cidade || '_______________') : '_______________', 35, y);
    
    y += 6;
    
    // Fone
    doc.setFont(undefined, 'bold');
    doc.text('FONE:', 15, y);
    doc.setFont(undefined, 'normal');
    doc.text(cliente ? (cliente.telefone || '_______________') : '_______________', 30, y);
    
    y += 8;
    doc.setLineWidth(0.8);
    doc.line(15, y, 195, y);
    
    y += 8;
    
    // ========== DADOS DO VEÍCULO ==========
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    
    // Veículo
    doc.text('VEÍCULO:', 15, y);
    doc.setFont(undefined, 'normal');
    doc.text(veiculo ? `${veiculo.marca} ${veiculo.modelo}` : '_______________', 35, y);
    
    // Cor
    doc.setFont(undefined, 'bold');
    doc.text('COR:', 100, y);
    doc.setFont(undefined, 'normal');
    doc.text(veiculo ? (veiculo.cor || '_______________') : '_______________', 110, y);
    
    // Marca
    doc.setFont(undefined, 'bold');
    doc.text('MARCA:', 150, y);
    doc.setFont(undefined, 'normal');
    doc.text(veiculo ? (veiculo.marca || '_______________') : '_______________', 165, y);
    
    y += 6;
    
    // Placa
    doc.setFont(undefined, 'bold');
    doc.text('PLACA:', 15, y);
    doc.setFont(undefined, 'normal');
    doc.text(veiculo ? (veiculo.placa || '_______________') : '_______________', 30, y);
    
    // KM
    doc.setFont(undefined, 'bold');
    doc.text('KM:', 80, y);
    doc.setFont(undefined, 'normal');
    doc.text(veiculo ? (veiculo.km ? veiculo.km.toString() : '_______________') : '_______________', 90, y);
    
    // Chassi
    doc.setFont(undefined, 'bold');
    doc.text('CHASSI:', 130, y);
    doc.setFont(undefined, 'normal');
    doc.text(veiculo ? (veiculo.chassi || '_______________') : '_______________', 145, y);
    
    y += 8;
    doc.setLineWidth(0.8);
    doc.line(15, y, 195, y);
    
    y += 8;
    
    // ========== DESCRIÇÃO DOS SERVIÇOS ==========
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('DESCRIÇÃO DOS SERVIÇOS A SEREM EFETUADOS: (descrição do que precisa ser feito, comunicado pelo colaborador da Gsiagro)', 15, y);
    
    y += 6;
    
    doc.setFont(undefined, 'normal');
    const problema = ordem.problema || ordem.observacoes || '';
    if (problema) {
        const linhasProblema = doc.splitTextToSize(problema, 180);
        doc.text(linhasProblema, 15, y);
        y += (linhasProblema.length * 5) + 3;
    } else {
        doc.text('_________________________________________________________________________________', 15, y);
        y += 10;
    }
    
    // Adicionar serviços realizados na descrição (se houver)
    if (ordem.servicos_ids && ordem.servicos_ids.length > 0) {
        ordem.servicos_ids.forEach(servico_id => {
            const servico = servicosDisponiveis.find(srv => srv.id === servico_id);
            if (servico && y < 200) { // Limite de altura para esta seção
                doc.text(`- ${servico.descricao}`, 15, y);
                y += 5;
            }
        });
        y += 3;
    }
    
    y += 5;
    doc.setLineWidth(0.5);
    doc.line(15, y, 195, y);
    
    y += 8;
    
    // ========== TABELA DE PEÇAS-SERVIÇOS-VALORES ==========
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('PEÇAS-SERVIÇOS-VALORES', 15, y);
    
    y += 6;
    
    // Cabeçalho da tabela
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    
    const tableStartY = y;
    // const colWidths = [15, 90, 20, 30, 30]; // Código, Descrição, Qtd, Valor Unit, Valor Total
    const colX = [15, 30, 120, 140, 170]; // Posições X para as colunas
    
    // Desenhar cabeçalho
    doc.setFillColor(240, 240, 240);
    doc.rect(15, y - 4, 180, 7, 'FD');
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('Código', colX[0] + 2, y);
    doc.text('Descrição', colX[1] + 2, y);
    doc.text('Qtd', colX[2] + 2, y);
    doc.text('Valor unit', colX[3] + 2, y);
    doc.text('Valor Total', colX[4] + 2, y);
    
    y += 7;
    
    // Linhas da tabela
    doc.setFont(undefined, 'normal');
    let totalGeralCalculado = 0;
    let linhaNum = 1;
    
    // Adicionar peças
    if (ordem.pecas_usadas && ordem.pecas_usadas.length > 0) {
        for (const p of ordem.pecas_usadas) {
            const peca = pecasDisponiveis.find(pc => pc.id === p.peca_id);
            if (peca) {
                const valorTotal = peca.precoVenda * p.quantidade;
                totalGeralCalculado += valorTotal;
                
                doc.text(linhaNum.toString(), colX[0] + 2, y);
                doc.text(peca.descricao.substring(0, 35), colX[1] + 2, y);
                doc.text(p.quantidade.toString(), colX[2] + 2, y);
                doc.text(formatarMoeda(peca.precoVenda), colX[3] + 2, y);
                doc.text(formatarMoeda(valorTotal), colX[4] + 2, y);
                
                // Linha horizontal
                doc.line(15, y + 2, 195, y + 2);
                
                y += 6;
                linhaNum++;
            }
        }
    }
    
    // Adicionar serviços
    if (ordem.servicos_ids && ordem.servicos_ids.length > 0) {
        for (const servico_id of ordem.servicos_ids) {
            const servico = servicosDisponiveis.find(srv => srv.id === servico_id);
            if (servico) {
                totalGeralCalculado += servico.valorMaoObra;
                
                doc.text(linhaNum.toString(), colX[0] + 2, y);
                doc.text(servico.descricao.substring(0, 35), colX[1] + 2, y);
                doc.text('1', colX[2] + 2, y);
                doc.text(formatarMoeda(servico.valorMaoObra), colX[3] + 2, y);
                doc.text(formatarMoeda(servico.valorMaoObra), colX[4] + 2, y);
                
                // Linha horizontal
                doc.line(15, y + 2, 195, y + 2);
                
                y += 6;
                linhaNum++;
            }
        }
    }
    
    // Preencher linhas vazias até ter pelo menos 10 linhas (ou mais se houver muito conteúdo)
    const minLines = 10; // Número mínimo de linhas na tabela
    while (linhaNum <= minLines || y < (tableStartY + (minLines * 6) + 10)) { // Garante que a tabela tenha um tamanho mínimo ou o suficiente para o conteúdo
        doc.text(linhaNum.toString(), colX[0] + 2, y);
        doc.line(15, y + 2, 195, y + 2);
        y += 6;
        linhaNum++;
    }
    
    // Desenhar bordas verticais da tabela
    // A altura da tabela é calculada dinamicamente com base no conteúdo
    doc.line(15, tableStartY - 4, 15, y - 4); // Esquerda
    doc.line(colX[1], tableStartY - 4, colX[1], y - 4); // Após Código
    doc.line(colX[2], tableStartY - 4, colX[2], y - 4); // Após Descrição
    doc.line(colX[3], tableStartY - 4, colX[3], y - 4); // Após Qtd
    doc.line(colX[4], tableStartY - 4, colX[4], y - 4); // Após Valor Unit
    doc.line(195, tableStartY - 4, 195, y - 4); // Direita
    
    y += 8;
    
    // TOTAL GERAL
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL GERAL', 140, y);
    doc.text(formatarMoeda(ordem.valor_total || totalGeralCalculado), 175, y);
    
    y += 10;
    doc.setLineWidth(0.8);
    doc.line(15, y, 195, y);
    
    y += 8;
    
    // ========== DATA DE SAÍDA E FORMA DE PAGAMENTO ==========
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('DATA DA SAÍDA VEÍCULO:', 15, y);
    doc.setFont(undefined, 'normal');
    doc.text(ordem.data_fechamento ? formatarData(ordem.data_fechamento) : '___/___/______', 60, y);
    
    y += 8;
    
    doc.setFont(undefined, 'bold');
    doc.text('Serviço pago ___/___/______ via R$ /PIX/CHEQUE:', 15, y);
    doc.setFont(undefined, 'normal');
    doc.text(ordem.forma_pagamento || '_________________', 120, y);
    
    y += 15;
    
    // ========== ASSINATURAS ==========
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    // Assinatura do Cliente
    doc.line(120, y, 195, y);
    doc.setFontSize(8);
    doc.text('Assinatura Cliente-colaborador que retirou', 120, y + 4);
    
    y += 15;
    
    // Assinatura da Oficina
    doc.line(15, y, 90, y);
    doc.text('ASSINATURA-VISTO: O CASARÃO', 15, y + 4);
    
    // Rodapé com logo da empresa cliente (se houver)
    doc.setFontSize(8);
    doc.text('Sistema de Gestão - Oficina Mecânica', 105, 285, { align: 'center' });
    
    // Salvar PDF
    doc.save(`OS_${ordem.id}_${cliente ? cliente.nome.replace(/\s/g, '_') : 'Cliente'}.pdf`);
    
    mostrarNotificacao('PDF gerado com sucesso!', 'success');
}

// Função auxiliar para formatar data
function formatarData(data) {
    if (!data) return '';
    const d = new Date(data);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Função auxiliar para formatar moeda
function formatarMoeda(valor) {
    if (valor === null || valor === undefined) return 'R$ 0,00';
    return `R$ ${parseFloat(valor).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`;
}

// Função para converter imagem para Base64
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
        console.log('Erro ao carregar imagem:', error);
        return null;
    }
}

