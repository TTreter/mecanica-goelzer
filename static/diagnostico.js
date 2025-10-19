// ========================================
// SISTEMA DE DIAGNÓSTICO AUTOMÁTICO
// Mecânica Göelzer - Versão 4.1
// ========================================

/**
 * Este módulo realiza diagnóstico automático do sistema
 * para identificar problemas comuns e orientar o usuário
 */

(function() {
    'use strict';
    
    console.log('🔍 Iniciando diagnóstico automático do sistema...');
    
    // Versão do sistema (para controle de cache)
    const VERSAO_SISTEMA = '4.1.0';
    const DATA_VERSAO = '2025-10-18';
    
    // Armazenar versão no localStorage
    localStorage.setItem('sistemaVersao', VERSAO_SISTEMA);
    localStorage.setItem('sistemaDataAtualizacao', DATA_VERSAO);
    
    // ========== DIAGNÓSTICO DE MÓDULOS ==========
    const modulosEsperados = [
        'notificacoes.js',
        'validacoes.js', 
        'mascaras.js',
        'atualizacao_automatica.js',
        'edicao_exclusao.js',
        'filtros_busca.js',
        'calculos.js',
        'paginacao_ordenacao.js',
        'exportacao.js',
        'graficos.js'
    ];
    
    const funcoesEsperadas = [
        'carregarVeiculosCliente',
        'carregarVeiculosSelectAgenda',
        'salvarOrdem',
        'salvarAgendamento',
        'showPage',
        'salvarDados',
        'carregarDados'
    ];
    
    // ========== VERIFICAR MÓDULOS CARREGADOS ==========
    function verificarModulosCarregados() {
        const scripts = Array.from(document.querySelectorAll('script[src]'));
        const scriptsSrc = scripts.map(s => s.src.split('/').pop());
        
        const modulosCarregados = [];
        const modulosFaltando = [];
        
        modulosEsperados.forEach(modulo => {
            if (scriptsSrc.includes(modulo)) {
                modulosCarregados.push(modulo);
            } else {
                modulosFaltando.push(modulo);
            }
        });
        
        return { modulosCarregados, modulosFaltando };
    }
    
    // ========== VERIFICAR FUNÇÕES DISPONÍVEIS ==========
    function verificarFuncoesDisponiveis() {
        const funcoesDisponiveis = [];
        const funcoesFaltando = [];
        
        funcoesEsperadas.forEach(funcao => {
            if (typeof window[funcao] === 'function') {
                funcoesDisponiveis.push(funcao);
            } else {
                funcoesFaltando.push(funcao);
            }
        });
        
        return { funcoesDisponiveis, funcoesFaltando };
    }
    
    // ========== VERIFICAR DADOS NO LOCALSTORAGE ==========
    function verificarDados() {
        const dados = localStorage.getItem('oficinaCompleta');
        
        if (!dados) {
            return {
                status: 'vazio',
                mensagem: 'Nenhum dado encontrado no sistema'
            };
        }
        
        try {
            const dadosObj = JSON.parse(dados);
            const clientes = dadosObj.clientes ? dadosObj.clientes.length : 0;
            const veiculos = dadosObj.veiculos ? dadosObj.veiculos.length : 0;
            const ordens = dadosObj.ordens ? dadosObj.ordens.length : 0;
            const agendamentos = dadosObj.agendamentos ? dadosObj.agendamentos.length : 0;
            
            return {
                status: 'ok',
                clientes,
                veiculos,
                ordens,
                agendamentos,
                mensagem: `Sistema com ${clientes} clientes, ${veiculos} veículos, ${ordens} ordens e ${agendamentos} agendamentos`
            };
        } catch (e) {
            return {
                status: 'erro',
                mensagem: 'Erro ao ler dados: ' + e.message
            };
        }
    }
    
    // ========== VERIFICAR ELEMENTOS DO DOM ==========
    function verificarElementosDOM() {
        const elementosEsperados = [
            'ordemClienteId',
            'ordemVeiculoId',
            'agendamentoCliente',
            'agendamentoVeiculo'
        ];
        
        const elementosEncontrados = [];
        const elementosFaltando = [];
        
        elementosEsperados.forEach(id => {
            if (document.getElementById(id)) {
                elementosEncontrados.push(id);
            } else {
                elementosFaltando.push(id);
            }
        });
        
        return { elementosEncontrados, elementosFaltando };
    }
    
    // ========== TESTAR FUNÇÃO DE CARREGAR VEÍCULOS ==========
    function testarCarregarVeiculos() {
        if (typeof window.carregarVeiculosCliente !== 'function') {
            return {
                status: 'erro',
                mensagem: 'Função carregarVeiculosCliente não encontrada'
            };
        }
        
        // Verificar se os selects existem
        const selectOS = document.getElementById('ordemVeiculoId');
        const selectAgenda = document.getElementById('agendamentoVeiculo');
        
        if (!selectOS) {
            return {
                status: 'erro',
                mensagem: 'Select de veículo da Ordem de Serviço não encontrado'
            };
        }
        
        if (!selectAgenda) {
            return {
                status: 'erro',
                mensagem: 'Select de veículo do Agendamento não encontrado'
            };
        }
        
        return {
            status: 'ok',
            mensagem: 'Função e elementos encontrados corretamente'
        };
    }
    
    // ========== EXECUTAR DIAGNÓSTICO COMPLETO ==========
    function executarDiagnostico() {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 DIAGNÓSTICO DO SISTEMA - Mecânica Göelzer');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`🔖 Versão: ${VERSAO_SISTEMA}`);
        console.log(`📅 Data: ${DATA_VERSAO}`);
        console.log('');
        
        // 1. Verificar módulos
        const { modulosCarregados, modulosFaltando } = verificarModulosCarregados();
        console.log('📦 MÓDULOS CARREGADOS:');
        console.log(`   ✅ ${modulosCarregados.length}/${modulosEsperados.length} módulos carregados`);
        if (modulosFaltando.length > 0) {
            console.warn(`   ⚠️  Módulos faltando: ${modulosFaltando.join(', ')}`);
        }
        console.log('');
        
        // 2. Verificar funções
        const { funcoesDisponiveis, funcoesFaltando } = verificarFuncoesDisponiveis();
        console.log('⚙️  FUNÇÕES DISPONÍVEIS:');
        console.log(`   ✅ ${funcoesDisponiveis.length}/${funcoesEsperadas.length} funções disponíveis`);
        if (funcoesFaltando.length > 0) {
            console.error(`   ❌ Funções faltando: ${funcoesFaltando.join(', ')}`);
        }
        console.log('');
        
        // 3. Verificar dados
        const dadosInfo = verificarDados();
        console.log('💾 DADOS DO SISTEMA:');
        console.log(`   ${dadosInfo.status === 'ok' ? '✅' : '⚠️'} ${dadosInfo.mensagem}`);
        console.log('');
        
        // 4. Verificar elementos DOM
        const { elementosEncontrados, elementosFaltando } = verificarElementosDOM();
        console.log('🎯 ELEMENTOS DO DOM:');
        console.log(`   ✅ ${elementosEncontrados.length}/${elementosEncontrados.length + elementosFaltando.length} elementos encontrados`);
        if (elementosFaltando.length > 0) {
            console.error(`   ❌ Elementos faltando: ${elementosFaltando.join(', ')}`);
        }
        console.log('');
        
        // 5. Testar função de carregar veículos
        const testeVeiculos = testarCarregarVeiculos();
        console.log('🚗 TESTE DE CARREGAMENTO DE VEÍCULOS:');
        console.log(`   ${testeVeiculos.status === 'ok' ? '✅' : '❌'} ${testeVeiculos.mensagem}`);
        console.log('');
        
        // 6. Informações do navegador
        console.log('🌐 INFORMAÇÕES DO NAVEGADOR:');
        console.log(`   Navegador: ${navigator.userAgent}`);
        console.log(`   LocalStorage disponível: ${typeof Storage !== 'undefined' ? 'Sim' : 'Não'}`);
        console.log('');
        
        // Resumo final
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const problemas = [];
        if (modulosFaltando.length > 0) problemas.push('Módulos faltando');
        if (funcoesFaltando.length > 0) problemas.push('Funções faltando');
        if (elementosFaltando.length > 0) problemas.push('Elementos DOM faltando');
        if (testeVeiculos.status !== 'ok') problemas.push('Problema no carregamento de veículos');
        
        if (problemas.length === 0) {
            console.log('✅ SISTEMA FUNCIONANDO CORRETAMENTE!');
            console.log('');
            console.log('📝 INSTRUÇÕES DE USO:');
            console.log('   1. Vá em "Ordens de Serviço" ou "Agendamentos"');
            console.log('   2. Clique em "+ Nova Ordem" ou "+ Novo Agendamento"');
            console.log('   3. PRIMEIRO selecione o Cliente no dropdown');
            console.log('   4. DEPOIS o dropdown de Veículos será preenchido automaticamente');
            console.log('   5. Selecione o veículo desejado');
        } else {
            console.error('❌ PROBLEMAS DETECTADOS:');
            problemas.forEach(p => console.error(`   • ${p}`));
            console.log('');
            console.log('🔧 SOLUÇÃO:');
            console.log('   1. Limpe o cache do navegador (Ctrl+Shift+Del)');
            console.log('   2. Feche todas as abas do sistema');
            console.log('   3. Abra o arquivo index.html novamente');
            console.log('   4. Pressione Ctrl+F5 para forçar recarregamento');
        }
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Retornar resultado do diagnóstico
        return {
            versao: VERSAO_SISTEMA,
            modulosCarregados: modulosCarregados.length,
            modulosTotal: modulosEsperados.length,
            funcoesDisponiveis: funcoesDisponiveis.length,
            funcoesTotal: funcoesEsperadas.length,
            problemas: problemas.length,
            status: problemas.length === 0 ? 'ok' : 'com_problemas'
        };
    }
    
    // ========== CRIAR PAINEL DE DIAGNÓSTICO NA INTERFACE ==========
    function criarPainelDiagnostico() {
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', criarPainelDiagnostico);
            return;
        }
        
        // Criar botão de diagnóstico no canto inferior direito
        const btnDiagnostico = document.createElement('button');
        btnDiagnostico.id = 'btnDiagnostico';
        btnDiagnostico.innerHTML = '🔍 Diagnóstico';
        btnDiagnostico.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 9999;
        `;
        
        btnDiagnostico.onclick = function() {
            const resultado = executarDiagnostico();
            
            // Mostrar alerta com resultado
            let mensagem = `DIAGNÓSTICO DO SISTEMA\n\n`;
            mensagem += `Versão: ${resultado.versao}\n`;
            mensagem += `Módulos: ${resultado.modulosCarregados}/${resultado.modulosTotal}\n`;
            mensagem += `Funções: ${resultado.funcoesDisponiveis}/${resultado.funcoesTotal}\n\n`;
            
            if (resultado.status === 'ok') {
                mensagem += `✅ Sistema funcionando corretamente!\n\n`;
                mensagem += `COMO USAR:\n`;
                mensagem += `1. Selecione PRIMEIRO o Cliente\n`;
                mensagem += `2. O dropdown de Veículos será preenchido automaticamente\n`;
                mensagem += `3. Selecione o Veículo desejado`;
            } else {
                mensagem += `⚠️ ${resultado.problemas} problema(s) detectado(s)\n\n`;
                mensagem += `SOLUÇÃO:\n`;
                mensagem += `1. Limpe o cache (Ctrl+Shift+Del)\n`;
                mensagem += `2. Feche todas as abas\n`;
                mensagem += `3. Abra o sistema novamente\n`;
                mensagem += `4. Pressione Ctrl+F5`;
            }
            
            alert(mensagem);
        };
        
        document.body.appendChild(btnDiagnostico);
        
        // Mostrar versão no console
        console.log(`%c🔧 Mecânica Göelzer v${VERSAO_SISTEMA}`, 'color: #007bff; font-size: 16px; font-weight: bold;');
    }
    
    // ========== EXECUTAR DIAGNÓSTICO AUTOMÁTICO NA INICIALIZAÇÃO ==========
    window.addEventListener('load', function() {
        setTimeout(function() {
            executarDiagnostico();
            criarPainelDiagnostico();
        }, 1000);
    });
    
    // Expor função globalmente para uso manual
    window.executarDiagnostico = executarDiagnostico;
    
})();

