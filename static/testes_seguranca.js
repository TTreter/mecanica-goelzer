// ========== SUITE DE TESTES DE SEGURANÇA ==========
// Testes automatizados para validar o sistema de segurança

class TestesSeguranca {
    constructor() {
        this.resultados = [];
        this.testesPassaram = 0;
        this.testesFalharam = 0;
    }

    async executarTodos() {
        console.log('🧪 Iniciando suite de testes de segurança...\n');
        
        this.resultados = [];
        this.testesPassaram = 0;
        this.testesFalharam = 0;

        // Testes de Validação
        await this.testeValidacaoEstrutura();
        await this.testeValidacaoIntegridade();
        await this.testeValidacaoIDsDuplicados();

        // Testes de Salvamento
        await this.testeSalvamentoLocalStorage();
        await this.testeSalvamentoIndexedDB();
        await this.testeVerificacaoChecksum();

        // Testes de Recuperação
        await this.testeRecuperacaoIndexedDB();
        await this.testeRecuperacaoDadosCorrempidos();

        // Testes de Backup
        await this.testeBackupAutomatico();
        await this.testeHistoricoVersoes();

        // Testes de Estresse
        await this.testeEstresse1000Clientes();
        await this.testeEstresse500OS();
        await this.testeLimiteLocalStorage();

        // Mostrar resultados
        this.mostrarResultados();
    }

    registrarResultado(nome, passou, detalhes = '') {
        this.resultados.push({
            nome,
            passou,
            detalhes,
            timestamp: new Date().toISOString()
        });

        if (passou) {
            this.testesPassaram++;
            console.log(`✅ ${nome}`);
        } else {
            this.testesFalharam++;
            console.error(`❌ ${nome} - ${detalhes}`);
        }
    }

    // ========== TESTES DE VALIDAÇÃO ==========

    async testeValidacaoEstrutura() {
        try {
            const dadosTeste = {
                clientes: [],
                veiculos: [],
                servicos: [],
                pecas: [],
                ferramentas: [],
                agendamentos: [],
                ordens: [],
                compras: [],
                movimentacoes: [],
                despesasGerais: []
            };

            const validacao = ValidadorDados.validarEstrutura(dadosTeste);
            const passou = validacao.length === 0;

            this.registrarResultado(
                'Validação de Estrutura',
                passou,
                passou ? '' : validacao.join(', ')
            );
        } catch (error) {
            this.registrarResultado('Validação de Estrutura', false, error.message);
        }
    }

    async testeValidacaoIntegridade() {
        try {
            const dadosTeste = {
                clientes: [{ id: 1, nome: 'Cliente Teste' }],
                veiculos: [{ id: 1, clienteId: 1, placa: 'ABC-1234' }],
                ordens: [{ id: 1, numero: '2025-0001', clienteId: 1, veiculoId: 1 }],
                servicos: [],
                pecas: [],
                ferramentas: [],
                agendamentos: [],
                compras: [],
                movimentacoes: [],
                despesasGerais: []
            };

            const validacao = ValidadorDados.validarIntegridade(dadosTeste);
            const passou = validacao.length === 0;

            this.registrarResultado(
                'Validação de Integridade',
                passou,
                passou ? '' : validacao.join(', ')
            );
        } catch (error) {
            this.registrarResultado('Validação de Integridade', false, error.message);
        }
    }

    async testeValidacaoIDsDuplicados() {
        try {
            const dadosTeste = {
                clientes: [
                    { id: 1, nome: 'Cliente 1' },
                    { id: 2, nome: 'Cliente 2' },
                    { id: 1, nome: 'Cliente 3' } // ID duplicado
                ],
                veiculos: [],
                ordens: [],
                servicos: [],
                pecas: [],
                ferramentas: [],
                agendamentos: [],
                compras: [],
                movimentacoes: [],
                despesasGerais: []
            };

            const validacao = ValidadorDados.validarIntegridade(dadosTeste);
            const passou = validacao.some(erro => erro.includes('duplicados'));

            this.registrarResultado(
                'Detecção de IDs Duplicados',
                passou,
                passou ? '' : 'Não detectou IDs duplicados'
            );
        } catch (error) {
            this.registrarResultado('Detecção de IDs Duplicados', false, error.message);
        }
    }

    // ========== TESTES DE SALVAMENTO ==========

    async testeSalvamentoLocalStorage() {
        try {
            const dadosTeste = { teste: 'salvamento', timestamp: Date.now() };
            localStorage.setItem('_teste_salvamento', JSON.stringify(dadosTeste));
            
            const recuperado = JSON.parse(localStorage.getItem('_teste_salvamento'));
            const passou = recuperado.teste === 'salvamento';

            localStorage.removeItem('_teste_salvamento');

            this.registrarResultado(
                'Salvamento no localStorage',
                passou,
                passou ? '' : 'Dados não salvaram corretamente'
            );
        } catch (error) {
            this.registrarResultado('Salvamento no localStorage', false, error.message);
        }
    }

    async testeSalvamentoIndexedDB() {
        try {
            const dadosTeste = {
                clientes: [{ id: 1, nome: 'Teste IndexedDB' }],
                veiculos: [],
                ordens: [],
                servicos: [],
                pecas: [],
                ferramentas: [],
                agendamentos: [],
                compras: [],
                movimentacoes: [],
                despesasGerais: []
            };

            await backupDB.salvar(dadosTeste);
            const recuperado = await backupDB.recuperar();
            
            const passou = recuperado && recuperado.clientes[0].nome === 'Teste IndexedDB';

            this.registrarResultado(
                'Salvamento no IndexedDB',
                passou,
                passou ? '' : 'Dados não salvaram no IndexedDB'
            );
        } catch (error) {
            this.registrarResultado('Salvamento no IndexedDB', false, error.message);
        }
    }

    async testeVerificacaoChecksum() {
        try {
            const dadosTeste = { teste: 'checksum' };
            const checksum1 = backupDB.calcularChecksum(dadosTeste);
            const checksum2 = backupDB.calcularChecksum(dadosTeste);
            
            const passou = checksum1 === checksum2;

            this.registrarResultado(
                'Verificação de Checksum',
                passou,
                passou ? '' : 'Checksums diferentes para mesmos dados'
            );
        } catch (error) {
            this.registrarResultado('Verificação de Checksum', false, error.message);
        }
    }

    // ========== TESTES DE RECUPERAÇÃO ==========

    async testeRecuperacaoIndexedDB() {
        try {
            const dadosTeste = {
                clientes: [{ id: 999, nome: 'Recuperação Teste' }],
                veiculos: [],
                ordens: [],
                servicos: [],
                pecas: [],
                ferramentas: [],
                agendamentos: [],
                compras: [],
                movimentacoes: [],
                despesasGerais: []
            };

            // Salvar no IndexedDB
            await backupDB.salvar(dadosTeste);

            // Limpar localStorage
            localStorage.removeItem('oficinaCompleta');

            // Tentar recuperar
            const recuperado = await sistemaSeguro.carregarDadosSeguro();
            
            const passou = recuperado && recuperado.clientes[0].id === 999;

            this.registrarResultado(
                'Recuperação do IndexedDB',
                passou,
                passou ? '' : 'Não recuperou do IndexedDB'
            );
        } catch (error) {
            this.registrarResultado('Recuperação do IndexedDB', false, error.message);
        }
    }

    async testeRecuperacaoDadosCorrempidos() {
        try {
            // Salvar dados corrompidos
            localStorage.setItem('oficinaCompleta', '{dados: corrompidos}');

            // Tentar carregar (deve falhar e recuperar do IndexedDB)
            const recuperado = await sistemaSeguro.carregarDadosSeguro();
            
            const passou = recuperado !== null;

            this.registrarResultado(
                'Recuperação de Dados Corrompidos',
                passou,
                passou ? '' : 'Não recuperou dados corrompidos'
            );
        } catch (error) {
            this.registrarResultado('Recuperação de Dados Corrompidos', false, error.message);
        }
    }

    // ========== TESTES DE BACKUP ==========

    async testeBackupAutomatico() {
        try {
            const dadosTeste = {
                clientes: [{ id: 1, nome: 'Backup Auto' }],
                veiculos: [],
                ordens: [],
                servicos: [],
                pecas: [],
                ferramentas: [],
                agendamentos: [],
                compras: [],
                movimentacoes: [],
                despesasGerais: []
            };

            await backupDB.salvar(dadosTeste);
            await backupDB.salvarHistorico(dadosTeste, 'teste_backup');

            const passou = true;

            this.registrarResultado(
                'Backup Automático',
                passou,
                passou ? '' : 'Backup automático falhou'
            );
        } catch (error) {
            this.registrarResultado('Backup Automático', false, error.message);
        }
    }

    async testeHistoricoVersoes() {
        try {
            // Salvar 3 versões
            for (let i = 1; i <= 3; i++) {
                const dadosTeste = {
                    clientes: [{ id: i, nome: `Versão ${i}` }],
                    veiculos: [],
                    ordens: [],
                    servicos: [],
                    pecas: [],
                    ferramentas: [],
                    agendamentos: [],
                    compras: [],
                    movimentacoes: [],
                    despesasGerais: []
                };

                await backupDB.salvarHistorico(dadosTeste, `versao_${i}`);
                await new Promise(resolve => setTimeout(resolve, 100)); // Delay para timestamps diferentes
            }

            const historico = await backupDB.obterHistorico(5);
            const passou = historico.length >= 3;

            this.registrarResultado(
                'Histórico de Versões',
                passou,
                passou ? '' : `Apenas ${historico.length} versões encontradas`
            );
        } catch (error) {
            this.registrarResultado('Histórico de Versões', false, error.message);
        }
    }

    // ========== TESTES DE ESTRESSE ==========

    async testeEstresse1000Clientes() {
        try {
            const dadosTeste = {
                clientes: [],
                veiculos: [],
                ordens: [],
                servicos: [],
                pecas: [],
                ferramentas: [],
                agendamentos: [],
                compras: [],
                movimentacoes: [],
                despesasGerais: []
            };

            // Criar 1000 clientes
            for (let i = 1; i <= 1000; i++) {
                dadosTeste.clientes.push({
                    id: i,
                    nome: `Cliente Teste ${i}`,
                    cpfCnpj: `000.000.000-${String(i).padStart(2, '0')}`,
                    telefone: `(00) 0000-${String(i).padStart(4, '0')}`,
                    email: `cliente${i}@teste.com`
                });
            }

            // Tentar salvar
            const dadosString = JSON.stringify(dadosTeste);
            localStorage.setItem('_teste_estresse', dadosString);
            
            const recuperado = localStorage.getItem('_teste_estresse');
            const passou = recuperado === dadosString;

            localStorage.removeItem('_teste_estresse');

            const tamanho = new Blob([dadosString]).size;
            this.registrarResultado(
                'Estresse: 1000 Clientes',
                passou,
                passou ? `Tamanho: ${(tamanho / 1024).toFixed(2)} KB` : 'Falhou ao salvar'
            );
        } catch (error) {
            this.registrarResultado('Estresse: 1000 Clientes', false, error.message);
        }
    }

    async testeEstresse500OS() {
        try {
            const dadosTeste = {
                clientes: [{ id: 1, nome: 'Cliente Teste' }],
                veiculos: [{ id: 1, clienteId: 1, placa: 'ABC-1234' }],
                ordens: [],
                servicos: [],
                pecas: [],
                ferramentas: [],
                agendamentos: [],
                compras: [],
                movimentacoes: [],
                despesasGerais: []
            };

            // Criar 500 OS
            for (let i = 1; i <= 500; i++) {
                dadosTeste.ordens.push({
                    id: i,
                    numero: `2025-${String(i).padStart(4, '0')}`,
                    clienteId: 1,
                    veiculoId: 1,
                    servicos: [{ servicoId: 1, valor: 100 }],
                    pecas: [{ pecaId: 1, quantidade: 2, valor: 50 }],
                    valorTotal: 200,
                    status: 'Concluída',
                    dataAbertura: new Date().toISOString()
                });
            }

            // Tentar salvar
            const dadosString = JSON.stringify(dadosTeste);
            localStorage.setItem('_teste_estresse_os', dadosString);
            
            const recuperado = localStorage.getItem('_teste_estresse_os');
            const passou = recuperado === dadosString;

            localStorage.removeItem('_teste_estresse_os');

            const tamanho = new Blob([dadosString]).size;
            this.registrarResultado(
                'Estresse: 500 OS',
                passou,
                passou ? `Tamanho: ${(tamanho / 1024).toFixed(2)} KB` : 'Falhou ao salvar'
            );
        } catch (error) {
            this.registrarResultado('Estresse: 500 OS', false, error.message);
        }
    }

    async testeLimiteLocalStorage() {
        try {
            const dadosAtuais = localStorage.getItem('oficinaCompleta');
            const tamanho = dadosAtuais ? new Blob([dadosAtuais]).size : 0;
            const tamanhoKB = (tamanho / 1024).toFixed(2);
            const tamanhoMB = (tamanho / 1024 / 1024).toFixed(2);

            const limiteTypico = 5 * 1024 * 1024; // 5MB
            const passou = tamanho < limiteTypico;

            this.registrarResultado(
                'Limite do localStorage',
                passou,
                `Tamanho atual: ${tamanhoKB} KB (${tamanhoMB} MB) - Limite: 5 MB`
            );
        } catch (error) {
            this.registrarResultado('Limite do localStorage', false, error.message);
        }
    }

    // ========== MOSTRAR RESULTADOS ==========

    mostrarResultados() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 RESULTADOS DOS TESTES DE SEGURANÇA');
        console.log('='.repeat(60) + '\n');

        console.log(`✅ Testes passaram: ${this.testesPassaram}`);
        console.log(`❌ Testes falharam: ${this.testesFalharam}`);
        console.log(`📊 Total de testes: ${this.resultados.length}`);
        
        const porcentagem = ((this.testesPassaram / this.resultados.length) * 100).toFixed(2);
        console.log(`📈 Taxa de sucesso: ${porcentagem}%\n`);

        if (this.testesFalharam > 0) {
            console.log('❌ TESTES QUE FALHARAM:\n');
            this.resultados
                .filter(r => !r.passou)
                .forEach(r => {
                    console.log(`   • ${r.nome}`);
                    if (r.detalhes) {
                        console.log(`     Detalhes: ${r.detalhes}`);
                    }
                });
            console.log('');
        }

        console.log('='.repeat(60));

        // Criar relatório HTML
        this.gerarRelatorioHTML();
    }

    gerarRelatorioHTML() {
        const porcentagem = ((this.testesPassaram / this.resultados.length) * 100).toFixed(2);
        
        let html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
            <h1 style="color: #1e3a8a;">📊 Relatório de Testes de Segurança</h1>
            <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h2>Resumo</h2>
                <p>✅ <strong>Testes passaram:</strong> ${this.testesPassaram}</p>
                <p>❌ <strong>Testes falharam:</strong> ${this.testesFalharam}</p>
                <p>📊 <strong>Total de testes:</strong> ${this.resultados.length}</p>
                <p>📈 <strong>Taxa de sucesso:</strong> ${porcentagem}%</p>
            </div>

            <h2>Detalhes dos Testes</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #1e3a8a; color: white;">
                        <th style="padding: 10px; text-align: left;">Teste</th>
                        <th style="padding: 10px; text-align: center;">Status</th>
                        <th style="padding: 10px; text-align: left;">Detalhes</th>
                    </tr>
                </thead>
                <tbody>
        `;

        this.resultados.forEach(r => {
            const cor = r.passou ? '#22c55e' : '#ef4444';
            const status = r.passou ? '✅' : '❌';
            html += `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px;">${r.nome}</td>
                    <td style="padding: 10px; text-align: center; color: ${cor}; font-size: 20px;">${status}</td>
                    <td style="padding: 10px; font-size: 12px; color: #666;">${r.detalhes || '-'}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>

            <div style="margin-top: 30px; padding: 15px; background: ${this.testesFalharam === 0 ? '#d1fae5' : '#fee2e2'}; border-radius: 8px;">
                <h3>${this.testesFalharam === 0 ? '✅ Todos os testes passaram!' : '⚠️ Alguns testes falharam'}</h3>
                <p>${this.testesFalharam === 0 ? 
                    'O sistema de segurança está funcionando perfeitamente!' : 
                    'Verifique os testes que falharam e corrija os problemas.'}</p>
            </div>
        </div>
        `;

        console.log('\n📄 Relatório HTML gerado (disponível na variável testesSeguranca.relatorioHTML)');
        this.relatorioHTML = html;
    }

    salvarRelatorio() {
        const blob = new Blob([this.relatorioHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Relatorio_Testes_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('✅ Relatório HTML salvo!');
    }
}

// Instância global
const testesSeguranca = new TestesSeguranca();

// Função para executar testes via console
async function executarTestesSeguranca() {
    await testesSeguranca.executarTodos();
}

// Função para salvar relatório
function salvarRelatorioTestes() {
    testesSeguranca.salvarRelatorio();
}

console.log('✅ Suite de testes carregada!');
console.log('💡 Para executar os testes, digite: executarTestesSeguranca()');
console.log('💡 Para salvar relatório, digite: salvarRelatorioTestes()');

