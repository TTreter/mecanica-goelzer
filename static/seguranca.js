
// ========== SISTEMA DE SEGURANÇA E BACKUP ROBUSTO (ADAPTADO PARA API) ==========
// Implementação das 5 melhorias CRÍTICAS para garantir zero perda de dados

// Nota: O IndexedDB ainda pode ser usado para cache local ou funcionalidades offline
// mas a persistência primária e o backup/restauração agora são via API do backend.

// ========== 1. INDEXEDDB COMO CACHE/BACKUP LOCAL SECUNDÁRIO (OPCIONAL) ==========
// Mantido para potencial uso futuro de cache offline ou histórico local, mas não para o salvamento principal.
class BackupIndexedDB {
    constructor() {
        this.dbName = 'OficinaBackupDB';
        this.version = 1;
        this.db = null;
    }

    async inicializar() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                console.error('Erro ao abrir IndexedDB:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                // console.log('✅ IndexedDB inicializado com sucesso');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('historico')) {
                    const historicoStore = db.createObjectStore('historico', { keyPath: 'timestamp' });
                    historicoStore.createIndex('data', 'data', { unique: false });
                }
            };
        });
    }

    async salvarHistorico(dados, acao = 'salvamento') {
        try {
            if (!this.db) await this.inicializar();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['historico'], 'readwrite');
                const store = transaction.objectStore('historico');

                const registro = {
                    timestamp: Date.now(),
                    data: new Date().toISOString(),
                    acao: acao,
                    dados: JSON.parse(JSON.stringify(dados)), // Salvar cópia profunda
                    checksum: this.calcularChecksum(dados)
                };

                const request = store.add(registro);

                request.onsuccess = () => {
                    this.limparHistoricoAntigo();
                    resolve(true);
                };

                request.onerror = () => {
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('Erro ao salvar histórico no IndexedDB:', error);
        }
    }

    async limparHistoricoAntigo() {
        try {
            const transaction = this.db.transaction(['historico'], 'readwrite');
            const store = transaction.objectStore('historico');
            const request = store.openCursor();
            const registros = [];

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    registros.push(cursor.value);
                    cursor.continue();
                } else {
                    if (registros.length > 50) {
                        registros.sort((a, b) => b.timestamp - a.timestamp);
                        const paraRemover = registros.slice(50);
                        
                        paraRemover.forEach(reg => {
                            store.delete(reg.timestamp);
                        });
                    }
                }
            };
        } catch (error) {
            console.error('Erro ao limpar histórico do IndexedDB:', error);
        }
    }

    calcularChecksum(dados) {
        const str = JSON.stringify(dados);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    async obterHistorico(limite = 10) {
        try {
            if (!this.db) await this.inicializar();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['historico'], 'readonly');
                const store = transaction.objectStore('historico');
                const request = store.openCursor(null, 'prev');
                const historico = [];

                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor && historico.length < limite) {
                        historico.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(historico);
                    }
                };

                request.onerror = () => {
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('Erro ao obter histórico do IndexedDB:', error);
            return [];
        }
    }
}

const backupDB = new BackupIndexedDB();

// ========== 2. VALIDAÇÃO E INTEGRIDADE (CLIENT-SIDE) ==========

class ValidadorDados {
    static validarEstrutura(dados) {
        const erros = [];

        const camposObrigatorios = ['clientes', 'veiculos', 'servicos', 'pecas', 'ordens'];

        camposObrigatorios.forEach(campo => {
            if (!dados[campo] || !Array.isArray(dados[campo])) {
                erros.push(`Campo ${campo} inválido ou ausente`);
            }
        });

        return erros;
    }

    static validarIntegridade(dados) {
        const avisos = [];

        // Validar IDs únicos (apenas avisos)
        ['clientes', 'veiculos', 'ordens', 'pecas', 'servicos', 'ferramentas'].forEach(categoria => {
            if (dados[categoria]) {
                const ids = dados[categoria].map(item => item.id);
                const idsUnicos = new Set(ids);
                if (ids.length !== idsUnicos.size) {
                    avisos.push(`IDs duplicados em ${categoria}`);
                }
            }
        });

        // Exemplo de validação de referência: verificar se veiculo_id em ordens existe em veiculos
        if (dados.ordens && dados.veiculos) {
            dados.ordens.forEach(ordem => {
                if (ordem.veiculo_id && !dados.veiculos.some(v => v.id === ordem.veiculo_id)) {
                    avisos.push(`Ordem ${ordem.id} refere-se a um veículo inexistente: ${ordem.veiculo_id}`);
                }
            });
        }
        
        return avisos; // Retorna avisos, não erros críticos
    }

    static validarCompleto(dados) {
        const errosEstrutura = this.validarEstrutura(dados);
        const errosIntegridade = this.validarIntegridade(dados);
        
        const todosErros = [...errosEstrutura, ...errosIntegridade];
        
        if (todosErros.length > 0) {
            console.warn('⚠️ Erros de validação encontrados:', todosErros);
            return { valido: false, erros: todosErros };
        }
        
        return { valido: true, erros: [] };
    }
}

// ========== 3. SISTEMA DE SALVAMENTO SEGURO (VIA API) ==========
// A responsabilidade de salvamento é do backend. O frontend apenas envia os dados.
// A função apiRequest já inclui tratamento de erro.

// ========== 4. BACKUP E RESTAURAÇÃO (VIA API) ==========
// Funções de backup e restauração agora interagem com endpoints específicos no backend.
// As funções exportarBackupCompleto e importarBackup foram movidas para `melhorias.js`
// para centralizar funcionalidades de backup/restauração que interagem com a API.

// ========== 5. REGISTRO DE ATIVIDADES/LOGS (VIA API) ==========
// A função `registrarLog` foi movida para `melhorias.js` para centralizar funcionalidades
// que interagem com a API de logs.

console.log("✅ Sistema de segurança adaptado para API!");

